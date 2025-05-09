import { Request, Response } from 'express'
import { getSale, getSales, getSalesLimit, insertSale, qtySale, updateSale } from '../services/sale.service'
import { emitSocket } from '../socket'
import { handleHttp } from '../utils/error.handle'
import { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'
import { getItemSale, insertItemSale, updateItemsSale } from '../services/itemSale.service'
import { ItemSale, Sale } from '../interfaces/sale.interface'
import PDFDocument from 'pdfkit'
import path from 'path'
import clienteModel from '../models/cliente.model'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}

const postItem = async ({ body, user }: RequestExt, res: Response): Promise<void> => {
  try {
    const cliente = await clienteModel.findOne({ dni: '1' })
    if (!cliente) {
      res.status(404).send('Cliente no encontrado')
      return
    }
    const response = await insertSale({ ...body, user: new Types.ObjectId(user.id), cliente: new Types.ObjectId(cliente._id) })
    await Promise.all(
      body.itemsSale.map(async (item: any) => 
        await insertItemSale({ idProducto: item._id, total: item.total, cantidad: item.cantidad, idVenta: response._id, precio: item.precio })
      )
    )
    emitSocket('sale', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_SALE', e)
  }
}

const postMultipleItem = async ({ body, user }: RequestExt, res: Response): Promise<void> => {
  try {
    await Promise.all(
      body.map(async (item: any) => {
        const response = await insertSale({ ...item, user: new Types.ObjectId(user.id) })

        await Promise.all(
          item.itemsSale.map(async (item: any) =>
            await insertItemSale({
              idProducto: item._id,
              total: item.total,
              cantidad: item.cantidad,
              idVenta: response._id,
              precio: item.precio
            })
          )
        )
      })
    )
    emitSocket('sale', {
      action: 'create',
      data: 'Ventas guardadas'
    })
    res.send('Ventas guardadas')
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}

const getItem = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getSale(new Types.ObjectId(id))
    const response2 = await getItemSale(new Types.ObjectId(id))
    res.send({ r: response[0], itemsSale: response2 })
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}

const getItems = async ({ body }: RequestExt, res: Response): Promise<void> => {
  try {
    const { input, skip, limit } = body

    if (input !== undefined) {
      const response = await getSales(input)
      res.send(response)
    } else {
      const response = await getSalesLimit(parseInt(skip), parseInt(limit))
      const cantidad = await qtySale()
      res.send({ array: response, longitud: cantidad })
    }
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}

const updateItem = async ({ params, body, user }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await updateSale(new Types.ObjectId(id), { ...body, user: new Types.ObjectId(user.id) })
    await Promise.all(
      body.itemsSale.map(async (item: any) => {
        if (item.idVenta) {
          await updateItemsSale(new Types.ObjectId(item._id), { ...item, precio: item.precio })
        } else {
          await insertItemSale({ idProducto: item._id, total: item.total, cantidad: item.cantidad, idVenta: new Types.ObjectId(id), precio: item.precio })
        }
      })
    )
    emitSocket('sale', {
      action: 'update',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_PATCH_ITEM', e)
  }
}

const printSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const saleId = new Types.ObjectId(req.params.id)
    const sale: Sale[] = await getSale(saleId)

    if (sale.length === 0) {
      res.status(404).send('Sale not found')
      return
    }

    const itemsSale: ItemSale[] = await getItemSale(saleId)
    
    const doc = new PDFDocument()

    res.setHeader('Content-disposition', `attachment; filename=venta-${sale[0].cliente}.pdf`)
    res.setHeader('Content-type', 'application/pdf')
    doc.pipe(res)

    const logoPath = path.join(__dirname, '../../public/image/LOGO2.png')
    const logoWidth = 200
    const pageWidth = 595.28
    const xPosition = (pageWidth - logoWidth) / 2
    doc.image(logoPath, xPosition, 40, { width: logoWidth })
    doc.moveDown()
    doc.moveDown()
    doc.fontSize(16).text('Presupuesto', 15, 120)
    doc.fontSize(16).text('Presupuesto', 15, 120)
    doc.fontSize(14).text(`FECHA: ${new Date(sale[0].createdAt).toLocaleDateString()}`, 30, 160)
    doc.moveDown()

    const tableTop = 220
    const rowHeight = 20
    const columnWidths = [150, 100, 100, 100]
    const headers = ['PRODUCTO', 'CANTIDAD', 'P. UNITARIO', 'TOTAL']

    const drawTableHeaders = (): any => {
      doc.fillColor('lightgrey')
        .rect(50, tableTop - rowHeight, columnWidths.reduce((a, b) => a + b), rowHeight)
        .fill()

      doc.fillColor('black').fontSize(12)
      let xPosition2 = 50
      headers.forEach((header, index) => {
        doc.text(header, xPosition2, tableTop - rowHeight + 5)
        xPosition2 += columnWidths[index]
      })
    }

    drawTableHeaders()

    let yPosition = tableTop
    let itemsCount = 0
    let currentPage = 1

    itemsSale.forEach((item: ItemSale) => {
      if (itemsCount === 20) {
        doc.addPage()
        currentPage++
        yPosition = tableTop - 190
        itemsCount = 0
      }

      const name = item.name ?? 'Sin descripción'
      const precioUnitario = item.precio ?? 0

      doc.fillColor('black')
        .text(name, 50 + 5, yPosition + 5)
        .text(item.cantidad.toString(), 200 + 5, yPosition + 5)
        .text(`$${precioUnitario.toFixed(2)}`, 300 + 5, yPosition + 5)
        .text(`$${item.total.toFixed(2)}`, 400 + 5, yPosition + 5)

      yPosition += rowHeight
      itemsCount++
    })

    doc.moveDown(2)
    doc.fontSize(14).text(`TOTAL: $${sale[0].total.toFixed(2)}`, { align: 'right' })
    doc.moveDown(3)
    doc.fontSize(12).text('*No válido como factura', { align: 'center' })

    doc.fontSize(10).text(`Pagina ${currentPage} de ${currentPage}`, { align: 'right' })

    doc.end()
  } catch (e: any) {
    console.error('Error al generar el PDF:', e.message, e.stack)
    handleHttp(res, 'ERROR_PRINT_SALE')
  }
}

const printSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const saleIds = req.body
    const sales: Sale[][] = await Promise.all(saleIds.map(async (id: any) => await getSale(new Types.ObjectId(id))))
    const itemsSales: ItemSale[][] = await Promise.all(saleIds.map(async (id: any) => await getItemSale(new Types.ObjectId(id))))

    const doc = new PDFDocument()
    res.setHeader('Content-disposition', 'attachment; filename=ventas.pdf')
    res.setHeader('Content-type', 'application/pdf')
    doc.pipe(res)

    const logoPath = path.join(__dirname, '../../public/image/LOGO.png')
    const logoWidth = 80
    const invoiceWidth = 300
    const invoiceHeight = 380

    let fixIndex = 0
    sales.forEach((sale, index) => {
      let posicionGlobal = fixIndex + 1

      if ((fixIndex) !== 0 && ((fixIndex) % 4) === 0) {
        doc.addPage()
      }

      let posicionEnTabla = (posicionGlobal - 1) % 4
      let fila = Math.floor(posicionEnTabla / 2) + 1
      let columna = (posicionEnTabla % 2) + 1

      let xPosition = (columna - 1) * invoiceWidth
      let yPosition = (fila - 1) * invoiceHeight

      const drawHeader = (): any => {
        doc.image(logoPath, xPosition + (invoiceWidth - logoWidth) / 2, yPosition + 20, { width: logoWidth })
        doc.moveDown(1)
        doc.fontSize(8).text('Presupuesto', xPosition + 15, yPosition + 50)
        doc.fontSize(8).text(`CLIENTE: ${sale[0].cliente}`, xPosition + 15, yPosition + 60)
        doc.fontSize(8).text(`FECHA: ${new Date(sale[0].createdAt).toLocaleDateString()}`, xPosition + 15, yPosition + 70)
        doc.moveDown(1)
      }

      drawHeader()

      let tableTop = yPosition + 90
      const rowHeight = 10
      const columnWidths = [85, 60, 60, 60]
      const headers = ['PRODUCTO', 'CANTIDAD', 'P. UNITARIO', 'TOTAL']

      const drawTableHeaders = (): any => {
        doc.fillColor('lightgrey')
          .rect(
            xPosition + 15,
            tableTop - rowHeight,
            columnWidths.reduce((a, b) => a + b),
            rowHeight + 2
          )
          .fill()

        doc.fillColor('black').fontSize(8)
        let xPosition2 = xPosition + 25
        headers.forEach((header, index) => {
          doc.text(header, xPosition2, tableTop - rowHeight + 5, { width: 60 })
          xPosition2 += columnWidths[index]
        })
      }

      drawTableHeaders()

      let yPositionProducts = tableTop
      let itemsCount = 0
      let currentPage = 1
      const itemsSale = itemsSales[index]
      itemsSale.forEach((item: ItemSale, indexItemSale: number) => {
        const name = item.name ?? 'Sin descripción'

        const precioUnitario = item.precio ?? 0

        if (itemsCount === 18) {
          currentPage++
          fixIndex++
          posicionGlobal = fixIndex + 1
          if ((fixIndex) !== 0 && ((fixIndex) % 4) === 0) {
            doc.addPage()
          }
          posicionEnTabla = (posicionGlobal - 1) % 4
          fila = Math.floor(posicionEnTabla / 2) + 1
          columna = (posicionEnTabla % 2) + 1
          xPosition = (columna - 1) * invoiceWidth
          yPosition = (fila - 1) * invoiceHeight
          tableTop = yPosition + 90
          yPositionProducts = tableTop
          itemsCount = 0
          drawHeader()
          drawTableHeaders()
        }

        doc.fontSize(9).fillColor('black')
          .text(name, xPosition + 15, yPositionProducts + 10)
          .text(item.cantidad.toString(), xPosition + 155, yPositionProducts + 10)
          .text(`$${precioUnitario.toFixed(2)}`, xPosition + 185, yPositionProducts + 10)
          .text(`$${item.total.toFixed(2)}`, xPosition + 235, yPositionProducts + 10, { width: 60 })

        yPositionProducts += rowHeight
        itemsCount++
        if (itemsCount === 18 || indexItemSale + 1 === itemsSale.length) {
          doc.moveDown(2)
          doc.fontSize(9).text(`TOTAL: $${sale[0].total.toFixed(2)}`, xPosition + 180, undefined, { width: 100 })
          doc.fontSize(6).text('*No válido como factura', xPosition + 180, undefined, { width: 100 })

          doc.fontSize(6).text('Página ' + currentPage + ' de ' + (Math.floor(itemsSale.length / 18) + 1), xPosition + 180, undefined, { width: 100 })
        }
      })

      fixIndex++
    })

    doc.end()
  } catch (e: any) {
    console.error('Error al generar el PDF:', e.message, e.stack)
    handleHttp(res, 'ERROR_PRINT_SALES')
  }
}

export { postItem, getItem, getItems, updateItem, postMultipleItem, printSale, printSales }
