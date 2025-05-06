import { Schema, model } from 'mongoose';
import { Cliente } from '../interfaces/cliente.interface';

const clienteSchema = new Schema<Cliente>({
    nombreApellido: {
        type: String,
        required: true,
        trim: true
    },
    dni: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fechaNacimiento: {
        type: Date,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model<Cliente>('Client', clienteSchema); 