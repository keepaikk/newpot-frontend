// Markets Routes
import express from 'express';
import { markets, findMarketById } from '../database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/markets - Get all markets
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredMarkets = markets;
    
    if (category && category !== 'All') {
      filteredMarkets = markets.filter(market => market.category === category);
    }
    
    res.json({
      success: true,
      data: filteredMarkets.map(market => ({
        ...market,
        oddsHistory: [
          { timestamp: '2024-01-01', yes: market.yesPrice - 0.1, no: market.noPrice + 0.1 },
          { timestamp: '2024-06-01', yes: market.yesPrice - 0.05, no: market.noPrice + 0.05 },
          { timestamp: '2024-12-01', yes: market.yesPrice, no: market.noPrice }
        ]
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch markets'
      }
    });
  }
});

// GET /api/markets/:id - Get specific market
router.get('/:id', (req, res) => {
  try {
    const market = findMarketById(req.params.id);
    
    if (!market) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MARKET_NOT_FOUND',
          message: 'Market not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        ...market,
        oddsHistory: [
          { timestamp: '2024-01-01', yes: market.yesPrice - 0.15, no: market.noPrice + 0.15 },
          { timestamp: '2024-03-01', yes: market.yesPrice - 0.1, no: market.noPrice + 0.1 },
          { timestamp: '2024-06-01', yes: market.yesPrice - 0.05, no: market.noPrice + 0.05 },
          { timestamp: '2024-09-01', yes: market.yesPrice + 0.02, no: market.noPrice - 0.02 },
          { timestamp: '2024-12-01', yes: market.yesPrice, no: market.noPrice }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch market'
      }
    });
  }
});

// GET /api/markets/:id/analysis - Get AI analysis (mock for MVP)
router.get('/:id/analysis', authenticateToken, (req, res) => {
  try {
    const market = findMarketById(req.params.id);
    
    if (!market) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MARKET_NOT_FOUND',
          message: 'Market not found'
        }
      });
    }
    
    // Mock AI analysis for demo
    const analyses = {
      '1': 'Ghana has a strong squad this year with key players performing well in European leagues. However, AFCON history shows surprises are common. Consider recent form and injury reports.',
      '2': 'Recent polling data shows tight race between major parties. Economic indicators and regional voting patterns suggest outcome will depend on voter turnout in key constituencies.',
      '3': 'Bitcoin technical analysis indicates strong momentum above key resistance levels. Institutional adoption and regulatory clarity are positive factors, but market volatility remains high.'
    };
    
    res.json({
      success: true,
      data: {
        analysis: analyses[req.params.id as keyof typeof analyses] || 'Market analysis temporarily unavailable. Please check back later.',
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to get market analysis'
      }
    });
  }
});

export default router;