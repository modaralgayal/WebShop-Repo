import express from 'express';
import { register, login, logOut } from '../controllers/registration';
import { deleteById, getAll, getById } from '../controllers/userData';
import { isOwner } from '../middleware/verification';
import { addProductToBasket } from '../controllers/productManagement';

const router = express.Router();

// Creating a user and logging in
router.post('/auth/register', register);
router.post('/auth/login', login);

// Retrieving user info
router.get('/api/users', getAll);
router.get('/api/users/:id', getById);

// deleting a user
router.delete('/api/users/:id', isOwner, deleteById)
router.delete('/', logOut)

// add products
router.post('/products', addProductToBasket)

export default router;
