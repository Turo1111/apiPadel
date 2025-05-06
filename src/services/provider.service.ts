import ProviderModel from '../models/provider.model'
import { Provider } from './../interfaces/product.interface'
import { Types } from 'mongoose'

const createProviderService = async (item: Provider): Promise<Provider> => {
  const responseInsert = await ProviderModel.create(item)
  return responseInsert
}

const getAllProvidersService = async (): Promise<Provider[]> => {
  const response = await ProviderModel.find({})
  return response
}

const getProviderByIdService = async (id: Types.ObjectId): Promise<any> => {
  const response = await ProviderModel.find({ _id: id })
  return response
}

const updateProviderService = async (id: Types.ObjectId, item: Provider): Promise<any> => {
  const response = await ProviderModel.updateOne({ _id: id }, { $set: item })
  return response
}

export { getProviderByIdService, getAllProvidersService, createProviderService, updateProviderService }
