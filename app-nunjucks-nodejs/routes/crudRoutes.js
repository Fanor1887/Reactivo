// crudRoutes.js

import express from 'express';
const router = express.Router();
import crudMiddleware from '../middlewares/crudMiddleware.js'; // Importa el módulo completo
import User from '../models/userModel.js';
import Account from '../models/accountModel.js';
import Role from '../models/roleModel.js';
import Specialty from '../models/specialtyModel.js';
import Service from '../models/serviceModel.js';

// Desestructuración del objeto exportado
const { createItem, getAllItems, getItemById, updateItem, deleteItem } =
  crudMiddleware;

// Rutas CRUD para users
router.post('/create-user', createItem(User)); // Create user
router.get(
  '/getAll-user',
  getAllItems(User, ['roles', 'cuentas', 'especialidades'])
);
router.get('/user/:id', getItemById(User)); // Obtener user por ID
router.put('/update-user/:id', updateItem(User)); // Actualizar user
router.delete('/user/:id/delete', deleteItem(User)); // Eliminar user

// Rutas CRUD para roles
router.get('/getAll-role', getAllItems(Role)); // Obtener todos los roles
router.delete('/role/:id/delete', deleteItem(Role)); // Eliminar roles

// Rutas CRUD para accounts
router.get('/getAll-account', getAllItems(Account)); // Obtener todas las cuentas

// Rutas CRUD para specialties
router.post('/create-specialty', createItem(Specialty)); // Create specialty
router.get('/getAll-specialty', getAllItems(Specialty)); // Obtener todas las specialties
router.get('/specialty/:id', getItemById(Specialty)); // Obtener specialty por ID
router.put('/update-specialty/:id', updateItem(Specialty)); // Actualizar specialty
router.delete('/specialty/:id/delete', deleteItem(Specialty)); // Eliminar specialty

// Rutas CRUD para services
router.post('/create-service', createItem(Service)); // Create service
router.get('/getAll-service', getAllItems(Service)); // Obtener todos los services
router.get('/service/:id', getItemById(Service)); // Obtener service por ID
router.put('/update-service/:id', updateItem(Service)); // Actualizar service
router.delete('/service/:id/delete', deleteItem(Service)); // Eliminar service

export default router;
