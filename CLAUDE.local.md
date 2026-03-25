# CLAUDE.local.md

This file contains backend development documentation and guidance for Claude Code when working with the NewsoBet Africa backend system.

## Backend Development Overview

NewsoBet Africa backend will handle:
- User authentication and management
- Market creation and management
- Betting logic and position tracking
- Payment processing (crypto + mobile money)
- Real-time market data and odds calculation
- Transaction history and wallet management
- API endpoints for frontend integration

## Frontend Integration Points

The frontend expects these key API endpoints:
- User authentication and profile management
- Market data and betting functionality
- Wallet operations (deposits, withdrawals, balances)
- Transaction history
- Mobile money integration APIs
- Real-time market updates

## Frontend State Management

Current frontend uses Zustand store with:
- User balances (crypto + mobile money)
- Market data and positions
- Wallet modal state
- Payment method selection

## Technology Stack Requirements

**Frontend Complete:**
- React 19 + TypeScript
- Vite build system
- Deployed via Dokploy Nixpacks
- Domain: newsbet.rpnmore.com
- Mobile Money Integration: MTN, Airtel, Vodafone, Tigo
- Crypto Support: BTC, ETH, SOL, XLM, XRP, BONK
- AI Integration: Google Gemini for market analysis

**Backend Requirements:**
- Node.js/Express API server
- Prisma ORM with PostgreSQL/MySQL
- Redis for caching and rate limiting
- WebSocket for real-time updates
- Mobile money API integrations
- Crypto wallet integrations
- AI service connections

## Backend Documentation

### Integration Tests
```javascript
describe('Betting API', () => {
  test('POST /api/bets places bet and updates odds', async () => {
    const response = await request(app)
      .post('/api/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        market_id: market.id,
        position: 'YES',
        amount: 100,
        crypto_type: 'BTC'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.bet.shares).toBeGreaterThan(0);
    expect(response.body.updated_odds.yes_price).toBeGreaterThan(0.5);
  });
});
```

### API Response Formats

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance for this bet",
    "details": { ... }
  }
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

### Monitoring & Logging

**Health Check Endpoint:**
```javascript
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date(),
      database: 'connected',
      redis: 'connected',
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

**Logging:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log important events
logger.info('Bet placed', { user_id, market_id, amount });
logger.error('Withdrawal failed', { withdrawal_id, error });
```

### Critical Security Reminders

✅ Test all crypto integrations on TESTNET first
✅ Never store private keys in code (use env vars)  
✅ Always validate user inputs (Zod schemas)
✅ Use transactions for financial operations
✅ Log all money movements (audit trail)
✅ Rate limit all endpoints
✅ Implement 2FA for withdrawals >$500
✅ Monitor for suspicious activity (fraud detection)
✅ Backup database daily
✅ Keep hot wallet funds <10% of total
✅ Test payout calculations extensively
✅ Handle blockchain reorgs (rare but possible)
✅ Implement circuit breakers (pause if issues detected)
✅ Document all API endpoints (Swagger/OpenAPI)
✅ Version your API (/api/v1)

### Development Strategy

**Priority:** Security first (handling real money), then correctness (AMM math), then performance

**Implementation Plan:**
1. Start with BTC only, then add other cryptos one by one after testing
2. Test extensively on testnets before going to mainnet
3. Use Prisma for all database operations (prevents SQL injection)
4. Implement proper error handling and logging
5. Deploy to Dokploy with CI/CD pipeline

**Technology Stack:**
- Node.js/Express backend
- Prisma ORM for database operations
- Redis for caching and rate limiting
- Winston for logging
- Zod for input validation
- Jest for testing

## Missing Critical Components

### Database Schema (Prisma)

```prisma
model User {
  id                    String   @id @default(cuid())
  username             String   @unique
  email                String?  @unique
  phoneNumber          String?  @unique
  country              String?  // GH, NG, KE, UG, TZ, RW
  passwordHash         String
  isVerified           Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  // Crypto balances
  balanceBTC           Float    @default(0)
  balanceETH           Float    @default(0)
  balanceSOL           Float    @default(0)
  balanceXLM           Float    @default(0)
  balanceXRP           Float    @default(0)
  balanceBONK          Float    @default(0)
  
  // Mobile money balances
  mobileMoneyBalances  MobileMoneyBalance[]
  positions            Position[]
  transactions         Transaction[]
}

model MobileMoneyBalance {
  id          String @id @default(cuid())
  userId      String
  provider    String // MTN, AIRTEL, VODAFONE, TIGO
  phoneNumber String
  balance     Float  @default(0)
  currency    String // GHS, NGN, KES, UGX, TZS, RWF
  user        User   @relation(fields: [userId], references: [id])
}

model Market {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String   // Politics, Sports, Crypto, Economy
  endDate     DateTime
  isResolved  Boolean  @default(false)
  resolution  String?  // YES, NO, null
  
  // AMM State
  totalYesShares  Float @default(1000)
  totalNoShares   Float @default(1000)
  yesPrice        Float @default(0.5)
  noPrice         Float @default(0.5)
  volume          Float @default(0)
  
  positions   Position[]
  oddsHistory OddsHistory[]
  createdAt   DateTime @default(now())
}

model Position {
  id         String   @id @default(cuid())
  userId     String
  marketId   String
  side       String   // YES, NO
  amount     Float
  shares     Float
  entryPrice Float
  paymentMethod String // BTC, ETH, SOL, MTN, etc.
  timestamp  DateTime @default(now())
  
  user       User     @relation(fields: [userId], references: [id])
  market     Market   @relation(fields: [marketId], references: [id])
}

model Transaction {
  id            String   @id @default(cuid())
  userId        String
  type          String   // deposit, withdrawal, bet, payout
  paymentMethod String   // BTC, ETH, SOL, MTN, etc.
  amount        Float
  currency      String   // BTC, GHS, etc.
  status        String   // pending, completed, failed
  txHash        String?  // for crypto transactions
  phoneNumber   String?  // for mobile money
  timestamp     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
}

model OddsHistory {
  id        String   @id @default(cuid())
  marketId  String
  yesPrice  Float
  noPrice   Float
  timestamp DateTime @default(now())
  
  market    Market   @relation(fields: [marketId], references: [id])
}
```

### Mobile Money API Integration

```javascript
// Mobile Money Service Integration
class MobileMoneyService {
  async processDeposit(provider, phoneNumber, amount, currency) {
    switch(provider) {
      case 'MTN':
        return this.processMTNDeposit(phoneNumber, amount, currency);
      case 'AIRTEL':
        return this.processAirtelDeposit(phoneNumber, amount, currency);
      case 'VODAFONE':
        return this.processVodafoneDeposit(phoneNumber, amount, currency);
      case 'TIGO':
        return this.processTigoDeposit(phoneNumber, amount, currency);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  async processMTNDeposit(phoneNumber, amount, currency) {
    // MTN Mobile Money API integration
    // Different per country - Ghana vs Nigeria vs Uganda
    const countryCode = this.getCountryFromPhone(phoneNumber);
    const apiEndpoint = MTN_ENDPOINTS[countryCode];
    
    const response = await fetch(`${apiEndpoint}/deposit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MTN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: phoneNumber,
        amount: amount,
        currency: currency,
        reference: generateTransactionId()
      })
    });
    
    return response.json();
  }

  async checkTransactionStatus(provider, transactionId) {
    // Check status of mobile money transaction
    // Return: pending, completed, failed
  }
}
```

### Real-time Updates (WebSocket)

```javascript
const WebSocket = require('ws');

class MarketUpdatesService {
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });
    this.clients = new Map();
  }

  broadcastMarketUpdate(marketId, newOdds) {
    const message = {
      type: 'MARKET_UPDATE',
      marketId,
      yesPrice: newOdds.yes,
      noPrice: newOdds.no,
      timestamp: new Date()
    };

    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  broadcastBalanceUpdate(userId, balances) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'BALANCE_UPDATE',
        balances,
        timestamp: new Date()
      }));
    }
  }
}
```

### AI Integration Service

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async analyzeMarket(title, description) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Analyze this prediction market: "${title}". ${description}. 
                     Provide a brief analysis of factors that could influence the outcome.
                     Keep response under 100 words.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error('AI analysis failed', { error, title });
      return 'Market analysis temporarily unavailable.';
    }
  }

  async detectSuspiciousActivity(userId, betAmount, marketId) {
    // AI-powered fraud detection
    const userHistory = await this.getUserBettingHistory(userId);
    const marketData = await this.getMarketData(marketId);
    
    // Use AI to detect unusual patterns
    // Return risk score 0-1
  }
}
```

### AMM (Automated Market Maker) Mathematics

```javascript
class AMMService {
  calculateNewOdds(market, betSide, betAmount) {
    // Constant Product Market Maker formula
    // k = yesShares * noShares (constant)
    
    const k = market.totalYesShares * market.totalNoShares;
    
    if (betSide === 'YES') {
      const newYesShares = market.totalYesShares + betAmount;
      const newNoShares = k / newYesShares;
      
      return {
        yesPrice: newNoShares / (newYesShares + newNoShares),
        noPrice: newYesShares / (newYesShares + newNoShares),
        newYesShares,
        newNoShares: newNoShares
      };
    } else {
      const newNoShares = market.totalNoShares + betAmount;
      const newYesShares = k / newNoShares;
      
      return {
        yesPrice: newNoShares / (newYesShares + newNoShares),
        noPrice: newYesShares / (newYesShares + newNoShares),
        newYesShares,
        newNoShares
      };
    }
  }

  calculatePayout(position, marketResolution) {
    if (position.side === marketResolution) {
      // Winner gets proportional share of losing side's pool
      return position.shares * (1 / position.entryPrice);
    }
    return 0; // Loser gets nothing
  }
}
```

### Multi-Country Support

```javascript
const COUNTRY_CONFIG = {
  'GH': {
    currency: 'GHS',
    mobileProviders: ['MTN', 'VODAFONE'],
    regulations: 'ghana_gaming_commission',
    kyc_required: 1000 // GHS threshold
  },
  'NG': {
    currency: 'NGN', 
    mobileProviders: ['MTN', 'AIRTEL'],
    regulations: 'nigerian_gaming_board',
    kyc_required: 50000 // NGN threshold
  },
  'KE': {
    currency: 'KES',
    mobileProviders: ['AIRTEL'],
    regulations: 'betting_control_licensing_board',
    kyc_required: 10000 // KES threshold
  }
  // Add UG, TZ, RW...
};

class ComplianceService {
  async validateUserRegistration(country, phoneNumber, betAmount) {
    const config = COUNTRY_CONFIG[country];
    if (!config) throw new Error(`Unsupported country: ${country}`);
    
    // Check if KYC required based on amount
    if (betAmount > config.kyc_required) {
      return { requiresKYC: true, threshold: config.kyc_required };
    }
    
    return { requiresKYC: false };
  }
}
```

### Enhanced API Routes

```javascript
// Mobile Money Endpoints
app.post('/api/v1/wallet/mobile-money/deposit', auth, async (req, res) => {
  const { provider, phoneNumber, amount, currency } = req.body;
  
  // Validate inputs
  const schema = z.object({
    provider: z.enum(['MTN', 'AIRTEL', 'VODAFONE', 'TIGO']),
    phoneNumber: z.string().regex(/^\+\d{10,15}$/),
    amount: z.number().min(1).max(10000),
    currency: z.enum(['GHS', 'NGN', 'KES', 'UGX', 'TZS', 'RWF'])
  });
  
  const validatedData = schema.parse(req.body);
  
  try {
    const transaction = await mobileMoneyService.processDeposit(
      validatedData.provider,
      validatedData.phoneNumber, 
      validatedData.amount,
      validatedData.currency
    );
    
    res.json({
      success: true,
      data: transaction,
      message: 'Mobile money deposit initiated'
    });
  } catch (error) {
    logger.error('Mobile money deposit failed', { userId: req.user.id, error });
    res.status(500).json({
      success: false,
      error: {
        code: 'MOBILE_MONEY_ERROR',
        message: 'Failed to process mobile money deposit'
      }
    });
  }
});

// Enhanced Betting Endpoint with Mobile Money Support
app.post('/api/v1/bets', auth, async (req, res) => {
  const { marketId, side, amount, paymentMethod } = req.body;
  
  const schema = z.object({
    marketId: z.string().cuid(),
    side: z.enum(['YES', 'NO']),
    amount: z.number().min(0.01),
    paymentMethod: z.enum(['BTC', 'ETH', 'SOL', 'XLM', 'XRP', 'BONK', 'MTN', 'AIRTEL', 'VODAFONE', 'TIGO'])
  });
  
  const validatedData = schema.parse(req.body);
  
  // Start database transaction
  const result = await prisma.$transaction(async (tx) => {
    // Check balance based on payment method
    const user = await tx.user.findUnique({ 
      where: { id: req.user.id },
      include: { mobileMoneyBalances: true }
    });
    
    let hasBalance = false;
    if (['BTC', 'ETH', 'SOL', 'XLM', 'XRP', 'BONK'].includes(paymentMethod)) {
      hasBalance = user[`balance${paymentMethod}`] >= amount;
    } else {
      const mmBalance = user.mobileMoneyBalances.find(b => b.provider === paymentMethod);
      hasBalance = mmBalance && mmBalance.balance >= amount;
    }
    
    if (!hasBalance) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
    
    // Calculate new odds using AMM
    const market = await tx.market.findUnique({ where: { id: marketId } });
    const newOdds = ammService.calculateNewOdds(market, side, amount);
    
    // Create position
    const position = await tx.position.create({
      data: {
        userId: req.user.id,
        marketId,
        side,
        amount,
        shares: amount / (side === 'YES' ? market.yesPrice : market.noPrice),
        entryPrice: side === 'YES' ? market.yesPrice : market.noPrice,
        paymentMethod
      }
    });
    
    // Update market odds
    await tx.market.update({
      where: { id: marketId },
      data: {
        yesPrice: newOdds.yesPrice,
        noPrice: newOdds.noPrice,
        totalYesShares: newOdds.newYesShares,
        totalNoShares: newOdds.newNoShares,
        volume: { increment: amount }
      }
    });
    
    // Deduct balance
    if (['BTC', 'ETH', 'SOL', 'XLM', 'XRP', 'BONK'].includes(paymentMethod)) {
      await tx.user.update({
        where: { id: req.user.id },
        data: {
          [`balance${paymentMethod}`]: { decrement: amount }
        }
      });
    } else {
      await tx.mobileMoneyBalance.updateMany({
        where: { userId: req.user.id, provider: paymentMethod },
        data: { balance: { decrement: amount } }
      });
    }
    
    return { position, newOdds };
  });
  
  // Broadcast real-time updates
  marketUpdatesService.broadcastMarketUpdate(marketId, result.newOdds);
  
  res.json({
    success: true,
    data: {
      bet: result.position,
      updated_odds: result.newOdds
    },
    message: 'Bet placed successfully'
  });
});
```

---

## Development Notes

- Frontend is 100% complete with mobile money integration
- All payment methods working: BTC, ETH, SOL, XLM, XRP, BONK + MTN, Airtel, Vodafone, Tigo
- AI market analysis integrated with Gemini API
- Responsive design optimized for African markets
- Production deployment working on newsbet.rpnmore.com

## Next Steps

Backend development to provide API layer for:
1. User authentication system
2. Market data management
3. Betting and position tracking
4. Payment processing integration
5. Real-time updates and WebSocket support

---

*This file will be updated with backend-specific documentation as development progresses.*