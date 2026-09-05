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
  ShieldAlert,
  Trash2,
  Check
} from 'lucide-react';
import { useFamilyKnowledge } from '../context/FamilyContext';
import { analyzeDocument, analyzeDemoDocument, checkBackendHealth } from '../services/api';
import Badge from '../components/Badge';

export default function DocumentsPage() {
  const { 
    analyzedDocuments, 
    addAnalyzedDocument, 
    removeAnalyzedDocument, 
    clearAllAnalyzedDocuments,
    familyKnowledge 
  } = useFamilyKnowledge();

  const [currentAnalysis, setCurrentAnalysis] = useState(null);
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
  const [selectedDocModal, setSelectedDocModal] = useState(null);

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

    setCurrentAnalysis(null);
    setAnalysisError(null);

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

    setCurrentAnalysis(null);
    setAnalysisError(null);
    setIsAnalyzing(true);

    try {
      setAnalysisStage('Uploading document to analysis pipeline...');
      await new Promise(r => setTimeout(r, 300));

      setAnalysisStage('Analyzing document with Gemini Multimodal API...');
      
      const result = await analyzeDocument(selectedFile);
      const structuredData = result.data;

      setAnalysisStage('Extracting entities & responsibilities...');
      await new Promise(r => setTimeout(r, 200));

      setAnalysisStage('Analysis complete!');

      // Set current analysis view
      setCurrentAnalysis(structuredData);

      // Add to global multi-document family knowledge state
      addAnalyzedDocument(structuredData, selectedFile.name, selectedFile.size);

      setSelectedFile(null);
    } catch (err) {
      console.error('[Gemini Analysis Failed]:', err);
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
      addAnalyzedDocument(structuredData, structuredData.document?.source_file || `${demoId}.pdf`, 1024);
    } catch (err) {
      console.error('[Demo Analysis Failed]:', err);
      setCurrentAnalysis(null);
      setAnalysisError(err.message || 'Demo document analysis failed.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
    }
  };

  // Filtered documents list from application state
  const filteredDocuments = analyzedDocuments.filter((doc) => {
    const analysis = doc.analysis || {};
    const title = analysis.document?.title || doc.originalFileName || '';
    const source = analysis.document?.source_file || doc.originalFileName || '';
    const type = analysis.document?.type || '';

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      type.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-14">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>Document Intelligence Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Family Documents Vault</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Powered by Gemini
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyze family policies, deeds, and bills. Multiple documents combine into your central Family Knowledge & Responsibility Map.
          </p>
        </div>

        {/* Engine status indicator & Clear button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {analyzedDocuments.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Reset vault and remove all analyzed documents to test empty state?')) {
                  clearAllAnalyzedDocuments();
                  setCurrentAnalysis(null);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Clear vault to test empty state"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Vault</span>
            </button>
          )}

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
            1-Click Demo Documents (Analyze & Add to Family Map):
          </span>
          <span className="text-[11px] text-slate-400">Click any document to analyze</span>
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
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Cross-Document Aggregation</span>
            </div>
          </div>
        )}

        {/* Error Feedback */}
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
          </div>
        )}

      </div>

      {/* GEMINI ANALYSIS RESULT PANEL */}
      {currentAnalysis && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-gradient-to-l from-amber-500/20 to-transparent border-l border-b border-amber-500/30 text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            LATEST ANALYSIS RESULT
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {currentAnalysis.document?.type || 'Analyzed Document'}
                </span>
                {currentAnalysis.relevance?.is_relevant === false ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                    Not Relevant
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Added to Family Map
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
                Because this document does not contain family-relevant obligations, 0 responsibilities were added to the family map.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  People Mentioned ({currentAnalysis.people?.length || 0})
                </h3>
                <div className="space-y-2">
                  {currentAnalysis.people?.map((person, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="font-semibold text-slate-100">{person.name}</span>
                      <span className="text-[11px] text-amber-300 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {person.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Relationships ({currentAnalysis.relationships?.length || 0})
                </h3>
                <div className="space-y-2">
                  {currentAnalysis.relationships?.map((rel, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-0.5">
                      <div className="font-semibold text-slate-200">{rel.from}</div>
                      <div className="text-[11px] text-amber-400 flex items-center gap-1 pl-2">
                        <ArrowDown className="w-3 h-3 text-amber-400" />
                        <span>{rel.relationship}</span>
                      </div>
                      <div className="font-medium text-slate-400 pl-4">{rel.to}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Key Dates & Responsibilities
                </h3>
                {currentAnalysis.financial?.amount !== null && (
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Amount:</span>
                    <span className="font-bold text-amber-300">
                      ₹{Number(currentAnalysis.financial?.amount).toLocaleString('en-IN')} {currentAnalysis.financial?.currency}
                    </span>
                  </div>
                )}
                <div className="space-y-2">
                  {currentAnalysis.responsibilities?.map((resp, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-white">
                        <span>{resp.person}</span>
                        <span className="text-amber-300">{resp.due_date}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{resp.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ALL ANALYZED DOCUMENTS LIST & VAULT */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Analyzed Family Paperwork</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {analyzedDocuments.length} Documents in State
              </span>
            </h2>
            <p className="text-xs text-slate-400">Documents contributing to the live Sharma Family Knowledge & Responsibility Map</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by document title, source file, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

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
          </div>
        </div>

        {/* Document Cards Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <FileText className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No analyzed documents in vault</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Upload a document above or click any of the 1-Click Demo buttons to populate the family knowledge map.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocuments.map((item) => {
              const analysis = item.analysis || {};
              const isRelevant = analysis.relevance?.is_relevant !== false;
              const sourceFile = analysis.document?.source_file || item.originalFileName;
              const title = analysis.document?.title || item.originalFileName;
              const type = analysis.document?.type || 'Document';
              const peopleCount = analysis.people?.length || 0;
              const relsCount = analysis.relationships?.length || 0;
              const respCount = analysis.responsibilities?.length || 0;

              return (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <Badge variant={isRelevant ? 'success' : 'default'}>
                        {isRelevant ? 'Analyzed' : 'Not Relevant'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-1">{title}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{sourceFile}</p>
                    </div>

                    <p className="text-xs text-slate-400">
                      Type: <strong className="text-slate-300">{type}</strong>
                    </p>

                    {/* Metadata tags */}
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400 text-[11px]">People detected:</span>
                        <span className="font-semibold">{peopleCount}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400 text-[11px]">Relationships:</span>
                        <span className="font-semibold">{relsCount}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400 text-[11px]">Responsibilities:</span>
                        <span className={`font-semibold ${respCount > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                          {respCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Inspect & Remove */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedDocModal(item)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => {
                        removeAnalyzedDocument(item.id);
                        if (currentAnalysis?.document?.source_file === sourceFile) {
                          setCurrentAnalysis(null);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors"
                      title="Remove from family map"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDocModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white">
                  {selectedDocModal.analysis?.document?.title || selectedDocModal.originalFileName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedDocModal.analysis?.document?.source_file || selectedDocModal.originalFileName}
                </p>
              </div>
              <button
                onClick={() => setSelectedDocModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Relevance:</span>
                <Badge variant={selectedDocModal.analysis?.relevance?.is_relevant !== false ? 'success' : 'default'}>
                  {selectedDocModal.analysis?.relevance?.is_relevant !== false ? 'Family Relevant' : 'Not Relevant'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="font-semibold text-slate-200">{selectedDocModal.analysis?.document?.type || 'Document'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">People:</span>
                <span className="font-semibold text-slate-200">
                  {selectedDocModal.analysis?.people?.map(p => `${p.name} (${p.role})`).join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dates:</span>
                <span className="font-semibold text-amber-300">
                  {selectedDocModal.analysis?.dates?.map(d => `${d.type}: ${d.date}`).join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Responsibilities:</span>
                <span className="font-semibold text-white">
                  {selectedDocModal.analysis?.responsibilities?.length || 0}
                </span>
              </div>
              {selectedDocModal.analysis?.relevance?.reason && (
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span className="font-bold text-slate-300 block mb-1">Reason:</span>
                  <p>{selectedDocModal.analysis.relevance.reason}</p>
                </div>
              )}
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
