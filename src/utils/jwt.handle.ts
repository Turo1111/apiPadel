import { JwtPayload, sign, verify } from 'jsonwebtoken'
import { User } from '../interfaces/auth.interface'
import UserModel from '../models/user.model'

const JWT_SECRET = process.env.JWT_SECRET ?? 'NOT_TOKEN_ENV'

const generateToken = async (user: User): Promise<string> => {
  try {
    if (!user._id) {
      throw new Error('User ID is required for token generation')
    }

    const userData = await UserModel.findById(user._id).populate('role')
    if (!userData) {
      throw new Error('User not found in database')
    }

    const tokenData = {
      id: user._id.toString(),
      role: userData.role || [],
    }
    
    const jwt = await sign(tokenData, JWT_SECRET)

    return jwt
  } catch (error) {
    console.error('Error generating token:', error)
    throw error
  }
}

const verifyToken = async (jwt: string): Promise<JwtPayload | string> => {
  try {
    const isOk = verify(jwt, JWT_SECRET)
    return isOk
  } catch (error) {
    console.error('Error verifying token:', error)
    throw error
  }
}

export { generateToken, verifyToken } 