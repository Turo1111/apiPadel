import { Types } from 'mongoose'
import { TurnoFijo } from '../interfaces/turno.interface'
import TurnoFijoModel from '../models/turnoFijo.model'

const createTurnoFijoService = async (item: TurnoFijo): Promise<TurnoFijo> => {
  const responseInsert = await TurnoFijoModel.create(item)
  return responseInsert
}

const getAllTurnosFijosService = async (): Promise<TurnoFijo[]> => {
  const response = await TurnoFijoModel.find({})
  return response
}

const getTurnoFijoByIdService = async (id: Types.ObjectId): Promise<any> => {
  const response = await TurnoFijoModel.find({ _id: id })
  return response
}

const updateTurnoFijoService = async (id: Types.ObjectId, item: TurnoFijo): Promise<any> => {
  const response = await TurnoFijoModel.updateOne({ _id: id }, { $set: item })
  return response
}

export {
  createTurnoFijoService,
  getAllTurnosFijosService,
  getTurnoFijoByIdService,
  updateTurnoFijoService
} 