// Betting Routes
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { findMarketById, markets, addPosition, addTransaction, getUserPositions } from '../database';
import { AMMService } from '../services/ammService';
import { Position, Transaction } from '../types';

const router = express.Router();

// POST /api/bets - Place a bet
router.post('/', authenticateToken, (req, res) => {
  try {
    const { marketId, side, amount, paymentMethod } = req.body;
    const user = req.user!;
    
    // Validate input
    if (!marketId || !side || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Market ID, side, amount, and payment method are required'
        }
      });
    }
    
    if (!['YES', 'NO'].includes(side)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SIDE',
          message: 'Side must be YES or NO'
        }
      });
    }
    
    const market = findMarketById(marketId);
    if (!market) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MARKET_NOT_FOUND',
          message: 'Market not found'
        }
      });
    }
    
    // Validate bet
    const validation = AMMService.validateBet(market, amount);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_BET',
          message: validation.error
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
    
    // Calculate new odds using AMM
    const ammResult = AMMService.calculateNewOdds(market, side, amount);
    
    // Create position
    const position: Position = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      marketId,
      side,
      amount,
      shares: ammResult.userShares,
      entryPrice: side === 'YES' ? market.yesPrice : market.noPrice,
      paymentMethod,
      timestamp: new Date()
    };
    
    // Create transaction
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: 'bet',
      paymentMethod,
      amount,
      currency: isCrypto ? paymentMethod : user.mobileMoneyBalances.find(b => b.provider === paymentMethod)?.currency || 'GHS',
      status: 'completed',
      timestamp: new Date()
    };
    
    // Update user balance (in real app, this would be atomic)
    if (isCrypto) {
      user.balances[paymentMethod as keyof typeof user.balances] -= amount;
    } else {
      const mmBalance = user.mobileMoneyBalances.find(b => b.provider === paymentMethod);
      if (mmBalance) {
        mmBalance.balance -= amount;
      }
    }
    
    // Update market odds
    market.yesPrice = ammResult.yesPrice;
    market.noPrice = ammResult.noPrice;
    market.totalYesShares = ammResult.newYesShares;
    market.totalNoShares = ammResult.newNoShares;
    market.volume += amount;
    
    // Save position and transaction
    addPosition(position);
    addTransaction(transaction);
    
    res.status(201).json({
      success: true,
      data: {
        bet: position,
        updated_odds: {
          yesPrice: ammResult.yesPrice,
          noPrice: ammResult.noPrice
        },
        user_shares: ammResult.userShares
      },
      message: 'Bet placed successfully'
    });
    
  } catch (error) {
    console.error('Bet placement error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to place bet'
      }
    });
  }
});

// GET /api/bets/positions - Get user positions
router.get('/positions', authenticateToken, (req, res) => {
  try {
    const positions = getUserPositions(req.user!.id);
    
    res.json({
      success: true,
      data: positions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch positions'
      }
    });
  }
});

export default router;