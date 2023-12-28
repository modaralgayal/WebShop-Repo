import express from 'express';
import { register, login, logOut } from '../controllers/registration';
import { deleteById, getAll, getById } from '../controllers/userData';
import { isOwner } from '../middleware/verification';
import { addProductToBasket } from '../controllers/productManagement';
import { deserializeUser } from '../middleware/deserializeuser';

const router = express.Router();

// Creating a user and logging in
router.post('/auth/register', register);
router.post('/auth/login', login);
router.delete('/', logOut)

// Retrieving user info
router.get('/api/users', deserializeUser, getAll);
router.get('/api/users/:id', getById);

// deleting a user
router.delete('/api/users/:id', isOwner, deleteById)

// add products
router.post('/products', )
router.post('api/user/products/:id', addProductToBasket)

export default router;
