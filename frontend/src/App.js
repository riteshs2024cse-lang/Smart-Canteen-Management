import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  TrendingUp, 
  Leaf,
  BrainCircuit,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import FoodLogs from './pages/FoodLogs';
import Predictions from './pages/Predictions';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
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

  return (
    <Router>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={toggleSidebar}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="logo">
              <Leaf className="logo-icon" size={32} />
              <div>
                <h1>Smart Canteen</h1>
                <p>Eco-Friendly Management</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="ai-badge">
              <BrainCircuit size={20} />
              <span>AI Powered</span>
            </div>
          </div>
        </header>

        <div className="main-container">
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <nav className="nav-menu">
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/food-logs" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <ClipboardList size={20} />
                <span>Food Logs</span>
              </NavLink>
              <NavLink to="/predictions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <BrainCircuit size={20} />
                <span>AI Predictions</span>
              </NavLink>
              <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <TrendingUp size={20} />
                <span>Analytics</span>
              </NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/food-logs" element={<FoodLogs />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
