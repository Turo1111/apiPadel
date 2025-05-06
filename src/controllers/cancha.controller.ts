import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { emitSocket } from '../socket'
import {
  createCanchaService,
  getAllCanchasService,
  getCanchaByIdService,
  updateCanchaService
} from '../services/cancha.service'
import CanchaModel from '../models/cancha.model'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}

const getCanchaCtrl = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getCanchaByIdService(new Types.ObjectId(id))
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}

const getCanchasCtrl = async (_: RequestExt, res: Response): Promise<void> => {
  try {
    const response = await getAllCanchasService()
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}

const updateCanchaCtrl = async ({ params, body }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await updateCanchaService(new Types.ObjectId(id), body)
    emitSocket('cancha', {
      action: 'update',
      data: body
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}

const createCanchaCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const response = await createCanchaService(body)
    emitSocket('cancha', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}

const deleteCanchaCtrl = async ({ params }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await CanchaModel.deleteOne({ _id: new Types.ObjectId(id) })
    emitSocket('cancha', {
      action: 'delete',
      data: { id }
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_ITEM')
  }
}

export {
  getCanchaCtrl,
  getCanchasCtrl,
  updateCanchaCtrl,
  createCanchaCtrl,
  deleteCanchaCtrl
} 