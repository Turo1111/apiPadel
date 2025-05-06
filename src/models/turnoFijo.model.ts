import { Schema, model } from 'mongoose'
import { TurnoFijo } from '../interfaces/turno.interface'

const TurnoFijoSchema = new Schema<TurnoFijo>(
  {
    canchaId: {
      type: Schema.Types.ObjectId,
      ref: 'cancha',
      required: true
    },
    diaSemana: {
      type: String,
      enum: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
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
    precio: {
      type: Number,
      required: true
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const TurnoFijoModel = model('turnofijo', TurnoFijoSchema)
export default TurnoFijoModel 