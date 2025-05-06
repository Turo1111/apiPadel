import { Router } from 'express'
import { loginCtrl, registerCtrl } from '../controllers/auth.controller'
import { checkJwt } from '../middleware/session'
import { checkPermission } from '../middleware/checkPermission'

const router = Router()

router.post('/register', checkJwt, checkPermission('create_user'), registerCtrl)
router.post('/login', loginCtrl)

export { router } 