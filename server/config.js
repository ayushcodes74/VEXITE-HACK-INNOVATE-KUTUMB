import dotenv from 'dotenv';

// Load .env with override so our file values take precedence over
// any shell/hosting environment variables (e.g. PORT set by Freebuff).
dotenv.config({ override: true });

// Centralized configuration for KUTUMB Gemini Document Intelligence
export const config = {
  get port() {
    return process.env.PORT || 5000;
  },
  // Centralized Gemini model identifier (can be overridden via GEMINI_MODEL env var)
  get geminiModel() {
    return process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  },
  get geminiApiKey() {
    return process.env.GEMINI_API_KEY || '';
  },
  get isApiKeyConfigured() {
    const key = process.env.GEMINI_API_KEY;
    return Boolean(
      key && 
      key !== 'YOUR_API_KEY_HERE' &&
      key.trim().length > 10
    );
  }
};
