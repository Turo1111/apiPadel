import { hash, compare } from 'bcrypt'

const SALT_ROUNDS = 10

const encrypt = async (password: string): Promise<string> => {
  const passwordHash = await hash(password, SALT_ROUNDS)
  return passwordHash
}

const verified = async (password: string, passwordHash: string): Promise<boolean> => {
  const isCorrect = await compare(password, passwordHash)
  return isCorrect
}

export { encrypt, verified } 