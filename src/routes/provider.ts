import { Router } from 'express'
import { deleteProviderCtrl, getProviderCtrl, getProvidersCtrl, createProviderCtrl, updateProviderCtrl } from '../controllers/provider.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_product'), getProvidersCtrl)
router.get('/:id', checkJwt, checkPermission('read_product'), getProviderCtrl)
router.post('/', checkJwt, checkPermission('create_product'), createProviderCtrl)
router.patch('/:id', checkJwt, checkPermission('update_product'), updateProviderCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_product'), deleteProviderCtrl)

export { router }
