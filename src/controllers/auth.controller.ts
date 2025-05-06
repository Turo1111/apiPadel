import { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handle'
import { loginUser, registerNewUser } from '../services/auth.service'
import { Types } from 'mongoose'
import { emitSocket } from '../socket'

const registerCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    console.log('body', body)
    const responseUser = await registerNewUser({...body, role: new Types.ObjectId(body.role)})

    emitSocket('user', {
      action: 'create',
      data: responseUser
    })
    res.send(responseUser)
  } catch (e) {
    handleHttp(res, 'ERROR_REGISTER_USER', e)
  }
}

const loginCtrl = async ({ body }: Request, res: Response): Promise<void> => {
  try {
    const { nickname, password } = body
    const responseUser = await loginUser({ nickname, password })
    res.send(responseUser)
  } catch (e) {
    handleHttp(res, 'ERROR_LOGIN_USER', e)
  }
}
  
export { registerCtrl, loginCtrl } 