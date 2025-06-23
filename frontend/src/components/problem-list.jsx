import { useState } from 'react';
import { updateProblemStatus, deleteProblem } from '../api/auth';

import './problem-list.css';

const ProblemList = ({ problems, onProblemUpdate, onProblemDelete, isViewingOthers = false, onAddProblem }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [addedProblems, setAddedProblems] = useState(new Set());

  const handleStatusToggle = async (problemId) => {
    setLoadingStates(prev => ({ ...prev, [problemId]: 'status' }));
    try {
      await updateProblemStatus(problemId);
      onProblemUpdate(problemId, 'status');
    } catch (error) {
      console.error('Failed to update problem status:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [problemId]: null }));
    }
  };

  const confirmAndDelete = async () => {
    const problemId = confirmDelete;
    setLoadingStates(prev => ({ ...prev, [problemId]: 'delete' }));
    try {
      await deleteProblem(problemId);
      onProblemDelete(problemId);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete problem:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [problemId]: null }));
    }
  };

  const handleAddToMySheet = async (problemId) => {
    setLoadingStates(prev => ({ ...prev, [problemId]: 'add' }));
    try {
      await onAddProblem(problemId);
      setAddedProblems(prev => new Set(prev).add(problemId));
    } catch (error) {
      console.error('Failed to add problem:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [problemId]: null }));
    }
  };

  const getDifficultyBadge = (difficulty) => (
    <span className={`badge difficulty ${difficulty.toLowerCase()}`}>{difficulty}</span>
  );

  const getTagBadges = (tags) => {
    if (!tags) return null;
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((tag, idx) => (
        <span key={idx} className="badge tag">{tag}</span>
      ));
  };

  const handleClose = () => {
    setConfirmDelete(null);
  }

  if (problems.length === 0) {
    return (
      <div className="card-problem-list">
        <div className="flex items-center gap-4 font-bold text-xl empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          <h3>No problems found</h3>
        </div>
        <p>{isViewingOthers ? "This sheet doesn't have any problems yet." : "Start building your sheet by adding problems!"}</p>
      </div>
    );
  }

  return (
    <div className="card-problem-list">
      <div className="card-header">
        <h3 className="font-bold text-xl">{isViewingOthers ? 'Shared Problems' : 'My Problem Sheet'}</h3>
        <span className="problem-count">({problems.length} problem{problems.length !== 1 ? 's' : ''})</span>
      </div>
      <div className="problem-table-wrapper">
        <table className="problem-table">
          <thead>
            <tr>
              {!isViewingOthers && <th>Status</th>}
              <th>Problem</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.problem_id}>
                {!isViewingOthers && (
                  <td>
                    <button
                      className={`status-toggle ${problem.status ? 'active' : ''}`}
                      onClick={() => handleStatusToggle(problem.problem_id)}
                      disabled={loadingStates[problem.problem_id]}
                    >
                      {loadingStates[problem.problem_id] === 'status' ? <div className="spinner"></div> : '✓'}
                    </button>
                  </td>
                )}
                <td>
                  {problem.url ? (
                    <a href={problem.url} target="_blank" rel="noreferrer" className="problem-link">
                      {problem.title} ↗
                    </a>
                  ) : (
                    <span className="problem-title">{problem.title}</span>
                  )}
                </td>
                <td>{getDifficultyBadge(problem.difficulty)}</td>
                <td><div className="tags">{getTagBadges(problem.tags)}</div></td>
                <td className="text-center">
                  {isViewingOthers ? (
                    addedProblems.has(problem.problem_id) ? (
                      <span className="text-muted">✓ Added</span>
                    ) : (
                      <button
                        onClick={() => handleAddToMySheet(problem.problem_id)}
                        disabled={loadingStates[problem.problem_id]}
                        className="btn btn-sm btn-success"
                      >
                        {loadingStates[problem.problem_id] === 'add' ? <div className="spinner"></div> : '+'}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(problem.problem_id)}
                      disabled={loadingStates[problem.problem_id]}
                      className="btn btn-sm btn-danger"
                    >
                      {loadingStates[problem.problem_id] === 'delete' ? <div className="spinner"></div> : '🗑'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="modal-backdrop">
          <div className="modal-sm">
            <div className="modal-header">
              <h4 className="text-left font-bold text-xl mb-6">Confirm Deletion 🗑</h4>
              <button
                onClick={handleClose}
                className="close-btn"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-sm mb-6">Are you sure you want to remove this problem from your sheet?</p>
            <button
              type="submit"
              className="submit-button mt-2"
              style={{backgroundColor: "var(--error"}}
              onClick={confirmAndDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemList;
