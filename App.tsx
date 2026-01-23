
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
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import { UserRole } from './types';
import { UserCog } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState('identity');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('ADMIN'); // Default to Admin for demo
  const navigate = useNavigate();
  const location = useLocation();

  // Handle standalone pages (Login/Register) outside the main layout
  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
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
        return <Connectors userRole={currentUserRole} />;
      case 'catalog':
        return <Catalog />;
      case 'contracts':
        // RBAC Check for page content safety
        return currentUserRole === 'ADMIN' ? <Contracts /> : <div className="p-8 text-center text-slate-500">Access Denied</div>;
      case 'admin':
        return currentUserRole === 'ADMIN' ? <Admin /> : <div className="p-8 text-center text-slate-500">Access Denied</div>;
      case 'users':
        return currentUserRole === 'ADMIN' ? <UserManagement /> : <div className="p-8 text-center text-slate-500">Access Denied</div>;
      default:
        return <Identity />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate} userRole={currentUserRole}>
      <Routes>
        <Route path="/" element={renderPage()} />
      </Routes>

      {/* DEV TOOL: Role Switcher (Bottom Left fixed) */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-slate-800 text-white p-2 rounded-lg shadow-lg flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity">
           <UserCog size={16} />
           <span className="text-xs font-mono">Dev: Switch Role</span>
           <select 
             value={currentUserRole} 
             onChange={(e) => {
               const newRole = e.target.value as UserRole;
               setCurrentUserRole(newRole);
               // If switching to CONSUMER while on a restricted page, go back to identity
               if (newRole === 'CONSUMER' && ['users', 'contracts', 'admin'].includes(activePage)) {
                 setActivePage('identity');
               }
             }}
             className="bg-slate-700 text-xs rounded border border-slate-600 px-2 py-1 focus:outline-none"
           >
              <option value="ADMIN">ADMIN</option>
              <option value="CONSUMER">CONSUMER</option>
           </select>
        </div>
      </div>
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
