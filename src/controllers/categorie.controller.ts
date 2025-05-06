import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { emitSocket } from '../socket'
import { getCategorieByIdService, getAllCategoriesService, createCategorieService, updateCategorieService } from '../services/categorie.service'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}

const getCategorieCtrl = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getCategorieByIdService(new Types.ObjectId(id))
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}
const getCategoriesCtrl = async (_: RequestExt, res: Response): Promise<void> => {
  try {
    const response = await getAllCategoriesService()
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}
const updateCategorieCtrl = async ({ params, body }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await updateCategorieService(new Types.ObjectId(id), body)
    emitSocket('categorie', {
      action: 'update',
      data: body
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}
const createCategorieCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const response = await createCategorieService(body)
    emitSocket('categorie', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}
const deleteCategorieCtrl = (_: Request, res: Response): void => {
  try {
    res.send({ data: 'algo' })
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_ITEM')
  }
}

export { getCategorieCtrl, getCategoriesCtrl, updateCategorieCtrl, createCategorieCtrl, deleteCategorieCtrl }
