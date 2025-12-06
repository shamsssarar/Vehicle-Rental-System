import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authService from './auth.service';
import { sendResponse, sendError } from '../../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Sign Up
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Basic Validation
    if (!email || !password || password.length < 6) {
      return sendError(res, 400, 'Invalid input data. Password must be at least 6 chars.');
    }

    // Check if user exists
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 400, 'User already exists');
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role logic
    const userRole = role === 'admin' ? 'admin' : 'customer';

    const newUser = await authService.createUser(name, email, hashedPassword, phone, userRole);
    
    sendResponse(res, 201, true, 'User registered successfully', newUser);
  } catch (error: any) {
    sendError(res, 500, 'Internal server error', error.message);
  }
};

// Sign In
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    const responseData = {
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    };

    sendResponse(res, 200, true, 'Login successful', responseData);
  } catch (error: any) {
    sendError(res, 500, 'Internal server error', error.message);
  }
};