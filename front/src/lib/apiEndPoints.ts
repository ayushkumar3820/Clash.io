import Env from "./env";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const BACKEND_URL = Env.BACKEND_URL;
export const LOGIN_URL = `${BASE_URL}/api/check/login`;
export const CHECK_CREDENTIALS_URL = BACKEND_URL + "/api/check/login";
export const REGISTER_URL = `${BASE_URL}/api/auth/register`;
export const FORGOT_PASSWORD_URL = BACKEND_URL + "/api/forget-password";
export const RESET_PASSWORD_URL = BACKEND_URL + "/api/reset-password";
export const VERIFY_EMAIL_URL = `${BASE_URL}/api/verify-email`;

//  Clash URL
export const CLASH_URL = BACKEND_URL + "/api/clash";
export const CLASH_ITEMS_URL = BACKEND_URL + "/api/clash/items";
