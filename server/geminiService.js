import { GoogleGenAI } from '@google/genai';
import { config } from './config.js';

// Dedicated Gemini System Instruction for KUTUMB Document Intelligence Engine
export const KUTUMB_SYSTEM_INSTRUCTION = `You are KUTUMB, a family document intelligence engine.

Analyze ONLY the supplied document.

Do not use information from previous documents.
Do not use information from application mock data.
Do not assume the document belongs to the Sharma family.
Do not invent people, dates, amounts, policies or relationships.

If the supplied document does not contain family/financial/responsibility information relevant to KUTUMB, set "is_relevant" to false in the "relevance" object, return empty arrays for people, entities, relationships, dates, responsibilities, and explain that no relevant family information was detected.

Return only information supported by the supplied document.

Return strictly valid JSON matching this exact canonical schema:
{
  "document": {
    "type": "string (e.g. Health Insurance Policy, Electricity Bill, Home Loan Statement, Presentation, Academic Paper, Hackathon Problem Statement, General Document)",
    "title": "string (actual document title found inside document)",
    "source_file": "string (the supplied original filename)"
  },
  "relevance": {
    "is_relevant": "boolean (true if related to family responsibilities, documents, assets, deadlines, ownership; false if completely unrelated like tech hackathons, academic research, corporate decks)",
    "reason": "string (concise explanation of whether and why this document is or is not relevant to family management)"
  },
  "people": [
    {
      "name": "string (actual person name found in document)",
      "role": "string (role mentioned in document, e.g. Policy Holder, Nominee, Borrower, Co-Applicant, Consumer)"
    }
  ],
  "entities": [
    {
      "type": "string (e.g. Policy, Vehicle, Property, Account, Organization)",
      "name": "string"
    }
  ],
  "relationships": [
    {
      "from": "string (person or entity name)",
      "relationship": "string (exact relation, e.g. policy holder, nominee, borrower, co-owner)",
      "to": "string (person or entity name)"
    }
  ],
  "financial": {
    "amount": "number or null (exact numerical amount without symbols, or null if none)",
    "currency": "string (e.g. INR, USD, or null)"
  },
  "dates": [
    {
      "type": "string (e.g. Renewal Date, Due Date, Issue Date, Expiry Date)",
      "date": "string (exact date found in document)",
      "importance": "string (High, Medium, Normal)"
    }
  ],
  "responsibilities": [
    {
      "person": "string (responsible individual)",
      "action": "string (explicit action supported by document)",
      "due_date": "string (action deadline)",
      "priority": "string (High, Medium, Low)"
    }
  ],
  "warnings": [
    "string (explicit warnings, late fee notices, or inconsistencies found in document)"
  ],
  "confidence": "number (0.0 to 1.0, representing extraction confidence based purely on document clarity)"
}

Do NOT output any markdown backticks like \`\`\`json or text before or after. Return ONLY the raw JSON string.`;

/**
 * Determine accurate MIME type from file extension if incoming mime is generic
 */
export function resolveMimeType(fileName, incomingMime, fileBuffer) {
  // If a specific mime type was explicitly provided (like text/plain, image/png), respect it
  if (incomingMime && incomingMime !== 'application/octet-stream') {
    // If incomingMime is application/pdf but buffer is not PDF (e.g. plain text demo), treat as text/plain
    if (incomingMime === 'application/pdf' && fileBuffer && !fileBuffer.slice(0, 4).toString().startsWith('%PDF')) {
      return 'text/plain';
    }
    return incomingMime;
  }

  // Check PDF magic bytes
  if (fileBuffer && fileBuffer.slice(0, 4).toString().startsWith('%PDF')) {
    return 'application/pdf';
  }

  const ext = (fileName || '').split('.').pop()?.toLowerCase();
  const extMap = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    txt: 'text/plain'
  };

  if (ext && extMap[ext]) {
    return extMap[ext];
  }

  return 'application/pdf';
}

/**
 * Clean and parse Gemini response into validated Canonical JSON
 */
export function parseAndValidateCanonicalSchema(rawText, sourceFileName) {
  let cleaned = (rawText || '').trim();
  
  // Remove markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    // Fallback: extract outermost JSON object via regex
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (innerErr) {
        const error = new Error(`INVALID_GEMINI_RESPONSE: Model output is not valid JSON: ${innerErr.message}`);
        error.code = 'INVALID_GEMINI_RESPONSE';
        throw error;
      }
    } else {
      const error = new Error(`INVALID_GEMINI_RESPONSE: Model output did not contain a JSON object: ${err.message}`);
      error.code = 'INVALID_GEMINI_RESPONSE';
      throw error;
    }
  }

  // Ensure canonical schema structure with absolute integrity
  const isRelevant = parsed.relevance?.is_relevant !== false;

  const result = {
    document: {
      type: parsed.document?.type || (isRelevant ? 'General Document' : 'Unrelated Document'),
      title: parsed.document?.title || sourceFileName,
      source_file: sourceFileName // Always retain actual uploaded filename
    },
    relevance: {
      is_relevant: isRelevant,
      reason: parsed.relevance?.reason || (isRelevant 
        ? 'Document contains family responsibility or financial data.' 
        : 'The document does not contain information relevant to family responsibilities, documents, assets, deadlines, ownership or related family context.')
    },
    people: Array.isArray(parsed.people) ? parsed.people : [],
    entities: Array.isArray(parsed.entities) ? parsed.entities : [],
    relationships: Array.isArray(parsed.relationships) ? parsed.relationships : [],
    financial: {
      amount: typeof parsed.financial?.amount === 'number' ? parsed.financial.amount : null,
      currency: parsed.financial?.currency || 'INR'
    },
    dates: Array.isArray(parsed.dates) ? parsed.dates : [],
    responsibilities: Array.isArray(parsed.responsibilities) ? parsed.responsibilities : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.90
  };

  return result;
}

/**
 * REAL GEMINI MULTIMODAL DOCUMENT ANALYSIS
 * Sends actual document bytes to Gemini API with automatic retry for 503 spikes.
 * NEVER uses mock/fallback data.
 */
export async function analyzeDocumentWithGemini(fileBuffer, mimeType, originalName) {
  // 1. Verify API Key
  if (!config.isApiKeyConfigured) {
    const error = new Error('GEMINI_API_ERROR: GEMINI_API_KEY is not configured in .env. Please configure a valid Gemini API key.');
    error.code = 'GEMINI_API_ERROR';
    throw error;
  }

  // 2. Validate and log incoming file metadata (DO NOT log contents or API keys)
  const resolvedMime = resolveMimeType(originalName, mimeType, fileBuffer);
  console.log(`\nReceived file:`);
  console.log(`filename: ${originalName}`);
  console.log(`mimeType: ${resolvedMime}`);
  console.log(`size: ${fileBuffer.length} bytes\n`);

  if (!fileBuffer || fileBuffer.length === 0) {
    const error = new Error('UPLOAD_ERROR: The uploaded file is empty.');
    error.code = 'UPLOAD_ERROR';
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  const base64Data = fileBuffer.toString('base64');

  // Multi-model resilience: if one model hits quota (429) or high demand (503), failover to alternative active flash models
  const candidateModels = [
    config.geminiModel || 'gemini-3.5-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash-lite'
  ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

  let lastError;
  for (const currentModel of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini API] Invoking ${currentModel} for "${originalName}" (attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Analyze ONLY the supplied document. Extract structured intelligence into the canonical schema. Original filename: "${originalName}".`
                },
                {
                  inlineData: {
                    mimeType: resolvedMime,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          config: {
            systemInstruction: KUTUMB_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
          }
        });

        const responseText = response.text;
        if (!responseText) {
          const error = new Error('INVALID_GEMINI_RESPONSE: Gemini returned an empty response.');
          error.code = 'INVALID_GEMINI_RESPONSE';
          throw error;
        }

        // Parse, validate, and enforce canonical schema
        return parseAndValidateCanonicalSchema(responseText, originalName);
      } catch (error) {
        lastError = error;
        const msg = error.message || '';
        const is503 = msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE');
        const is429 = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');

        if (is503 && attempt < 2) {
          console.warn(`[Gemini API] ${currentModel} attempt ${attempt} failed with 503 high demand. Retrying in 1.5s...`);
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }

        if (is429) {
          console.warn(`[Gemini API] ${currentModel} hit rate limit / quota (429). Failing over to next available candidate model...`);
          break; // Try next candidate model immediately
        }

        console.error(`[Gemini API Call Failed with ${currentModel} for "${originalName}"]:`, error.message);
        break; // Other error, try next model or fail
      }
    }
  }

  if (lastError?.code) throw lastError;
  const apiError = new Error(`GEMINI_API_ERROR: ${lastError?.message || 'Gemini processing failed.'}`);
  apiError.code = 'GEMINI_API_ERROR';
  throw apiError;
}
