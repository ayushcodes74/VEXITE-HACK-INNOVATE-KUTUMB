import dotenv from 'dotenv';
dotenv.config();

// Centralized configuration for KUTUMB Gemini Document Intelligence
export const config = {
  get port() {
    return process.env.PORT || 5000;
  },
  // Centralized Gemini model identifier (can be overridden via GEMINI_MODEL env var)
  get geminiModel() {
    dotenv.config();
    return process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  },
  get geminiApiKey() {
    dotenv.config();
    return process.env.GEMINI_API_KEY || '';
  },
  get isApiKeyConfigured() {
    dotenv.config();
    const key = process.env.GEMINI_API_KEY;
    return Boolean(
      key && 
      key !== 'YOUR_API_KEY_HERE' &&
      key.trim().length > 10
    );
  }
};
