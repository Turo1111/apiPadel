import { Types } from 'mongoose'

export interface Sale {
  _id: Types.ObjectId
  user: Types.ObjectId
  cliente: Types.ObjectId
  estado: EstadoVenta
  total: number
  createdAt: string
  itemsSale: ItemSale[]
  nameCliente?: string
}

export enum EstadoVenta {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA', 
  CANCELADA = 'CANCELADA'
}


export interface ItemSale {
  _id?: Types.ObjectId
  idVenta: Types.ObjectId
  idProducto: Types.ObjectId
  cantidad: number
  total: number
  precio: number
  name?: string
}
