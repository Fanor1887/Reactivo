// controllers/accountController.js
import Account from '../models/accountModel.js'; // Modelo Account
import User from '../models/userModel.js'; // Modelo User

// Función para crear una cuenta asociada a un usuario específico
const createAccount = async (req, res) => {
  try {
    const { email, contraseña } = req.body; // Obtener datos de la cuenta del cuerpo de la solicitud
    const { userId } = req.params; // Obtener el userId de los parámetros de la ruta

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear una nueva cuenta
    const newAccount = new Account({
      email,
      contraseña,
      user: userId, // Asociamos la cuenta al usuario
    });

    // Guardar la cuenta
    await newAccount.save();

    // Agregar la cuenta al array de cuentas del usuario
    user.cuentas.push(newAccount._id);
    await user.save();

    res.status(201).json({
      message: 'Cuenta creada exitosamente',
      account: newAccount,
    });
  } catch (error) {
    console.error('Error al crear cuenta:', error);
    res.status(500).json({ message: 'Error al crear la cuenta' });
  }
};

// Función para obtener todas las cuentas
const getAllAccounts = async (req, res) => {
  try {
    // Obtener todas las cuentas de la base de datos
    const accounts = await Account.find().populate('user', 'nombre apellido'); // Popula la información del usuario

    // Si no hay cuentas, se responde con un mensaje de "No hay cuentas"
    if (accounts.length === 0) {
      return res.status(404).json({ message: 'No hay cuentas disponibles' });
    }

    // Responder con las cuentas obtenidas
    res.status(200).json({
      message: 'Cuentas obtenidas exitosamente',
      accounts,
    });
  } catch (error) {
    console.error('Error al obtener las cuentas:', error);
    res.status(500).json({ message: 'Error al obtener las cuentas' });
  }
};

export default {
  createAccount,
  getAllAccounts, // Exportamos la función para obtener todas las cuentas
};
