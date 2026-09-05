import React, { useState } from 'react';
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
  FileUp, 
  FolderOpen, 
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { syntheticDocuments, familyInfo } from '../data/mockData';
import Badge from '../components/Badge';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(syntheticDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMember, setSelectedMember] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [forceEmptyState, setForceEmptyState] = useState(false);

  // Filter categories
  const categories = ['All', 'Insurance', 'Utilities', 'Loans', 'Taxes', 'Vehicles'];

  // Handle frontend simulated file upload
  const handleFileUpload = (file) => {
    if (!file) return;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
      fileName: file.name,
      category: 'Uncategorized',
      type: file.type || 'PDF Document',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` || '1.2 MB',
      uploadedDate: 'Just now',
      dueDate: 'Pending analysis',
      assignedMember: 'Sharma Family',
      memberId: 'both',
      status: 'Uploaded (Ready for AI)',
      statusType: 'info',
      policyNo: `TEMP-${Math.floor(1000 + Math.random() * 9000)}`,
      coverage: 'Awaiting Gemini OCR parsing',
      description: 'Document uploaded to local vault. AI extraction will process in the next milestone.'
    };

    setDocuments([newDoc, ...documents]);
    setUploadNotice(`Successfully added "${file.name}" to local documents.`);
    setTimeout(() => setUploadNotice(null), 5000);
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
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

  const getBadgeVariant = (statusType) => {
    switch (statusType) {
      case 'warning':
        return 'high';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>Family Knowledge Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Family Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized repository for all insurance policies, bills, loan deeds, and receipts.
          </p>
        </div>

        {/* Action Toggle for Empty State Demo */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setForceEmptyState(!forceEmptyState)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              forceEmptyState
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle empty state view for evaluation"
          >
            {forceEmptyState ? '← Restore Documents' : 'Preview Empty State'}
          </button>
        </div>
      </div>

      {/* Upload Dropzone UI (Frontend only) */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          onChange={onFileInputChange}
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              <span className="text-amber-400 hover:underline">Click to upload</span> or drag and drop paperwork
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              PDF statements, policy scans, electricity bills, tax receipts up to 25MB.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Frontend demo: files stay safely in your browser</span>
          </div>
        </label>
      </div>

      {/* Upload Feedback Notice */}
      {uploadNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadNotice}</span>
          </div>
          <button
            onClick={() => setUploadNotice(null)}
            className="text-emerald-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by document name, policy number, or family member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Member Filter Dropdown */}
          <div className="sm:w-56">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="All">All Family Members</option>
              <option value="Rajesh">Rajesh Sharma (Papa)</option>
              <option value="Sunita">Sunita Sharma (Mummy)</option>
              <option value="both">Joint / Both</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}

          <span className="ml-auto text-xs text-slate-400">
            Showing {filteredDocuments.length} of {documents.length} documents
          </span>
        </div>
      </div>

      {/* Documents Grid or Empty State */}
      {filteredDocuments.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/70 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 mx-auto flex items-center justify-center text-slate-500">
            <FileText className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No documents found</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {forceEmptyState 
                ? "This is the empty vault state. Click 'Restore Documents' at the top to reload synthetic records."
                : "No paperwork matches your filter criteria. Try clearing the search query or category filter."}
            </p>
          </div>
          {forceEmptyState ? (
            <button
              onClick={() => setForceEmptyState(false)}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-all"
            >
              Restore Sharma Family Documents
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedMember('All');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold hover:bg-slate-700 transition-all"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        /* Documents List / Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 group relative"
            >
              <div className="space-y-3">
                {/* Header: Type icon + status badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge variant={getBadgeVariant(doc.statusType)}>
                    {doc.status}
                  </Badge>
                </div>

                {/* Title and metadata */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {doc.policyNo}
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {doc.description}
                </p>

                {/* Details Pills */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Assigned Member:</span>
                    <span className="font-semibold text-slate-200">{doc.assignedMember}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Due / Validity:</span>
                    <span className={`font-semibold ${doc.statusType === 'warning' ? 'text-rose-400' : 'text-slate-200'}`}>
                      {doc.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">File Size:</span>
                    <span className="text-slate-400 text-[11px]">{doc.size}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700/60 hover:border-slate-600 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => alert(`Downloading demo statement: ${doc.fileName}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{selectedDoc.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedDoc.fileName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <Badge variant={getBadgeVariant(selectedDoc.statusType)}>{selectedDoc.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference / Policy No:</span>
                  <span className="font-mono text-slate-200">{selectedDoc.policyNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned To:</span>
                  <span className="font-semibold text-slate-200">{selectedDoc.assignedMember}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Due Date / Period:</span>
                  <span className="font-semibold text-amber-300">{selectedDoc.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coverage / Value:</span>
                  <span className="font-semibold text-emerald-400">{selectedDoc.coverage}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-xs mb-1">Summary Context:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  {selectedDoc.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${selectedDoc.fileName}`);
                  setSelectedDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
