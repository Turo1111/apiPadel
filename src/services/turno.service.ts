import { Types } from 'mongoose'
import { Turno } from '../interfaces/turno.interface'
import TurnoModel from '../models/turno.model'

const createTurnoService = async (item: Turno): Promise<Turno> => {
  const responseInsert = await TurnoModel.create(item)
  return responseInsert
}

const getAllTurnosService = async (): Promise<Turno[]> => {
  const response = await TurnoModel.find({})
  return response
}

const getTurnoByIdService = async (id: Types.ObjectId): Promise<any> => {
  const response = await TurnoModel.find({ _id: id })
  return response
}

const updateTurnoService = async (id: Types.ObjectId, item: Turno): Promise<any> => {
  const response = await TurnoModel.updateOne({ _id: id }, { $set: item })
  return response
}

export {
  createTurnoService,
  getAllTurnosService,
  getTurnoByIdService,
  updateTurnoService
} 