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
  Check
} from 'lucide-react';
import { PriorityBadge } from '../Common/PriorityBadge';

export const LeadsScreen = ({ leads, onSelectLead, onOpenAddLeadModal, onTriggerAction }) => {
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('probability-desc');
  const [density, setDensity] = useState('normal'); // 'compact' | 'normal' | 'spacious'
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Multi-Filter & Search Logic
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
                          l.company.toLowerCase().includes(search.toLowerCase()) ||
                          l.industry.toLowerCase().includes(search.toLowerCase());
    const matchesSource = selectedSource === 'ALL' || l.source === selectedSource;
    const matchesPriority = selectedPriority === 'ALL' || l.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
    return matchesSearch && matchesSource && matchesPriority && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'probability-desc') return b.probability - a.probability;
    if (sortBy === 'probability-asc') return a.probability - b.probability;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'company-asc') return a.company.localeCompare(b.company);
    if (sortBy === 'company-desc') return b.company.localeCompare(a.company);
    return 0;
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

  // Header Sort Toggle
  const handleSortToggle = (col) => {
    if (col === 'probability') {
      setSortBy(prev => prev === 'probability-desc' ? 'probability-asc' : 'probability-desc');
    } else if (col === 'name') {
      setSortBy(prev => prev === 'name-asc' ? 'name-desc' : 'name-asc');
    } else if (col === 'company') {
      setSortBy(prev => prev === 'company-asc' ? 'company-desc' : 'company-asc');
    }
  };

  // Export selected to CSV
  const handleExportCSV = () => {
    const targetLeads = selectedLeadIds.length > 0 
      ? leads.filter(l => selectedLeadIds.includes(l.id))
      : filteredLeads;

    const headers = ['ID', 'Name', 'Email', 'Company', 'Industry', 'Source', 'Probability', 'Priority', 'Status', 'Last Contact'];
    const rows = targetLeads.map(l => [
      l.id,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.company}"`,
      `"${l.industry}"`,
      `"${l.source}"`,
      l.probability,
      l.priority,
      `"${l.status}"`,
      `"${l.lastContact}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SalesSahara_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onTriggerAction('Export CSV', `Exported ${targetLeads.length} leads to CSV successfully.`);
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
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            AI-prioritized prospects ranked by conversion propensity and buying intent signals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

          <button className="btn btn-secondary" onClick={handleExportCSV} title="Export directory as CSV">
            <Download size={15} />
            <span>Export</span>
          </button>

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
                placeholder="Search leads by prospect name, company, or domain..."
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
            <select className="form-select" style={{ width: 'auto', height: '40px' }} value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
              <option value="ALL">All Sources</option>
              <option value="Inbound Demo">Inbound Demo</option>
              <option value="Partner Referral">Partner Referral</option>
              <option value="Webinar Attendee">Webinar Attendee</option>
              <option value="Google Organic Search">Google Organic</option>
              <option value="Outbound Email">Outbound Email</option>
            </select>

            {/* Priority Filter */}
            <select className="form-select" style={{ width: 'auto', height: '40px' }} value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
              <option value="ALL">All Priorities</option>
              <option value="VERY HIGH">VERY HIGH</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>

            {/* Status Filter */}
            <select className="form-select" style={{ width: 'auto', height: '40px' }} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="Qualified">Qualified</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="Nurturing">Nurturing</option>
              <option value="Contacted">Contacted</option>
              <option value="At Risk">At Risk</option>
            </select>

            {/* Sort Selector */}
            <select className="form-select" style={{ width: 'auto', height: '40px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="probability-desc">Probability (High → Low)</option>
              <option value="probability-asc">Probability (Low → High)</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="company-asc">Company (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Filters:
            </span>

            {search && (
              <span className="filter-chip">
                Search: "{search}"
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />
              </span>
            )}

            {selectedSource !== 'ALL' && (
              <span className="filter-chip">
                Source: {selectedSource}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedSource('ALL')} />
              </span>
            )}

            {selectedPriority !== 'ALL' && (
              <span className="filter-chip">
                Priority: {selectedPriority}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedPriority('ALL')} />
              </span>
            )}

            {selectedStatus !== 'ALL' && (
              <span className="filter-chip">
                Status: {selectedStatus}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedStatus('ALL')} />
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
                fontSize: '0.725rem',
                color: 'var(--text-dim)',
                textDecoration: 'underline',
                cursor: 'pointer',
                marginLeft: '0.25rem'
              }}
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Directory Table with Sticky Glass Headers */}
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
              <th onClick={() => handleSortToggle('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Lead Name</span>
                  {sortBy.startsWith('name') ? (
                    sortBy === 'name-asc' ? <ArrowUp size={14} color="var(--accent-primary)" /> : <ArrowDown size={14} color="var(--accent-primary)" />
                  ) : (
                    <ArrowUpDown size={12} color="var(--text-dim)" />
                  )}
                </div>
              </th>
              <th onClick={() => handleSortToggle('company')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Company</span>
                  {sortBy.startsWith('company') ? (
                    sortBy === 'company-asc' ? <ArrowUp size={14} color="var(--accent-primary)" /> : <ArrowDown size={14} color="var(--accent-primary)" />
                  ) : (
                    <ArrowUpDown size={12} color="var(--text-dim)" />
                  )}
                </div>
              </th>
              <th>Source</th>
              <th>Industry</th>
              <th onClick={() => handleSortToggle('probability')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Propensity</span>
                  {sortBy.startsWith('probability') ? (
                    sortBy === 'probability-desc' ? <ArrowDown size={14} color="var(--accent-primary)" /> : <ArrowUp size={14} color="var(--accent-primary)" />
                  ) : (
                    <ArrowUpDown size={12} color="var(--text-dim)" />
                  )}
                </div>
              </th>
              <th>Priority</th>
              <th>Status</th>
              <th>Last Touch</th>
              <th>Next Action</th>
              <th style={{ width: '32px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
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
                    <td style={{ textAlign: 'center' }} onClick={(e) => toggleSelectLead(item.id, e)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectLead(item.id, e)}
                        style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)', width: '15px', height: '15px' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.company}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{item.companySize} emp.</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.source}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.industry}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '42px',
                          height: '6px',
                          borderRadius: '3px',
                          background: 'var(--border-medium)',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${item.probability}%`,
                            height: '100%',
                            background: item.probability >= 80 ? 'linear-gradient(90deg, #dc2626, #ea580c)' : 'linear-gradient(90deg, #4f46e5, #0284c7)'
                          }} />
                        </div>
                        <span className="tabular-nums" style={{
                          fontWeight: '800',
                          fontSize: '0.875rem',
                          color: item.probability >= 80 ? '#dc2626' : 'var(--text-main)'
                        }}>
                          {item.probability}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td>
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
                    </td>
                    <td className="tabular-nums" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {item.lastContact}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerAction(item.nextAction, `Executing: ${item.nextAction} for ${item.name}`);
                        }}
                        style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', whiteSpace: 'nowrap' }}
                      >
                        {item.nextAction}
                      </button>
                    </td>
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

    </div>
  );
};
