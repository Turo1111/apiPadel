import { Document } from 'mongoose';

export interface Cliente extends Document {
    nombreApellido: string;
    dni: string;
    fechaNacimiento?: Date;
} 