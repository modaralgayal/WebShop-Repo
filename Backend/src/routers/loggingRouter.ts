import express from 'express';
import { register, login } from '../controllers/registration';
import { deleteById, getAll, getById } from '../controllers/userData';
import { isOwner } from '../middleware/verification';

const router = express.Router();

// Creating a user and logging in
router.post('/auth/register', register);
router.post('/auth/login', login);

// Retrieving user info
router.get('/api/users', isOwner, getAll);
router.get('/api/users/:id', isOwner, getById);

// deleting a user
router.delete('/api/users/:id', isOwner, deleteById)

export default router;
