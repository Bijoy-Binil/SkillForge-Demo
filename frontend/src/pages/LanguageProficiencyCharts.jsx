import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function LanguageProficiencyCharts() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/github-languages/')
      .then(res => {
        setLanguages(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch language data.');
        setLanguages([]);
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels: languages.map(lang => lang.name),
    datasets: [
      {
        label: 'Bytes of Code',
        data: languages.map(lang => lang.bytes),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'GitHub Language Proficiency' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Bytes' } },
      x: { title: { display: true, text: 'Language' } },
    },
  };

  return (
    <div className="container">
      <h1 className="title">Language Proficiency Charts</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && languages.length === 0 && (
        <div>No language data found. Connect your GitHub account or push some code!</div>
      )}
      {!loading && !error && languages.length > 0 && (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
  );
}
