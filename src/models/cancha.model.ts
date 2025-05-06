import { Schema, model } from 'mongoose'
import { Cancha } from '../interfaces/turno.interface'

const CanchaSchema = new Schema<Cancha>(
  {
    nombre: {
      type: String,
      required: true
    },
    local: {
      type: Schema.Types.ObjectId,
      ref: 'local',
      required: true
    },
    tipo: {
      type: String,
      enum: ['pasto_sintetico', 'cemento', 'alfombra'],
      required: true
    },
    cubierta: {
      type: Boolean,
      required: true
    },
    iluminacion: {
      type: Boolean,
      required: true
    },
    activa: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const CanchaModel = model('cancha', CanchaSchema)
export default CanchaModel 