import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import EditorPage from './pages/EditorPage/EditorPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Leaderboard from './pages/Dashboard/Leaderboard';

const AppContent = () => {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) return <div className="glass" style={{ margin: '100px auto', width: '240px', padding: '20px', textAlign: 'center' }}>Loading C++ Compiler Hub...</div>;

  return (
    <Router>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/code/:slug" element={<EditorPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
