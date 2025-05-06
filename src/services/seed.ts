import clienteModel from '../models/cliente.model';
import RoleModel from '../models/role.model';
import UserModel from '../models/user.model';
import { encrypt } from '../utils/bcrypt.handle';

export const seedDatabase = async () => {
  // Crear permisos básicos
  const permissions = [
    //Usuarios  
    'create_user',
    'delete_user',
    'update_user',
    'read_user',
    //Roles
    'create_role',
    'delete_role',
    'update_role',
    'read_role',
    //Productos 
    'create_product',
    'delete_product',
    'update_product',
    'read_product',
    //Proveedores
    'create_provider',
    'delete_provider',
    'update_provider',
    'read_provider',
    //Marcas
    'create_brand',
    'delete_brand',
    'update_brand',
    'read_brand',
    //Categorias
    'create_categorie',
    'delete_categorie',
    'update_categorie',
    'read_categorie',
    //Clientes
    'create_client',
    'delete_client',
    'update_client',
    'read_client',
    //Ventas
    'create_sale',
    'delete_sale',
    'update_sale',
    'read_sale',
    /* //Turnos
    'create_turno',
    'delete_turno',
    'update_turno',
    'read_turno' */
  ];

  // Crear cliente por defecto (Consumidor Final)
  const defaultClient = await clienteModel.findOne({ dni: '1' });
  if (!defaultClient) {
    await clienteModel.create({
      nombreApellido: 'Consumidor final',
      dni: '1'
    });
  }

  // Crear o actualizar rol admin
  const adminRole = await RoleModel.findOne({ name: 'admin' });
  if (!adminRole) {
    // Si no existe el rol admin, crearlo
    await RoleModel.create({
      name: 'admin',
      permissions: permissions
    });
  } else {
    // Si existe, verificar y actualizar permisos faltantes
    const missingPermissions = permissions.filter(
      permission => !adminRole.permissions.includes(permission)
    );
    
    if (missingPermissions.length > 0) {
      adminRole.permissions = [...new Set([...adminRole.permissions, ...missingPermissions])];
      await adminRole.save();
    } else {
    }
  }

  // Crear usuario admin
  const adminUser = await UserModel.findOne({ nickname: 'admin' });
  if (!adminUser) {
    const passHash = await encrypt(process.env.ADMIN_PASSWORD! as string)
    const currentAdminRole = await RoleModel.findOne({ name: 'admin' });

    if (!currentAdminRole) {
      throw new Error('No se pudo encontrar el rol de administrador');
    }

    await UserModel.create({
      nickname: 'admin',
      password: passHash,
      role: currentAdminRole._id
    });
  } else {
    // Verificar si el usuario admin tiene el rol correcto
    const currentAdminRole = await RoleModel.findOne({ name: 'admin' });
    if (currentAdminRole && adminUser.role?.toString() !== currentAdminRole._id.toString()) {
      adminUser.role = currentAdminRole;
      await adminUser.save();
    }
  }
};
