import { Types } from 'mongoose'
import { Brand } from '../interfaces/product.interface';
import BrandModel from '../models/brand.model';

const createBrandService = async (item: Brand): Promise<Brand> => {
  const responseInsert = await BrandModel.create(item)
  return responseInsert
}

const getAllBrandsService = async (): Promise<Brand[]> => {
  const response = await BrandModel.find({})
  return response
}

const getBrandByIdService = async (id: Types.ObjectId): Promise<any> => {
  const response = await BrandModel.find({ _id: id })
  return response
}

const updateBrandService = async (id: Types.ObjectId, item: Brand): Promise<any> => {
  const response = await BrandModel.updateOne({ _id: id }, { $set: item })
  return response
}

export { getBrandByIdService, getAllBrandsService, createBrandService, updateBrandService }
