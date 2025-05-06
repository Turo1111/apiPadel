import { Schema, Types, model } from 'mongoose'
import { Product } from '../interfaces/product.interface'

const ProductSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    codigoBarra: {
      type: String
    },
    precioCompra: {
      type: Number,
      maxDecimalPlaces: 2
    },
    precioUnitario: {
      type: Number,
      required: true,
      maxDecimalPlaces: 2
    },
    categoria: {
      type: Schema.Types.Mixed,
      ref: 'Categoria',
      validate: {
        validator: function(v: any) {
          return v === '' || Types.ObjectId.isValid(v);
        },
        message: 'Debe ser ObjectId válido o string vacío'
      }
    },
    marca: {
      type: Schema.Types.Mixed,
      ref: 'Marca',
      validate: {
        validator: function(v: any) {
          return v === '' || Types.ObjectId.isValid(v);
        },
        message: 'Debe ser ObjectId válido o string vacío'
      }
    },
    proveedor: {
      type: Schema.Types.Mixed,
      ref: 'Proveedor',
      validate: {
        validator: function(v: any) {
          return v === '' || Types.ObjectId.isValid(v);
        },
        message: 'Debe ser ObjectId válido o string vacío'
      }
    },
    path: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const ProductModel = model('product', ProductSchema)
export default ProductModel
