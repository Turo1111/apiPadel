import { Router } from 'express'
import { deleteBrandCtrl, getBrandCtrl, getBrandsCtrl, createBrandCtrl, updateBrandCtrl } from '../controllers/brand.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_product'), getBrandsCtrl)
router.get('/:id', checkJwt, checkPermission('read_product'), getBrandCtrl)
router.post('/', checkJwt, checkPermission('create_product'), createBrandCtrl)
router.patch('/:id', checkJwt, checkPermission('update_product'), updateBrandCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_product'), deleteBrandCtrl)

export { router }
