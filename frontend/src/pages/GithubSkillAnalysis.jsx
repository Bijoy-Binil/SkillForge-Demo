import { useState } from 'react';
import { UserCircleIcon, ArrowPathIcon, ExclamationCircleIcon, CheckCircleIcon, CodeBracketIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function GithubSkillAnalysis() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [suggestion, setSuggestion] = useState('');
  const [showConnectMsg, setShowConnectMsg] = useState(false);

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProfile(null);
    setLanguages([]);
    setSuggestion('');
    try {
      // Save GitHub username to backend (optional, if you want to persist)
      // await axios.post('/api/github/connect/', { username });
      // Fetch profile
      const profileRes = await axios.get(`/api/github/?search=${username}`);
      const profileData = profileRes.data && profileRes.data.length ? profileRes.data[0] : null;
      setProfile(profileData);
      // Fetch languages
      const langRes = await axios.get(`/api/github-languages/?search=${username}`);
      const langs = langRes.data;
      setLanguages(langs);
      // Suggest a pathway based on most used language
      if (langs.length > 0) {
        const topLang = langs[0].name;
        setSuggestion(`Recommended Pathway: ${topLang} Developer`);
      } else {
        setSuggestion('No dominant language found. Explore Full Stack or Generalist pathways!');
      }
    } catch (err) {
      setError('Failed to fetch GitHub data. Please check the username and try again.');
    } finally {
      setLoading(false);
    }
  };

  const connectGithub = () => {
    if (username) {
      window.open(`https://github.com/${username}`, '_blank');
      setShowConnectMsg(false);
    } else {
      setShowConnectMsg(true);
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        <CodeBracketIcon className="icon" /> GitHub Skill Analysis
      </h1>
      <form onSubmit={handleConnect} className="form">
        <input
          type="text"
          className="form-input"
          placeholder="Enter your GitHub username"
          value={username}
          onChange={e => { setUsername(e.target.value); setShowConnectMsg(false); }}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={connectGithub}
        >
          Connect GitHub
        </button>
      </form>
      {showConnectMsg && (
        <div className="error-message">Please enter your GitHub username to connect.</div>
      )}
      {loading && (
        <div className="loading">
          <ArrowPathIcon className="spinner" />
          <div>Analyzing GitHub skills...</div>
        </div>
      )}
      {error && (
        <div className="error-message">
          <ExclamationCircleIcon className="icon" /> {error}
        </div>
      )}
      {profile && (
        <div className="profile-card">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="avatar" />
          ) : (
            <UserCircleIcon className="icon-large" />
          )}
          <div>
            <div className="name">{profile.name || profile.login}</div>
            <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="link">{profile.html_url}</a>
            <div className="details">Public Repos: {profile.public_repos}</div>
            <div className="details">Followers: {profile.followers}</div>
            <div className="details">Bio: {profile.bio}</div>
          </div>
        </div>
      )}
      {languages.length > 0 && (
        <div className="languages">
          <h2 className="section-title">
            <CheckCircleIcon className="icon" /> Top Languages
          </h2>
          <ul className="language-list">
            {languages.map(lang => (
              <li key={lang.id} className="language-item">
                {lang.name} <span className="size-info">({lang.bytes} bytes)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {suggestion && (
        <div className="suggestion">
          <AcademicCapIcon className="icon" />
          <span className="suggestion-text">{suggestion}</span>
        </div>
      )}
    </div>
  );
}
