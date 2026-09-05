import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function generateTestPdfs() {
  const dir = path.resolve('public/test-documents');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. Health Insurance Policy PDF (Document A)
  const healthDoc = await PDFDocument.create();
  const fontBold = await healthDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await healthDoc.embedFont(StandardFonts.Helvetica);
  const page1 = healthDoc.addPage([600, 450]);

  page1.drawText('STAR HEALTH & ALLIED INSURANCE COMPANY LTD.', { x: 50, y: 400, size: 14, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
  page1.drawText('FAMILY OPTIMA HEALTH INSURANCE POLICY SCHEDULE', { x: 50, y: 380, size: 11, font: fontBold });
  page1.drawText('Policy Number: SH-OPT-2026-90421', { x: 50, y: 350, size: 10, font: fontRegular });
  page1.drawText('Primary Policy Holder: Rajesh Sharma', { x: 50, y: 330, size: 10, font: fontRegular });
  page1.drawText('Nominee: Sunita Sharma (Spouse, 100%)', { x: 50, y: 310, size: 10, font: fontRegular });
  page1.drawText('Covered Family: Rajesh Sharma, Sunita Sharma, Aarav Sharma, Ananya Sharma', { x: 50, y: 290, size: 10, font: fontRegular });
  page1.drawText('Sum Insured: INR 15,00,000 (Floater)', { x: 50, y: 270, size: 10, font: fontRegular });
  page1.drawText('Renewal Due Date: 18 September 2026', { x: 50, y: 250, size: 10, font: fontBold, color: rgb(0.8, 0.1, 0.1) });
  page1.drawText('Gross Premium Payable: INR 24,850', { x: 50, y: 230, size: 10, font: fontBold });
  page1.drawText('Action Required: Renew policy before due date to retain waiting period continuity.', { x: 50, y: 200, size: 9, font: fontRegular });

  const healthBytes = await healthDoc.save();
  fs.writeFileSync(path.join(dir, 'health_insurance_policy_test.pdf'), healthBytes);

  // 2. Unrelated SIH Hackathon Document (Document B)
  const sihDoc = await PDFDocument.create();
  const fontBold2 = await sihDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular2 = await sihDoc.embedFont(StandardFonts.Helvetica);
  const page2 = sihDoc.addPage([600, 450]);

  page2.drawText('SMART INDIA HACKATHON (SIH) 2026', { x: 50, y: 400, size: 16, font: fontBold2, color: rgb(0.1, 0.4, 0.2) });
  page2.drawText('MINISTRY OF EDUCATION INNOVATION CELL - GOVERNMENT OF INDIA', { x: 50, y: 380, size: 9, font: fontRegular2 });
  page2.drawText('Problem Statement ID: SIH-1695', { x: 50, y: 340, size: 12, font: fontBold2 });
  page2.drawText('Theme: Smart Automation & IoT-driven Crop Monitoring for Rural Farmers', { x: 50, y: 320, size: 10, font: fontRegular2 });
  page2.drawText('Organization: Department of Agriculture and Farmers Welfare', { x: 50, y: 300, size: 10, font: fontRegular2 });
  page2.drawText('Category: Software / Hardware Hybrid', { x: 50, y: 280, size: 10, font: fontRegular2 });
  page2.drawText('Project Description:', { x: 50, y: 250, size: 11, font: fontBold2 });
  page2.drawText('Develop an edge computing multi-spectral imaging camera pipeline to detect pest infestation in paddy fields.', { x: 50, y: 230, size: 9, font: fontRegular2 });
  page2.drawText('Submission Deadline for Round 1: 15 October 2026', { x: 50, y: 200, size: 10, font: fontRegular2 });
  page2.drawText('Team Size: 6 students (minimum 1 female member)', { x: 50, y: 180, size: 9, font: fontRegular2 });

  const sihBytes = await sihDoc.save();
  fs.writeFileSync(path.join(dir, 'sih_1695_smart_agriculture.pdf'), sihBytes);

  console.log('Successfully generated test PDFs in', dir);
}

generateTestPdfs().catch(console.error);
