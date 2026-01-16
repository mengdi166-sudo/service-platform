import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Portal from './pages/Portal';
import Identity from './pages/Identity';
import PlatformIdentity from './pages/PlatformIdentity';
import Connectors from './pages/Connectors';
import Catalog from './pages/Catalog';
import Contracts from './pages/Contracts';
import Admin from './pages/Admin';
import Register from './pages/Register';

// Simple placeholder for pages not fully implemented in detail
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p>This module is currently under development or restricted.</p>
  </div>
);

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState('portal');
  const navigate = useNavigate();
  const location = useLocation();

  // If we are on the register page, don't wrap in the main layout
  if (location.pathname === '/register') {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // Handle sidebar navigation logic
  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate('/');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'portal':
        return <Portal />;
      case 'identity':
        return <Identity />;
      case 'platform-identity':
        return <PlatformIdentity />;
      case 'connectors':
        return <Connectors />;
      case 'catalog':
        return <Catalog />;
      case 'contracts':
        return <Contracts />;
      case 'admin':
        return <Admin />;
      default:
        return <Portal />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/" element={renderPage()} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;