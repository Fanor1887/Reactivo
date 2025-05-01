// models/accountModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // El email debe ser único
  },
  contraseña: {
    type: String,
    required: true,
  },
  // Relación con el usuario, para saber a qué usuario pertenece la cuenta
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Relación con el modelo User
    required: true,
  },
});

// Hashear la contraseña antes de guardar
accountSchema.pre('save', async function (next) {
  if (this.isModified('contraseña')) {
    this.contraseña = await bcrypt.hash(this.contraseña, 10);
  }
  next();
});

// Método para comparar contraseñas
accountSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.contraseña);
};

const Account = mongoose.model('Account', accountSchema);

export default Account;
