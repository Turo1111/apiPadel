import { Router } from 'express'
import { deleteCategorieCtrl, getCategorieCtrl, getCategoriesCtrl, createCategorieCtrl, updateCategorieCtrl } from '../controllers/categorie.controller'
import { checkPermission } from '../middleware/checkPermission'
import { checkJwt } from '../middleware/session'

const router = Router()

router.get('/', checkJwt, checkPermission('read_categorie'), getCategoriesCtrl)
router.get('/:id', checkJwt, checkPermission('read_categorie'), getCategorieCtrl)
router.post('/', checkJwt, checkPermission('create_categorie'), createCategorieCtrl)
router.patch('/:id', checkJwt, checkPermission('update_categorie'), updateCategorieCtrl)
router.delete('/:id', checkJwt, checkPermission('delete_categorie'), deleteCategorieCtrl)

export { router }
