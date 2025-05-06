import { Schema, model } from 'mongoose'
import { User } from '../interfaces/auth.interface'

const UserSchema = new Schema<User>(
  {
    nickname: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'role',
    },
    local: {
      type: Schema.Types.ObjectId,
      ref: 'local',
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const UserModel = model('user', UserSchema)
export default UserModel 