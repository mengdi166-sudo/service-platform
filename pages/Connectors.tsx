
import React, { useState } from 'react';
import { Server, Activity, AlertTriangle, Shield, ShieldCheck, RefreshCw, MoreHorizontal, Plus, Trash2, Edit2, Save, X, ChevronRight, Upload, FileText, CheckCircle2, ExternalLink, Clock, PlayCircle, Download, FileKey, Box, Cpu, HardDrive, Ban } from 'lucide-react';
import { Connector, ConnectorStatus, ConnectorEnvironment, UserRole } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Mock Data ------

const INITIAL_CONNECTORS: Connector[] = [
  { 
    id: 'CONN-001', 
    name: 'Primary Gateway (BJ-North)', 
    ip: '10.20.4.15', 
    dashboardUrl: 'https://console.bj-north.dataspaces.demo',
    mac: '00:1B:44:11:3A:B7', 
    env: 'Huawei Kunpeng', 
    lastHeartbeat: new Date(), 
    status: ConnectorStatus.ONLINE, 
    certExpiryDays: 85,
    accessMethod: '专线',
    type: '1',
    orgName: '北京市大数据局',
    uscc: '11110000MB16685822',
    environments: [
      {
        id: 'ENV-BJN-01',
        name: 'General Data Sandbox',
        type: 'DATA_SANDBOX',
        description: 'Standard sandbox for general purpose data analysis.',
        status: 'APPROVED'
      }
    ]
  },
  { 
    id: 'CONN-004', 
    name: 'New Edge Node 01', 
    ip: '10.20.4.100', 
    mac: '00:1B:44:11:3A:DD', 
    env: 'x86_64 Generic', 
    lastHeartbeat: new Date(), 
    status: ConnectorStatus.PENDING_REGISTRATION, 
    certExpiryDays: 0,
    accessMethod: '互联网',
    type: '0',
    orgName: '北京市大数据局',
    uscc: '11110000MB16685822',
    environments: []
  },
  { 
    id: 'CONN-005', 
    name: 'Secure Data Proxy', 
    ip: '10.20.4.101', 
    mac: '00:1B:44:11:3A:EE', 
    env: 'Hygon Dhyana', 
    lastHeartbeat: new Date(), 
    status: ConnectorStatus.PENDING_ACTIVATION, 
    certExpiryDays: 0,
    accessMethod: '专线',
    type: '1',
    orgName: '北京市大数据局',
    uscc: '11110000MB16685822',
    csrFile: 'req_proxy_node.csr',
    environments: [
       {
        name: 'Trusted Compute Zone A',
        type: 'TEE',
        description: 'Intel SGX enabled enclave for model training.',
        attachment: 'tee_attestation_report.pdf',
        status: 'PENDING'
      }
    ]
  },
  { 
    id: 'CONN-002', 
    name: 'Backup Node (BJ-South)', 
    ip: '10.20.4.16', 
    mac: '00:1B:44:11:3A:C2', 
    env: 'Hygon Dhyana', 
    lastHeartbeat: new Date(), 
    status: ConnectorStatus.ONLINE, 
    certExpiryDays: 12,
    accessMethod: '互联网（固定公网IP）',
    type: '0',
    orgName: '北京市大数据局',
    uscc: '11110000MB16685822',
    environments: []
  },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
const certData = [
  { name: '> 60 days', value: 2 },
  { name: '< 30 days', value: 1 },
  { name: 'Expired', value: 0 },
];

const EMPTY_FORM: Partial<Connector> = {
  name: '',
  id: '', // Should be generated or input
  ip: '',
  dashboardUrl: '',
  domains: [],
  accessMethod: '专线',
  orgName: '',
  uscc: '',
  credential: '',
  csrFile: '',
  certIssueDate: '',
  issuer: '',
  vendorName: '',
  vendorCode: '',
  sn: '',
  version: '',
  type: '0',
  mac: '',
  env: 'Linux/Generic', // Default
  status: ConnectorStatus.OFFLINE,
  certExpiryDays: 365,
  environments: []
};

// --- Component ---

interface ConnectorsProps {
  userRole?: UserRole;
}

const Connectors: React.FC<ConnectorsProps> = ({ userRole = 'CONSUMER' }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [connectors, setConnectors] = useState<Connector[]>(INITIAL_CONNECTORS);
  const [formData, setFormData] = useState<Partial<Connector>>(EMPTY_FORM);
  const [formTab, setFormTab] = useState<'basic' | 'env' | 'tech' | 'attach'>('basic');

  // --- Helpers ---

  const getStatusConfig = (status: ConnectorStatus) => {
    switch (status) {
      case ConnectorStatus.ONLINE:
        return { label: '已激活 (Online)', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' };
      case ConnectorStatus.OFFLINE:
        return { label: '离线 (Offline)', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' };
      case ConnectorStatus.PENDING_REGISTRATION:
        return { label: '待审核注册', color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
      case ConnectorStatus.PENDING_CERTIFICATION:
        return { label: '待认证 (需上传CSR)', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
      case ConnectorStatus.PENDING_CERT_AUDIT:
        return { label: '待审核认证', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case ConnectorStatus.PENDING_ACTIVATION:
        return { label: '待激活 (需下载凭证)', color: 'bg-teal-100 text-teal-700 border-teal-200', dot: 'bg-teal-500' };
      case ConnectorStatus.WARNING:
        return { label: 'Warning', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
      case ConnectorStatus.REVOKED:
        return { label: '已吊销 (Revoked)', color: 'bg-slate-200 text-slate-500 border-slate-300', dot: 'bg-slate-500' };
      default:
        return { label: 'Unknown', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' };
    }
  };

  // --- Actions ---

  const handleAddNew = () => {
    setFormData({ 
      ...EMPTY_FORM, 
      id: `CONN-${Date.now().toString().slice(-4)}`, // Backend ID generation simulation
      status: ConnectorStatus.PENDING_REGISTRATION // Initial State
    }); 
    setView('form');
    setFormTab('basic');
  };

  const handleEdit = (conn: Connector) => {
    setFormData({ ...conn, environments: conn.environments || [] });
    setView('form');
    setFormTab('basic');
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除该连接器吗？此操作不可恢复。')) {
      setConnectors(prev => prev.filter(c => c.id !== id));
    }
  };

  // Admin Action: Revoke/Stop
  const handleRevoke = (id: string) => {
    if (confirm('确定要吊销该连接器的访问凭证吗？连接器将立即下线并无法访问平台。')) {
      setConnectors(prev => prev.map(c => 
        c.id === id ? { ...c, status: ConnectorStatus.REVOKED } : c
      ));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.ip) {
      alert('请填写必要的基础信息（名称、IP）');
      return;
    }

    setConnectors(prev => {
      const exists = prev.find(c => c.id === formData.id);
      
      // State Transition Logic for User Save
      let newStatus = formData.status;
      if (formData.status === ConnectorStatus.PENDING_CERTIFICATION && formData.csrFile) {
        // If user is in certification phase and uploads the file, move to Audit
        newStatus = ConnectorStatus.PENDING_CERT_AUDIT;
        alert('凭证请求文件已提交，状态已更新为“待审核认证”');
      }

      // Simulation: Ensure IDs for environments if we are saving in a valid state
      const processedEnvs = formData.environments?.map((env, idx) => ({
         ...env,
         // Simulate ID issuance for demo purposes if not present
         id: env.id || (newStatus === ConnectorStatus.ONLINE ? `ENV-${formData.id?.split('-')[1]}-${idx + 1}` : undefined),
         status: newStatus === ConnectorStatus.ONLINE ? 'APPROVED' : env.status
      })) as ConnectorEnvironment[];

      const updatedConn = { ...formData, status: newStatus, environments: processedEnvs } as Connector;

      if (exists) {
        return prev.map(c => c.id === formData.id ? updatedConn : c);
      } else {
        return [...prev, updatedConn];
      }
    });
    setView('list');
  };

  const handleOpenDashboard = (conn: Connector) => {
    if (conn.status !== ConnectorStatus.ONLINE) return;
    const url = conn.dashboardUrl || `http://${conn.ip}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Simulate Admin Actions (Only for Admin Role now)
  const simulateAdminAction = (id: string, action: 'APPROVE_REG' | 'APPROVE_AUDIT') => {
    setConnectors(prev => prev.map(c => {
      if (c.id !== id) return c;
      if (action === 'APPROVE_REG') return { ...c, status: ConnectorStatus.PENDING_CERTIFICATION };
      if (action === 'APPROVE_AUDIT') {
          // When audit approved, also approve environments for demo
          const approvedEnvs = c.environments?.map((e, idx) => ({ ...e, id: `ENV-${c.id.split('-')[1]}-${idx+1}`, status: 'APPROVED' })) as ConnectorEnvironment[];
          return { ...c, status: ConnectorStatus.PENDING_ACTIVATION, environments: approvedEnvs }; 
      }
      return c;
    }));
  };

  // Environment Actions
  const addEnvironment = () => {
    const newEnv: ConnectorEnvironment = {
      name: '',
      type: 'DATA_SANDBOX',
      description: '',
      status: 'PENDING'
    };
    setFormData({ ...formData, environments: [...(formData.environments || []), newEnv] });
  };

  const removeEnvironment = (index: number) => {
    const newEnvs = [...(formData.environments || [])];
    newEnvs.splice(index, 1);
    setFormData({ ...formData, environments: newEnvs });
  };

  const updateEnvironment = (index: number, field: keyof ConnectorEnvironment, value: string) => {
    const newEnvs = [...(formData.environments || [])];
    newEnvs[index] = { ...newEnvs[index], [field]: value };
    setFormData({ ...formData, environments: newEnvs });
  };

  // --- Render Helpers ---

  const renderKPIs = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
             <Activity size={24} />
           </div>
           <div>
             <p className="text-sm text-slate-500">Online</p>
             <p className="text-2xl font-bold text-slate-800">{connectors.filter(c => c.status === ConnectorStatus.ONLINE).length}</p>
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
             <AlertTriangle size={24} />
           </div>
           <div>
             <p className="text-sm text-slate-500">Warnings</p>
             <p className="text-2xl font-bold text-slate-800">{connectors.filter(c => c.certExpiryDays < 30 && c.status === ConnectorStatus.ONLINE).length}</p>
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
             <Clock size={24} />
           </div>
           <div>
             <p className="text-sm text-slate-500">Pending</p>
             <p className="text-2xl font-bold text-slate-800">
               {connectors.filter(c => c.status === ConnectorStatus.PENDING_REGISTRATION || c.status === ConnectorStatus.PENDING_CERTIFICATION || c.status === ConnectorStatus.PENDING_CERT_AUDIT || c.status === ConnectorStatus.PENDING_ACTIVATION).length}
             </p>
           </div>
        </div>
         <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center relative">
            <div className="w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={certData} innerRadius={15} outerRadius={25} fill="#8884d8" paddingAngle={5} dataKey="value">
                    {certData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4">
              <p className="text-xs text-slate-500">Cert Health</p>
              <p className="font-bold text-sm text-amber-600">Attention Needed</p>
            </div>
         </div>
    </div>
  );

  const renderForm = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      {/* Form Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
         <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              {connectors.find(c => c.id === formData.id) ? <Edit2 size={18}/> : <Plus size={18} />}
              {connectors.find(c => c.id === formData.id) ? '编辑连接器配置' : '部署新连接器'}
            </h3>
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusConfig(formData.status!).color}`}>
               {getStatusConfig(formData.status!).label}
            </span>
         </div>
         <button onClick={() => setView('list')} className="text-slate-400 hover:text-slate-600">
           <X size={20} />
         </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'basic', label: '基础信息 (Basic)' },
          { id: 'env', label: '执行环境 (Environments)' },
          { id: 'tech', label: '技术与设备信息 (Technical)' },
          { id: 'attach', label: '合规与资质附件 (Attachments)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFormTab(tab.id as any)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              formTab === tab.id ? 'border-gov-700 text-gov-700 bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="p-8 overflow-y-auto flex-1">
        
        {/* TAB 1: BASIC INFO */}
        {formTab === 'basic' && (
          <div className="space-y-6">
            {/* SPECIAL SECTION: Certification Upload (Only for PENDING_CERTIFICATION) */}
            {formData.status === ConnectorStatus.PENDING_CERTIFICATION && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 animate-pulse-fast/50">
                 <h4 className="text-blue-800 font-bold flex items-center gap-2 mb-4">
                    <ShieldCheck size={20} /> 待认证：请提交凭证请求文件
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-blue-900 mb-1">接入连接器身份标识 (Platform ID)</label>
                       <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={formData.id} 
                            disabled 
                            className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-slate-600 font-mono font-bold" 
                          />
                          <button 
                             onClick={() => navigator.clipboard.writeText(formData.id || '')}
                             className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                          >
                             复制
                          </button>
                       </div>
                       <p className="text-xs text-blue-600/80 mt-1">请使用此 ID 在设备端生成 CSR 文件。</p>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-blue-900 mb-1">上传凭证请求文件 (CSR)</label>
                       <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                             <input 
                               type="file" 
                               id="csr-upload"
                               className="hidden" 
                               onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) setFormData({...formData, csrFile: file.name});
                               }}
                             />
                             <label 
                                htmlFor="csr-upload"
                                className="w-full flex items-center justify-between px-4 py-2 bg-white border border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                             >
                                <span className="text-sm text-slate-600 truncate">{formData.csrFile || '点击选择 .csr / .pem 文件...'}</span>
                                <Upload size={16} className="text-blue-500" />
                             </label>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* SPECIAL SECTION: Audit Pending (PENDING_CERT_AUDIT) */}
            {formData.status === ConnectorStatus.PENDING_CERT_AUDIT && (
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <Clock className="text-amber-600 mt-0.5" size={20} />
                  <div>
                     <h4 className="text-amber-900 font-bold text-sm">CSR 文件已提交，等待 CA 中心签发证书</h4>
                     <p className="text-xs text-amber-700 mt-1">预计审核时间为 1-3 个工作日。审核通过后，状态将变更为“待激活”。</p>
                     <div className="mt-2 text-xs text-amber-800 font-mono bg-amber-100/50 px-2 py-1 rounded w-fit">
                        Submitted CSR: {formData.csrFile || 'request.csr'}
                     </div>
                  </div>
               </div>
            )}

            {/* SPECIAL SECTION: Pending Activation (PENDING_ACTIVATION) - New Logic */}
            {formData.status === ConnectorStatus.PENDING_ACTIVATION && (
               <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                  <h4 className="text-teal-800 font-bold flex items-center gap-2 mb-4">
                     <CheckCircle2 size={20} /> 认证审核通过，请激活连接器
                  </h4>
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                     <div className="flex-1">
                        <p className="text-sm text-teal-700 mb-2">CA 中心已签发身份凭证，请下载并导入到连接器设备中。</p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium shadow-sm">
                           <Download size={16} /> 下载身份凭证文件 (.cer / .pem)
                        </button>
                     </div>
                     <div className="border-l border-teal-200 pl-6 h-full flex flex-col justify-center">
                         <p className="text-sm text-teal-800 font-bold">等待设备自动激活...</p>
                         <p className="text-xs text-teal-600 mt-1">请将证书导入设备，连接器上线后状态将自动更新。</p>
                     </div>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">接入连接器名称 *</label>
                 <input 
                   type="text" 
                   value={formData.name || ''}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none"
                   placeholder="e.g. Primary Gateway Node 01"
                 />
               </div>
               
               {/* ID Field: HIDE if PENDING_REGISTRATION. Show standard field otherwise (unless in PENDING_CERTIFICATION blue box) */}
               {formData.status !== ConnectorStatus.PENDING_REGISTRATION && formData.status !== ConnectorStatus.PENDING_CERTIFICATION && (
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">
                      接入连接器身份标识 (Platform ID)
                   </label>
                   <div className="relative">
                      <input 
                        type="text" 
                        value={formData.id} 
                        disabled 
                        className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 font-mono" 
                      />
                   </div>
                 </div>
               )}

               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">IP地址列表 *</label>
                 <input 
                   type="text" 
                   value={formData.ip || ''}
                   onChange={e => setFormData({...formData, ip: e.target.value})}
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none"
                   placeholder="IPv4 / IPv6 (Comma separated)"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">管理控制台地址 (Dashboard URL)</label>
                 <input 
                   type="text" 
                   value={formData.dashboardUrl || ''}
                   onChange={e => setFormData({...formData, dashboardUrl: e.target.value})}
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none"
                   placeholder="e.g. https://connector-console.local"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">接入方式</label>
                 <select 
                   value={formData.accessMethod}
                   onChange={e => setFormData({...formData, accessMethod: e.target.value})}
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none bg-white"
                 >
                   <option>专线</option>
                   <option>互联网（固定公网IP）</option>
                   <option>互联网（无固定公网IP）</option>
                   <option>高速数据网</option>
                   <option>其他</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">域名列表</label>
                 <input 
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    placeholder="example.com, api.example.com"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">所属法人或其他组织名称</label>
                 <input 
                   type="text" 
                   value={formData.orgName || ''}
                   onChange={e => setFormData({...formData, orgName: e.target.value})}
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">统一社会信用代码</label>
                 <input 
                   type="text" 
                   value={formData.uscc || ''}
                   onChange={e => setFormData({...formData, uscc: e.target.value})}
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none"
                 />
               </div>
               {formData.status === ConnectorStatus.ONLINE && (
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">凭证颁发日期</label>
                   <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none" />
                 </div>
               )}
            </div>
          </div>
        )}

        {/* TAB 2: ENVIRONMENTS (New Feature) */}
        {formTab === 'env' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 mb-6">
              <Box className="text-blue-600 shrink-0" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-bold">执行环境配置</p>
                <p>请配置该连接器内部支持的计算或存储环境。平台审核通过后将颁发环境标识 (Environment ID)。</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {formData.environments?.map((env, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50 relative group">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">环境名称</label>
                         <input 
                           type="text" 
                           value={env.name}
                           onChange={e => updateEnvironment(idx, 'name', e.target.value)}
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-500 text-sm"
                           placeholder="e.g. Finance Secure Sandbox"
                         />
                      </div>
                      
                      {/* Type */}
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">环境类型</label>
                         <select 
                            value={env.type}
                            onChange={e => updateEnvironment(idx, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-500 text-sm bg-white"
                         >
                            <option value="DATA_SANDBOX">数据沙箱 (Data Sandbox)</option>
                            <option value="PRIVACY_COMPUTE">隐私计算 (Privacy Compute)</option>
                            <option value="TEE">可信执行环境 (TEE)</option>
                            <option value="MPC">多方安全计算 (MPC)</option>
                            <option value="OTHER">其他 (Other)</option>
                         </select>
                      </div>

                      {/* ID (Read Only) */}
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">环境标识 (Environment ID)</label>
                         <div className="relative">
                            <input 
                              type="text" 
                              value={env.id || 'Pending Audit...'}
                              disabled
                              className={`w-full px-3 py-2 border rounded-lg text-sm font-mono ${env.id ? 'bg-white border-green-200 text-green-700 font-bold' : 'bg-slate-100 border-slate-200 text-slate-400 italic'}`}
                            />
                            {env.id && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16} />}
                         </div>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">环境描述</label>
                         <textarea 
                           rows={2}
                           value={env.description}
                           onChange={e => updateEnvironment(idx, 'description', e.target.value)}
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-500 text-sm"
                           placeholder="描述该环境的用途、安全隔离机制等..."
                         />
                      </div>

                      {/* Attachment */}
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">附件 (验证方式)</label>
                         <div className="flex items-center gap-2">
                           <div className="flex-1 relative">
                              <input 
                                type="file" 
                                id={`env-upload-${idx}`}
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) updateEnvironment(idx, 'attachment', file.name);
                                }}
                              />
                              <label 
                                 htmlFor={`env-upload-${idx}`}
                                 className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                              >
                                 <span className="text-sm text-slate-600 truncate">{env.attachment || '点击上传环境验证报告/证明...'}</span>
                                 <Upload size={14} className="text-slate-400" />
                              </label>
                           </div>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => removeEnvironment(idx)}
                     className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 transition-colors"
                     title="Remove Environment"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}

              <button 
                onClick={addEnvironment}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-gov-500 hover:text-gov-600 hover:bg-gov-50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus size={18} /> 添加新的执行环境
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TECHNICAL INFO (Table 11) */}
        {formTab === 'tech' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">可验证身份签发单位</label>
               <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">供应商名称</label>
               <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">供应商代码</label>
               <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">产品SN号</label>
               <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">产品版本号</label>
               <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">设备MAC地址</label>
               <input 
                 type="text" 
                 value={formData.mac || ''}
                 onChange={e => setFormData({...formData, mac: e.target.value})}
                 className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:outline-none"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">连接器类型</label>
               <div className="flex gap-4 mt-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input 
                     type="radio" 
                     name="type" 
                     checked={formData.type === '0'} 
                     onChange={() => setFormData({...formData, type: '0'})}
                     className="text-gov-700 focus:ring-gov-500" 
                   />
                   <span className="text-sm text-slate-700">标准型 (Standard)</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input 
                      type="radio" 
                      name="type" 
                      checked={formData.type === '1'} 
                      onChange={() => setFormData({...formData, type: '1'})}
                      className="text-gov-700 focus:ring-gov-500" 
                    />
                   <span className="text-sm text-slate-700">全功能型 (Full)</span>
                 </label>
               </div>
             </div>
          </div>
        )}

        {/* TAB 4: ATTACHMENTS (Table 12) */}
        {formTab === 'attach' && (
          <div className="space-y-4">
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 mb-6">
               <Shield className="text-blue-600 shrink-0" size={20} />
               <div className="text-sm text-blue-800">
                 <p className="font-bold">资质文件要求</p>
                 <p>请上传PDF或JPG格式文件，单个文件不超过10MB。所有认证文件需在有效期内。</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 '网络接入资质认证',
                 '等级保护（等保2.0）测评结果',
                 '网络安全产品备案证明',
                 '加密模块认证',
                 '软件供应链合规声明',
                 '安全漏洞修复声明',
                 '通信协议兼容性认证',
                 '硬件可信执行环境（TEE）认证',
                 '接入行为审计合规报告',
                 '第三方认证声明'
               ].map((label, idx) => (
                 <div key={idx} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-700 text-sm">{label}</p>
                      <p className="text-xs text-slate-400 mt-1">未上传</p>
                    </div>
                    <button className="flex items-center gap-1 text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-600">
                      <Upload size={14} /> 上传
                    </button>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-3">
         <button 
           onClick={() => setView('list')}
           className="px-6 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
         >
           取消
         </button>
         <button 
           onClick={handleSave}
           className="px-6 py-2 bg-gov-700 text-white rounded-lg hover:bg-gov-800 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-colors"
         >
           <Save size={18} /> 保存并提交
         </button>
      </div>
    </div>
  );

  // --- Main View Logic ---

  if (view === 'form') {
    return renderForm();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">连接器管理 (Connector Console)</h2>
         {userRole === 'CONSUMER' && (
            <button 
              onClick={handleAddNew}
              className="px-4 py-2 bg-gov-700 text-white rounded-lg hover:bg-gov-800 shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus size={18} /> 部署新连接器
            </button>
         )}
      </div>

      {renderKPIs()}

      {/* Connector Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
           <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
             <tr>
               <th className="px-6 py-4 font-semibold">Status</th>
               <th className="px-6 py-4 font-semibold">Connector ID / Name</th>
               <th className="px-6 py-4 font-semibold">Details</th>
               {/* REMOVED: Cert Life Column Header */}
               <th className="px-6 py-4 font-semibold text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {connectors.map((conn) => {
               const statusCfg = getStatusConfig(conn.status);
               return (
               <tr key={conn.id} className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border ${statusCfg.color} w-fit`}>
                        <div className={`w-2 h-2 rounded-full ${statusCfg.dot} ${conn.status === ConnectorStatus.ONLINE ? 'animate-pulse' : ''}`}></div>
                        <span className="font-medium text-xs whitespace-nowrap">{statusCfg.label}</span>
                      </div>
                      
                      {/* Admin Approval Actions */}
                      {userRole === 'ADMIN' && (
                        <>
                          {conn.status === ConnectorStatus.PENDING_REGISTRATION && (
                            <button 
                              onClick={() => simulateAdminAction(conn.id, 'APPROVE_REG')}
                              className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded flex items-center gap-1 w-fit"
                            >
                              <PlayCircle size={10}/> 审核通过(注册)
                            </button>
                          )}
                          {conn.status === ConnectorStatus.PENDING_CERT_AUDIT && (
                            <button 
                              onClick={() => simulateAdminAction(conn.id, 'APPROVE_AUDIT')}
                              className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-1 rounded flex items-center gap-1 w-fit"
                            >
                              <PlayCircle size={10}/> 审核通过(签发证书)
                            </button>
                          )}
                        </>
                      )}
                    </div>
                 </td>
                 <td className="px-6 py-4">
                   <div 
                     className="font-bold text-slate-800 hover:text-gov-700 cursor-pointer flex items-center gap-2"
                     onClick={() => handleOpenDashboard(conn)}
                   >
                     {conn.name}
                     {/* External Link Icon: Only for Consumers on Online connectors */}
                     {conn.status === ConnectorStatus.ONLINE && userRole === 'CONSUMER' && <ExternalLink size={14} className="text-slate-400" />}
                   </div>
                   {conn.status !== ConnectorStatus.PENDING_REGISTRATION && (
                      <div className="text-xs text-slate-400 font-mono">{conn.id}</div>
                   )}
                   {conn.orgName && <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Shield size={10}/> {conn.orgName}</div>}
                 </td>
                 <td className="px-6 py-4 text-slate-600 font-mono text-xs space-y-1">
                   <div>IP: {conn.ip}</div>
                   <div>MAC: {conn.mac}</div>
                   <div className="text-slate-400">{conn.env}</div>
                   {conn.environments && conn.environments.length > 0 && (
                      <div className="text-blue-500 font-medium mt-1 flex items-center gap-1">
                        <Box size={10} /> {conn.environments.length} Environments
                      </div>
                   )}
                 </td>
                 {/* REMOVED: Cert Life Column Body */}
                 <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {conn.status === ConnectorStatus.ONLINE && userRole === 'CONSUMER' && (
                         <button 
                            onClick={() => handleOpenDashboard(conn)}
                            className="p-2 text-slate-500 hover:text-gov-700 hover:bg-gov-50 rounded-lg transition-colors"
                            title="Open Web Dashboard"
                          >
                           <ExternalLink size={16} />
                         </button>
                       )}
                       
                       {/* Consumer Actions: Edit / Delete */}
                       {userRole === 'CONSUMER' && (
                         <>
                           <button 
                              onClick={() => handleEdit(conn)}
                              className="p-2 text-slate-500 hover:text-gov-700 hover:bg-gov-50 rounded-lg transition-colors"
                              title="Edit / Configure"
                            >
                             <Edit2 size={16} />
                           </button>
                           <button 
                              onClick={() => handleDelete(conn.id)}
                              className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                           >
                             <Trash2 size={16} />
                           </button>
                         </>
                       )}

                       {/* Admin Actions: Revoke (Only when Online) */}
                       {userRole === 'ADMIN' && conn.status === ConnectorStatus.ONLINE && (
                          <button 
                             onClick={() => handleRevoke(conn.id)}
                             className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                             title="停用/吊销连接器 (Revoke)"
                          >
                             <Ban size={16} />
                          </button>
                       )}
                    </div>
                 </td>
               </tr>
               );
             })}
           </tbody>
         </table>
      </div>
      
      {/* Simulation of Security Sync Status */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-800 rounded-lg">
               <Shield className="text-green-400" size={24} />
            </div>
            <div>
               <h4 className="font-bold text-sm">安全策略自动同步 (Security Policy Sync)</h4>
               <p className="text-xs text-slate-400">All online connectors are running the latest enforcement policy (v2.4.1).</p>
            </div>
         </div>
         <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition-colors">
            View Policy Audit
         </button>
      </div>
    </div>
  );
};

export default Connectors;
