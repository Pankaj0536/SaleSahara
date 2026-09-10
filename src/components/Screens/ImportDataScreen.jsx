import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  RefreshCw,
  X,
  Table,
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ImportDataScreen = ({ onImportComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [importStats, setImportStats] = useState({
    totalRows: 0,
    duplicates: 0,
    missingBudgets: 0,
    qualityScore: 94
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  // Generate and download sample Excel (.xlsx) template
  const handleDownloadExcelTemplate = (e) => {
    e?.stopPropagation();
    const templateData = [
      {
        "Lead Name": "Priya Patel",
        "Email": "priya.patel@fintechscale.io",
        "Company": "FintechScale Inc",
        "Role": "VP of Revenue Operations",
        "Industry": "Fintech",
        "Company Size": 320,
        "Source": "Inbound Demo",
        "Deal Value": "$85,000",
        "Priority": "HIGH",
        "Status": "Qualified"
      },
      {
        "Lead Name": "Marcus Vance",
        "Email": "m.vance@cloudhyper.com",
        "Company": "CloudHyper Systems",
        "Role": "Chief Technology Officer",
        "Industry": "Cloud Infrastructure",
        "Company Size": 1100,
        "Source": "Partner Referral",
        "Deal Value": "$140,000",
        "Priority": "VERY HIGH",
        "Status": "Demo Scheduled"
      },
      {
        "Lead Name": "Elena Rostova",
        "Email": "elena.r@nordicsecurity.com",
        "Company": "Nordic Security",
        "Role": "Director of Information Security",
        "Industry": "Cybersecurity",
        "Company Size": 450,
        "Source": "Webinar Attendee",
        "Deal Value": "$62,000",
        "Priority": "MEDIUM",
        "Status": "Contacted"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SalesSahara_Leads");
    XLSX.writeFile(wb, "SalesSahara_Sample_Leads_Template.xlsx");
  };

  // Generate and download sample CSV (.csv) template
  const handleDownloadCsvTemplate = (e) => {
    e?.stopPropagation();
    const csvContent = "Lead Name,Email,Company,Role,Industry,Company Size,Source,Deal Value,Priority,Status\n" +
      "Priya Patel,priya.patel@fintechscale.io,FintechScale Inc,VP of Revenue Operations,Fintech,320,Inbound Demo,$85000,HIGH,Qualified\n" +
      "Marcus Vance,m.vance@cloudhyper.com,CloudHyper Systems,Chief Technology Officer,Cloud Infrastructure,1100,Partner Referral,$140000,VERY HIGH,Demo Scheduled\n" +
      "Elena Rostova,elena.r@nordicsecurity.com,Nordic Security,Director of Information Security,Cybersecurity,450,Webinar Attendee,$62000,MEDIUM,Contacted";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SalesSahara_Sample_Leads_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse Excel or CSV file buffer
  const processSpreadsheetFile = (file) => {
    if (!file) return;
    setErrorMsg(null);
    setIsProcessing(true);

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isCsv = file.name.endsWith('.csv');

    if (!isExcel && !isCsv) {
      setErrorMsg('Unsupported file format. Please upload an Excel spreadsheet (.xlsx, .xls) or a CSV file (.csv).');
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonRows.length === 0) {
          setErrorMsg('The uploaded spreadsheet contains no readable rows.');
          setIsProcessing(false);
          return;
        }

        const headers = Object.keys(jsonRows[0] || {});
        
        // Calculate basic hygiene stats
        const emailsSeen = new Set();
        let dupes = 0;
        let missingBudget = 0;

        jsonRows.forEach(row => {
          const email = (row['Email'] || row['email'] || '').toLowerCase();
          if (email && emailsSeen.has(email)) {
            dupes++;
          } else if (email) {
            emailsSeen.add(email);
          }
          const budget = row['Deal Value'] || row['deal value'] || row['Budget'] || row['budget'];
          if (!budget) missingBudget++;
        });

        const quality = Math.max(72, Math.min(99, 100 - Math.round((dupes * 2 + missingBudget * 1.5))));

        setFileInfo({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          type: isExcel ? 'Excel (.xlsx/.xls)' : 'CSV (.csv)',
          sheetName: firstSheetName,
          rowCount: jsonRows.length
        });

        setColumnHeaders(headers.slice(0, 7));
        setPreviewRows(jsonRows.slice(0, 8));
        setImportStats({
          totalRows: jsonRows.length,
          duplicates: dupes,
          missingBudgets: missingBudget,
          qualityScore: quality
        });

        setTimeout(() => {
          setIsProcessing(false);
          setFileUploaded(true);
          setCurrentStep(2);
        }, 600);

      } catch (err) {
        console.error('Error parsing spreadsheet:', err);
        setErrorMsg('Failed to parse the file. Please ensure it is a valid Excel (.xlsx, .xls) or CSV document.');
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Error reading file from disk.');
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Demo Fallback / Instant Sample Loader
  const handleLoadDemoDataset = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setFileInfo({
        name: 'Q3_Global_Enterprise_Leads.xlsx',
        size: '1.45 MB',
        type: 'Excel (.xlsx)',
        sheetName: 'Active Pipeline 2026',
        rowCount: 450
      });
      setColumnHeaders(['Lead Name', 'Company', 'Email', 'Role', 'Industry', 'Deal Value', 'Priority']);
      setPreviewRows([
        { 'Lead Name': 'Priya Patel', 'Company': 'FintechScale Inc', 'Email': 'priya.patel@fintechscale.io', 'Role': 'VP Operations', 'Industry': 'Fintech', 'Deal Value': '$85,000', 'Priority': 'HIGH' },
        { 'Lead Name': 'Marcus Vance', 'Company': 'CloudHyper Systems', 'Email': 'm.vance@cloudhyper.com', 'Role': 'CTO', 'Industry': 'Cloud', 'Deal Value': '$140,000', 'Priority': 'VERY HIGH' },
        { 'Lead Name': 'Elena Rostova', 'Company': 'Nordic Security', 'Email': 'elena.r@nordicsecurity.com', 'Role': 'CISO', 'Industry': 'Cybersecurity', 'Deal Value': '$62,000', 'Priority': 'MEDIUM' },
        { 'Lead Name': 'Ananya Verma', 'Company': 'DataPulse AI', 'Email': 'ananya.v@datapulse.ai', 'Role': 'Head of AI', 'Industry': 'SaaS', 'Deal Value': '$95,000', 'Priority': 'VERY HIGH' },
        { 'Lead Name': 'Liam O’Connor', 'Company': 'Vertex Logix', 'Email': 'liam.oc@vertexlogix.com', 'Role': 'VP Sales', 'Industry': 'Logistics', 'Deal Value': '$78,000', 'Priority': 'HIGH' }
      ]);
      setImportStats({
        totalRows: 450,
        duplicates: 8,
        missingBudgets: 4,
        qualityScore: 96
      });
      setIsProcessing(false);
      setFileUploaded(true);
      setCurrentStep(2);
    }, 500);
  };

  const handleFinalImport = () => {
    setCurrentStep(4);
    setTimeout(() => {
      onImportComplete?.(fileInfo?.rowCount || 450);
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Templates Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Import Lead Dataset
            </h1>
            <span style={{
              fontSize: '0.725rem',
              fontWeight: '800',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: 'rgba(5, 150, 105, 0.12)',
              color: '#059669',
              border: '1px solid rgba(5, 150, 105, 0.25)'
            }}>
              Excel (.xlsx, .xls) & CSV Supported
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Upload your sales prospect spreadsheets for automatic AI parsing, deduplication, and conversion propensity scoring.
          </p>
        </div>

        {/* Download Template Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadExcelTemplate}
            className="btn btn-secondary btn-sm"
            title="Download formatted sample Excel spreadsheet"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem' }}
          >
            <FileSpreadsheet size={15} color="#059669" />
            <span>Sample Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleDownloadCsvTemplate}
            className="btn btn-secondary btn-sm"
            title="Download formatted sample CSV file"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem' }}
          >
            <FileText size={15} color="var(--accent-primary)" />
            <span>Sample CSV (.csv)</span>
          </button>
        </div>
      </div>

      {/* 4-Step Progress Stepper */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', flexWrap: 'wrap', gap: '1rem' }}>
        {[
          { step: 1, title: "1. Upload Excel / CSV" },
          { step: 2, title: "2. Preview Data" },
          { step: 3, title: "3. AI Validation" },
          { step: 4, title: "4. Import Pipeline" }
        ].map((s) => (
          <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: currentStep >= s.step ? 'linear-gradient(135deg, var(--accent-primary) 0%, #2563eb 100%)' : 'var(--border-medium)',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: currentStep === s.step ? 'var(--shadow-glow-cyan)' : 'none'
            }}>
              {currentStep > s.step ? <CheckCircle2 size={16} /> : s.step}
            </div>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: currentStep >= s.step ? '700' : '500',
              color: currentStep >= s.step ? 'var(--text-main)' : 'var(--text-muted)'
            }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Error Alert if any */}
      {errorMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          background: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          color: '#dc2626',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Hidden Native File Input Supporting Both Excel & CSV */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            processSpreadsheetFile(e.target.files[0]);
          }
        }}
      />

      {/* Step 1: Upload Dropzone with Dual Excel & CSV support */}
      {!fileUploaded ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) {
              processSpreadsheetFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-fast)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
        >
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(2, 132, 199, 0.1)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <UploadCloud size={34} />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            {isProcessing ? 'Parsing & Analyzing Spreadsheet...' : 'Upload your lead dataset'}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: '480px', lineHeight: '1.5' }}>
            Drag and drop your <strong>Excel (.xlsx, .xls)</strong> or <strong>CSV (.csv)</strong> spreadsheet here, or click to browse files.
          </p>

          {/* Supported Format Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(5, 150, 105, 0.1)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              color: '#059669',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <FileSpreadsheet size={14} />
              <span>Microsoft Excel (.xlsx, .xls)</span>
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              color: 'var(--accent-primary)',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <FileText size={14} />
              <span>CSV Spreadsheet (.csv)</span>
            </span>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Max file size: 50MB
            </span>
          </div>

          {/* Quick Demo Dataset Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLoadDemoDataset();
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem' }}
          >
            <Sparkles size={14} color="var(--accent-primary)" />
            <span>Try Sample Enterprise Excel File</span>
          </button>
        </div>
      ) : (
        /* Step 2: Post-Upload Data Preview & Hygiene Summary */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* File Info Header Banner */}
          <div className="card" style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: fileInfo?.type.includes('Excel') ? 'rgba(5, 150, 105, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: fileInfo?.type.includes('Excel') ? '#059669' : 'var(--accent-primary)'
                }}>
                  {fileInfo?.type.includes('Excel') ? <FileSpreadsheet size={24} /> : <FileText size={24} />}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {fileInfo?.name}
                  </h3>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    Format: <strong>{fileInfo?.type}</strong> • Sheet: <em>{fileInfo?.sheetName}</em> • Size: {fileInfo?.size} • {fileInfo?.rowCount} Records
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: '0.8rem',
                fontWeight: '800',
                color: '#059669',
                background: 'rgba(5, 150, 105, 0.1)',
                border: '1px solid rgba(5, 150, 105, 0.25)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Check size={14} strokeWidth={3} />
                <span>AI Parsing & Mapping Complete</span>
              </span>
            </div>

            {/* Metrics Breakdown Bar */}
            <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Total Records</div>
                <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                  {importStats.totalRows}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Duplicates Flagged</div>
                <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#d97706', marginTop: '2px' }}>
                  {importStats.duplicates}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Missing Values</div>
                <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#dc2626', marginTop: '2px' }}>
                  {importStats.missingBudgets}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-hover)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Dataset Hygiene</div>
                <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
                  {importStats.qualityScore}% Quality
                </div>
              </div>
            </div>

            {/* Interactive Data Preview Table */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Parsed Spreadsheet Preview (First {previewRows.length} Rows):
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                  All columns auto-mapped to SalesSahara Lead Schema
                </span>
              </div>

              <div className="table-container" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                <table className="custom-table density-compact">
                  <thead>
                    <tr>
                      {columnHeaders.map((col, idx) => (
                        <th key={idx} style={{ whiteSpace: 'nowrap' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {columnHeaders.map((col, cIdx) => (
                          <td key={cIdx} style={{ fontSize: '0.775rem', whiteSpace: 'nowrap' }}>
                            {String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFileUploaded(false);
                  setFileInfo(null);
                  setCurrentStep(1);
                }}
              >
                Cancel & Re-upload
              </button>

              <button className="btn btn-primary btn-lg" onClick={handleFinalImport}>
                <Sparkles size={18} />
                <span>Import {fileInfo?.rowCount} Leads to Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
