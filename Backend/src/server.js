import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import MongoStore from 'connect-mongo';
import crypto from 'crypto';

import config from './core/config/config.js';
import logger from './core/logger/logger.js';
import connectDB from './config/db.js';
import errorHandler from './core/error/errorHandler.js';
import routes from './routes/index.js';
import './config/passportConfig.js'; 

import { initRedis } from './core/cache/redis.js';
import { initMetadata } from './models/systemMetadata.model.js';
import * as Metrics from './core/metrics/metrics.js';
import als from './core/logger/als.js';

const app = express();

/**
 * SECURITY & PERFORMANCE MIDDLEWARES
 */
app.use(helmet()); 

// Inject Request ID for Traceability (Staff-level Distributed Tracing)
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', requestId);
  
  // Implicitly propagate requestId through the entire execution context
  als.run(requestId, () => {
    next();
  });
});

app.use(compression()); 
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 🔍 Metrics Middleware (Staff-level Observability)
// Collects duration histograms for all API requests
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const seconds = duration[0] + duration[1] / 1e9;
    Metrics.httpRequestDuration.observe(
      { 
        method: req.method, 
        route: req.route ? req.route.path : req.originalUrl, 
        status_code: res.statusCode 
      },
      seconds
    );
  });
  next();
});

// Prometheus Scrape Endpoint - Internal Use
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', Metrics.getContentType());
    res.end(await Metrics.getMetrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Khong duoc phep boi CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

/**
 * SESSION & AUTHENTICATION
 */
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.mongoUri,
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      secure: config.isProduction,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: config.isProduction ? 'none' : 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * REQUEST LOGGING
 */
if (!config.isProduction) {
  app.use((req, res, next) => {
    logger.debug(`[${req.method}] ${req.url}`);
    next();
  });
}

/**
 * ROUTES
 */
app.use('/api/v1', routes); 

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HCM Metro API is running (ESM Mode)',
    version: '1.0.0',
    env: config.nodeEnv
  });
});

/**
 * ERROR HANDLING
 */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Khong tim thay route: ${req.originalUrl}`
  });
});

app.use(errorHandler);

/**
 * SERVER BOOTSTRAP
 */
const startServer = async () => {
  try {
    await connectDB();
    await initMetadata();
    await initRedis();
    
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      const PORT = config.port || 5000;
      app.listen(PORT, () => {
        logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT} [ESM]`);
      });
    }
  } catch (err) {
    logger.error('💥 Server Bootstrap Error:', { error: err.message });
    process.exit(1);
  }
};

startServer();

/**
 * GLOBAL PROCESS ERROR HANDLERS (L7 Standard)
 */
process.on('unhandledRejection', (err) => {
  logger.error('💥 UNHANDLED REJECTION! Shutting down...', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

export default app;
