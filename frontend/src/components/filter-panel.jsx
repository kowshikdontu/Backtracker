import { useState } from 'react';
import './filter-panel.css';

const tagOptions = [
  'all', 'array', 'string', 'linked-list', 'tree', 'graph', 'dynamic-programming',
  'greedy', 'backtracking', 'binary-search', 'two-pointers', 'sliding-window',
  'stack', 'queue', 'heap', 'hash-table', 'sorting', 'math', 'bit-manipulation'
];

const filterConfigs = [
  {
    key: 'tag',
    label: 'Tag',
    options: tagOptions.map(tag => ({
      value: tag,
      label: tag === 'all' ? 'All Tags' : tag.replace(/-/g, ' ').replace(/^./, str => str.toUpperCase())
    }))
  },
  {
    key: 'difficulty',
    label: 'Difficulty',
    options: [
      { value: 'all', label: 'All Difficulties' },
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Status' },
      { value: 'completed', label: 'Completed' },
      { value: 'pending', label: 'Pending' }
    ]
  }
];

const FilterPanel = ({ onFilterChange, onViewOthersSheet, onCreateProblem }) => {
  const [filters, setFilters] = useState({
    search: '',
    tag: 'all',
    difficulty: 'all',
    status: 'all'
  });

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-inner">
      <div className="filter-top-row">
        <div className="search-bar">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="var(--primary-color)" strokeWidth="3" fill="none" />
            <line x1="17" y1="17" x2="22" y2="22" stroke="var(--primary-color)" strokeWidth="3" />
          </svg>
          <input
            type="text"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <button className="rounded-btn" onClick={onCreateProblem}>
            <span className="plus-icon">+</span> Add Problem
          </button>
          <button className="rounded-btn" onClick={onViewOthersSheet}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            View Others' Sheet
          </button>
        </div>
      </div>


        <div className="filter-dropdowns">
          {filterConfigs.map(({ key, label, options }) => (
            <div className="dropdown-container" key={key}>
              <label>{label}</label>
              <div className="custom-select-wrapper">
                <select
                  value={filters[key]}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                >
                  {options.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <span className="select-arrow">›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default FilterPanel;
