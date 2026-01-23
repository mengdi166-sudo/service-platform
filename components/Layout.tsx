
import React from 'react';
import { 
  Globe, 
  Server, 
  Database, 
  FileSignature, 
  ShieldCheck, 
  Bell, 
  User, 
  LogOut,
  Search,
  UserPlus,
  Landmark,
  ChevronsUpDown,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  userRole: UserRole; // Current logged-in user role
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, userRole }) => {
  const navigate = useNavigate();

  // Define all possible menu items
  const allMenuItems = [
    { id: 'identity', label: '身份管理', icon: User, allowedRoles: ['ADMIN', 'CONSUMER'] },
    { id: 'connectors', label: '连接器管理', icon: Server, allowedRoles: ['ADMIN', 'CONSUMER'] },
    { id: 'catalog', label: '数据目录', icon: Database, allowedRoles: ['ADMIN', 'CONSUMER'] },
    { id: 'contracts', label: '数字合约', icon: FileSignature, allowedRoles: ['ADMIN'] },
    { id: 'admin', label: '产品审核', icon: ShieldCheck, allowedRoles: ['ADMIN'] },
    { id: 'users', label: '用户管理', icon: Users, allowedRoles: ['ADMIN'] }, // New Menu
  ];

  // Filter based on RBAC
  const visibleMenuItems = allMenuItems.filter(item => item.allowedRoles.includes(userRole));

  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-4 border-b border-slate-700">
          <button className="flex items-center gap-3 w-full p-2 hover:bg-slate-800 rounded-lg transition-colors text-left group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform ${
              userRole === 'ADMIN' ? 'bg-purple-600' : 'bg-blue-600'
            }`}>
              {userRole === 'ADMIN' ? <ShieldCheck size={24} className="text-white" /> : <User size={24} className="text-white" />}
            </div>
            <div className="flex-1 overflow-hidden">
              <h1 className="font-bold text-sm truncate">可信数据空间服务平台</h1>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {userRole === 'ADMIN' ? '管理员控制台' : '用户工作台'}
              </p>
            </div>
            <ChevronsUpDown size={16} className="text-slate-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleMenuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
           <button 
             onClick={() => navigate('/login')}
             className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
           >
              <LogOut size={18} /> 退出登录
           </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0">
           <div className="flex items-center gap-4 text-slate-500">
              <span className="text-sm font-medium">当前空间: <span className="text-slate-800 font-bold">京津冀医疗健康数据专区</span></span>
              <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-bold border border-green-200">运行正常</span>
           </div>

           <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="全局搜索..." 
                   className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                 />
              </div>
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-800">{userRole === 'ADMIN' ? '系统管理员' : '数据用户'}</p>
                    <p className="text-xs text-slate-500">{userRole}</p>
                 </div>
                 <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm font-bold ${
                    userRole === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'
                 }`}>
                    {userRole === 'ADMIN' ? 'A' : 'U'}
                 </div>
              </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50 p-6 relative">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
