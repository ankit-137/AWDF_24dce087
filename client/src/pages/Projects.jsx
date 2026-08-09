import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRepos = () => {
    setLoading(true);
    setError(null);
    fetch('https://api.github.com/users/ankit-137/repos')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch repositories');
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  if (loading) return <Spinner />;
  if (error) return (
    <div>
      <ErrorMessage message={error} />
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button className="btn-retry" onClick={fetchRepos}>Retry</button>
      </div>
    </div>
  );

  return (
    <div>
      <h2>My Projects</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Live data fetched from the GitHub API — {repos.length} repositories found.
      </p>
      <ul className="repo-list">
        {repos.map((repo) => (
          <li key={repo.id} className="repo-card">
            <div>
              <div className="repo-name">{repo.name}</div>
              <div className="repo-meta">
                {repo.description ?? 'No description provided.'}
              </div>
              <div className="repo-stars">Stars: {repo.stargazers_count}</div>
            </div>
            <a
              className="repo-link"
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
