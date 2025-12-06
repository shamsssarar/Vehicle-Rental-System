import { Request, Response } from 'express';
import * as userService from './users.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse, sendError } from '../../utils/response';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    sendResponse(res, 200, true, 'Users retrieved successfully', users);
  } catch (error: any) {
    sendError(res, 500, 'Error fetching users', error.message);
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = parseInt(req.params.userId!);
    const requesterId = req.user!.id;
    const requesterRole = req.user!.role;

    if (requesterRole !== 'admin' && requesterId !== targetUserId) {
      return sendError(res, 403, 'Access denied');
    }

    if (requesterRole !== 'admin' && req.body.role && req.body.role === 'admin') {
      return sendError(res, 403, 'Cannot promote self to admin');
    }

    const updatedUser = await userService.updateUser(targetUserId, req.body);
    if (!updatedUser) {
        return sendError(res, 404, 'User not found');
    }

    sendResponse(res, 200, true, 'User updated successfully', updatedUser);
  } catch (error: any) {
    sendError(res, 500, 'Error updating user', error.message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.userId!);
    await userService.deleteUser(id);
    sendResponse(res, 200, true, 'User deleted successfully');
  } catch (error: any) {
    sendError(res, 500, 'Error deleting user', error.message);
  }
};