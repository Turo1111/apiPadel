import { Router } from 'express'
import { checkPermission } from '../middleware/checkPermission'
import { getItem, getAllItems, getItems, postItem, postMultipleItem, uptdateItem, uptdateItems, deleteItem, printList } from '../controllers/product.controller'
import { checkJwt } from '../middleware/session'
const router = Router()

// Rutas protegidas con permisos
router.get('/:id', checkJwt ,checkPermission('read_product'), getItem)
router.get('/', checkJwt ,checkPermission('read_product'), getAllItems)
router.post('/skip', checkJwt ,checkPermission('read_product'), getItems)
router.post('/search', checkJwt ,checkPermission('read_product'), getItems)
router.post('/', checkJwt ,checkPermission('create_product'), postItem) 
router.post('/multiple', checkJwt, checkPermission('create_product'), postMultipleItem) 
router.patch('/:id', checkJwt, checkPermission('update_product'), uptdateItem)
router.patch('/', checkJwt, checkPermission('update_product'), uptdateItems)
router.delete('/:id', checkJwt, checkPermission('delete_product'), deleteItem)
router.post('/print/print', checkJwt, checkPermission('read_product'), printList)

export { router } 