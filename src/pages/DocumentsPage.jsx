import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  Eye, 
  X, 
  Sparkles,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  UserCheck,
  Calendar,
  CreditCard,
  AlertCircle,
  FileCheck2,
  Cpu,
  Layers,
  RefreshCw,
  FolderOpen,
  Info,
  ShieldAlert
} from 'lucide-react';
import { syntheticDocuments, familyInfo } from '../data/mockData';
import { analyzeDocument, analyzeDemoDocument, checkBackendHealth } from '../services/api';
import Badge from '../components/Badge';

export default function DocumentsPage() {
  // Existing synthetic documents list for fallback / browsing
  const [documents, setDocuments] = useState(syntheticDocuments);
  
  // Stored array of Gemini analyzed document results (Milestone 2 multi-document foundation)
  const [analyzedDocuments, setAnalyzedDocuments] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // File selection & upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [analysisError, setAnalysisError] = useState(null);

  // Server health indicator
  const [serverHealth, setServerHealth] = useState({ status: 'checking', isApiKeyConfigured: false, geminiModel: '' });

  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMember, setSelectedMember] = useState('All');
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [forceEmptyState, setForceEmptyState] = useState(false);

  // Categories
  const categories = ['All', 'Insurance', 'Utilities', 'Loans', 'Taxes', 'Vehicles'];

  // Synthetic demo files quick list for 1-click testing
  const demoFiles = [
    { id: 'health-insurance', label: 'Health Insurance Policy', file: 'health_insurance_policy_sharma.pdf', tag: 'Renewal 18 Sep' },
    { id: 'vehicle-insurance', label: 'Vehicle Insurance', file: 'vehicle_insurance_brezza.pdf', tag: 'Brezza MP04' },
    { id: 'home-loan', label: 'Home Loan Statement', file: 'home_loan_statement_hdfc.pdf', tag: 'HDFC EMI' },
    { id: 'electricity-bill', label: 'Electricity Bill', file: 'electricity_bill_sept2026.pdf', tag: 'Due 20 Sep' },
    { id: 'property-tax', label: 'Property Tax Receipt', file: 'property_tax_receipt_bhopal.pdf', tag: 'Paid ₹8,760' },
    { id: 'life-insurance', label: 'Life Insurance Policy', file: 'lic_tech_term_life_policy.pdf', tag: 'LIC ₹1 Cr' }
  ];

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setServerHealth(res);
    });
  }, []);

  // File selection handlers
  const handleFileSelect = (file) => {
    if (!file) return;

    // Clear previous analysis to prevent state leakage
    setCurrentAnalysis(null);
    setAnalysisError(null);

    // Validate format
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(ext)) {
      setAnalysisError(
        `Unsupported file format (.${ext || 'unknown'}). KUTUMB supports PDF, PNG, and JPG/JPEG documents. If you have a presentation (PPT/PPTX), please export it as PDF first.`
      );
      setSelectedFile(null);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setAnalysisError('File exceeds 25 MB size limit. Please upload a smaller document.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Run Real Gemini Document Analysis (ZERO FAKE FALLBACK)
  const handleAnalyzeWithGemini = async () => {
    if (!selectedFile) return;

    // Reset current analysis and error states
    setCurrentAnalysis(null);
    setAnalysisError(null);
    setIsAnalyzing(true);

    try {
      // Stage 1: Uploading
      setAnalysisStage('Uploading document to analysis pipeline...');
      await new Promise(r => setTimeout(r, 350));

      // Stage 2: Gemini Multimodal Analysis
      setAnalysisStage('Analyzing document with Gemini Multimodal API...');
      
      // Call API
      const result = await analyzeDocument(selectedFile);
      const structuredData = result.data;

      // Stage 3: Context Understanding
      setAnalysisStage('Extracting entities & responsibilities...');
      await new Promise(r => setTimeout(r, 200));

      // Stage 4: Complete
      setAnalysisStage('Analysis complete!');

      // Set current analysis to the real structured data from Gemini
      setCurrentAnalysis(structuredData);
      setAnalyzedDocuments(prev => [structuredData, ...prev.filter(d => d.document?.source_file !== structuredData.document?.source_file)]);

      // Only add to catalog if the document is genuinely family relevant
      if (structuredData.relevance?.is_relevant !== false) {
        const primaryPerson = structuredData.people?.[0]?.name || 'Family Document';
        const newDocEntry = {
          id: `gemini-${Date.now()}`,
          name: structuredData.document?.title || selectedFile.name,
          fileName: structuredData.document?.source_file || selectedFile.name,
          category: structuredData.document?.type?.includes('Insurance') ? 'Insurance' : 
                    structuredData.document?.type?.includes('Bill') ? 'Utilities' : 
                    structuredData.document?.type?.includes('Loan') ? 'Loans' : 'General',
          type: structuredData.document?.type || 'Extracted Document',
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedDate: 'Just now',
          dueDate: structuredData.dates?.[0]?.date || 'Extracted',
          assignedMember: primaryPerson,
          memberId: primaryPerson.toLowerCase().includes('rajesh') ? 'rajesh' : 
                    primaryPerson.toLowerCase().includes('sunita') ? 'sunita' : 'both',
          status: 'Gemini Verified',
          statusType: structuredData.warnings?.length > 0 ? 'warning' : 'success',
          policyNo: structuredData.entities?.[0]?.name || selectedFile.name,
          coverage: structuredData.financial?.amount ? `₹${structuredData.financial.amount.toLocaleString('en-IN')}` : 'Extracted',
          description: `Extracted via Gemini (${(structuredData.confidence * 100).toFixed(0)}% confidence). ${structuredData.responsibilities?.[0]?.action || 'Document mapped.'}`
        };

        setDocuments(prev => [newDocEntry, ...prev]);
      }

      setSelectedFile(null);
    } catch (err) {
      console.error('[Gemini Analysis Failed]:', err);
      // Strictly show error - NEVER FALL BACK TO MOCK DATA
      setCurrentAnalysis(null);
      setAnalysisError(err.message || 'KUTUMB could not analyze this document.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  };

  // 1-Click Synthetic Demo Analysis
  const handleAnalyzeDemo = async (demoId) => {
    setCurrentAnalysis(null);
    setAnalysisError(null);
    setIsAnalyzing(true);

    try {
      setAnalysisStage('Analyzing demo document with Gemini...');
      const result = await analyzeDemoDocument(demoId);
      const structuredData = result.data;

      setAnalysisStage('Analysis complete!');
      await new Promise(r => setTimeout(r, 200));

      setCurrentAnalysis(structuredData);
      setAnalyzedDocuments(prev => [structuredData, ...prev.filter(d => d.document?.source_file !== structuredData.document?.source_file)]);
    } catch (err) {
      console.error('[Demo Analysis Failed]:', err);
      setCurrentAnalysis(null);
      setAnalysisError(err.message || 'Demo document analysis failed.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  };

  // Filtered documents
  const filteredDocuments = forceEmptyState
    ? []
    : documents.filter((doc) => {
        const matchesSearch =
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.policyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.assignedMember.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' || doc.category === selectedCategory;

        const matchesMember =
          selectedMember === 'All' ||
          doc.assignedMember.toLowerCase().includes(selectedMember.toLowerCase());

        return matchesSearch && matchesCategory && matchesMember;
      });

  return (
    <div className="space-y-8 pb-14">
      {/* Page Header with Engine Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>Document Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Family Documents</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Powered by Gemini
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload family policies, deeds, and bills to automatically extract responsibilities, ownership, and key deadlines.
          </p>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              serverHealth.isApiKeyConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}></span>
            <span className="text-slate-300 font-medium">
              {serverHealth.isApiKeyConfigured ? `Gemini API Active (${serverHealth.geminiModel || 'gemini-3.6-flash'})` : 'Gemini Key Missing'}
            </span>
          </div>
        </div>
      </div>

      {/* 1-CLICK SYNTHETIC DEMO DOCUMENTS STRIP */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/60 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            1-Click Demo Documents (Pre-loaded Sharma Family Files):
          </span>
          <span className="text-[11px] text-slate-400">Instant test</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {demoFiles.map((item) => (
            <button
              key={item.id}
              onClick={() => handleAnalyzeDemo(item.id)}
              disabled={isAnalyzing}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/70 hover:border-amber-500/40 text-xs font-medium transition-all flex items-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
              <span>{item.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* UPLOAD & ANALYZE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dropzone Box */}
        <div className="lg:col-span-12">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : selectedFile
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
            }`}
          >
            <input
              type="file"
              id="doc-file-input"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            />

            {!selectedFile ? (
              <label
                htmlFor="doc-file-input"
                className="flex flex-col items-center justify-center cursor-pointer space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md">
                  <Upload className="w-6 h-6 stroke-[2]" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    <span className="text-amber-400 hover:underline">Select document</span> or drag & drop here
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Multimodal support: PDF, PNG, JPG/JPEG (Max 25MB). Upload any real document or test file.
                  </p>
                </div>
              </label>
            ) : (
              /* Selected file state with Analyze button */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedFile.name}</h4>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Gemini Analysis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setCurrentAnalysis(null);
                    }}
                    disabled={isAnalyzing}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleAnalyzeWithGemini}
                    disabled={isAnalyzing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>Analyze with Gemini</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading / Progress Indicator */}
        {isAnalyzing && (
          <div className="lg:col-span-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 text-center space-y-3 animate-pulse">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
              <Cpu className="w-5 h-5 animate-spin" />
              <span>{analysisStage}</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Uploading bytes</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Gemini Multimodal API</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Canonical Schema Validation</span>
            </div>
          </div>
        )}

        {/* Error Feedback (STRICT REAL ERROR REPORTING) */}
        {analysisError && (
          <div className="lg:col-span-12 p-5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-200">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Document Analysis Failed</span>
              </div>
              <button
                onClick={() => setAnalysisError(null)}
                className="text-rose-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-rose-300/90 leading-relaxed">
              {analysisError}
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-rose-500/20">
              KUTUMB does not substitute mock data when an analysis fails. Please verify that your document is a valid PDF or image file and that your Gemini API key has quota available.
            </p>
          </div>
        )}

      </div>

      {/* GEMINI ANALYSIS RESULT PANEL (CANONICAL SCHEMA VISUALIZATION) */}
      {currentAnalysis && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-gradient-to-l from-amber-500/20 to-transparent border-l border-b border-amber-500/30 text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            GEMINI DOCUMENT INTELLIGENCE
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {currentAnalysis.document?.type || 'Analyzed Document'}
                </span>
                {currentAnalysis.relevance?.is_relevant === false && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                    Not Family Relevant
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {currentAnalysis.document?.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Source File: <strong className="text-slate-200 font-mono">{currentAnalysis.document?.source_file}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">
                  {(currentAnalysis.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentAnalysis(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 self-start sm:self-center"
              title="Dismiss panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* DOCUMENT RELEVANCE NOTICE IF UNRELATED (e.g. SIH Hackathon Problem Statement) */}
          {currentAnalysis.relevance?.is_relevant === false ? (
            <div className="p-5 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Document not relevant to KUTUMB family responsibility context.</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <strong>Gemini Assessment:</strong> {currentAnalysis.relevance?.reason}
              </p>
              <p className="text-[11px] text-slate-400">
                KUTUMB verified this document using genuine Gemini multimodal parsing. Because it does not pertain to household insurance, property deeds, utilities, loans, or family dependents, no synthetic family records were fabricated.
              </p>
            </div>
          ) : (
            /* FULL CANONICAL EXTRACTION (FOR GENUINELY RELEVANT DOCUMENTS) */
            <>
              {/* Grid of Extracted Canonical Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. People Extracted */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    People Mentioned ({currentAnalysis.people?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {currentAnalysis.people?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No specific individuals identified in document.</p>
                    ) : (
                      currentAnalysis.people?.map((person, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                          <span className="font-semibold text-slate-100">{person.name}</span>
                          <span className="text-[11px] text-amber-300 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {person.role}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Relationships Extracted */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Relationships ({currentAnalysis.relationships?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {currentAnalysis.relationships?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No specific ownership or legal relationships identified.</p>
                    ) : (
                      currentAnalysis.relationships?.map((rel, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-0.5">
                          <div className="font-semibold text-slate-200">{rel.from}</div>
                          <div className="text-[11px] text-amber-400 flex items-center gap-1 pl-2">
                            <ArrowDown className="w-3 h-3 text-amber-400" />
                            <span>{rel.relationship}</span>
                          </div>
                          <div className="font-medium text-slate-400 pl-4">{rel.to}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. Important Dates & Financials */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Key Dates & Financials
                  </h3>

                  {currentAnalysis.financial?.amount !== null && (
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Financial Amount:</span>
                      <span className="font-bold text-amber-300 text-sm">
                        ₹{Number(currentAnalysis.financial?.amount).toLocaleString('en-IN')} {currentAnalysis.financial?.currency}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {currentAnalysis.dates?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No explicit due or expiry dates found.</p>
                    ) : (
                      currentAnalysis.dates?.map((d, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                          <span className="text-slate-400">{d.type}</span>
                          <span className="font-bold text-white">{d.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* 4. Responsibilities Extracted */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  Extracted Responsibilities & Actions ({currentAnalysis.responsibilities?.length || 0})
                </h3>

                {currentAnalysis.responsibilities?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No pending action required based on this document.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentAnalysis.responsibilities?.map((resp, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white text-xs">{resp.person}</span>
                          <Badge variant={resp.priority?.toLowerCase() === 'high' ? 'high' : 'medium'}>
                            {resp.priority} Priority
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {resp.action}
                        </p>
                        <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 pt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Due: {resp.due_date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Warnings */}
          {currentAnalysis.warnings?.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <strong className="block font-bold">Document Warnings:</strong>
              {currentAnalysis.warnings.map((w, idx) => (
                <p key={idx} className="leading-snug">• {w}</p>
              ))}
            </div>
          )}

          {/* Traceability Footer */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
            <span>Traceability: Verified from <strong className="text-slate-300 font-mono">{currentAnalysis.document?.source_file}</strong></span>
            <span className="text-emerald-400 font-medium">No Synthetic Fallback Used</span>
          </div>
        </div>
      )}

      {/* ALL DOCUMENTS VAULT SECTION */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">All Family Documents</h2>
            <p className="text-xs text-slate-400">Verified policies and statements currently tracked for Sharma Family</p>
          </div>

          <button
            onClick={() => setForceEmptyState(!forceEmptyState)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              forceEmptyState
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {forceEmptyState ? '← Restore Documents' : 'Preview Empty State'}
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by document name, policy number, or family member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="sm:w-56">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="All">All Family Members</option>
              <option value="Rajesh">Rajesh Sharma (Papa)</option>
              <option value="Sunita">Sunita Sharma (Mummy)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400">
            {filteredDocuments.length} documents
          </span>
        </div>

        {/* Document Cards Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <FileText className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No documents match the current filter</h3>
            <button
              onClick={() => setForceEmptyState(false)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              Restore Sharma Family Documents
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <Badge variant={doc.statusType === 'warning' ? 'high' : 'success'}>
                      {doc.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{doc.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{doc.policyNo}</p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Assigned:</span>
                      <span className="font-semibold text-slate-200">{doc.assignedMember}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Due Date:</span>
                      <span className="font-semibold text-amber-300">{doc.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDocModal(doc)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Inspect</span>
                  </button>
                  <button
                    onClick={() => alert(`Downloading demo file: ${doc.fileName}`)}
                    className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDocModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white">{selectedDocModal.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedDocModal.fileName}</p>
              </div>
              <button
                onClick={() => setSelectedDocModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned To:</span>
                <span className="font-semibold text-slate-200">{selectedDocModal.assignedMember}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Due / Expiry:</span>
                <span className="font-semibold text-amber-300">{selectedDocModal.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coverage / Value:</span>
                <span className="font-semibold text-emerald-400">{selectedDocModal.coverage}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-xs mb-1">Description:</span>
                <p className="text-xs text-slate-300">{selectedDocModal.description}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDocModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
