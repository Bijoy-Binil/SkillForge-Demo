import React, { useEffect, useState } from 'react';
import axios from 'axios';
import notificationService from '../../services/notificationService';
import '../admin/AdminDashboard.css';

const TABS = [
  { label: 'Learning Paths', key: 'paths' },
  { label: 'Learning Modules', key: 'modules' },
];

const initialPath = { title: '', description: '', estimated_hours: 1, is_ai_generated: false };
const initialModule = { title: '', description: '', module_type: 'article', url: '', estimated_hours: 1, order: 1, learning_path: '' };

export default function ContentManagement() {
  const [tab, setTab] = useState('paths');
  const [paths, setPaths] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialPath);

  // Fetch data
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [tab]);

  function fetchData() {
    setLoading(true);
    setError('');
    if (tab === 'paths') {
      axios.get('/api/admin/learning-paths/')
        .then(res => setPaths(Array.isArray(res.data) ? res.data : []))
        .catch(() => setError('Failed to load learning paths.'))
        .finally(() => setLoading(false));
    } else {
      axios.get('/api/admin/learning-modules/')
        .then(res => setModules(Array.isArray(res.data) ? res.data : []))
        .catch(() => setError('Failed to load learning modules.'))
        .finally(() => setLoading(false));
    }
  }

  function openAdd() {
    setEditId(null);
    setForm(tab === 'paths' ? initialPath : initialModule);
    setShowModal(true);
  }

  function openEdit(item) {
    setEditId(item.id);
    setForm({ ...item });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setForm(tab === 'paths' ? initialPath : initialModule);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'paths') {
        if (editId) {
          await axios.put(`/api/admin/learning-paths/${editId}/`, form);
          notificationService.success('Learning Path updated!');
        } else {
          await axios.post('/api/admin/learning-paths/', form);
          notificationService.success('Learning Path created!');
        }
      } else {
        if (editId) {
          await axios.put(`/api/admin/learning-modules/${editId}/`, form);
          notificationService.success('Learning Module updated!');
        } else {
          await axios.post('/api/admin/learning-modules/', form);
          notificationService.success('Learning Module created!');
        }
      }
      closeModal();
      fetchData();
    } catch (err) {
      notificationService.error('Failed to save.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure?')) return;
    setLoading(true);
    try {
      if (tab === 'paths') {
        await axios.delete(`/api/admin/learning-paths/${id}/`);
        notificationService.success('Learning Path deleted!');
      } else {
        await axios.delete(`/api/admin/learning-modules/${id}/`);
        notificationService.success('Learning Module deleted!');
      }
      fetchData();
    } catch {
      notificationService.error('Failed to delete.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Content Management</h2>
      <div style={{ marginBottom: 24 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={`btn ${tab === t.key ? 'success' : ''}`}
            style={{ marginRight: 8 }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        <button className="btn success" style={{ float: 'right' }} onClick={openAdd}>
          + Add {tab === 'paths' ? 'Learning Path' : 'Module'}
        </button>
      </div>
      {loading && <div className="loading-container"><div className="spinner"></div></div>}
      {error && <div className="error-alert">{error}</div>}
      {!loading && !error && tab === 'paths' && (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Estimated Hours</th>
                <th>AI Generated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paths.map(path => (
                <tr key={path.id}>
                  <td>{path.title}</td>
                  <td>{path.description}</td>
                  <td>{path.estimated_hours}</td>
                  <td>{path.is_ai_generated ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="btn success" style={{ marginRight: 8 }} onClick={() => openEdit(path)}>Edit</button>
                    <button className="btn danger" onClick={() => handleDelete(path.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && tab === 'modules' && (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Type</th>
                <th>URL</th>
                <th>Estimated Hours</th>
                <th>Order</th>
                <th>Learning Path</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(module => (
                <tr key={module.id}>
                  <td>{module.title}</td>
                  <td>{module.description}</td>
                  <td>{module.module_type}</td>
                  <td><a href={module.url} target="_blank" rel="noopener noreferrer">Link</a></td>
                  <td>{module.estimated_hours}</td>
                  <td>{module.order}</td>
                  <td>{module.learning_path}</td>
                  <td>
                    <button className="btn success" style={{ marginRight: 8 }} onClick={() => openEdit(module)}>Edit</button>
                    <button className="btn danger" onClick={() => handleDelete(module.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editId ? 'Edit' : 'Add'} {tab === 'paths' ? 'Learning Path' : 'Module'}</h3>
            <form onSubmit={handleSubmit}>
              {tab === 'paths' ? (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input name="title" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Estimated Hours</label>
                    <input name="estimated_hours" type="number" value={form.estimated_hours} onChange={handleChange} min="1" required />
                  </div>
                  <div className="form-group">
                    <label><input type="checkbox" name="is_ai_generated" checked={form.is_ai_generated} onChange={handleChange} /> AI Generated</label>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input name="title" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select name="module_type" value={form.module_type} onChange={handleChange} required>
                      <option value="video">Video</option>
                      <option value="article">Article</option>
                      <option value="exercise">Exercise</option>
                      <option value="quiz">Quiz</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>URL</label>
                    <input name="url" value={form.url} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Estimated Hours</label>
                    <input name="estimated_hours" type="number" value={form.estimated_hours} onChange={handleChange} min="1" required />
                  </div>
                  <div className="form-group">
                    <label>Order</label>
                    <input name="order" type="number" value={form.order} onChange={handleChange} min="1" required />
                  </div>
                  <div className="form-group">
                    <label>Learning Path ID</label>
                    <input name="learning_path" value={form.learning_path} onChange={handleChange} required />
                  </div>
                </>
              )}
              <div style={{ marginTop: 16 }}>
                <button className="btn success" type="submit" disabled={loading}>{editId ? 'Update' : 'Create'}</button>
                <button className="btn danger" type="button" onClick={closeModal} style={{ marginLeft: 8 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 