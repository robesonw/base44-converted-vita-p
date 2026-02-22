import { Router } from 'express';
import { register, login, me, refresh, logout } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, me);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;