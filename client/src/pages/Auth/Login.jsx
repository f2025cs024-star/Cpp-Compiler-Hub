import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ padding: '40px', width: '100%', maxWidth: '450px' }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Welcome <span className="gradient-text">Back</span></h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Enter your credentials to access your programs.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="nex-input" 
              style={{ paddingLeft: '45px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              className="nex-input" 
              style={{ paddingLeft: '45px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
