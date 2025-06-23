import { useState, useEffect } from 'react';
import Header from '../components/header.jsx';
import FilterPanel from '../components/filter-panel.jsx';
import MetricsPanel from '../components/metrics-panel.jsx';
import ProblemList from '../components/problem-list.jsx';
import PasswordModal from '../components/password-modal.jsx';
import CreateProblemModal from '../components/create-problem-modal.jsx';
import ViewSheetModal from '../components/view-sheet-modal.jsx';
import { getMySheet, addProblem } from '../api/auth.ts';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    tag: 'all',
    difficulty: 'all',
    status: 'all'
  });

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewSheetModal, setShowViewSheetModal] = useState(false);

  // Viewing others' sheet state
  const [viewingOthersSheet, setViewingOthersSheet] = useState(false);
  const [othersSheetData, setOthersSheetData] = useState([]);
  const [othersUsername, setOthersUsername] = useState('');

  // Load user's problems on component mount
  useEffect(() => {
    loadMyProblems();
  }, []);

  // Apply filters when problems or filters change
  useEffect(() => {
    applyFilters();
  }, [problems, filters]);

  const loadMyProblems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getMySheet();
      setProblems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...problems];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchLower) ||
        (problem.tags && problem.tags.toLowerCase().includes(searchLower))
      );
    }

    // Apply tag filter
    if (filters.tag !== 'all') {
      filtered = filtered.filter(problem =>
        problem.tags && problem.tags.toLowerCase().includes(filters.tag.toLowerCase())
      );
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(problem =>
        problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      if (filters.status === 'completed') {
        filtered = filtered.filter(problem => problem.status === true);
      } else if (filters.status === 'pending') {
        filtered = filtered.filter(problem => problem.status === false);
      }
    }

    setFilteredProblems(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleProblemUpdate = (problemId, updateType) => {
    if (updateType === 'status') {
      setProblems(prev =>
        prev.map(problem =>
          problem.problem_id === problemId
            ? { ...problem, status: !problem.status }
            : problem
        )
      );
    }
  };

  const handleProblemDelete = (problemId) => {
    setProblems(prev => prev.filter(problem => problem.problem_id !== problemId));
  };

  const handleProblemCreated = (newProblem) => {
    // Add status property for newly created problems
    const problemWithStatus = { ...newProblem, status: false };
    setProblems(prev => [problemWithStatus, ...prev]);
  };

  const handleSheetLoaded = (sheetData, username) => {
    setOthersSheetData(sheetData);
    setOthersUsername(username);
    setViewingOthersSheet(true);
  };

  const handleAddToMySheet = async (problemId) => {
    try {
      const addedProblem = await addProblem(problemId);
      // Add the problem to our sheet with status false
      const problemWithStatus = { ...addedProblem, status: false };
      setProblems(prev => [problemWithStatus, ...prev]);

      // Show success message or toast here if needed
      console.log('Problem added to your sheet successfully!');
    } catch (error) {
      console.error('Failed to add problem:', error);
      throw error; // Re-throw to handle in the calling component
    }
  };

  const handleBackToMySheet = () => {
    setViewingOthersSheet(false);
    setOthersSheetData([]);
    setOthersUsername('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto var(--spacing-md)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header
        onChangePassword={() => setShowPasswordModal(true)}
        onChangeAccessCode={() => setShowAccessCodeModal(true)}
      />

      <main style={{margin: '0 auto', padding: 'var(--spacing-xl)' }}>
        {/* {error && (
          <div className="mb-lg p-md" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--error)'
          }}>
            {error}
            <button
              onClick={loadMyProblems}
              className="btn btn-sm btn-secondary ml-md"
            >
              Retry
            </button>
          </div>
        )} */}

        {viewingOthersSheet ? (
          <div>
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-xl">{othersUsername}'s Problem Sheet</h2>
              <button
                onClick={handleBackToMySheet}
                className="rounded-btn mb-4"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5"/>
                  <path d="M12 19l-7-7 7-7"/>
                </svg>
                Back to My Sheet
              </button>
            </div>
            <ProblemList
              problems={othersSheetData}
              onProblemUpdate={() => {}}
              onProblemDelete={() => {}}
              isViewingOthers={true}
              onAddProblem={handleAddToMySheet}
            />
          </div>
        ) : (
          <div className="dashboard-table">
            <FilterPanel
              onFilterChange={handleFilterChange}
              onViewOthersSheet={() => setShowViewSheetModal(true)}
              onCreateProblem={() => setShowCreateModal(true)}
            />

            <MetricsPanel
              problems={problems}
              filteredProblems={filteredProblems}
            />

            <ProblemList
              problems={filteredProblems}
              onProblemUpdate={handleProblemUpdate}
              onProblemDelete={handleProblemDelete}
              isViewingOthers={false}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        isAccessCode={false}
      />

      <PasswordModal
        isOpen={showAccessCodeModal}
        onClose={() => setShowAccessCodeModal(false)}
        isAccessCode={true}
      />

      <CreateProblemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProblemCreated={handleProblemCreated}
      />

      <ViewSheetModal
        isOpen={showViewSheetModal}
        onClose={() => setShowViewSheetModal(false)}
        onSheetLoaded={handleSheetLoaded}
      />
    </div>
  );
};

export default Dashboard;