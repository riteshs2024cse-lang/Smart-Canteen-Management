import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  Leaf,
  BrainCircuit,
  CalendarCheck2,
  Menu,
  X,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import FoodLogs from './pages/FoodLogs';
import Predictions from './pages/Predictions';
import Analytics from './pages/Analytics';
import PreOrders from './pages/PreOrders';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import UserPreOrders from './pages/UserPreOrders';
import { clearAuth, getAuth, hasRole, isAuthenticated } from './auth';
import './App.css';

function RequireAuth({ roles, children }) {
  const authenticated = isAuthenticated();
  const auth = getAuth();
  const role = auth?.user?.role;

  if (!authenticated) {
    if (roles.includes('user') && !roles.includes('admin')) {
      return <Navigate to="/user/login" replace />;
    }
    return <Navigate to="/admin/login" replace />;
  }

  if (!hasRole(roles)) {
    return <Navigate to={role === 'user' ? '/user/preorders' : '/'} replace />;
  }

  return children;
}

function AdminLayout({ theme, onToggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/admin/login';
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo">
            <Leaf className="logo-icon" size={32} />
            <div>
              <h1>Smart Canteen</h1>
              <p>Admin Dashboard</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <div className="ai-badge">
            <BrainCircuit size={20} />
            <span>AI Powered</span>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="main-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="nav-menu">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/food-logs" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <ClipboardList size={20} />
              <span>Food Logs</span>
            </NavLink>
            <NavLink to="/predictions" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <BrainCircuit size={20} />
              <span>AI Predictions</span>
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <TrendingUp size={20} />
              <span>Analytics</span>
            </NavLink>
            <NavLink to="/pre-orders" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <CalendarCheck2 size={20} />
              <span>Pre-Orders</span>
            </NavLink>
          </nav>
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/food-logs" element={<FoodLogs />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pre-orders" element={<PreOrders />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route
          path="/user/preorders"
          element={(
            <RequireAuth roles={['user']}>
              <UserPreOrders />
            </RequireAuth>
          )}
        />
        <Route
          path="/*"
          element={(
            <RequireAuth roles={['admin']}>
              <AdminLayout theme={theme} onToggleTheme={toggleTheme} />
            </RequireAuth>
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
