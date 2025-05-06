import { Router } from 'express'
import { deleteCanchaCtrl, getCanchaCtrl, getCanchasCtrl, createCanchaCtrl, updateCanchaCtrl } from '../controllers/cancha.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_cancha'), getCanchasCtrl)
router.get('/:id', checkJwt, checkPermission('read_cancha'), getCanchaCtrl)
router.post('/', checkJwt, checkPermission('create_cancha'), createCanchaCtrl)
router.patch('/:id', checkJwt, checkPermission('update_cancha'), updateCanchaCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_cancha'), deleteCanchaCtrl)

export { router } 