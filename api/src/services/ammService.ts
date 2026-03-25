// Automated Market Maker Service for MVP
import { Market } from '../types';

export interface AMMResult {
  yesPrice: number;
  noPrice: number;
  newYesShares: number;
  newNoShares: number;
  userShares: number;
}

export class AMMService {
  /**
   * Calculate new market odds using Constant Product Market Maker formula
   * k = yesShares * noShares (constant)
   */
  static calculateNewOdds(market: Market, betSide: 'YES' | 'NO', betAmount: number): AMMResult {
    const k = market.totalYesShares * market.totalNoShares;
    
    let newYesShares = market.totalYesShares;
    let newNoShares = market.totalNoShares;
    let userShares = 0;
    
    if (betSide === 'YES') {
      // Calculate shares user gets based on current price
      userShares = betAmount / market.yesPrice;
      newYesShares = market.totalYesShares + userShares;
      newNoShares = k / newYesShares;
    } else {
      // Calculate shares user gets based on current price
      userShares = betAmount / market.noPrice;
      newNoShares = market.totalNoShares + userShares;
      newYesShares = k / newNoShares;
    }
    
    const totalShares = newYesShares + newNoShares;
    const yesPrice = newNoShares / totalShares;
    const noPrice = newYesShares / totalShares;
    
    return {
      yesPrice,
      noPrice,
      newYesShares,
      newNoShares,
      userShares
    };
  }
  
  /**
   * Calculate potential payout for a position
   */
  static calculatePayout(shares: number, entryPrice: number, marketResolution: 'YES' | 'NO', positionSide: 'YES' | 'NO'): number {
    if (positionSide === marketResolution) {
      // Winner gets proportional payout
      return shares / entryPrice;
    }
    return 0; // Loser gets nothing
  }
  
  /**
   * Calculate current market probabilities
   */
  static getMarketProbabilities(market: Market): { yesProb: number; noProb: number } {
    return {
      yesProb: market.yesPrice,
      noProb: market.noPrice
    };
  }
  
  /**
   * Validate bet parameters
   */
  static validateBet(market: Market, amount: number): { valid: boolean; error?: string } {
    if (market.isResolved) {
      return { valid: false, error: 'Market has already been resolved' };
    }
    
    if (market.endDate < new Date()) {
      return { valid: false, error: 'Market has expired' };
    }
    
    if (amount <= 0) {
      return { valid: false, error: 'Bet amount must be positive' };
    }
    
    if (amount < 0.01) {
      return { valid: false, error: 'Minimum bet amount is 0.01' };
    }
    
    return { valid: true };
  }
}