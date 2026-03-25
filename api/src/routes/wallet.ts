// Wallet Routes
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { addTransaction, getUserTransactions } from '../database';
import { Transaction } from '../types';

const router = express.Router();

// GET /api/wallet/balance - Get user balances
router.get('/balance', authenticateToken, (req, res) => {
  try {
    const user = req.user!;
    
    res.json({
      success: true,
      data: {
        crypto: user.balances,
        mobileMoneyBalances: user.mobileMoneyBalances
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch balance'
      }
    });
  }
});

// POST /api/wallet/deposit - Simulate deposit
router.post('/deposit', authenticateToken, (req, res) => {
  try {
    const { paymentMethod, amount, currency } = req.body;
    const user = req.user!;
    
    if (!paymentMethod || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Payment method and positive amount required'
        }
      });
    }
    
    // For MVP, simulate successful deposit
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: 'deposit',
      paymentMethod,
      amount,
      currency: currency || paymentMethod,
      status: 'completed',
      timestamp: new Date()
    };
    
    // Update user balance
    const isCrypto = ['BTC', 'ETH', 'SOL', 'XLM', 'XRP', 'BONK'].includes(paymentMethod);
    
    if (isCrypto) {
      user.balances[paymentMethod as keyof typeof user.balances] += amount;
    } else {
      const mmBalance = user.mobileMoneyBalances.find(b => b.provider === paymentMethod);
      if (mmBalance) {
        mmBalance.balance += amount;
      } else {
        // Create new mobile money balance if doesn't exist
        user.mobileMoneyBalances.push({
          provider: paymentMethod as any,
          phoneNumber: user.phoneNumber || '+233241234567',
          balance: amount,
          currency: (currency || 'GHS') as any
        });
      }
    }
    
    addTransaction(transaction);
    
    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Deposit processed successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Deposit failed'
      }
    });
  }
});

// POST /api/wallet/withdraw - Simulate withdrawal
router.post('/withdraw', authenticateToken, (req, res) => {
  try {
    const { paymentMethod, amount, currency, address } = req.body;
    const user = req.user!;
    
    if (!paymentMethod || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Payment method and positive amount required'
        }
      });
    }
    
    // Check balance
    const isCrypto = ['BTC', 'ETH', 'SOL', 'XLM', 'XRP', 'BONK'].includes(paymentMethod);
    let hasBalance = false;
    
    if (isCrypto) {
      hasBalance = user.balances[paymentMethod as keyof typeof user.balances] >= amount;
    } else {
      const mmBalance = user.mobileMoneyBalances.find(b => b.provider === paymentMethod);
      hasBalance = mmBalance ? mmBalance.balance >= amount : false;
    }
    
    if (!hasBalance) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_BALANCE',
          message: `Insufficient ${paymentMethod} balance`
        }
      });
    }
    
    // For MVP, simulate successful withdrawal
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: 'withdrawal',
      paymentMethod,
      amount,
      currency: currency || paymentMethod,
      status: 'completed',
      timestamp: new Date()
    };
    
    // Update user balance
    if (isCrypto) {
      user.balances[paymentMethod as keyof typeof user.balances] -= amount;
    } else {
      const mmBalance = user.mobileMoneyBalances.find(b => b.provider === paymentMethod);
      if (mmBalance) {
        mmBalance.balance -= amount;
      }
    }
    
    addTransaction(transaction);
    
    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Withdrawal processed successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Withdrawal failed'
      }
    });
  }
});

// GET /api/wallet/transactions - Get transaction history
router.get('/transactions', authenticateToken, (req, res) => {
  try {
    const transactions = getUserTransactions(req.user!.id);
    
    res.json({
      success: true,
      data: transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch transactions'
      }
    });
  }
});

export default router;