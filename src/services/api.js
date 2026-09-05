// KUTUMB API Client Service
// Facilitates communication with the backend Gemini Document Intelligence Engine

// VITE_API_URL = backend origin (e.g. https://...onrender.com).
// All backend routes live under /api, so we always append that path.
// Local dev: VITE_API_URL is unset → '/api' is proxied to localhost:5000 via vite.config.js.
const _rawBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
const API_BASE = _rawBase ? _rawBase + '/api' : '/api';

/**
 * Check backend server and Gemini engine status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('[API Service] Backend health check failed:', error.message);
    return { status: 'offline', error: error.message };
  }
}

/**
 * Fetch available synthetic demonstration documents
 */
export async function fetchDemoDocuments() {
  try {
    const res = await fetch(`${API_BASE}/demo-documents`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.documents || [];
  } catch (error) {
    console.error('[API Service] Failed to fetch demo documents:', error);
    return [];
  }
}

/**
 * Upload and analyze a document file using Gemini Document Intelligence
 * @param {File} file - PDF, PNG, or JPEG file
 */
export async function analyzeDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/analyze-document`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json().catch(() => ({
    success: false,
    error: 'NETWORK_ERROR',
    message: `Server returned HTTP ${res.status}`
  }));

  if (!res.ok || !json.success) {
    const err = new Error(json.message || json.error || `Analysis request failed with status ${res.status}`);
    err.code = json.error || 'DOCUMENT_ANALYSIS_FAILED';
    throw err;
  }

  return json;
}

/**
 * 1-Click analysis for synthetic demonstration document
 * @param {string} demoId - ID of the synthetic demo document
 */
export async function analyzeDemoDocument(demoId) {
  const res = await fetch(`${API_BASE}/analyze-demo/${demoId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await res.json().catch(() => ({
    success: false,
    error: 'NETWORK_ERROR',
    message: `Server returned HTTP ${res.status}`
  }));

  if (!res.ok || !json.success) {
    const err = new Error(json.message || json.error || `Demo analysis request failed with status ${res.status}`);
    err.code = json.error || 'DOCUMENT_ANALYSIS_FAILED';
    throw err;
  }

  return json;
}
