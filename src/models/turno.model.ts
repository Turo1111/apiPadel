import { Schema, model } from 'mongoose'
import { Turno } from '../interfaces/turno.interface'

const TurnoSchema = new Schema<Turno>(
  {
    canchaId: {
      type: Schema.Types.ObjectId,
      ref: 'cancha',
      required: true
    },
    fecha: {
      type: String,
      required: true
    },
    horaInicio: {
      type: String,
      required: true
    },
    horaFin: {
      type: String,
      required: true
    },
    reservadoPor: String,
    estado: {
      type: String,
      enum: ['disponible', 'reservado', 'pagado'],
      default: 'disponible'
    },
    precio: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const TurnoModel = model('turno', TurnoSchema)
export default TurnoModel 