import { Types } from 'mongoose'
import { Product } from '../interfaces/product.interface'
import ProductModel from '../models/product.model'

const insertProduct = async (item: Product): Promise<Product> => {
  const responseInsert = await ProductModel.create(item)
  return responseInsert
}

const getAllProducts = async (): Promise<Product[]> => {
  return await ProductModel.aggregate(
    [
      {
        $lookup: {
          from: 'categories',
          localField: 'categoria',
          foreignField: '_id',
          as: 'categoria'
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'marca',
          foreignField: '_id',
          as: 'marca'
        }
      },
      {
        $lookup: {
          from: 'providers',
          localField: 'proveedor',
          foreignField: '_id',
          as: 'proveedor'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          stock: 1,
          codigoBarra: 1,
          precioCompra: 1,
          precioUnitario: 1,
          categoria: '$categoria._id',
          proveedor: '$proveedor._id',
          marca: '$marca._id',
          NameProveedor: '$proveedor.name',
          NameMarca: '$marca.name',
          NameCategoria: '$categoria.name'
        }
      },
      {
        $unwind: '$categoria'
      },
      {
        $unwind: '$proveedor'
      },
      {
        $unwind: '$marca'
      },
      {
        $unwind: '$NameProveedor'
      },
      {
        $unwind: '$NameMarca'
      },
      {
        $unwind: '$NameCategoria'
      },
      {
        $sort: { name: 1 }
      }
    ]
  )
}

const getAllProductsCategories = async (categories: [] | undefined): Promise<any[]> => {
  let query: any = {

  }

  if (categories !== undefined) {
    if (categories?.length !== 0) {
      query = { NameCategoria: { $in: categories } }
    }
  } else {
    query = {}
  }


  return await ProductModel.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'categoria',
        foreignField: '_id',
        as: 'categoria'
      }
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'marca',
        foreignField: '_id',
        as: 'marca'
      }
    },
    {
      $lookup: {
        from: 'providers',
        localField: 'proveedor',
        foreignField: '_id',
        as: 'proveedor'
      }
    },
    {
      $unwind: '$categoria'
    },
    {
      $unwind: '$proveedor'
    },
    {
      $unwind: '$marca'
    },
    {
      $project: {
        _id: 1,
        name: 1,
        stock: 1,
        codigoBarra: 1,
        precioCompra: 1,
        precioUnitario: 1,
        categoria: '$categoria._id',
        proveedor: '$proveedor._id',
        marca: '$marca._id',
        NameCategoria: '$categoria.name',
        NameProveedor: '$proveedor.name',
        NameMarca: '$marca.name'
      }
    },
    {
      $match: query
    },
    {
      $sort: { NameCategoria: 1 }
    }
    
  ])
}

const getProducts = async (skip: number, limit: number): Promise<Product[]> => {
  return await ProductModel.aggregate(
    [
      {
        $lookup: {
          from: 'categories',
          localField: 'categoria',
          foreignField: '_id',
          as: 'categoria'
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'marca',
          foreignField: '_id',
          as: 'marca'
        }
      },
      {
        $lookup: {
          from: 'providers',
          localField: 'proveedor',
          foreignField: '_id',
          as: 'proveedor'
        }
      },
      {
        $project: {
          name: 1,
          stock: 1,
          codigoBarra: 1,
          precioCompra: 1,
          precioUnitario: 1,
          categoria: { $arrayElemAt: ['$categoria._id', 0] },
          proveedor: { $arrayElemAt: ['$proveedor._id', 0] },
          marca: { $arrayElemAt: ['$marca._id', 0] },
          NameProveedor: { $arrayElemAt: ['$proveedor.name', 0] },
          NameMarca: { $arrayElemAt: ['$marca.name', 0] },
          NameCategoria: { $arrayElemAt: ['$categoria.name', 0] },
          createdAt: 1,
          nameLower: { $toLower: '$name' }
        }
      },
      {
        $sort: { nameLower: 1 }
      }
    ]
  ).skip(skip).limit(limit)
}

const getProductsSearch = async (input: string, filter: Filter): Promise<Product[]> => {
  let query: any = {
  }

  if (input !== '') {
    query.name = {
      $regex: input,
      $options: 'i'
    }
  }

  if (filter.categoria !== undefined || filter.marca !== undefined || filter.proveedor !== undefined) {
    query = Object.assign({}, query, filter)
  }

  return await ProductModel.aggregate(
    [
      {
        $lookup: {
          from: 'categories',
          localField: 'categoria',
          foreignField: '_id',
          as: 'categoria'
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'marca',
          foreignField: '_id',
          as: 'marca'
        }
      },
      {
        $lookup: {
          from: 'providers',
          localField: 'proveedor',
          foreignField: '_id',
          as: 'proveedor'
        }
      },
      {
        $project: {
          name: 1,
          stock: 1,
          codigoBarra: 1,
          precioUnitario: 1,
          categoria: { $arrayElemAt: ['$categoria._id', 0] },
          proveedor: { $arrayElemAt: ['$proveedor._id', 0] },
          marca: { $arrayElemAt: ['$marca._id', 0] },
          NameProveedor: { $arrayElemAt: ['$proveedor.name', 0] },
          NameMarca: { $arrayElemAt: ['$marca.name', 0] },
          NameCategoria: { $arrayElemAt: ['$categoria.name', 0] },
          createdAt: 1
        }
      },
      {
        $match: query
      },
      {
        $sort: { name: 1 }
      }
    ]
  )
}

const getProduct = async (id: Types.ObjectId): Promise<any> => {
  return await ProductModel.aggregate(
    [
      {
        $match: {
          _id: {
            $eq: id
          }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoria',
          foreignField: '_id',
          as: 'categoria'
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'marca',
          foreignField: '_id',
          as: 'marca'
        }
      },
      {
        $lookup: {
          from: 'providers',
          localField: 'proveedor',
          foreignField: '_id',
          as: 'proveedor'
        }
      },
      {
        $project: {
          name: 1,
          stock: 1,
          codigoBarra: 1,
          precioCompra: 1,
          precioUnitario: 1,
          categoria: '$categoria._id',
          proveedor: '$proveedor._id',
          marca: '$marca._id',
          NameProveedor: '$proveedor.name',
          NameMarca: '$marca.name',
          NameCategoria: '$categoria.name'
        }
      },
      {
        $unwind: '$categoria'
      },
      {
        $unwind: '$proveedor'
      },
      {
        $unwind: '$marca'
      },
      {
        $unwind: '$NameProveedor'
      },
      {
        $unwind: '$NameMarca'
      },
      {
        $unwind: '$NameCategoria'
      }
    ]
  )
}

const updateProduct = async (id: Types.ObjectId, item: Partial<Product>): Promise<any> => {
  const response = await ProductModel.updateOne({ _id: id }, { $set: item })
  return response
}

const qtyProduct = async (): Promise<any> => {
  const response = await ProductModel.countDocuments()
  return response
}

export interface Filter {
  categoria?: string
  proveedor?: string
  marca?: string
}

const findProducts = async (filter: Filter): Promise<any> => {
  const query = []

  if (filter.categoria !== undefined) {
    query.push({ categoria: filter.categoria })
  }

  if (filter.proveedor !== undefined) {
    query.push({ proveedor: filter.proveedor })
  }

  if (filter.marca !== undefined) {
    query.push({ marca: filter.marca })
  }

  const response = await ProductModel.find({ $and: query })

  return response
}

export { getProduct, getProducts, insertProduct, updateProduct, getProductsSearch, findProducts, qtyProduct, getAllProducts, getAllProductsCategories }
