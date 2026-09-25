import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Layout, User, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="glass" style={{ margin: '15px', padding: '10px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{ background: 'var(--gradient-primary)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
          <Zap size={24} color="white" fill="white" />
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>
          C++ Compiler <span className="gradient-text">Hub</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/leaderboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Leaderboard</Link>
        <Link to="/download" style={{ color: '#00d4ff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>⬇ Download App</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '8px 16px' }}>
              <Layout size={18} /> Dashboard
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '5px 15px', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="white" />
              </div>
              <span style={{ fontWeight: '600' }}>{user.username}</span>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
