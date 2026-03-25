// Authentication Service for MVP
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../types';
import { findUserByEmail, users } from '../database';

const JWT_SECRET = process.env.JWT_SECRET || 'newpot_mvp_secret_key';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const authenticateUser = async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
  // For MVP, we'll use a simple demo login
  const user = findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  // For demo purposes, any password works
  const token = generateToken(user.id);
  return { user, token };
};

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  country?: 'GH' | 'NG' | 'KE' | 'UG' | 'TZ' | 'RW';
}): Promise<{ user: User; token: string }> => {
  const newUser: User = {
    id: `user_${Date.now()}`,
    username: userData.username,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    country: userData.country,
    balances: {
      BTC: 0.01, // Demo balance
      ETH: 0.5,
      SOL: 10,
      XLM: 100,
      XRP: 50,
      BONK: 1000000
    },
    mobileMoneyBalances: userData.country === 'GH' ? [
      {
        provider: 'MTN',
        phoneNumber: userData.phoneNumber || '+233241234567',
        balance: 500,
        currency: 'GHS'
      }
    ] : [],
    createdAt: new Date()
  };
  
  users.push(newUser);
  const token = generateToken(newUser.id);
  
  return { user: newUser, token };
};