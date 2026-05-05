import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Play, User, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [topPrograms, setTopPrograms] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('/api/programs/leaderboard');
        setTopPrograms(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard');
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(124, 58, 237, 0.1)', padding: '15px', borderRadius: '20px', marginBottom: '15px' }}>
          <Trophy size={40} color="var(--accent-violet)" />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800' }}>Global <span className="gradient-text">Leaderboard</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Discover the most executed C++ programs in the community.</p>
      </header>

      <div className="glass" style={{ padding: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '15px' }}>RANK</th>
              <th style={{ padding: '15px' }}>PROGRAM</th>
              <th style={{ padding: '15px' }}>AUTHOR</th>
              <th style={{ padding: '15px' }}>RUNS</th>
              <th style={{ padding: '15px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {topPrograms.map((program, index) => (
              <tr key={program.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.3s' }} className="hover-row">
                <td style={{ padding: '20px', fontWeight: '800', fontSize: '1.2rem' }}>
                  {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : `#${index + 1}`}
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Code size={18} color="var(--accent-cyan)" />
                    <span style={{ fontWeight: '600' }}>{program.title}</span>
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} />
                    {program.username}
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700' }}>
                    <Play size={14} fill="var(--accent-cyan)" color="var(--accent-cyan)" />
                    {program.run_count}
                   </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <Link to={`/code/${program.slug}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View Code</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
