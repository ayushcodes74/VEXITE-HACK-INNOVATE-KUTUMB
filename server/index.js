import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from './config.js';
import { 
  analyzeDocumentWithGemini,
  resolveMimeType 
} from './geminiService.js';
import { demoDocumentsList } from './demoDocuments/demoData.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory Multer configuration for file uploads (max 25MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'text/plain'
    ];
    
    const ext = (file.originalname || '').split('.').pop()?.toLowerCase();
    const isAllowedExt = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'txt'].includes(ext);
    const isAllowedMime = allowedMimeTypes.includes(file.mimetype);

    if (isAllowedExt || isAllowedMime) {
      cb(null, true);
    } else {
      const err = new Error(
        `UNSUPPORTED_FILE: Unsupported file format (.${ext || 'unknown'}). KUTUMB accepts PDF, PNG, and JPG/JPEG files. If you have a presentation (PPT/PPTX), please export it as PDF first.`
      );
      err.code = 'UNSUPPORTED_FILE';
      cb(err, false);
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'KUTUMB Document Intelligence Engine',
    geminiModel: config.geminiModel,
    isApiKeyConfigured: config.isApiKeyConfigured,
    mode: config.isApiKeyConfigured ? 'live_gemini' : 'key_missing',
    timestamp: new Date().toISOString()
  });
});

// List synthetic demo documents
app.get('/api/demo-documents', (req, res) => {
  const sanitized = demoDocumentsList.map(doc => ({
    id: doc.id,
    title: doc.title,
    fileName: doc.fileName,
    type: doc.type,
    facts: doc.facts
  }));
  res.json({ success: true, documents: sanitized });
});

/**
 * REAL DOCUMENT ANALYSIS ENDPOINT
 * Strictly analyzes the uploaded file using Gemini API.
 * NO MOCK DATA. NO FAKE FALLBACK.
 */
app.post('/api/analyze-document', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const errorCode = err.code === 'LIMIT_FILE_SIZE' ? 'FILE_TOO_LARGE' : (err.code || 'UNSUPPORTED_FILE');
      return res.status(400).json({
        success: false,
        error: errorCode,
        message: err.message || 'File upload validation error.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'UPLOAD_ERROR',
        message: 'No document file provided in request.'
      });
    }

    try {
      const mime = resolveMimeType(req.file.originalname, req.file.mimetype, req.file.buffer);
      
      const structuredKnowledge = await analyzeDocumentWithGemini(
        req.file.buffer,
        mime,
        req.file.originalname
      );

      return res.json({
        success: true,
        data: structuredKnowledge,
        meta: {
          engine: config.geminiModel,
          processedAt: new Date().toISOString(),
          fileSize: req.file.size,
          fileName: req.file.originalname,
          isRelevant: structuredKnowledge.relevance?.is_relevant !== false
        }
      });
    } catch (error) {
      console.error(`[Analysis Request Failed]: ${error.message}`);
      
      const statusCode = error.code === 'UNSUPPORTED_FILE' || error.code === 'UPLOAD_ERROR' ? 400 : 500;
      return res.status(statusCode).json({
        success: false,
        error: error.code || 'DOCUMENT_ANALYSIS_FAILED',
        message: error.message || 'KUTUMB could not analyze this document.'
      });
    }
  });
});

/**
 * Demo document analysis (Sends actual demo text to Gemini if key is configured)
 */
app.post('/api/analyze-demo/:id', async (req, res) => {
  const { id } = req.params;
  const demoDoc = demoDocumentsList.find(d => d.id === id);

  if (!demoDoc) {
    return res.status(404).json({
      success: false,
      error: 'DEMO_NOT_FOUND',
      message: `Demo document with id "${id}" not found.`
    });
  }

  try {
    const textBuffer = Buffer.from(demoDoc.rawText, 'utf-8');
    
    // Call real Gemini analysis with the demo document text
    const structuredKnowledge = await analyzeDocumentWithGemini(
      textBuffer,
      'text/plain',
      demoDoc.fileName.replace(/\.pdf$/, '.txt')
    );

    return res.json({
      success: true,
      data: structuredKnowledge,
      meta: {
        engine: config.geminiModel,
        processedAt: new Date().toISOString(),
        demoId: demoDoc.id,
        fileName: demoDoc.fileName,
        isRelevant: structuredKnowledge.relevance?.is_relevant !== false
      }
    });
  } catch (error) {
    console.error(`[Demo Analysis Failed]: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.code || 'DOCUMENT_ANALYSIS_FAILED',
      message: error.message || 'Demo document analysis failed.'
    });
  }
});

// Start Express server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` KUTUMB Document Intelligence Server (STRICT ZERO-FALLBACK)`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(` Gemini Multimodal Model: ${config.geminiModel}`);
  console.log(` Gemini API Key Configured: ${config.isApiKeyConfigured ? 'YES' : 'NO'}`);
  console.log(`==================================================\n`);
});
