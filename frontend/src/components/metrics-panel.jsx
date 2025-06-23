import './metrics-panel.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

const MetricsPanel = ({ problems, filteredProblems }) => {
  const calculateMetrics = () => {
    const total = filteredProblems.length;
    const completed = filteredProblems.filter(p => p.status).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const difficultyStats = {
      easy: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      hard: { total: 0, completed: 0 }
    };

    filteredProblems.forEach(problem => {
      const difficulty = problem.difficulty.toLowerCase();
      if (difficultyStats[difficulty]) {
        difficultyStats[difficulty].total++;
        if (problem.status) difficultyStats[difficulty].completed++;
      }
    });

    const tagStats = {};
    filteredProblems.forEach(problem => {
      if (problem.tags) {
        const tags = problem.tags.split(',').map(tag => tag.trim().toLowerCase());
        tags.forEach(tag => {
          if (tag) {
            if (!tagStats[tag]) tagStats[tag] = { total: 0, completed: 0 };
            tagStats[tag].total++;
            if (problem.status) tagStats[tag].completed++;
          }
        });
      }
    });

    const sortedTags = Object.entries(tagStats)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 8);

    return {
      total,
      completed,
      pending,
      completionRate,
      difficultyStats,
      tagStats: sortedTags
    };
  };

  const metrics = calculateMetrics();

  // Format data for Recharts
  const difficultyData = ['easy', 'medium', 'hard'].map(level => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    Completed: metrics.difficultyStats[level].completed,
    Total: metrics.difficultyStats[level].total
  }));

  const tagData = metrics.tagStats.map(([tag, stats]) => ({
    name: tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' '),
    Completed: stats.completed,
    Total: stats.total
  }));

  return (
    <div className="metrics-panel">
      <h3 className="metrics-title">Problem Statistics</h3>

      <div className="metrics-cards">
        <div className="metrics-card" style={{ background: 'var(--gradient-primary)' }}>
          <div className="count">{metrics.total}</div>
          <div className="label">Total Problems</div>
        </div>

        <div className="metrics-card" style={{ background: 'var(--success)' }}>
          <div className="count">{metrics.completed}</div>
          <div className="label">Completed</div>
        </div>

        <div className="metrics-card" style={{ background: 'var(--warning)' }}>
          <div className="count">{metrics.pending}</div>
          <div className="label">Pending</div>
        </div>

        <div className="metrics-card" style={{ background: 'var(--info)' }}>
          <div className="count">{metrics.completionRate}%</div>
          <div className="label">Completion Rate</div>
        </div>
      </div>

      <div className="metrics-graphs-container">
        <div className="metrics-graph">
          <h4 className="metrics-subtitle">Difficulty Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={difficultyData}>
              <XAxis dataKey="name" stroke="rgba(109, 73, 232, 0.3)" tick={{ fill: '#6d49e8' }}/>
              <YAxis allowDecimals={false} stroke="rgba(109, 73, 232, 0.3)" tick={{ fill: '#6d49e8' }}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="Total" fill="#8b92f8"/>
              <Bar dataKey="Completed" fill="#9df6be" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="metrics-graph">
          <h4 className="metrics-subtitle">Top Tags</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tagData} layout="vertical">
              <XAxis type="number" allowDecimals={false} stroke="rgba(109, 73, 232, 0.3)" tick={{ fill: '#6d49e8' }}/>
              <YAxis type="category" dataKey="name" width={100} stroke="rgba(109, 73, 232, 0.3)" tick={{ fill: '#6d49e8' }}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="Total" fill="#8b92f8" />
              <Bar dataKey="Completed" fill="#9df6be" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default MetricsPanel;
