# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Newpot is a crypto prediction markets app focused on African markets, built as a React TypeScript application using Vite. The app allows users to place bets on various markets (politics, sports, crypto, etc.) using multiple cryptocurrency assets.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 3000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Install dependencies**: `npm install`

## Environment Setup

The app requires a `GEMINI_API_KEY` environment variable set in `.env.local` for AI-powered market analysis features.

## DEPLOYMENT SOLUTION 🚀

### Dokploy Configuration (PROVEN WORKING)

After extensive troubleshooting, the correct Dokploy configuration is:

```
Build Type: Nixpacks (NOT Docker!)
Build Path: newpot
Publish Directory: ./dist
Port: 80
Domain: newpot.rpnmore.com

Environment Variables:
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=production
```

### Key Deployment Learnings

1. **Use Nixpacks, NOT Docker**: Dokploy's official Vite React example uses Nixpacks auto-detection
2. **Docker Issues**: Complex multi-stage Dockerfile with nginx caused 404 errors and file path issues
3. **Build Path**: Must be set to `newpot` since the app is in a subdirectory
4. **Port**: Use port 80 (standard for web apps)
5. **Environment Variables**: GEMINI_API_KEY is critical for AI features

### Troubleshooting Notes

- **404 Errors**: Usually caused by wrong build type (Docker instead of Nixpacks)
- **Build Failures**: Missing `GEMINI_API_KEY` or wrong build context
- **nginx.conf issues**: Avoided by using Nixpacks instead of custom Docker setup
- **File Path Problems**: Solved by proper Build Path configuration in Dokploy

## Architecture

### State Management
- Uses **Zustand** for global state management in `store.ts`
- Single store handles user data, markets, positions, wallet modal state, and betting logic
- Mock user with crypto balances (BTC, ETH, SOL, XLM, XRP, BONK)

### Key Components
- **App.tsx**: Main app component with mobile navigation
- **components/**: Reusable UI components (Navbar, WalletModal, MarketCard)
- **views/**: Main application views (HomeView, MarketDetailView)
- **services/**: External service integrations (Gemini AI)

### Type System
- **types.ts**: Core TypeScript interfaces (User, Market, Position, Transaction)
- **constants.tsx**: Static data including supported cryptocurrencies and mock markets

### Routing & Navigation
- Simple state-based navigation without external router
- Mobile-first design with bottom tab navigation
- Desktop navigation through top navbar

### AI Integration
- **geminiService.ts**: Provides market sentiment analysis using Google Gemini AI
- Fallback responses when API fails
- Configured for African crypto trader audience

### Mock Data
- **MOCK_MARKETS**: Sample prediction markets for development
- Categories: Politics, Sports, Entertainment, Crypto, Economy
- Includes Ghana AFCON, presidential elections, and Bitcoin price predictions

## Code Patterns

### Styling
- Uses Tailwind CSS classes throughout
- Dark theme (slate-950 background)
- Responsive design with mobile-first approach

### State Updates
- Zustand actions for all state mutations
- Betting logic validates balances before placing bets
- Position tracking with entry prices and timestamps

### File Organization
- Flat component structure in `/components`
- Separate views for major app screens
- Service layer for external dependencies
- Centralized types and constants

## Path Aliases
- Uses `@/*` alias mapping to project root (configured in tsconfig.json and vite.config.ts)

## Deployment Files (For Reference Only)

The repository contains various Docker-related files that were created during troubleshooting:
- `Dockerfile` - Final Docker version (not used in production)
- `Dockerfile.complex` - Complex multi-stage build (caused issues)
- `nginx.conf` - Nginx configuration (not needed with Nixpacks)
- `docker-compose.yml` - Local development setup

**Note**: These files are kept for reference, but production deployment uses Nixpacks configuration above.

## Backend Development Plan

### 📅 6-Week Implementation Timeline

**Phase 1: Foundation & Core Infrastructure (Week 1)**
- Development environment setup (Node.js/Express/TypeScript)
- Database schema implementation (Prisma + PostgreSQL)
- Security foundation (JWT, bcrypt, rate limiting, input validation)
- Development standards (ESLint, Prettier, Jest, Swagger)

**Phase 2: Core API Development (Week 2)**
- User management system with multi-country support
- Basic wallet system (crypto + mobile money tracking)
- Market management (creation, listing, resolution)
- Basic betting system (BTC only initially)

**Phase 3: Advanced Features & Integrations (Week 3)**
- AI integration (Google Gemini for market analysis)
- Real-time features (WebSocket for live updates)
- Advanced market features (AMM implementation)
- Enhanced betting system (all cryptocurrencies)

**Phase 4: Mobile Money Integration (Week 4)**
- Mobile money API integration (MTN, Airtel, Vodafone, Tigo)
- Payment processing for 6 African countries
- Enhanced betting with mobile money support
- Multi-country compliance frameworks

**Phase 5: Testing & Security Hardening (Week 5)**
- Comprehensive testing (unit, integration, load testing)
- Security audit and hardening
- Monitoring and observability setup
- Incident response procedures

**Phase 6: Deployment & Production Launch (Week 6)**
- Dokploy production deployment
- CI/CD pipeline with GitHub Actions
- Production monitoring and alerting
- Security verification and go-live procedures

### 🎯 Critical Success Factors

**Security Priority:** Security > Correctness > Performance (handling real money)

**Key Dependencies:**
- Database schema must be complete before other features
- Authentication system required for all protected endpoints
- Security foundation essential before financial operations
- Mobile money API access required for full feature parity

**Risk Mitigation:**
- Extensive testing on testnets before mainnet
- Robust error handling for external API integrations
- Circuit breakers and graceful degradation
- Comprehensive audit trails for all financial operations

**Success Metrics:**
- API response time < 200ms for 95% of requests
- 99.9% uptime for core trading functionality
- Zero financial calculation errors
- Complete frontend feature parity
- Support for 6 African countries with mobile money integration

### 🚀 Production Readiness Checklist

**Technical Requirements:**
- [ ] All frontend API endpoints implemented
- [ ] Mobile money integration for MTN, Airtel, Vodafone, Tigo
- [ ] Real-time WebSocket updates for live betting
- [ ] AI-powered market analysis
- [ ] Automated Market Maker (AMM) mathematics
- [ ] Multi-currency support (6 cryptos + 6 fiat currencies)
- [ ] Security hardening and audit completion
- [ ] Comprehensive testing suite passing
- [ ] Production deployment pipeline ready
- [ ] Monitoring and alerting configured

**Business Requirements:**
- [ ] Support for Ghana, Nigeria, Kenya, Uganda, Tanzania, Rwanda
- [ ] KYC compliance per country regulations
- [ ] Financial audit trails for all transactions
- [ ] Fraud detection and prevention systems
- [ ] Disaster recovery and backup procedures

---

## Next Steps

**Immediate Action:** Begin Phase 1 - Foundation & Core Infrastructure
1. Set up Node.js/Express/TypeScript project structure
2. Implement Prisma database schema
3. Configure security foundation (JWT, validation, rate limiting)
4. Set up development tools and testing framework

**Backend Status:** 📋 Planning Complete - Ready for Implementation
**Frontend Status:** ✅ 100% Complete with mobile money + crypto integration
**Timeline:** 6 weeks to production deployment
**Priority:** Security-first development for financial operations