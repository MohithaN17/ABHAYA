import { useState, useEffect, useCallback } from 'react';
import { getCases, getCaseById, saveHumanReview } from '../services/api';

export function useCases(role = 'police', initialParams = {}) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(initialParams.search || '');
  const [statusFilter, setStatusFilter] = useState(initialParams.status || 'all');
  const [caseTypeFilter, setCaseTypeFilter] = useState(initialParams.caseType || 'all');
  const [sortBy, setSortBy] = useState(initialParams.sortBy || 'score-desc');

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCases({
        role,
        search,
        status: statusFilter,
        caseType: caseTypeFilter,
        sortBy
      });
      setCases(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  }, [role, search, statusFilter, caseTypeFilter, sortBy]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return {
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
    setSortBy,
    refreshCases: fetchCases
  };
}

export function useCaseDetail(caseId, role = 'social-worker') {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCaseById(caseId, role);
      setCaseData(data);
    } catch (err) {
      setError(err.message || 'Failed to load case details');
    } finally {
      setLoading(false);
    }
  }, [caseId, role]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const submitReview = async (action, notes) => {
    setSubmittingReview(true);
    try {
      const reviewRecord = await saveHumanReview(caseId, { action, notes });
      setCaseData(prev => prev ? { ...prev, humanReview: reviewRecord } : null);
      return reviewRecord;
    } catch (err) {
      throw err;
    } finally {
      setSubmittingReview(false);
    }
  };

  return {
    caseData,
    loading,
    error,
    submittingReview,
    submitReview,
    refresh: fetchDetail
  };
}
