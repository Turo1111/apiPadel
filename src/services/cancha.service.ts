import { Types } from 'mongoose'
import { Cancha } from '../interfaces/turno.interface'
import CanchaModel from '../models/cancha.model'

const createCanchaService = async (item: Cancha): Promise<Cancha> => {
  const responseInsert = await CanchaModel.create(item)
  return responseInsert
}

const getAllCanchasService = async (): Promise<Cancha[]> => {
  const response = await CanchaModel.find({})
  return response
}

const getCanchaByIdService = async (id: Types.ObjectId): Promise<any> => {
  const response = await CanchaModel.find({ _id: id })
  return response
}

const updateCanchaService = async (id: Types.ObjectId, item: Cancha): Promise<any> => {
  const response = await CanchaModel.updateOne({ _id: id }, { $set: item })
  return response
}

export {
  createCanchaService,
  getAllCanchasService,
  getCanchaByIdService,
  updateCanchaService
} 