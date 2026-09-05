import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { buildFamilyKnowledge } from '../utils/aggregationEngine';

const FamilyContext = createContext(null);

const STORAGE_KEY = 'kutumb_analyzed_documents_v3';

export function FamilyProvider({ children }) {
  const [analyzedDocuments, setAnalyzedDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[FamilyContext] Could not load from localStorage:', e);
    }
    return [];
  });

  // Save to localStorage on state update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analyzedDocuments));
    } catch (e) {
      console.warn('[FamilyContext] Could not save to localStorage:', e);
    }
  }, [analyzedDocuments]);

  /**
   * Deterministically derive the unified family knowledge model
   * Automatically re-computes whenever analyzedDocuments changes
   */
  const familyKnowledge = useMemo(() => {
    return buildFamilyKnowledge(analyzedDocuments, 'Sharma Family');
  }, [analyzedDocuments]);

  /**
   * Append or update an analyzed document result
   */
  const addAnalyzedDocument = (analysisData, originalFileName, fileSize = 0) => {
    const newEntry = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      analysis: analysisData,
      originalFileName: originalFileName || analysisData.document?.source_file || 'document.pdf',
      analyzedAt: new Date().toISOString(),
      fileSize: fileSize || 0
    };

    setAnalyzedDocuments(prev => {
      // Remove any existing entry with the exact same source filename to prevent duplicates
      const filtered = prev.filter(d => 
        (d.analysis?.document?.source_file || d.originalFileName) !== newEntry.originalFileName
      );
      return [newEntry, ...filtered];
    });

    return newEntry;
  };

  /**
   * Remove an analyzed document by id or source filename
   */
  const removeAnalyzedDocument = (identifier) => {
    setAnalyzedDocuments(prev => 
      prev.filter(d => d.id !== identifier && d.originalFileName !== identifier && d.analysis?.document?.source_file !== identifier)
    );
  };

  /**
   * Clear all analyzed documents (to test clean empty state)
   */
  const clearAllAnalyzedDocuments = () => {
    setAnalyzedDocuments([]);
  };

  return (
    <FamilyContext.Provider
      value={{
        analyzedDocuments,
        familyKnowledge,
        addAnalyzedDocument,
        removeAnalyzedDocument,
        clearAllAnalyzedDocuments
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamilyKnowledge() {
  const ctx = useContext(FamilyContext);
  if (!ctx) {
    throw new Error('useFamilyKnowledge must be used within a FamilyProvider');
  }
  return ctx;
}
