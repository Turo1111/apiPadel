import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { emitSocket } from '../socket'
import {
  createTurnoFijoService,
  getAllTurnosFijosService,
  getTurnoFijoByIdService,
  updateTurnoFijoService
} from '../services/turnoFijo.service'
import TurnoFijoModel from '../models/turnoFijo.model'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}

const getTurnoFijoCtrl = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getTurnoFijoByIdService(new Types.ObjectId(id))
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}

const getTurnosFijosCtrl = async (_: RequestExt, res: Response): Promise<void> => {
  try {
    const response = await getAllTurnosFijosService()
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}

const updateTurnoFijoCtrl = async ({ params, body }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await updateTurnoFijoService(new Types.ObjectId(id), body)
    emitSocket('turnofijo', {
      action: 'update',
      data: body
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}

const createTurnoFijoCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const response = await createTurnoFijoService(body)
    emitSocket('turnofijo', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}

const deleteTurnoFijoCtrl = async ({ params }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await TurnoFijoModel.deleteOne({ _id: new Types.ObjectId(id) })
    emitSocket('turnofijo', {
      action: 'delete',
      data: { id }
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_ITEM')
  }
}

export {
  getTurnoFijoCtrl,
  getTurnosFijosCtrl,
  updateTurnoFijoCtrl,
  createTurnoFijoCtrl,
  deleteTurnoFijoCtrl
} 