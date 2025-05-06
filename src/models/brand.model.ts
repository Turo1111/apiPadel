import { Schema, model } from 'mongoose'
import { Brand } from '../interfaces/product.interface';

const BrandSchema = new Schema<Brand>(
  {
    name : {
        type: String,
        require: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const BrandModel = model('brand', BrandSchema)
export default BrandModel
