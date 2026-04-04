import 'dotenv/config';

/**
 * CORE CONFIG — Fail Fast Pattern
 * Nếu thiếu bất kỳ ENV nào dưới đây, server sẽ không khởi động.
 * Đây là hành vi đúng: tốt hơn là crash sớm thay vì chạy với config sai.
 */
const REQUIRED_ENVS = [
  'MONGO_URI',
  'JWT_SECRET',
  'REFRESH_SECRET',
  'SESSION_SECRET',
];

const missing = REQUIRED_ENVS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `[CONFIG] Missing required environment variables: ${missing.join(', ')}\n` +
    `Server cannot start without these values. Check your .env file.`
  );
}

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Database
  mongoUri: process.env.MONGO_URI,

  // Auth
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshSecret: process.env.REFRESH_SECRET,
  refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',

  // Session
  sessionSecret: process.env.SESSION_SECRET,

  // Frontend
  clientUrl: process.env.CLIENT_URL || process.env.LOCALHOST,

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,

  // CORS
  allowedOrigins: [
    'http://localhost:5173',
    'http://localhost:5713',
    'http://localhost:3000',
    'https://hcm-metro.vercel.app',
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ],
};

export default config;
