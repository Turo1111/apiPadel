import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { emitSocket } from '../socket'
import { findProducts, getAllProducts, getAllProductsCategories, getProduct, getProducts, getProductsSearch, insertProduct, qtyProduct, updateProduct } from '../services/product.service'
import { Product } from '../interfaces/product.interface'
import { ObjectId } from 'mongodb'
import PDFDocument from 'pdfkit'
import path from 'path'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}


const getItem = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getProduct(new Types.ObjectId(id))
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}

const getItems = async ({ body }: RequestExt, res: Response): Promise<void> => {
  try {
    const { input, skip, limit } = body

    const filter = {
      categoria: body.categoria,
      marca: body.marca,
      proveedor: body.proveedor
    }

    if (body.categoria !== '' && body.categoria !== 1 && body.categoria !== undefined) {
      filter.categoria = ObjectId.createFromHexString(body.categoria)
    } else {
      delete filter.categoria
    }

    if (body.marca !== '' && body.marca !== 1 && body.marca !== undefined) {
      filter.marca = ObjectId.createFromHexString(body.marca)
    } else {
      delete filter.marca
    }

    if (body.proveedor !== '' && body.proveedor !== 1 && body.proveedor !== undefined) {
      filter.proveedor = ObjectId.createFromHexString(body.proveedor)
    } else {
      delete filter.proveedor
    }

    if (input !== undefined || filter.categoria !== undefined || filter.marca !== undefined || filter.proveedor !== undefined) {
      const response = await getProductsSearch(input, filter)
      res.send(response)
    } else {
      const response = await getProducts(parseInt(skip), parseInt(limit))
      const cantidad = await qtyProduct()
      res.send({ array: response, longitud: cantidad })
    }
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}

const uptdateItem = async ({ params, body }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const productData = {
      ...body,
      categoria: body.categoria ? new Types.ObjectId(body.categoria) : '',
      marca: body.marca ? new Types.ObjectId(body.marca) : '',
      proveedor: body.proveedor ? new Types.ObjectId(body.proveedor) : ''
    }
    const response = await updateProduct(new Types.ObjectId(id), productData)
    emitSocket('product', {
      action: 'update',
      data: body
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}

const uptdateItems = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const filter = {
      categoria: body.categoria,
      marca: body.marca,
      proveedor: body.proveedor
    }

    const porcentaje: number = body.porcentaje

    if (body.categoria !== '') {
      filter.categoria = new Types.ObjectId(body.categoria)
    } else {
      delete filter.categoria
    }

    if (body.marca !== '') {
      filter.marca = new Types.ObjectId(body.marca)
    } else {
      delete filter.marca
    }

    if (body.proveedor !== '') {
      filter.proveedor = new Types.ObjectId(body.proveedor)
    } else {
      delete filter.proveedor
    }

    const products = await findProducts(filter)

    const response = products.map(async (item: Product): Promise<Product> => {
      const newPrice = parseFloat((item.precioUnitario + (item.precioUnitario * porcentaje) / 100).toFixed(2))
      item.precioUnitario = newPrice
      await updateProduct(item._id, item)
      return item
    })

    emitSocket('product', {
      action: 'updateMany',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}
const postItem = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const productData = {
      ...body,
      categoria: body.categoria ? new Types.ObjectId(body.categoria) : '',
      marca: body.marca ? new Types.ObjectId(body.marca) : '',
      proveedor: body.proveedor ? new Types.ObjectId(body.proveedor) : ''
    }
    const response = await insertProduct(productData)
    emitSocket('product', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM: FALTAN CAMPOS REQUERIDOS', e)
  }
}

const postMultipleItem = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    await Promise.all(
      body.map(async (item: any) => 
        await insertProduct({ ...item, categoria: new Types.ObjectId(item.categoria), marca: new Types.ObjectId(item.marca), proveedor: new Types.ObjectId(item.proveedor)})
      )
    )
    res.send('Creado multiples productos')
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}

const deleteItem = (_: Request, res: Response): void => {
  try {
    res.send({ data: 'algo' })
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_ITEM')
  }
}

const getAllItems = async (_: RequestExt, res: Response): Promise<void> => {
  try {
    const response = await getAllProducts()
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}

const printList = async ({ body }: RequestExt, res: Response): Promise<void> => {
  try {
    const { categories} = body
    const products = await getAllProductsCategories(categories)
    if (products.length === 0) {
      res.status(404).send('Products not found')
      return
    }
    const doc = new PDFDocument()
    res.setHeader('Content-disposition', 'attachment; filename=ListaDePrecios.pdf')
    res.setHeader('Content-type', 'application/pdf')
    doc.pipe(res)
    const logoPath = path.join(__dirname, '../../public/image/LOGO.png')
    doc.image(logoPath, 450, 5, { width: 100 })
    let categorieActive: (string | undefined) = ''

    products.forEach((itemProduct: Product)=>{
      if (itemProduct.NameCategoria !== categorieActive) {
        categorieActive = itemProduct.NameCategoria
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#3764A0')
        .text(`${categorieActive}`, 25)
      }
      
      const yPosition = doc.y;

      // Escribir la descripción del producto
      doc.fontSize(14).font('Helvetica').fillColor('black')
        .text(`${itemProduct.name}`, 50, yPosition);

      // Escribir el precio del producto en la misma posición Y
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#FA9B50')
            .text(`$ ${itemProduct.precioUnitario}`, 440, yPosition);
      
      doc.moveDown(0.1);

      doc.lineWidth(0.5);
      doc.strokeColor('#d9d9d9');

      doc.moveTo(20, doc.y)
      .lineTo(550, doc.y)
      .stroke();

      doc.moveDown(0.3);

      if (yPosition > 680) {
        doc.addPage()
      }

      doc.on('pageAdded', () => doc.image(logoPath, 450, 5, { width: 100 }));
    })
    
    // Finalizar el documento
    doc.end()
  } catch (e) {
    handleHttp(res, 'ERROR_PRINT_LIST')
  }
}

export { getItem, getItems, uptdateItem, postItem, deleteItem, uptdateItems, getAllItems, printList, postMultipleItem }
