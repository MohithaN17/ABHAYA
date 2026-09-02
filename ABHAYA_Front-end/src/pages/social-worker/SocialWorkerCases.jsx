import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import CaseTable from '../../components/CaseTable';
import CaseCard from '../../components/CaseCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, HeartHandshake } from 'lucide-react';

export default function SocialWorkerCases() {
  const { globalSearch } = useOutletContext() || {};
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [viewMode, setViewMode] = useState('grid');

  const {
    cases,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy
  } = useCases('social-worker', { status: initialStatus });

  useEffect(() => {
    if (globalSearch !== undefined && globalSearch !== null) {
      setSearch(globalSearch);
    }
  }, [globalSearch, setSearch]);

  const statusOptions = [
    { value: 'all', label: 'All Risk Categories' },
    { value: 'urgent', label: 'Urgent Support (71+)' },
    { value: 'attention', label: 'Attention Required (41 - 70)' },
    { value: 'stable', label: 'Stable (0 - 40)' }
  ];

  const sortOptions = [
    { value: 'score-desc', label: 'Highest Distress Score' },
    { value: 'score-asc', label: 'Lowest Distress Score' },
    { value: 'date-desc', label: 'Newest Registration' },
    { value: 'date-asc', label: 'Oldest Registration' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-md border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-slate-700" />
            Social Work Case Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active caseload: {cases.length} assigned records
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-md border border-slate-200">
        <Input
          placeholder="Search by Case ID or Location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          icon={Filter}
        />
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          icon={ArrowUpDown}
        />
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingState message="Fetching social worker case files..." />
      ) : error ? (
        <EmptyState
          title="Unable to load social work case records"
          description={error}
          isError={true}
        />
      ) : cases.length === 0 ? (
        <EmptyState
          title="No cases available"
          description="Cases assigned to this account will appear here."
          icon={HeartHandshake}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cases.map((c) => (
            <CaseCard key={c.id} c={c} role="social-worker" />
          ))}
        </div>
      ) : (
        <CaseTable cases={cases} role="social-worker" />
      )}
    </div>
  );
}
