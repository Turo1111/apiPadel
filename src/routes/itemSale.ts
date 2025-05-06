import { Router } from 'express'
import { deleteItem, getItem, getItems, patchItem, postItem } from '../controllers/itemSale.controller'


const router = Router()

router.get('/', getItems)
router.get('/:id', getItem)
router.post('/', postItem)
router.patch('/:id', patchItem)
router.delete('/:id', deleteItem)

export { router }
