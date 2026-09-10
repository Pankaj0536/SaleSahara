import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const ImportDataScreen = ({ onImportComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDropFile = (e) => {
    e.preventDefault();
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setFileUploaded(true);
      setCurrentStep(2);
    }, 1200);
  };

  const handleFinalImport = () => {
    setCurrentStep(4);
    setTimeout(() => {
      onImportComplete(500);
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
          Import Lead Dataset
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Upload CSV spreadsheets for automatic AI parsing, deduplication, and predictive scoring.
        </p>
      </div>

      {/* 4-Step Progress Stepper */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem' }}>
        {[
          { step: 1, title: "1. Upload CSV" },
          { step: 2, title: "2. Preview Data" },
          { step: 3, title: "3. AI Validation" },
          { step: 4, title: "4. Import Pipeline" }
        ].map((s) => (
          <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: currentStep >= s.step ? 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)' : 'var(--border-medium)',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: currentStep === s.step ? 'var(--shadow-glow)' : 'none'
            }}>
              {currentStep > s.step ? <CheckCircle2 size={18} /> : s.step}
            </div>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: currentStep >= s.step ? '700' : '500',
              color: currentStep >= s.step ? 'var(--text-main)' : 'var(--text-muted)'
            }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Drag & Drop Area */}
      {!fileUploaded ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropFile}
          onClick={simulateUpload}
          style={{
            border: '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'border-color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(79, 70, 229, 0.1)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <UploadCloud size={32} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            {isProcessing ? 'Analyzing Lead File...' : 'Upload your lead data'}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Drag and drop your CSV file here, or click to browse local files.
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
            Supported format: CSV (Max file size 50MB)
          </div>
        </div>
      ) : (
        /* Post-Upload Analysis Card & Preview */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, var(--bg-surface) 100%)', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={24} color="var(--accent-cyan)" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Q3_Enterprise_Pipeline_Import.csv
                  </h3>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    File size: 1.4 MB • 500 Records Processed
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                ✓ AI Analysis Complete
              </span>
            </div>

            {/* Metrics Breakdown Bar */}
            <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Detected Rows</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>500 rows</div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duplicates Flagged</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#d97706' }}>12 duplicates</div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Missing Budgets</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#dc2626' }}>7 missing</div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dataset Data Quality</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669' }}>91% Quality</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setFileUploaded(false)}>
                Cancel & Re-upload
              </button>

              <button className="btn btn-cyan btn-lg" onClick={handleFinalImport}>
                <Sparkles size={18} />
                <span>Import Leads (500 Records)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
