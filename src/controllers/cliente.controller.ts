import { Request, Response } from 'express';
import { handleHttp } from '../utils/error.handle';
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { emitSocket } from '../socket';
import { 
    getClienteByIdService, 
    getAllClientesService, 
    createClienteService, 
    updateClienteService,
    deleteClienteService 
} from '../services/cliente.service';

interface RequestExt extends Request {
    user?: string | JwtPayload | undefined | any;
}

const getClienteCtrl = async ({ params }: RequestExt, res: Response): Promise<void> => {
    try {
        const { id } = params;
        const response = await getClienteByIdService(new Types.ObjectId(id));
        res.send(response);
    } catch (e) {
        handleHttp(res, 'ERROR_GET_ITEM');
    }
}

const getClientesCtrl = async (_: RequestExt, res: Response): Promise<void> => {
    try {
        const response = await getAllClientesService();
        res.send(response);
    } catch (e) {
        handleHttp(res, 'ERROR_GET_ITEMS');
    }
}

const updateClienteCtrl = async ({ params, body }: Request, res: Response): Promise<void> => {
    try {
        const { id } = params;
        const response = await updateClienteService(new Types.ObjectId(id), body);
        emitSocket('cliente', {
            action: 'update',
            data: body
        });
        res.send(response);
    } catch (e) {
        handleHttp(res, 'ERROR_UPDATE_ITEM');
    }
}

const createClienteCtrl = async ({ body }: Request, res: Response): Promise<void> => {
    try {
        const response = await createClienteService(body);
        emitSocket('cliente', {
            action: 'create',
            data: response
        });
        res.send(response);
    } catch (e) {
        handleHttp(res, 'ERROR_POST_ITEM', e);
    }
}

const deleteClienteCtrl = async ({ params }: Request, res: Response): Promise<void> => {
    try {
        const { id } = params;
        const response = await deleteClienteService(new Types.ObjectId(id));
        emitSocket('cliente', {
            action: 'delete',
            data: id
        });
        res.send(response);
    } catch (e) {
        handleHttp(res, 'ERROR_DELETE_ITEM');
    }
}

export { 
    getClienteCtrl, 
    getClientesCtrl, 
    updateClienteCtrl, 
    createClienteCtrl, 
    deleteClienteCtrl 
} 