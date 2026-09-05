import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Search, 
  Eye, 
  X, 
  Sparkles,
  ArrowDown,
  UserCheck,
  Calendar,
  FileCheck2,
  Cpu,
  Layers,
  Info,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { useFamilyKnowledge } from '../context/FamilyContext';
import { analyzeDocument, analyzeDemoDocument, checkBackendHealth } from '../services/api';
import Badge from '../components/Badge';

const OLIVE = '#5a7a4a';
const OLIVE_DIM = 'rgba(90,122,74,0.08)';
const OLIVE_BORDER = 'rgba(90,122,74,0.18)';

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
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* ── PAGE HEADER ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#111111' }}>
            Your family's source of truth.
          </h1>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: '#888888' }}>
            Upload documents and let KUTUMB turn them into structured family knowledge.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start shrink-0">
          {analyzedDocuments.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Reset vault and remove all analyzed documents to test empty state?')) {
                  clearAllAnalyzedDocuments();
                  setCurrentAnalysis(null);
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 focus-ring"
              style={{ color: '#888888', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Vault</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-2" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
            <span className={`w-1.5 h-1.5 rounded-full ${serverHealth.isApiKeyConfigured ? 'animate-pulse' : ''}`} style={{ background: serverHealth.isApiKeyConfigured ? '#27ae60' : '#c08a20' }} />
            <span className="font-medium" style={{ color: '#888888' }}>
              {serverHealth.isApiKeyConfigured ? `Gemini ${serverHealth.geminiModel || ''}` : 'Gemini Key Missing'}
            </span>
          </div>
        </div>
      </div>

      {/* ── 1-CLICK DEMO DOCUMENTS ──────────────────────────────────── */}
      <div className="p-5 rounded-2xl space-y-3" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: '#333333' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: OLIVE }} />
            1-Click Demo Documents
          </span>
          <span className="text-[10px]" style={{ color: '#AAAAAA' }}>Click any to analyze with Gemini</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {demoFiles.map((item) => (
            <button
              key={item.id}
              onClick={() => handleAnalyzeDemo(item.id)}
              disabled={isAnalyzing}
              className="px-3 py-2.5 rounded-xl border transition-all flex items-center gap-2.5 group cursor-pointer disabled:opacity-40 text-left focus-ring"
              style={{ background: '#FAFAF8', borderColor: 'rgba(0,0,0,0.06)', color: '#555555' }}
            >
              <FileText className="w-3.5 h-3.5 shrink-0 group-hover:text-[#5a7a4a] transition-colors" style={{ color: '#AAAAAA' }} />
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">{item.label}</div>
                <div className="text-[10px] truncate" style={{ color: '#AAAAAA' }}>{item.tag}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── UPLOAD ZONE ─────────────────────────────────────────────── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative rounded-2xl transition-all ${isDragging ? 'scale-[1.01]' : ''}`}
        style={{
          border: isDragging
            ? `2px dashed ${OLIVE}`
            : selectedFile
            ? '2px dashed rgba(39,174,96,0.4)'
            : '2px dashed rgba(0,0,0,0.10)',
          background: isDragging
            ? OLIVE_DIM
            : selectedFile
            ? 'rgba(39,174,96,0.03)'
            : '#FFFFFF'
        }}
      >
        <input
          type="file"
          id="doc-file-input"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
        />

        {!selectedFile ? (
          <label htmlFor="doc-file-input" className="flex flex-col items-center justify-center cursor-pointer py-12 px-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: OLIVE_DIM, border: `1px solid ${OLIVE_BORDER}` }}>
              <Upload className="w-7 h-7 stroke-[1.5]" style={{ color: OLIVE }} />
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-base font-bold">
                <span style={{ color: OLIVE }}>Select document</span> or drag &amp; drop
              </p>
              <div className="flex items-center justify-center gap-3 text-xs" style={{ color: '#AAAAAA' }}>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.04)' }}>PDF</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.04)' }}>JPG</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.04)' }}>PNG</span>
                <span style={{ color: '#D5D0CA' }}>· Max 25MB</span>
              </div>
            </div>
          </label>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(39,174,96,0.06)', border: '1px solid rgba(39,174,96,0.15)' }}>
                <FileCheck2 className="w-5 h-5" style={{ color: '#27ae60' }} />
              </div>
              <div>
                <h4 className="text-sm font-bold" style={{ color: '#111111' }}>{selectedFile.name}</h4>
                <p className="text-xs" style={{ color: '#888888' }}>{(selectedFile.size / 1024).toFixed(1)} KB · Ready for analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setSelectedFile(null); setCurrentAnalysis(null); }}
                disabled={isAnalyzing}
                className="p-2 rounded-xl transition-colors"
                style={{ color: '#888888' }}
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleAnalyzeWithGemini}
                disabled={isAnalyzing}
                className="k-btn-primary px-5 py-2.5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                <span>Analyze with Gemini</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── ANALYSIS LOADING STATE ──────────────────────────────────── */}
      {isAnalyzing && (
        <div className="p-6 rounded-2xl space-y-4" style={{ background: OLIVE_DIM, border: `1px solid ${OLIVE_BORDER}` }}>
          <div className="flex items-center gap-2.5 font-bold text-sm" style={{ color: OLIVE }}>
            <Cpu className="w-4 h-4 animate-spin" />
            <span>{analysisStage}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]" style={{ color: '#888888' }}>
            {['Understanding your document…','Finding people…','Connecting relationships…','Detecting important dates…','Extracting responsibilities…','Building knowledge model…'].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="w-1 h-1 rounded-full" style={{ background: '#27ae60' }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ERROR STATE ─────────────────────────────────────────────── */}
      {analysisError && (
        <div className="p-5 rounded-2xl space-y-2" style={{ background: 'rgba(192,57,43,0.04)', border: '1px solid rgba(192,57,43,0.12)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm" style={{ color: '#c0392b' }}>
              <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: '#c0392b' }} />
              <span>Document Analysis Failed</span>
            </div>
            <button onClick={() => setAnalysisError(null)} style={{ color: '#c0392b' }} className="p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(192,57,43,0.8)' }}>{analysisError}</p>
        </div>
      )}

      {/* ── ANALYSIS RESULT PANEL ───────────────────────────────────── */}
      {currentAnalysis && (
        <div className="rounded-2xl overflow-hidden animate-slideUp" style={{ border: `1px solid ${OLIVE_BORDER}`, background: '#FFFFFF' }}>
          {/* Top accent bar */}
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, #5a7a4a, #4a6a3a, rgba(90,122,74,0.2))` }} />

          <div className="p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.25rem' }}>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="label-xs px-2 py-0.5 rounded" style={{ background: OLIVE_DIM, color: OLIVE, border: `1px solid ${OLIVE_BORDER}` }}>
                    {currentAnalysis.document?.type || 'Analyzed Document'}
                  </span>
                  {currentAnalysis.relevance?.is_relevant === false ? (
                    <span className="label-xs px-2 py-0.5 rounded" style={{ background: 'rgba(192,138,32,0.06)', color: '#c08a20', border: '1px solid rgba(192,138,32,0.15)' }}>Not Relevant</span>
                  ) : (
                    <span className="label-xs px-2 py-0.5 rounded" style={{ background: 'rgba(39,174,96,0.06)', color: '#27ae60', border: '1px solid rgba(39,174,96,0.15)' }}>Document Understood</span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-0.5" style={{ color: '#111111' }}>
                  {currentAnalysis.document?.title}
                </h2>
                <div className="flex items-center gap-3 text-xs mt-1" style={{ color: '#AAAAAA' }}>
                  <span>Source: <strong className="font-mono" style={{ color: '#888888' }}>{currentAnalysis.document?.source_file}</strong></span>
                  <span style={{ color: '#D5D0CA' }}>·</span>
                  <span className="font-semibold" style={{ color: OLIVE }}>{(currentAnalysis.confidence * 100).toFixed(0)}% Confidence</span>
                </div>
              </div>
              <button
                onClick={() => setCurrentAnalysis(null)}
                className="p-1.5 rounded-xl self-start sm:self-center transition-colors"
                style={{ color: '#888888' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {currentAnalysis.relevance?.is_relevant === false ? (
            <div className="p-5 rounded-xl space-y-3" style={{ background: '#F7F4F0', border: '1px solid rgba(192,138,32,0.15)' }}>
              <div className="flex items-center gap-2 font-bold text-sm" style={{ color: '#c08a20' }}>
                <Info className="w-4 h-4 shrink-0" style={{ color: '#c08a20' }} />
                <span>Document not relevant to KUTUMB family responsibility context.</span>
              </div>
              <p className="text-xs leading-relaxed p-3 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', color: '#555555' }}>
                <strong>Gemini Assessment:</strong> {currentAnalysis.relevance?.reason}
              </p>
              <p className="text-[11px]" style={{ color: '#888888' }}>
                Because this document does not contain family-relevant obligations, 0 responsibilities were added to the family map.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 rounded-xl" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#888888' }}>
                  <UserCheck className="w-4 h-4" style={{ color: '#c08a20' }} />
                  People Mentioned ({currentAnalysis.people?.length || 0})
                </h3>
                <div className="space-y-2">
                  {currentAnalysis.people?.map((person, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <span className="font-semibold" style={{ color: '#111111' }}>{person.name}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded" style={{ background: 'rgba(192,138,32,0.06)', color: '#c08a20', border: '1px solid rgba(192,138,32,0.12)' }}>
                        {person.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#888888' }}>
                  <Layers className="w-4 h-4" style={{ color: '#2980b9' }} />
                  Relationships ({currentAnalysis.relationships?.length || 0})
                </h3>
                <div className="space-y-2">
                  {currentAnalysis.relationships?.map((rel, idx) => (
                    <div key={idx} className="p-2 rounded-lg text-xs space-y-0.5" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="font-semibold" style={{ color: '#333333' }}>{rel.from}</div>
                      <div className="text-[11px] flex items-center gap-1 pl-2" style={{ color: '#c08a20' }}>
                        <ArrowDown className="w-3 h-3" style={{ color: '#c08a20' }} />
                        <span>{rel.relationship}</span>
                      </div>
                      <div className="font-medium pl-4" style={{ color: '#888888' }}>{rel.to}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#888888' }}>
                  <Calendar className="w-4 h-4" style={{ color: '#27ae60' }} />
                  Key Dates & Responsibilities
                </h3>
                {currentAnalysis.financial?.amount !== null && (
                  <div className="p-2.5 rounded-lg flex items-center justify-between text-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#888888' }}>Amount:</span>
                    <span className="font-bold" style={{ color: '#c08a20' }}>
                      ₹{Number(currentAnalysis.financial?.amount).toLocaleString('en-IN')} {currentAnalysis.financial?.currency}
                    </span>
                  </div>
                )}
                <div className="space-y-2">
                  {currentAnalysis.responsibilities?.map((resp, idx) => (
                    <div key={idx} className="p-2 rounded-lg text-xs space-y-1" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="flex justify-between font-semibold">
                        <span style={{ color: '#111111' }}>{resp.person}</span>
                        <span style={{ color: '#c08a20' }}>{resp.due_date}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: '#555555' }}>{resp.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ALL ANALYZED DOCUMENTS LIST & VAULT */}
      <div className="space-y-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#111111' }}>
              <span>Analyzed Family Paperwork</span>
              <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: '#F0EDE8', color: '#555555', border: '1px solid rgba(0,0,0,0.05)' }}>
                {analyzedDocuments.length} Documents in State
              </span>
            </h2>
            <p className="text-xs" style={{ color: '#888888' }}>Documents contributing to the live Sharma Family Knowledge & Responsibility Map</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#AAAAAA' }} />
            <input
              type="text"
              placeholder="Search by document title, source file, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="k-input w-full pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? ''
                    : ''
                }`}
                style={{
                  background: selectedCategory === cat ? OLIVE_DIM : '#F7F4F0',
                  color: selectedCategory === cat ? OLIVE : '#888888',
                  border: `1px solid ${selectedCategory === cat ? OLIVE_BORDER : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Document Cards Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="p-10 text-center rounded-2xl space-y-3" style={{ background: '#F7F4F0', border: '1px dashed rgba(0,0,0,0.08)' }}>
            <FileText className="w-8 h-8 mx-auto" style={{ color: '#AAAAAA' }} />
            <h3 className="text-sm font-bold" style={{ color: '#111111' }}>No analyzed documents in vault</h3>
            <p className="text-xs max-w-md mx-auto" style={{ color: '#888888' }}>
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
                  className="glass-card p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F0EDE8', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <FileText className="w-5 h-5" style={{ color: '#c08a20' }} />
                      </div>
                      <Badge variant={isRelevant ? 'success' : 'default'}>
                        {isRelevant ? 'Analyzed' : 'Not Relevant'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-base font-bold line-clamp-1" style={{ color: '#111111' }}>{title}</h3>
                      <p className="text-xs font-mono mt-0.5 truncate" style={{ color: '#888888' }}>{sourceFile}</p>
                    </div>

                    <p className="text-xs" style={{ color: '#888888' }}>
                      Type: <strong style={{ color: '#555555' }}>{type}</strong>
                    </p>

                    {/* Metadata tags */}
                    <div className="p-3 rounded-xl space-y-1 text-xs" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.04)' }}>
                      <div className="flex justify-between" style={{ color: '#555555' }}>
                        <span style={{ color: '#888888', fontSize: '11px' }}>People detected:</span>
                        <span className="font-semibold">{peopleCount}</span>
                      </div>
                      <div className="flex justify-between" style={{ color: '#555555' }}>
                        <span style={{ color: '#888888', fontSize: '11px' }}>Relationships:</span>
                        <span className="font-semibold">{relsCount}</span>
                      </div>
                      <div className="flex justify-between" style={{ color: '#555555' }}>
                        <span style={{ color: '#888888', fontSize: '11px' }}>Responsibilities:</span>
                        <span className={`font-semibold ${respCount > 0 ? '' : ''}`} style={{ color: respCount > 0 ? '#c08a20' : '#888888' }}>
                          {respCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Inspect & Remove */}
                  <div className="pt-3 flex items-center justify-between gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <button
                      onClick={() => setSelectedDocModal(item)}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      style={{ background: '#F0EDE8', color: '#555555' }}
                    >
                      <Eye className="w-3.5 h-3.5" style={{ color: '#888888' }} />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => {
                        removeAnalyzedDocument(item.id);
                        if (currentAnalysis?.document?.source_file === sourceFile) {
                          setCurrentAnalysis(null);
                        }
                      }}
                      className="p-1.5 rounded-xl transition-colors"
                      style={{ background: '#F7F4F0', color: '#AAAAAA', border: '1px solid rgba(0,0,0,0.04)' }}
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
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="rounded-2xl max-w-xl w-full p-6 space-y-5 animate-fadeIn" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 24px 64px -16px rgba(0,0,0,0.2)' }}>
            <div className="flex items-start justify-between gap-4 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#111111' }}>
                  {selectedDocModal.analysis?.document?.title || selectedDocModal.originalFileName}
                </h3>
                <p className="text-xs font-mono" style={{ color: '#888888' }}>
                  {selectedDocModal.analysis?.document?.source_file || selectedDocModal.originalFileName}
                </p>
              </div>
              <button
                onClick={() => setSelectedDocModal(null)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#888888' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm p-4 rounded-xl" style={{ background: '#F7F4F0', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex justify-between">
                <span style={{ color: '#888888' }}>Relevance:</span>
                <Badge variant={selectedDocModal.analysis?.relevance?.is_relevant !== false ? 'success' : 'default'}>
                  {selectedDocModal.analysis?.relevance?.is_relevant !== false ? 'Family Relevant' : 'Not Relevant'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#888888' }}>Type:</span>
                <span className="font-semibold" style={{ color: '#333333' }}>{selectedDocModal.analysis?.document?.type || 'Document'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#888888' }}>People:</span>
                <span className="font-semibold" style={{ color: '#333333' }}>
                  {selectedDocModal.analysis?.people?.map(p => `${p.name} (${p.role})`).join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#888888' }}>Dates:</span>
                <span className="font-semibold" style={{ color: '#c08a20' }}>
                  {selectedDocModal.analysis?.dates?.map(d => `${d.type}: ${d.date}`).join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#888888' }}>Responsibilities:</span>
                <span className="font-semibold" style={{ color: '#111111' }}>
                  {selectedDocModal.analysis?.responsibilities?.length || 0}
                </span>
              </div>
              {selectedDocModal.analysis?.relevance?.reason && (
                <div className="pt-2 text-xs" style={{ color: '#888888', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <span className="font-bold block mb-1" style={{ color: '#555555' }}>Reason:</span>
                  <p>{selectedDocModal.analysis.relevance.reason}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDocModal(null)}
                className="k-btn-secondary px-4 py-2"
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
