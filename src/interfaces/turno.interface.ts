import { ObjectId } from "mongoose";

export interface Local {
    _id: ObjectId;
    nombre: string;
    direccion: string;
    telefono?: string;
    email?: string;
    precioHora: number
    apertura: string; // e.g., "08:00"
    cierre: string;   // e.g., "23:00"
    createdAt: Date;
    updatedAt: Date;
  }
  
export interface Cancha {
    _id: ObjectId;
    nombre: string;
    local: ObjectId; // referencia al Local
    tipo: 'pasto_sintetico' | 'cemento' | 'alfombra'; //ENUM
    cubierta: boolean; 
    iluminacion: boolean;
    activa: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
export interface Turno {
    _id: ObjectId;
    canchaId: ObjectId;
    fecha: string; // formato ISODate o "2025-05-01"
    horaInicio: string; // e.g., "18:00"
    horaFin: string;    // e.g., "19:30"
    reservadoPor?: string;
    estado: 'disponible' | 'reservado' | 'pagado'; //ENUM
    precio: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
export interface TurnoFijo {
    _id: ObjectId;
    canchaId: ObjectId;
    diaSemana: "Lunes" | "Martes" | "Miercoles" | "Jueves" | "Viernes" | "Sabado" | "Domingo"; //ENUM
    horaInicio: string; // e.g., "18:00"
    horaFin: string;    // e.g., "19:30"
    reservadoPor?: string;
    precio: number;
    estado: 'activo' | 'inactivo';
    createdAt: Date;
    updatedAt: Date;
  }
  
  