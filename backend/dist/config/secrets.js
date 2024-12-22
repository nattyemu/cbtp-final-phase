import dotenv from 'dotenv';
dotenv.config({
    path: '.env'
});
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const SECRET = process.env.JWT_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const PHONE = process.env.PHONE;
export const AUTH_TOKEN = process.env.AUTH_TOKEN;
export const ACCOUNT_ID = process.env.ACCOUNT_ID;
export const VONAGE_API = process.env.VONAGE_API;
export const VONAGE_APISECRAT = process.env.VONAGE_APISECRAT;
export const UNCG_API = process.env.UNCG_API;
export const SIKAR_API = process.env.SIKAR_API;
export const BASE_URL = process.env.BASE_URL;
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
