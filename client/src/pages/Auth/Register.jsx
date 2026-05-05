import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
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
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Join <span className="gradient-text">NexCPP</span></h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Start your C++ journey with cloud storage and interactive tools.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Username" 
              className="nex-input" 
              style={{ paddingLeft: '45px' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
