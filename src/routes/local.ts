import { Router } from 'express'
import { deleteLocalCtrl, getLocalCtrl, getLocalesCtrl, createLocalCtrl, updateLocalCtrl } from '../controllers/local.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_local'), getLocalesCtrl)
router.get('/:id', checkJwt, checkPermission('read_local'), getLocalCtrl)
router.post('/', checkJwt, checkPermission('create_local'), createLocalCtrl)
router.patch('/:id', checkJwt, checkPermission('update_local'), updateLocalCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_local'), deleteLocalCtrl)

export { router } 