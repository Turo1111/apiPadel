import { ObjectId } from "mongoose"

export interface Auth {
  nickname: string
  password: string
}

export interface AuthWithToken {
  token: string
  nickname: string
}

/* export interface Permission {
  _id: string
  name: string
  description?: string
  actions: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
} */

export interface Role {
  _id: string
  name: string
  description?: string
  permissions: string[]
  isActive: boolean
}

export interface User {
  _id: string
  nickname: string
  email?: string
  password: string
  role: Role
  nameRole: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  local?: ObjectId | null
}
