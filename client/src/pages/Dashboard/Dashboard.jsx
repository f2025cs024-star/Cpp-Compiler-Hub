import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Plus, Code, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get('/api/programs');
        setPrograms(res.data);
      } catch (err) {
        console.error('Error fetching programs');
      }
    };
    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await axios.delete(`/api/programs/${id}`);
        setPrograms(programs.filter(p => p.id !== id));
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>My <span className="gradient-text">Programs</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your saved snippets and projects.</p>
        </div>
        <Link to="/" className="btn-primary">
          <Plus size={20} /> Create New
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {programs.length > 0 ? programs.map(program => (
          <div key={program.id} className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(0, 212, 255, 0.1)', padding: '10px', borderRadius: '12px' }}>
                <Code size={24} color="var(--accent-cyan)" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleDelete(program.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '5px' }}>{program.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Calendar size={14} />
                {new Date(program.updated_at).toLocaleDateString()}
              </div>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                {program.language.toUpperCase()}
              </span>
              <Link to={`/code/${program.slug}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', fontSize: '0.9rem' }}>
                Open Editor <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        )) : (
          <div className="glass" style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>You haven't saved any programs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
