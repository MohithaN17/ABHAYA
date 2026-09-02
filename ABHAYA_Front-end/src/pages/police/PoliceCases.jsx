import React, { useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import CaseTable from '../../components/CaseTable';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { Search, Filter, ArrowUpDown, Shield } from 'lucide-react';

export default function PoliceCases() {
  const { globalSearch } = useOutletContext() || {};
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const {
    cases,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    caseTypeFilter,
    setCaseTypeFilter,
    sortBy,
    setSortBy
  } = useCases('police', { status: initialStatus });

  useEffect(() => {
    if (globalSearch !== undefined && globalSearch !== null) {
      setSearch(globalSearch);
    }
  }, [globalSearch, setSearch]);

  const caseTypeOptions = [
    { value: 'all', label: 'All Case Types' },
    { value: 'Domestic Harassment', label: 'Domestic Harassment' },
    { value: 'Stalking & Cyber Safety', label: 'Stalking & Cyber Safety' },
    { value: 'Workplace Harassment', label: 'Workplace Harassment' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status Categories' },
    { value: 'urgent', label: 'Urgent Support (71+)' },
    { value: 'attention', label: 'Attention Required (41 - 70)' },
    { value: 'stable', label: 'Stable (0 - 40)' }
  ];

  const sortOptions = [
    { value: 'score-desc', label: 'Highest Distress Score First' },
    { value: 'score-asc', label: 'Lowest Distress Score First' },
    { value: 'date-desc', label: 'Newest Registration First' },
    { value: 'date-asc', label: 'Oldest Registration First' }
  ];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-md border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-700" />
            Official Case Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered law enforcement case records ({cases.length} records)
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-white p-3 rounded-md border border-slate-200">
        <Input
          placeholder="Search Case ID or FIR..."
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
          options={caseTypeOptions}
          value={caseTypeFilter}
          onChange={(e) => setCaseTypeFilter(e.target.value)}
        />
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          icon={ArrowUpDown}
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching registered case directory..." />
      ) : error ? (
        <EmptyState
          title="Unable to load case records"
          description={error}
          isError={true}
        />
      ) : (
        <CaseTable cases={cases} role="police" onSort={() => setSortBy(sortBy === 'score-desc' ? 'score-asc' : 'score-desc')} />
      )}
    </div>
  );
}
