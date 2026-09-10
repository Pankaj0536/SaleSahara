import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckSquare,
  Square,
  Download,
  X,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Mail,
  Check,
  RotateCcw,
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';
import { PriorityBadge } from '../Common/PriorityBadge';

const DEFAULT_FALLBACK_COLUMNS = [
  { id: 'name', label: 'Lead Name', visible: true, sortable: true, isCore: true },
  { id: 'company', label: 'Company', visible: true, sortable: true, isCore: true },
  { id: 'source', label: 'Source', visible: true, sortable: false, isCore: true },
  { id: 'industry', label: 'Industry', visible: true, sortable: false, isCore: true },
  { id: 'probability', label: 'Propensity', visible: true, sortable: true, isCore: true },
  { id: 'priority', label: 'Priority', visible: true, sortable: false, isCore: true },
  { id: 'status', label: 'Status', visible: true, sortable: false, isCore: true },
  { id: 'lastContact', label: 'Last Touch', visible: true, sortable: true, isCore: true },
  { id: 'nextAction', label: 'Next Action', visible: true, sortable: false, isCore: true }
];

export const LeadsScreen = ({
  leads = [],
  columns = [],
  onUpdateColumns,
  onAddColumn,
  onSelectLead,
  onOpenAddLeadModal,
  onTriggerAction
}) => {
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortCol, setSortCol] = useState('probability');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [density, setDensity] = useState('normal'); // 'compact' | 'normal' | 'spacious'
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  // Active columns fallback
  const activeCols = columns && columns.length > 0 ? columns : DEFAULT_FALLBACK_COLUMNS;
  const visibleCols = activeCols.filter(c => c.visible);

  // Toggle single column visibility
  const toggleColumnVisibility = (colId) => {
    if (!onUpdateColumns) return;
    const updated = activeCols.map(col =>
      col.id === colId ? { ...col, visible: !col.visible } : col
    );
    onUpdateColumns(updated);
  };

  // Show all columns
  const handleShowAllColumns = () => {
    if (!onUpdateColumns) return;
    onUpdateColumns(activeCols.map(c => ({ ...c, visible: true })));
  };

  // Reset to default columns
  const handleResetColumns = () => {
    if (!onUpdateColumns) return;
    onUpdateColumns(DEFAULT_FALLBACK_COLUMNS);
  };

  // Add custom column
  const handleCreateCustomColumn = (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    onAddColumn?.({ label: newColumnName.trim() });
    setNewColumnName('');
  };

  // Dynamic sorting handler
  const handleSortToggle = (columnId) => {
    if (sortCol === columnId) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(columnId);
      setSortOrder('desc');
    }
  };

  // Multi-Filter & Dynamic Search Logic
  const filteredLeads = leads.filter(l => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (l.name && l.name.toLowerCase().includes(searchLower)) ||
      (l.company && l.company.toLowerCase().includes(searchLower)) ||
      (l.industry && l.industry.toLowerCase().includes(searchLower)) ||
      (l.role && l.role.toLowerCase().includes(searchLower)) ||
      (l.email && l.email.toLowerCase().includes(searchLower));

    const matchesSource = selectedSource === 'ALL' || l.source === selectedSource;
    const matchesPriority = selectedPriority === 'ALL' || l.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;

    return matchesSearch && matchesSource && matchesPriority && matchesStatus;
  }).sort((a, b) => {
    let valA = a[sortCol] ?? a[sortCol.replace(/_/g, ' ')] ?? '';
    let valB = b[sortCol] ?? b[sortCol.replace(/_/g, ' ')] ?? '';

    // Handle currency / numbers
    if (typeof valA === 'string' && valA.startsWith('$')) {
      valA = parseFloat(valA.replace(/[^0-9.-]+/g, '')) || 0;
    }
    if (typeof valB === 'string' && valB.startsWith('$')) {
      valB = parseFloat(valB.replace(/[^0-9.-]+/g, '')) || 0;
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();
    return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });

  // Toggle single row selection
  const toggleSelectLead = (id, e) => {
    e.stopPropagation();
    setSelectedLeadIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle select all filtered rows
  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    }
  };

  // Dynamic CSV Export (Respects visible columns)
  const handleExportCSV = () => {
    const targetLeads = selectedLeadIds.length > 0
      ? leads.filter(l => selectedLeadIds.includes(l.id))
      : filteredLeads;

    const headers = ['ID', ...visibleCols.map(c => c.label)];
    const rows = targetLeads.map(l => {
      const cells = [l.id];
      visibleCols.forEach(col => {
        let val = l[col.id] ?? l[col.label] ?? l[col.id.replace(/_/g, ' ')] ?? '';
        cells.push(`"${String(val).replace(/"/g, '""')}"`);
      });
      return cells.join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SalesSahara_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onTriggerAction('Export CSV', `Exported ${targetLeads.length} leads with ${visibleCols.length} dynamic columns to CSV.`);
  };

  // Adaptive Cell Renderer for core and arbitrary Excel attributes
  const renderCellContent = (col, item) => {
    const colId = col.id;

    if (colId === 'name') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(2, 132, 199, 0.12)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '800',
            flexShrink: 0
          }}>
            {item.name ? item.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.85rem' }}>{item.name}</div>
            {item.email && <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.email}</div>}
          </div>
        </div>
      );
    }

    if (colId === 'company') {
      return (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.85rem' }}>{item.company}</div>
          {item.companySize && <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{item.companySize} emp.</div>}
        </div>
      );
    }

    if (colId === 'probability' || colId === 'propensity') {
      const score = Number(item.probability) || 0;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '42px',
            height: '6px',
            borderRadius: '3px',
            background: 'var(--border-medium)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${score}%`,
              height: '100%',
              background: score >= 80 ? 'linear-gradient(90deg, #dc2626, #ea580c)' : 'linear-gradient(90deg, #4f46e5, #0284c7)'
            }} />
          </div>
          <span className="tabular-nums" style={{
            fontWeight: '800',
            fontSize: '0.875rem',
            color: score >= 80 ? '#dc2626' : 'var(--text-main)'
          }}>
            {score}%
          </span>
        </div>
      );
    }

    if (colId === 'priority') {
      return <PriorityBadge priority={item.priority} />;
    }

    if (colId === 'status') {
      return (
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '0.2rem 0.5rem',
          borderRadius: '6px',
          background: item.status === 'Qualified' ? 'rgba(5, 150, 105, 0.12)' : 'var(--bg-surface-hover)',
          color: item.status === 'Qualified' ? '#059669' : 'var(--text-muted)',
          border: '1px solid var(--border-subtle)'
        }}>
          {item.status}
        </span>
      );
    }

    if (colId === 'lastContact') {
      return (
        <span className="tabular-nums" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {item.lastContact || '—'}
        </span>
      );
    }

    if (colId === 'nextAction') {
      return (
        <button
          className="btn btn-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onTriggerAction(item.nextAction, `Executing: ${item.nextAction} for ${item.name}`);
          }}
          style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', whiteSpace: 'nowrap' }}
        >
          {item.nextAction || 'Contact'}
        </button>
      );
    }

    // Dynamic / Excel Custom Column Value Extractor
    const rawVal = item[colId] ?? item[col.label] ?? item[colId.replace(/_/g, ' ')] ?? item[col.label?.toLowerCase()] ?? '—';
    const strVal = String(rawVal);

    // Formatted currency (e.g. $85,000, Deal Value, ARR)
    if (strVal.startsWith('$') || colId.includes('deal') || colId.includes('budget') || colId.includes('arr')) {
      return (
        <span className="tabular-nums" style={{
          fontWeight: '700',
          fontSize: '0.825rem',
          color: '#059669',
          background: 'rgba(5, 150, 105, 0.08)',
          padding: '0.15rem 0.45rem',
          borderRadius: '4px',
          border: '1px solid rgba(5, 150, 105, 0.2)'
        }}>
          {strVal}
        </span>
      );
    }

    // Role or Title badge
    if (colId.includes('role') || colId.includes('title')) {
      return (
        <span style={{
          fontSize: '0.775rem',
          fontWeight: '600',
          color: 'var(--text-main)',
          background: 'var(--bg-surface-hover)',
          padding: '0.2rem 0.5rem',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)'
        }}>
          {strVal}
        </span>
      );
    }

    // Country or Region badge
    if (colId.includes('country') || colId.includes('region')) {
      return (
        <span style={{
          fontSize: '0.775rem',
          fontWeight: '600',
          color: 'var(--accent-primary)',
          background: 'rgba(2, 132, 199, 0.08)',
          padding: '0.2rem 0.5rem',
          borderRadius: '6px',
          border: '1px solid rgba(2, 132, 199, 0.2)'
        }}>
          {strVal}
        </span>
      );
    }

    return (
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        {strVal}
      </span>
    );
  };

  const hasActiveFilters = search || selectedSource !== 'ALL' || selectedPriority !== 'ALL' || selectedStatus !== 'ALL';

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
      
      {/* Header & Density Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Leads & Pipeline
            </h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: 'var(--bg-surface-hover)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-subtle)'
            }}>
              {filteredLeads.length} of {leads.length} Active
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: 'rgba(5, 150, 105, 0.1)',
              color: '#059669',
              border: '1px solid rgba(5, 150, 105, 0.25)'
            }}>
              {visibleCols.length} Columns Active
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            AI-prioritized prospects with dynamic entity schema and adaptive Excel attribute mapping.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          
          {/* Customize Columns Button */}
          <button
            className="btn btn-secondary"
            onClick={() => setIsColumnModalOpen(true)}
            title="Configure table columns and entity attributes"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <SlidersHorizontal size={15} color="var(--accent-primary)" />
            <span>Customize Columns</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '800',
              padding: '0.1rem 0.4rem',
              borderRadius: '9999px',
              background: 'rgba(2, 132, 199, 0.15)',
              color: 'var(--accent-primary)'
            }}>
              {visibleCols.length}/{activeCols.length}
            </span>
          </button>

          {/* View Density Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '3px',
            gap: '2px'
          }}>
            <button
              onClick={() => setDensity('compact')}
              title="Compact View (36px)"
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                border: 'none',
                background: density === 'compact' ? 'var(--accent-primary)' : 'transparent',
                color: density === 'compact' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              Compact
            </button>
            <button
              onClick={() => setDensity('normal')}
              title="Standard View (48px)"
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                border: 'none',
                background: density === 'normal' ? 'var(--accent-primary)' : 'transparent',
                color: density === 'normal' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              Normal
            </button>
            <button
              onClick={() => setDensity('spacious')}
              title="Spacious View (60px)"
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                border: 'none',
                background: density === 'spacious' ? 'var(--accent-primary)' : 'transparent',
                color: density === 'spacious' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              Spacious
            </button>
          </div>

          {/* Export Visible Columns */}
          <button className="btn btn-secondary" onClick={handleExportCSV} title="Export active directory as CSV">
            <Download size={15} />
            <span>Export</span>
          </button>

          {/* Add Lead */}
          <button className="btn btn-primary" onClick={onOpenAddLeadModal}>
            <Plus size={16} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Top Filter Controls */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} color="var(--accent-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search leads by prospect name, company, domain, role..."
                className="form-input"
                style={{ paddingLeft: '2.35rem', height: '40px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-dim)'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
            {/* Source Filter */}
            <select
              className="form-input"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ width: 'auto', height: '40px', fontSize: '0.825rem' }}
            >
              <option value="ALL">All Inbound Sources</option>
              <option value="Inbound Demo">Inbound Demo</option>
              <option value="Partner Referral">Partner Referral</option>
              <option value="Product Qualified Lead">Product Qualified Lead</option>
              <option value="Webinar Attendee">Webinar Attendee</option>
              <option value="Outbound SDR">Outbound SDR</option>
            </select>

            {/* Priority Filter */}
            <select
              className="form-input"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{ width: 'auto', height: '40px', fontSize: '0.825rem' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="VERY HIGH">Very High Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {/* Status Filter */}
            <select
              className="form-input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ width: 'auto', height: '40px', fontSize: '0.825rem' }}
            >
              <option value="ALL">All Stages</option>
              <option value="Qualified">Qualified</option>
              <option value="Discovery">Discovery</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Contacted">Contacted</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Active Filters:</span>
            {search && (
              <span className="badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-main)', fontSize: '0.725rem' }}>
                Query: "{search}"
                <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSearch('')} />
              </span>
            )}
            {selectedSource !== 'ALL' && (
              <span className="badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-main)', fontSize: '0.725rem' }}>
                Source: {selectedSource}
                <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedSource('ALL')} />
              </span>
            )}
            {selectedPriority !== 'ALL' && (
              <span className="badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-main)', fontSize: '0.725rem' }}>
                Priority: {selectedPriority}
                <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedPriority('ALL')} />
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span className="badge" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-main)', fontSize: '0.725rem' }}>
                Status: {selectedStatus}
                <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedStatus('ALL')} />
              </span>
            )}
            <button
              onClick={() => {
                setSearch('');
                setSelectedSource('ALL');
                setSelectedPriority('ALL');
                setSelectedStatus('ALL');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginLeft: '0.25rem'
              }}
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Directory Table with Dynamic Columns and Sticky Glass Headers */}
      <div className="table-container" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', position: 'relative' }}>
        <table className={`custom-table density-${density}`}>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)', width: '15px', height: '15px' }}
                />
              </th>

              {/* Dynamic Column Headers */}
              {visibleCols.map(col => {
                const isCurrentlySorted = sortCol === col.id;
                return (
                  <th
                    key={col.id}
                    onClick={() => handleSortToggle(col.id)}
                    style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                    title={`Click to sort by ${col.label}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>{col.label}</span>
                      {col.isCustom && (
                        <span style={{
                          fontSize: '0.625rem',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '4px',
                          background: 'rgba(2, 132, 199, 0.1)',
                          color: 'var(--accent-primary)',
                          fontWeight: '800'
                        }}>
                          Custom
                        </span>
                      )}
                      {isCurrentlySorted ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp size={13} color="var(--accent-primary)" />
                        ) : (
                          <ArrowDown size={13} color="var(--accent-primary)" />
                        )
                      ) : (
                        <ArrowUpDown size={11} color="var(--text-dim)" />
                      )}
                    </div>
                  </th>
                );
              })}

              <th style={{ width: '32px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + 2} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Search size={32} color="var(--text-dim)" />
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>No matching leads found</div>
                    <div style={{ fontSize: '0.85rem' }}>Try clearing filters or search terms above.</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLeads.map((item) => {
                const isSelected = selectedLeadIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectLead(item)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'var(--bg-surface-hover)' : 'transparent',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ textAlign: 'center' }} onClick={(e) => toggleSelectLead(item.id, e)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectLead(item.id, e)}
                        style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)', width: '15px', height: '15px' }}
                      />
                    </td>

                    {/* Dynamic Cells */}
                    {visibleCols.map(col => (
                      <td key={col.id}>
                        {renderCellContent(col, item)}
                      </td>
                    ))}

                    {/* Action Chevron */}
                    <td>
                      <ChevronRight size={16} color="var(--text-dim)" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Bottom Bulk Action Toolbar */}
      {selectedLeadIds.length > 0 && (
        <div className="floating-bulk-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px'
            }}>
              {selectedLeadIds.length}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Leads Selected
            </span>
          </div>

          <div style={{ width: '1px', height: '20px', background: 'var(--border-medium)' }} />

          {/* Action 1: Bulk AI Outreach */}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onTriggerAction('Bulk AI Outreach', `Generated AI personalized multi-channel outreach drafts for ${selectedLeadIds.length} leads.`)}
            style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
          >
            <Sparkles size={14} />
            <span>Bulk AI Outreach</span>
          </button>

          {/* Action 2: Export Selection */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
          >
            <Download size={14} />
            <span>Export ({selectedLeadIds.length})</span>
          </button>

          {/* Action 3: Mark Contacted */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              onTriggerAction('Batch Status Update', `Updated ${selectedLeadIds.length} leads to "Contacted".`);
              setSelectedLeadIds([]);
            }}
            style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
          >
            <Check size={14} />
            <span>Mark Contacted</span>
          </button>

          {/* Dismiss */}
          <button
            onClick={() => setSelectedLeadIds([])}
            title="Deselect All"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem',
              borderRadius: '50%'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Column Customizer Modal */}
      {isColumnModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="card animate-scale-in" style={{
            width: '100%',
            maxWidth: '540px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            padding: '1.75rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-xl)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(2, 132, 199, 0.12)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                    Customize Table Attributes
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    Control visible entity columns or add custom attributes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsColumnModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '0.25rem',
                  borderRadius: '6px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                {visibleCols.length} of {activeCols.length} visible
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleShowAllColumns}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
                >
                  <Eye size={12} />
                  <span>Show All</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetColumns}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
                >
                  <RotateCcw size={12} />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Column Toggles List */}
            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingRight: '4px' }}>
              {activeCols.map(col => (
                <div
                  key={col.id}
                  onClick={() => toggleColumnVisibility(col.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: col.visible ? 'var(--bg-surface)' : 'var(--bg-surface-hover)',
                    border: `1px solid ${col.visible ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumnVisibility(col.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: col.visible ? '700' : '500', color: col.visible ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {col.label}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.675rem',
                    fontWeight: '800',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: col.isCustom ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-surface-hover)',
                    color: col.isCustom ? 'var(--accent-primary)' : 'var(--text-dim)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {col.isCustom ? 'Dynamic / Excel' : 'Core'}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Custom Column Section */}
            <form onSubmit={handleCreateCustomColumn} style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <input
                type="text"
                placeholder="Add custom attribute (e.g. ARR, Country, Decision Date)..."
                className="form-input"
                style={{ flex: 1, fontSize: '0.825rem', height: '38px' }}
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!newColumnName.trim()}
                style={{ whiteSpace: 'nowrap', height: '38px', padding: '0 0.85rem' }}
              >
                <Plus size={15} />
                <span>Add Attribute</span>
              </button>
            </form>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsColumnModalOpen(false)}
                style={{ width: '100%' }}
              >
                Done & Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
