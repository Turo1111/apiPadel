import { Schema, model } from 'mongoose'
import { Local } from '../interfaces/turno.interface'

const LocalSchema = new Schema<Local>(
  {
    nombre: {
      type: String,
      required: true
    },
    direccion: {
      type: String,
      required: true
    },
    telefono: String,
    email: String,
    precioHora: {
      type: Number,
      required: true
    },
    apertura: {
      type: String,
      required: true
    },
    cierre: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const LocalModel = model('local', LocalSchema)
export default LocalModel 