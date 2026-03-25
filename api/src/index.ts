// NewsoBet Africa MVP Backend Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth';
import marketRoutes from './routes/markets';
import betRoutes from './routes/bets';
import walletRoutes from './routes/wallet';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://newpot.rpnmore.com',
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    version: '1.0.0-mvp',
    message: 'NewsoBet Africa MVP API is running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/wallet', walletRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to NewsoBet Africa API',
    version: '1.0.0-mvp',
    documentation: 'Visit /health for health check',
    endpoints: {
      auth: '/api/auth (login, register)',
      markets: '/api/markets (list, get market, analysis)',
      bets: '/api/bets (place bet, positions)',
      wallet: '/api/wallet (balance, deposit, withdraw, transactions)'
    }
  });
});

// Demo endpoints for pitch
app.get('/api/demo/status', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 127,
      activeMarkets: 3,
      totalVolume: 3465040,
      currencies: ['BTC', 'ETH', 'SOL', 'XLM', 'XRP', 'BONK'],
      mobileMoneyProviders: ['MTN', 'AIRTEL', 'VODAFONE', 'TIGO'],
      countries: ['Ghana', 'Nigeria', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda'],
      features: [
        'Crypto & Mobile Money Integration',
        'Real-time Market Odds',
        'AI Market Analysis',
        'Multi-country Support',
        'Automated Market Maker (AMM)'
      ]
    },
    message: 'NewsoBet Africa - Prediction Markets for Africa'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.path} not found`
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 NewsoBet Africa MVP API Server Started');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Demo status: http://localhost:${PORT}/api/demo/status`);
  console.log('');
  console.log('Available Endpoints:');
  console.log('  POST /api/auth/login - User login');
  console.log('  POST /api/auth/register - User registration');
  console.log('  GET  /api/markets - List all markets');
  console.log('  GET  /api/markets/:id - Get specific market');
  console.log('  GET  /api/markets/:id/analysis - Get AI market analysis');
  console.log('  POST /api/bets - Place a bet');
  console.log('  GET  /api/bets/positions - Get user positions');
  console.log('  GET  /api/wallet/balance - Get user balance');
  console.log('  POST /api/wallet/deposit - Simulate deposit');
  console.log('  POST /api/wallet/withdraw - Simulate withdrawal');
  console.log('  GET  /api/wallet/transactions - Get transaction history');
  console.log('');
  console.log('🎯 Ready for pitch demo!');
});

export default app;