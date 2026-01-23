
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Shield, 
  ShieldCheck, 
  UserCog, 
  Filter,
  CheckCircle2,
  XCircle,
  Building2,
  Mail,
  Edit,
  Save,
  X,
  Eye,
  FileText
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { IdentityProfile } from '../components/IdentityProfile';

// Mock Data
const MOCK_USERS: UserProfile[] = [
  {
    id: 'U-001',
    username: 'admin_sys',
    name: '系统管理员',
    orgName: '平台运营中心',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLogin: '2024-05-23 10:30',
    email: 'admin@dataspaces.gov.cn'
  },
  {
    id: 'U-002',
    username: 'bj_health_01',
    name: '张主任',
    orgName: '北京市卫健委',
    role: 'CONSUMER',
    status: 'ACTIVE',
    lastLogin: '2024-05-22 16:45',
    email: 'zhang.hc@bj.gov.cn'
  },
  {
    id: 'U-003',
    username: 'tech_corp_dev',
    name: '李研发',
    orgName: '未来科技股份有限公司',
    role: 'CONSUMER',
    status: 'ACTIVE',
    lastLogin: '2024-05-23 09:15',
    email: 'dev@futuretech.com'
  },
  {
    id: 'U-004',
    username: 'audit_officer',
    name: '王审计',
    orgName: '第三方审计事务所',
    role: 'CONSUMER',
    status: 'DISABLED',
    lastLogin: '2024-04-10 11:20',
    email: 'audit@cpa-firm.com'
  }
];

// Helper to generate mock identity data based on the user profile
const generateMockIdentity = (user: UserProfile) => {
  const isOrg = user.role === 'CONSUMER'; // Assuming consumers are Organizations for this mock logic
  return {
    orgName: user.orgName,
    uscc: '11110000MB16685822',
    orgType: '企事业单位法人',
    repName: '张建国',
    repId: '110101197001011234',
    regAddr: '北京市海淀区中关村大街1号',
    industry: '信息技术',
    name: user.name, // for individual/operator context
    idNumber: '110101199001011234',
    phone: '13800138000',
    opPeriodStart: '2018-01-01',
    opPeriodEnd: '2038-01-01',
    authMethod: '人工核验',
    lastUpdated: '2024-05-01 10:00:00'
  };
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<UserRole>('CONSUMER');
  
  // State for Identity Viewer Modal
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);

  const handleEditClick = (user: UserProfile) => {
    setEditingUserId(user.id);
    setTempRole(user.role);
  };

  const handleSaveRole = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: tempRole } : u
    ));
    setEditingUserId(null);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : u
      ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
             <Users className="text-gov-700" size={28} />
             用户权限管理
         </h2>
         <div className="flex gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="搜索用户、机构..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gov-500 bg-white" 
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 bg-white text-slate-600">
               <Filter size={16} /> 筛选
            </button>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
               <tr>
                  <th className="px-6 py-4 font-semibold">用户 / 邮箱</th>
                  <th className="px-6 py-4 font-semibold">所属机构</th>
                  <th className="px-6 py-4 font-semibold">账号角色 (Role)</th>
                  <th className="px-6 py-4 font-semibold">状态</th>
                  <th className="px-6 py-4 font-semibold">最后登录</th>
                  <th className="px-6 py-4 font-semibold text-right">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
               {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{user.name} <span className="text-xs font-normal text-slate-400 ml-1">(@{user.username})</span></div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                           <Mail size={12}/> {user.email}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <Building2 size={16} className="text-slate-400" />
                           <span className="text-slate-700">{user.orgName}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        {editingUserId === user.id ? (
                           <div className="flex items-center gap-2">
                              <select 
                                 value={tempRole}
                                 onChange={(e) => setTempRole(e.target.value as UserRole)}
                                 className="px-2 py-1 bg-white border border-gov-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
                              >
                                 <option value="ADMIN">管理员 (Admin)</option>
                                 <option value="CONSUMER">数据需求/使用方</option>
                              </select>
                           </div>
                        ) : (
                           <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                              user.role === 'ADMIN' 
                               ? 'bg-purple-50 text-purple-700 border-purple-200' 
                               : 'bg-blue-50 text-blue-700 border-blue-200'
                           }`}>
                              {user.role === 'ADMIN' ? <ShieldCheck size={12}/> : <UserCog size={12}/>}
                              {user.role === 'ADMIN' ? '管理员' : '数据需求/使用方'}
                           </div>
                        )}
                     </td>
                     <td className="px-6 py-4">
                        {user.status === 'ACTIVE' ? (
                           <span className="text-green-600 font-medium text-xs flex items-center gap-1">
                              <CheckCircle2 size={14}/> 正常
                           </span>
                        ) : (
                           <span className="text-slate-400 font-medium text-xs flex items-center gap-1">
                              <XCircle size={14}/> 停用
                           </span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {user.lastLogin}
                     </td>
                     <td className="px-6 py-4 text-right">
                        {editingUserId === user.id ? (
                           <div className="flex justify-end gap-2">
                              <button onClick={() => handleSaveRole(user.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Save">
                                 <Save size={16} />
                              </button>
                              <button onClick={() => setEditingUserId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded" title="Cancel">
                                 <X size={16} />
                              </button>
                           </div>
                        ) : (
                           <div className="flex justify-end gap-2">
                              <button onClick={() => setViewingUser(user)} className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-gov-700 rounded" title="View Identity">
                                 <Eye size={16} />
                              </button>
                              <button onClick={() => handleEditClick(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit Role">
                                 <Edit size={16} />
                              </button>
                              <button onClick={() => handleToggleStatus(user.id)} className={`p-1.5 rounded ${user.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`} title={user.status === 'ACTIVE' ? 'Disable' : 'Enable'}>
                                 {user.status === 'ACTIVE' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                              </button>
                           </div>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Identity Viewer Modal */}
      {viewingUser && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
               {/* Modal Header */}
               <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                        <FileText size={20} />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-800 text-lg">用户身份详情</h3>
                        <p className="text-xs text-slate-500">查看 {viewingUser.name} 的认证资料</p>
                     </div>
                  </div>
                  <button 
                     onClick={() => setViewingUser(null)}
                     className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                     <X size={20} />
                  </button>
               </div>
               
               {/* Modal Body */}
               <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                  <IdentityProfile 
                     userType={viewingUser.role === 'ADMIN' ? 'operator' : 'organization'}
                     data={generateMockIdentity(viewingUser)}
                     readOnlyMode={true}
                  />
               </div>

               {/* Modal Footer */}
               <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button 
                     onClick={() => setViewingUser(null)}
                     className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                  >
                     关闭
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default UserManagement;
