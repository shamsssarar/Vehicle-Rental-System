import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

// 1. Verify Token Middleware
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  // Format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// 2. Role Authorization Middleware
export const authorizeRole = (requiredRole: 'admin' | 'customer') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({ message: `Access denied. Requires ${requiredRole} role.` });
      return;
    }

    next();
  };
};