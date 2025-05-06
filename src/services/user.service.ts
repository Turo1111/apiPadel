import { Types } from 'mongoose'
import { User } from '../interfaces/auth.interface'
import UserModel from '../models/user.model'

interface UserResponse {
  nickname: string;
  role: string;
  nameRole: string;
}


const getUserSearch = async (input: string): Promise<UserResponse[]> => {
  const response = await UserModel.find({ nickname: { $regex: input, $options: 'i' } }, { nickname: 1, role: 1, _id: 1 }).populate('role')
  return response.filter(user => user.nickname !== 'admin').map(user => ({
    nickname: user.nickname,
    role: user.role._id,
    nameRole: user.role.name,
    _id: user._id
  }))
}
const qtyUsers = async (): Promise<any> => {
  const response = await UserModel.countDocuments()
  return response
}

const getUsers = async (skip: number, limit: number): Promise<UserResponse[]> => {
  const response = await UserModel.find({}, { nickname: 1, role: 1, _id: 1 }).populate('role').skip(skip).limit(limit)  
  return response.filter(user => user.nickname !== 'admin').map(user => ({
    nickname: user.nickname,
    role: user.role._id,
    nameRole: user.role.name,
    _id: user._id
  }))
}

const getUser = async (id: Types.ObjectId): Promise<UserResponse | null> => {
  const response = await UserModel.findById(id, { nickname: 1, role: 1, _id: 0 }).populate('role')
  if (!response) return null
  return {
    nickname: response.nickname,
    role: response.role._id,
    nameRole: response.role.name
  }
}

const updateUser = async (id: Types.ObjectId, item: User): Promise<any> => {
  const response: any = await UserModel.findByIdAndUpdate(id, item, { new: true }).populate('role')
  const user = { ...response?._doc, password: undefined, nameRole: response?.role?.name, role: response?.role?._id, isActive: response?.isActive }
  return user
}

const deleteUser = async (id: Types.ObjectId): Promise<any> => {
  const response = await UserModel.findByIdAndDelete(id)
  return response
}

export { getUser, getUsers, updateUser, deleteUser, getUserSearch, qtyUsers } 