import { Types } from 'mongoose'
import { Local } from '../interfaces/turno.interface'
import LocalModel from '../models/local.model'

const createLocalService = async (item: Local): Promise<Local> => {
  const responseInsert = await LocalModel.create(item)
  return responseInsert
}

const getAllLocalesService = async (): Promise<Local[]> => {
  const response = await LocalModel.find({})
  return response
}

const getLocalByIdService = async (id: Types.ObjectId): Promise<any> => {
  const response = await LocalModel.find({ _id: id })
  return response
}

const updateLocalService = async (id: Types.ObjectId, item: Local): Promise<any> => {
  const response = await LocalModel.updateOne({ _id: id }, { $set: item })
  return response
}

export {
  createLocalService,
  getAllLocalesService,
  getLocalByIdService,
  updateLocalService
} 