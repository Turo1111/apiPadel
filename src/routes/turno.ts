import { Router } from 'express'
import { deleteTurnoCtrl, getTurnoCtrl, getTurnosCtrl, createTurnoCtrl, updateTurnoCtrl } from '../controllers/turno.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_turno'), getTurnosCtrl)
router.get('/:id', checkJwt, checkPermission('read_turno'), getTurnoCtrl)
router.post('/', checkJwt, checkPermission('create_turno'), createTurnoCtrl)
router.patch('/:id', checkJwt, checkPermission('update_turno'), updateTurnoCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_turno'), deleteTurnoCtrl)

export { router } 