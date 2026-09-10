import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUpDown, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';
import { PriorityBadge } from '../Common/PriorityBadge';

export const LeadsScreen = ({ leads, onSelectLead, onOpenAddLeadModal, onTriggerAction }) => {
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('probability-desc');

  // Multi-Filter logic
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
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Leads
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage, analyze and prioritize your sales opportunities.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddLeadModal}>
          <Plus size={16} />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Top Filter Controls */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search leads by name, company, industry..."
              className="form-input"
              style={{ paddingLeft: '2.3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          {/* Source Filter */}
          <select className="form-select" style={{ width: 'auto' }} value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
            <option value="ALL">All Sources</option>
            <option value="Inbound Demo">Inbound Demo</option>
            <option value="Partner Referral">Partner Referral</option>
            <option value="Webinar Attendee">Webinar Attendee</option>
            <option value="Google Organic Search">Google Organic</option>
            <option value="Outbound Email">Outbound Email</option>
          </select>

          {/* Priority Filter */}
          <select className="form-select" style={{ width: 'auto' }} value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
            <option value="ALL">All Priorities</option>
            <option value="VERY HIGH">VERY HIGH</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Status Filter */}
          <select className="form-select" style={{ width: 'auto' }} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="Qualified">Qualified</option>
            <option value="In Discussion">In Discussion</option>
            <option value="Demo Scheduled">Demo Scheduled</option>
            <option value="Nurturing">Nurturing</option>
            <option value="Contacted">Contacted</option>
            <option value="At Risk">At Risk</option>
          </select>

          {/* Sort Selector */}
          <select className="form-select" style={{ width: 'auto' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="probability-desc">Probability (High → Low)</option>
            <option value="probability-asc">Probability (Low → High)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Directory Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Company</th>
              <th>Source</th>
              <th>Industry</th>
              <th>Probability</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Last Contact</th>
              <th>Next Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No leads matching search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredLeads.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectLead(item)}
                  style={{ cursor: 'pointer' }}
                >
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{
                        width: '38px',
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
                      <span style={{ fontWeight: '800', fontSize: '0.875rem', color: item.probability >= 80 ? '#dc2626' : 'var(--text-main)' }}>
                        {item.probability}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {item.lastContact}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerAction(item.nextAction, `Executing: ${item.nextAction}`);
                      }}
                      style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}
                    >
                      {item.nextAction}
                    </button>
                  </td>
                  <td>
                    <ChevronRight size={16} color="var(--text-dim)" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
