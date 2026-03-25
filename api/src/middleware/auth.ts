// Authentication Middleware
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import { findUserById } from '../database';
import { User } from '../types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'Access token required'
      }
    });
    return;
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(403).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }
    });
    return;
  }
  
  const user = findUserById(decoded.userId);
  if (!user) {
    res.status(404).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      }
    });
    return;
  }
  
  req.user = user;
  next();
};