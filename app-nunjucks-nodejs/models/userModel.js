// models/userModel.js
import mongoose from 'mongoose';
import Account from './accountModel.js'; // Importar el modelo Account

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  nacionalidad: {
    type: String,
    required: true,
  },
  ciudad: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  cuentas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  especialidades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialty',
    },
  ],
});

// Middleware que se ejecuta después de la actualización del usuario
userSchema.post('save', async function (doc) {
  if (this.isModified()) {
    // Si se ha modificado un campo de usuario, actualizar las cuentas asociadas
    console.log('Actualizando cuentas asociadas...');
    await Account.updateMany(
      { user: doc._id },
      {
        // Aquí podemos actualizar lo que queramos de las cuentas asociadas
        $set: {
          // Ejemplo de actualización: actualizando el nombre del usuario
          'user.nombre': doc.nombre,
          'user.apellido': doc.apellido,
        },
      }
    );
  }
});

// Middleware para eliminar cuentas cuando un usuario es eliminado
userSchema.pre('remove', async function (next) {
  try {
    // Eliminar todas las cuentas asociadas al usuario
    await Account.deleteMany({ user: this._id });
    console.log('Cuentas asociadas eliminadas');
    next();
  } catch (error) {
    console.error('Error al eliminar cuentas asociadas:', error);
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
