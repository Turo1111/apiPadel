import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { emitSocket } from '../socket'
import {
  createTurnoService,
  getAllTurnosService,
  getTurnoByIdService,
  updateTurnoService
} from '../services/turno.service'
import TurnoModel from '../models/turno.model'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}

const getTurnoCtrl = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getTurnoByIdService(new Types.ObjectId(id))
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}

const getTurnosCtrl = async (_: RequestExt, res: Response): Promise<void> => {
  try {
    const response = await getAllTurnosService()
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}

const updateTurnoCtrl = async ({ params, body }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await updateTurnoService(new Types.ObjectId(id), body)
    emitSocket('turno', {
      action: 'update',
      data: body
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}

const createTurnoCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const response = await createTurnoService(body)
    emitSocket('turno', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}

const deleteTurnoCtrl = async ({ params }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await TurnoModel.deleteOne({ _id: new Types.ObjectId(id) })
    emitSocket('turno', {
      action: 'delete',
      data: { id }
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_ITEM')
  }
}

export {
  getTurnoCtrl,
  getTurnosCtrl,
  updateTurnoCtrl,
  createTurnoCtrl,
  deleteTurnoCtrl
} 