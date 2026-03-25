// Bot Authentication Middleware
// Allows Telegram bot to auth via x-user-id header (no JWT needed for bot→API calls)
import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../database';

export const botAuth = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers['x-user-id'] as string;

  if (userId) {
    // Bot calling with userId header — look up user directly
    // For MVP: user1 is the demo user
    const user = findUserById(userId) || findUserById('user1');
    if (user) {
      req.user = user;
      next();
      return;
    }
  }

  // Fall back to JWT if no x-user-id
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    // Use JWT validation from existing middleware
    const { verifyToken } = require('../services/authService');
    const decoded = verifyToken(token);
    if (decoded) {
      const user = findUserById(decoded.userId);
      if (user) {
        req.user = user;
        next();
        return;
      }
    }
  }

  res.status(401).json({
    success: false,
    error: {
      code: 'NO_TOKEN',
      message: 'Access token or x-user-id header required'
    }
  });
};
