import { Types } from 'mongoose';
import { Cliente } from '../interfaces/cliente.interface';
import ClienteModel from '../models/cliente.model';

const createClienteService = async (item: Cliente): Promise<Cliente> => {
    const responseInsert = await ClienteModel.create(item);
    return responseInsert;
}

const getAllClientesService = async (): Promise<Cliente[]> => {
    const response = await ClienteModel.find({});
    return response;
}

const getClienteByIdService = async (id: Types.ObjectId): Promise<any> => {
    const response = await ClienteModel.find({ _id: id });
    return response;
}

const updateClienteService = async (id: Types.ObjectId, item: Cliente): Promise<any> => {
    const response = await ClienteModel.updateOne({ _id: id }, { $set: item });
    return response;
}

const deleteClienteService = async (id: Types.ObjectId): Promise<any> => {
    const response = await ClienteModel.deleteOne({ _id: id });
    return response;
}

export { 
    getClienteByIdService, 
    getAllClientesService, 
    createClienteService, 
    updateClienteService,
    deleteClienteService 
} 