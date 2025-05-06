import { Router } from 'express'
import { deleteTurnoFijoCtrl, getTurnoFijoCtrl, getTurnosFijosCtrl, createTurnoFijoCtrl, updateTurnoFijoCtrl } from '../controllers/turnoFijo.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_turnofijo'), getTurnosFijosCtrl)
router.get('/:id', checkJwt, checkPermission('read_turnofijo'), getTurnoFijoCtrl)
router.post('/', checkJwt, checkPermission('create_turnofijo'), createTurnoFijoCtrl)
router.patch('/:id', checkJwt, checkPermission('update_turnofijo'), updateTurnoFijoCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_turnofijo'), deleteTurnoFijoCtrl)

export { router } 