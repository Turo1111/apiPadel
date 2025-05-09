import { Router } from 'express'
import { deleteCategorieCtrl, getCategorieCtrl, getCategoriesCtrl, createCategorieCtrl, updateCategorieCtrl } from '../controllers/categorie.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_product'), getCategoriesCtrl)
router.get('/:id', checkJwt, checkPermission('read_product'), getCategorieCtrl)
router.post('/', checkJwt, checkPermission('create_product'), createCategorieCtrl)
router.patch('/:id', checkJwt, checkPermission('update_product'), updateCategorieCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_product'), deleteCategorieCtrl)

export { router }
