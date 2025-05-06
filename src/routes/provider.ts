import { Router } from 'express'
import { deleteProviderCtrl, getProviderCtrl, getProvidersCtrl, createProviderCtrl, updateProviderCtrl } from '../controllers/provider.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_provider'), getProvidersCtrl)
router.get('/:id', checkJwt, checkPermission('read_provider'), getProviderCtrl)
router.post('/', checkJwt, checkPermission('create_provider'), createProviderCtrl)
router.patch('/:id', checkJwt, checkPermission('update_provider'), updateProviderCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_provider'), deleteProviderCtrl)

export { router }
