import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { emitSocket } from '../socket'
import { getBrandByIdService, getAllBrandsService, createBrandService, updateBrandService } from '../services/brand.service'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}

const getBrandCtrl = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getBrandByIdService(new Types.ObjectId(id))
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}
const getBrandsCtrl = async (_: RequestExt, res: Response): Promise<void> => {
  try {
    const response = await getAllBrandsService()
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}
const updateBrandCtrl = async ({ params, body }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await updateBrandService(new Types.ObjectId(id), body)
    emitSocket('brand', {
      action: 'update',
      data: body
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}
const createBrandCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const response = await createBrandService(body)
    emitSocket('brand', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}
const deleteBrandCtrl = (_: Request, res: Response): void => {
  try {
    res.send({ data: 'algo' })
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_ITEM')
  }
}

export { getBrandCtrl, getBrandsCtrl, updateBrandCtrl, createBrandCtrl, deleteBrandCtrl }
