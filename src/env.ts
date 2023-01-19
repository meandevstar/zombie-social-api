import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const INDEX_NAME = process.env.INDEX_NAME || 'local';

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 4000;

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';

export const RATE_LIMIT = process.env.RATE_LIMIT || 0;
