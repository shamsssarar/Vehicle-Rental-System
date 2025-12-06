import { Router } from 'express';
import * as userController from './users.controller';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, authorizeRole('admin'), userController.getUsers);
router.put('/:userId', authenticateToken, userController.updateUser);
router.delete('/:userId', authenticateToken, authorizeRole('admin'), userController.deleteUser);

export default router;