import fs from 'fs';
import path from 'path';
import { demoDocumentsList } from './demoData.js';

const targetDir = path.resolve('public/demo-documents');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Generate human-readable text document representations for testing
for (const doc of demoDocumentsList) {
  const filePath = path.join(targetDir, doc.fileName.replace(/\.pdf$/, '.txt'));
  fs.writeFileSync(filePath, doc.rawText, 'utf-8');
}

console.log(`[Demo Docs Generator] Successfully created demo documents in ${targetDir}`);
