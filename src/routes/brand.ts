import { Router } from 'express'
import { deleteBrandCtrl, getBrandCtrl, getBrandsCtrl, createBrandCtrl, updateBrandCtrl } from '../controllers/brand.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_brand'), getBrandsCtrl)
router.get('/:id', checkJwt, checkPermission('read_brand'), getBrandCtrl)
router.post('/', checkJwt, checkPermission('create_brand'), createBrandCtrl)
router.patch('/:id', checkJwt, checkPermission('update_brand'), updateBrandCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_brand'), deleteBrandCtrl)

export { router }
