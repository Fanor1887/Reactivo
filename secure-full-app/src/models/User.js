import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  roles: [{ type: String, default: [] }],
});

// Usamos el plugin de passport-local-mongoose para manejar autenticación
userSchema.plugin(passportLocalMongoose);

// Crear el modelo a partir del esquema
const User = mongoose.model('User', userSchema);

export default User;
