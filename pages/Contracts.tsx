import React, { useState } from 'react';
import { 
  FileText, 
  History, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft,
  Database,
  Users,
  Clock,
  Ban,
  Search,
  Filter,
  ArrowRightLeft,
  PenTool,
  CheckCircle2,
  Activity,
  Lock,
  FileKey,
  Globe,
  Server,
  Fingerprint,
  BarChart3,
  Terminal,
  FileSignature,
  Shield,
  Scale,
  User,
  MoreHorizontal,
  Edit2,
  Podcast,
  Download,
  Building2
} from 'lucide-react';
import { Contract, ContractStatus, SignMode, Policy } from '../types';

// --- Mock Data ---
const SELF_NAME = "北京市大数据局"; // Local Node Identity for Admin View

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'CNT-2025-001',
    name: '区域气象数据-科研所申请',
    description: '海淀科研所申请使用 2024 年度气象数据进行气候模型训练，要求每日更新。',
    role: 'Provider',
    productId: 'DP-BJ-882001',
    productName: '区域气象历史数据',
    counterpartyName: '海淀区科研所',
    counterpartyDid: 'did:conn:group:556677',
    signatorySpecifiedPointId: 'did:conn:my-connector:001',
    status: ContractStatus.ACTIVE,
    signMode: SignMode.BROKER,
    version: 4,
    lastUpdated: '2025-05-10 09:30:00',
    myPolicy: {
      actions: ['read', 'desensitize'],
      constraints: {
        usageCount: 2000,
        validUntil: '2025-12-31',
        environment: 'PrivacyCompute',
        ipWhitelist: '10.20.10.0/24'
      }
    },
    counterpartyPolicy: {
      actions: ['read', 'desensitize'],
      constraints: {
        usageCount: 2000,
        validUntil: '2025-12-31',
        environment: 'PrivacyCompute',
        ipWhitelist: '10.20.10.0/24'
      }
    },
    history: [
      {
        version: 4,
        proposer: 'Me',
        timestamp: '2025-05-10 09:30:00',
        comment: '合约已归档生效',
        policySnapshot: {
          actions: ['read', 'desensitize', 'transfer'],
          constraints: { usageCount: 2000, validUntil: '2025-12-31', environment: 'None' }
        }
      },
      {
        version: 3,
        proposer: 'Counterparty',
        timestamp: '2025-05-09 14:00:00',
        comment: '同意条款，请求签署',
        policySnapshot: {
          actions: ['read', 'desensitize'],
          constraints: { usageCount: 1000, validUntil: '2025-12-31', environment: 'None' }
        }
      }
    ],
    logs: [
      { id: 'PROOF-36a8-2025', timestamp: '2025-05-01T10:00:00Z', result: 'ALLOWED', connectorId: 'did:conn:node_0086', policyId: 'STRAT-002-INST-01', context: '{"action":"read", "bytes": 1024, "status": "success", "resource": "weather_v1.csv"}', signature: '0x7a2b...c91e' },
      { id: 'PROOF-36a8-2026', timestamp: '2025-05-01T10:05:00Z', result: 'ALLOWED', connectorId: 'did:conn:node_0086', policyId: 'STRAT-002-INST-01', context: '{"action":"read", "bytes": 2048, "status": "success", "resource": "weather_v1.csv"}', signature: '0x8b3c...d02f' },
      { id: 'PROOF-36a8-2099', timestamp: '2025-05-01T11:30:00Z', result: 'DENIED', connectorId: 'did:conn:node_0086', policyId: 'STRAT-002-INST-01', context: '{"action":"transfer", "error": "policy_violation", "reason": "geo_fence"}', signature: '0x9c4d...e13g' }
    ]
  },
  {
    id: 'CNT-2025-003',
    name: '金融风控黑名单查询',
    description: '每季度自动同步高风险企业名单。',
    role: 'Consumer',
    productId: 'DP-BJ-991002',
    productName: '企业信用评分报告',
    counterpartyName: '北京市金融局',
    counterpartyDid: 'did:conn:gov:bj:fin',
    signatorySpecifiedPointId: 'did:conn:my-connector:002',
    status: ContractStatus.ACTIVE,
    signMode: SignMode.P2P,
    version: 1,
    lastUpdated: '2026-05-01 12:00:00',
    myPolicy: {
      actions: ['read'],
      constraints: {
        usageCount: 12,
        validUntil: '2026-05-01',
        environment: 'PrivacyCompute',
        securityLevel: 'L4'
      }
    },
    counterpartyPolicy: {
       actions: ['read'],
       constraints: { usageCount: 12, validUntil: '2026-05-01' }
    },
    history: [
       {
         version: 1,
         proposer: 'Me',
         timestamp: '2024-05-01 09:00:00',
         comment: '合约已归档生效',
         policySnapshot: { actions: [], constraints: {} }
       }
    ],
    logs: [
      { id: 'PROOF-101-X92', timestamp: '2025-05-01T10:00:00Z', result: 'ALLOWED', connectorId: 'did:conn:node_0086...', policyId: 'STRAT-002-INST-01', context: '{"action":"read","bytes":100}', signature: '0x7a2b...c91e' }
    ]
  }
];

const Contracts: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  
  // Mock Admin State (In a real app, this comes from context/auth)
  const isAdmin = true; 

  // Helper to determine parties based on role
  const getParties = (contract: Contract) => {
    if (contract.role === 'Provider') {
        return { provider: SELF_NAME, consumer: contract.counterpartyName };
    } else {
        return { provider: contract.counterpartyName, consumer: SELF_NAME };
    }
  };

  const handleContractClick = (contract: Contract) => {
    setSelectedContract(contract);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedContract(null);
    setView('list');
  };

  const handleTerminate = () => {
    if (!selectedContract) return;
    if (confirm(`确定要终止合约 "${selectedContract.name}" 吗？此操作不可逆。`)) {
      setContracts(prev => prev.map(c => 
        c.id === selectedContract.id ? { ...c, status: ContractStatus.TERMINATED } : c
      ));
      setSelectedContract({ ...selectedContract, status: ContractStatus.TERMINATED });
    }
  };

  // --- Helper: Status Styles ---
  const getStatusStyles = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.NEGOTIATING:
        return { bg: 'bg-amber-50', text: 'text-amber-700', label: '协商中', icon: ArrowRightLeft };
      case ContractStatus.PENDING_SIGNATURE:
        return { bg: 'bg-blue-50', text: 'text-blue-700', label: '待签署', icon: PenTool };
      case ContractStatus.ACTIVE:
        return { bg: 'bg-green-50', text: 'text-green-700', label: 'Active', icon: CheckCircle2 }; // Changed label to match design
      case ContractStatus.TERMINATED:
        return { bg: 'bg-slate-100', text: 'text-slate-500', label: '已终止', icon: Ban };
      case ContractStatus.SIGNED:
         return { bg: 'bg-indigo-50', text: 'text-indigo-700', label: '已签署', icon: Check };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', label: status, icon: FileText };
    }
  };

  // --- Sub-Component: Detail View ---
  const ContractDetailView = ({ contract }: { contract: Contract }) => {
    const statusStyle = getStatusStyles(contract.status);
    const { provider, consumer } = getParties(contract);

    return (
      <div className="flex flex-col h-full bg-slate-50 absolute inset-0 z-20 animate-in slide-in-from-right-4 duration-300 overflow-y-auto">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-5 flex-shrink-0 sticky top-0 z-30">
           <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                 <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                 </button>
                 <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                       合约详情与协商
                    </h1>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                       <span className="font-mono">{contract.id}</span>
                       <span>•</span>
                       <span>{contract.productName}</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}>
                      <statusStyle.icon size={12}/> {statusStyle.label}
                  </div>
                  {isAdmin && contract.status !== ContractStatus.TERMINATED && (
                     <button 
                        onClick={handleTerminate}
                        className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors ml-4"
                     >
                        <Ban size={16} /> 终止合约
                     </button>
                  )}
              </div>
           </div>
        </div>

        <div className="flex flex-1 p-8 gap-8 max-w-7xl mx-auto w-full items-start">
            
            {/* Main Content Column */}
            <div className="flex-1 space-y-8 min-w-0">
                
                {/* 1. Basic Info */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText className="text-blue-600" size={20} />
                        1. 合约基础信息 (Basic Info)
                    </h3>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="mb-6">
                            <label className="text-xs text-slate-500 mb-1 block">合约名称</label>
                            <div className="text-lg font-bold text-slate-900">{contract.name}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">数据提供方 (Provider)</label>
                                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="p-1.5 rounded-lg bg-purple-200 text-purple-700">
                                        <Building2 size={16} />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm">{provider}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">数据消费方 (Consumer)</label>
                                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="p-1.5 rounded-lg bg-blue-200 text-blue-700">
                                        <Building2 size={16} />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm">{consumer}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs text-slate-500 mb-2 block">关联数据产品</label>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                <Database size={16} /> {contract.productName}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs text-slate-500 mb-2 block">合约描述/背景</label>
                            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 border border-slate-100">
                                {contract.description}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">授权生效时间 (Effective)</label>
                                <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 flex items-center gap-2 text-sm text-slate-600">
                                    <Clock size={16} className="text-slate-400"/> 签署后立即生效
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs text-slate-500">授权有效期 (Expiry) <ShieldCheck size={12} className="inline text-slate-400"/></label>
                                    <span className="text-[10px] text-slate-400">最长有效期至: 2026-12-31</span>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-800 font-medium">
                                    {contract.myPolicy.constraints.validUntil || '2026/05/01'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Locked Constraints */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Lock className="text-slate-600" size={20} />
                        2. 基础准入与禁止区 (Locked)
                        <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded ml-2">底线条款 · 不可修改</span>
                    </h3>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                         <div className="grid grid-cols-2 gap-6">
                             <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 relative">
                                 <label className="text-xs text-slate-500 mb-1 block">执行环境要求 (Environment)</label>
                                 <div className="flex items-center gap-2 font-bold text-slate-700">
                                     {contract.myPolicy.constraints.environment || 'None'}
                                     <Lock size={12} className="text-slate-300"/>
                                 </div>
                                 <div className="text-[10px] text-slate-400 mt-1">必须满足的安全计算环境类型。</div>
                             </div>
                             <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 relative">
                                 <label className="text-xs text-slate-500 mb-1 block">最低安全等级 (Security Level)</label>
                                 <div className="flex items-center gap-2 font-bold text-slate-700">
                                     {contract.myPolicy.constraints.securityLevel || 'L2'}
                                     <Lock size={12} className="text-slate-300"/>
                                 </div>
                                 <div className="text-[10px] text-slate-400 mt-1">必须通过等保三级测评。</div>
                             </div>
                         </div>
                    </div>
                </div>

                {/* 3. Negotiable Terms */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Edit2 className="text-blue-500" size={20} />
                        3. 业务配额与条款区 (Negotiable)
                        <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-2">可协商 · 需提供方确认</span>
                    </h3>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-slate-500">使用次数上限 (Max Count) <ShieldCheck size={12} className="inline text-slate-400"/></label>
                                <span className="text-[10px] text-slate-400">允许范围: 1 - 5000 次</span>
                            </div>
                            {contract.status === ContractStatus.NEGOTIATING ? (
                                <input 
                                    type="number" 
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-lg font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    defaultValue={contract.myPolicy.constraints.usageCount}
                                />
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-lg text-slate-600 font-medium">
                                    {contract.myPolicy.constraints.usageCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. Logs */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="text-green-500" size={20} />
                        4. 履约执行记录 (Execution Logs)
                        <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded ml-2">仅供审计查看</span>
                    </h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">证明ID (proofId)</th>
                                    <th className="px-6 py-4">合约标识 (contractId)</th>
                                    <th className="px-6 py-4">策略ID (strategyId)</th>
                                    <th className="px-6 py-4">日志信息 (log)</th>
                                    <th className="px-6 py-4">发送时间 (timestamp)</th>
                                    <th className="px-6 py-4">连接器签名 (signature)</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs text-slate-600 divide-y divide-slate-50">
                                {(contract.logs || []).map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono font-medium text-slate-700">{log.id}</td>
                                        <td className="px-6 py-4 font-mono text-slate-500 max-w-[150px] truncate" title={contract.id}>{contract.id}</td>
                                        <td className="px-6 py-4 font-mono text-slate-500">{log.policyId}</td>
                                        <td className="px-6 py-4 font-mono text-slate-500 truncate max-w-[200px]" title={log.context}>
                                            <div className="flex items-center gap-2">
                                                {log.result === 'ALLOWED' ? <CheckCircle2 size={12} className="text-green-500"/> : <Ban size={12} className="text-red-500"/>}
                                                {log.context}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono whitespace-nowrap">{log.timestamp}</td>
                                        <td className="px-6 py-4 font-mono text-slate-400 flex items-center gap-1">
                                            <Fingerprint size={12}/> {log.signature.substring(0, 10)}...
                                        </td>
                                    </tr>
                                ))}
                                {(!contract.logs || contract.logs.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">暂无执行记录</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Right Sidebar: History */}
            <div className="w-80 flex-shrink-0 sticky top-24">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <History size={18} className="text-slate-500"/> 协商历程
                    </h3>
                    <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                        {contract.history.map((item, index) => (
                           <div key={item.version} className="relative pl-4">
                              {/* Dot */}
                              <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                                  item.proposer === 'Me' ? 'bg-blue-500' : 'bg-slate-300'
                              }`}></div>
                              
                              <div className="flex justify-between items-start">
                                  <div>
                                      <div className="text-xs text-slate-500 mb-0.5">
                                          {item.proposer === 'Me' ? '我方' : '对方'}
                                      </div>
                                      <div className="text-sm font-medium text-slate-800 leading-snug">
                                          {item.comment}
                                      </div>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">V{item.version}</span>
                              </div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>
    );
  };

  // --- Main Render: List View ---
  if (view === 'detail' && selectedContract) {
    return <ContractDetailView contract={selectedContract} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
             <FileText className="text-gov-700" size={28} />
             数字合约管理
         </h2>
         <div className="flex gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="搜索合约号、产品..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gov-500 bg-white" 
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 bg-white text-slate-600">
               <Filter size={16} /> 筛选状态
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {contracts.map(contract => {
            const statusStyle = getStatusStyles(contract.status);
            const { provider, consumer } = getParties(contract);

            return (
               <div 
                  key={contract.id} 
                  onClick={() => handleContractClick(contract)}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full relative"
               >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-slate-800 group-hover:text-gov-700 transition-colors line-clamp-1 mr-2" title={contract.name}>
                        {contract.name}
                     </h3>
                     <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}>
                        <statusStyle.icon size={12}/> {statusStyle.label}
                     </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mb-4">{contract.id}</div>

                  {/* Info Block - Updated to show Provider/Consumer separately */}
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2 mb-4">
                     <div className="flex items-start gap-2">
                        <Database size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                           <div className="text-xs text-slate-400">数据产品</div>
                           <div className="text-sm font-medium text-slate-700 line-clamp-1">{contract.productName}</div>
                        </div>
                     </div>
                     <div className="flex items-start gap-2">
                        <Users size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                           <div className="text-xs text-slate-400">交易主体</div>
                           <div className="text-sm font-medium text-slate-700 line-clamp-1">
                                <span className="text-purple-700 font-bold">{provider}</span>
                                <span className="text-slate-400 mx-1">→</span>
                                <span className="text-blue-700 font-bold">{consumer}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                     {contract.description}
                  </p>

                  {/* Footer - Updated Style */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                     <div className="flex items-center gap-2">
                        {contract.role === 'Provider' ? (
                            <>
                                <Podcast size={14} className="text-purple-600" />
                                <span className="text-xs font-bold text-purple-700">Providing</span>
                            </>
                        ) : (
                            <>
                                <Download size={14} className="text-blue-600" />
                                <span className="text-xs font-bold text-blue-700">Consuming</span>
                            </>
                        )}
                     </div>
                     <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                           <Clock size={12} /> {contract.lastUpdated.split(' ')[0]}
                        </div>
                        <div className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                           v{contract.version}
                        </div>
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
    </div>
  );
};

export default Contracts;