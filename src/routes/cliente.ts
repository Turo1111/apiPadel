import { Router } from 'express';
import { 
    deleteClienteCtrl, 
    getClienteCtrl, 
    getClientesCtrl, 
    createClienteCtrl, 
    updateClienteCtrl 
} from '../controllers/cliente.controller';
import { checkPermission } from '../middleware/checkPermission';
import { checkJwt } from '../middleware/session';

const router = Router();

router.get('/', checkJwt, checkPermission('read_cliente'), getClientesCtrl);
router.get('/:id', checkJwt, checkPermission('read_cliente'), getClienteCtrl);
router.post('/', checkJwt, checkPermission('create_cliente'), createClienteCtrl);
router.patch('/:id', checkJwt, checkPermission('update_cliente'), updateClienteCtrl);
router.delete('/:id', checkJwt, checkPermission('delete_cliente'), deleteClienteCtrl);

export { router }; 