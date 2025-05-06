import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { emitSocket } from '../socket'
import { getProviderByIdService, getAllProvidersService, createProviderService, updateProviderService } from '../services/provider.service'

interface RequestExt extends Request {
  user?: string | JwtPayload | undefined | any
}

const getProviderCtrl = async ({ params }: RequestExt, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await getProviderByIdService(new Types.ObjectId(id))
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEM')
  }
}
const getProvidersCtrl = async (_: RequestExt, res: Response): Promise<void> => {
  try {
    const response = await getAllProvidersService()
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_GET_ITEMS')
  }
}
const updateProviderCtrl = async ({ params, body }: Request, res: Response): Promise<void> => {
  try {
    const { id } = params
    const response = await updateProviderService(new Types.ObjectId(id), body)
    emitSocket('provider', {
      action: 'update',
      data: body
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_UPDATE_ITEM')
  }
}
const createProviderCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const response = await createProviderService(body)
    emitSocket('provider', {
      action: 'create',
      data: response
    })
    res.send(response)
  } catch (e) {
    handleHttp(res, 'ERROR_POST_ITEM', e)
  }
}
const deleteProviderCtrl = (_: Request, res: Response): void => {
  try {
    res.send({ data: 'algo' })
  } catch (e) {
    handleHttp(res, 'ERROR_DELETE_ITEM')
  }
}

export { getProviderCtrl, getProvidersCtrl, updateProviderCtrl, createProviderCtrl, deleteProviderCtrl }
