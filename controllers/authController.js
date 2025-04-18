import Account from '../models/accountModel.js'; // Modelo Account
import User from '../models/userModel.js'; // Modelo User
import bcrypt from 'bcryptjs'; // Para el hashing de contraseñas

const authController = {
  // Método para mostrar la página de login
  showLogin: (req, res) => {
    res.render('login.njk', { title: 'Login' });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      console.log('Buscando cuenta con email:', email);

      // Buscar la cuenta por el email
      const account = await Account.findOne({ email }).populate('user'); // Solo populate 'user', no los roles todavía

      if (!account) {
        console.log('Cuenta no encontrada para el email:', email);
        return res.status(401).json({ error: 'Email incorrecto' });
      }

      console.log('Cuenta encontrada:', account);

      // Ahora hacemos populate de los roles en el objeto 'user'
      const user = account.user; // Accedemos al usuario relacionado
      await user.populate('roles'); // Aquí poblamos los roles del usuario

      console.log('Roles del usuario:', user.roles);

      // Verificar la contraseña de la cuenta
      const isPasswordValid = await bcrypt.compare(
        password,
        account.contraseña
      );
      console.log('Contraseña válida:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Contraseña incorrecta para el email:', email);
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Extraemos solo los alias de los roles
      const roleAliases = user.roles.map((role) => role.alias);
      console.log('Aliases de los roles:', roleAliases);
      req.session.isAuthenticated = true;

      // Si la autenticación es exitosa, establecer los datos en la sesión
      req.session.user = {
        id: user._id,
        email: account.email,
        roles: roleAliases, // Usamos solo los alias de los roles
      };
      console.log('Datos de sesión establecidos:', req.session.user);

      return res.json({
        message: 'Autenticación exitosa',
        user: { id: user._id, email: account.email, roles: roleAliases },
        isAuthenticated: req.session.isAuthenticated,
      });
    } catch (error) {
      console.error('Error al autenticar:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Método para registrar un nuevo usuario
  register: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: 'El correo electrónico ya está en uso' });
      }

      // Crear un nuevo usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();

      req.session.user = { id: newUser._id, email: newUser.email };

      return res.json({
        message: 'Registro exitoso',
        user: { id: newUser._id, email: newUser.email },
      });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Método para cerrar sesión
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }

      return res.json({ message: 'Sesión cerrada exitosamente' });
    });
  },
};

export default authController;
