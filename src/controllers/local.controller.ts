import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { emitSocket } from '../socket'
import {
  createLocalService,
  getAllLocalesService,
  getLocalByIdService,
  updateLocalService
} from '../services/local.service'
import LocalModel from '../models/local.model'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}

const getLocalCtrl = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getLocalByIdService(new Types.ObjectId(id))
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}

const getLocalesCtrl = async (_: RequestExt, res: Response): Promise<void> => {
  try {
    const response = await getAllLocalesService()
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}

const updateLocalCtrl = async ({ params, body }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await updateLocalService(new Types.ObjectId(id), body)
    emitSocket('local', {
      action: 'update',
      data: body
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}

const createLocalCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const response = await createLocalService(body)
    emitSocket('local', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}

const deleteLocalCtrl = async ({ params }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await LocalModel.deleteOne({ _id: new Types.ObjectId(id) })
    emitSocket('local', {
      action: 'delete',
      data: { id }
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_ITEM')
  }
}

export {
  getLocalCtrl,
  getLocalesCtrl,
  updateLocalCtrl,
  createLocalCtrl,
  deleteLocalCtrl
} 