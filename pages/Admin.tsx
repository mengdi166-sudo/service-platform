import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Filter, 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Server, 
  Database, 
  ArrowLeft,
  ChevronRight,
  UserCheck,
  Building2,
  Lock,
  PauseCircle,
  AlertOctagon
} from 'lucide-react';
import { DataProduct, ProductStatus, SensitiveRisk } from '../types';

// --- Mock Data ---

const MOCK_PRODUCTS: DataProduct[] = [
  { 
    id: 'DP-NEW-001', 
    name: '城市地下管网GIS矢量数据集', 
    provider: '北京市规划和自然资源委员会', 
    industry: '公共管理', 
    description: '包含核心城区供水、排水、燃气、热力等7大类地下管线的三维空间分布数据。', 
    publishDate: '2024-05-22 10:30',
    status: 'PENDING',
    version: 'v1.0.2',
    connectorId: 'CONN-BJ-001',
    themeCategory: '基础地理类',
    themeType: '测绘数据',
    usageConstraints: {
      maxCalls: '5,000次/日',
      expiryDate: '2025-12-31',
      geoRestriction: '仅限政务内网IP访问'
    },
    schema: [
      { name: 'pipeline_id', type: 'String', description: '管线唯一标识' },
      { name: 'geo_coordinates', type: 'GeoJSON', description: '精确经纬度坐标', sensitive: true },
      { name: 'depth', type: 'Float', description: '埋深(米)' },
      { name: 'material', type: 'String', description: '材质' }
    ],
    pricing: '政府部门免费共享'
  },
  { 
    id: 'DP-NEW-002', 
    name: '新能源汽车充电桩实时状态流', 
    provider: '特来电', 
    industry: '交通物流', 
    description: '全网充电桩实时占用率、故障状态及排队等待时长数据流，每5分钟更新一次。', 
    publishDate: '2024-05-23 09:15',
    status: 'PENDING',
    version: 'v2.1.0',
    connectorId: 'CONN-TLD-099',
    usageConstraints: {
      maxCalls: '无限制',
      expiryDate: '长期有效',
    },
    schema: [
      { name: 'station_id', type: 'String', description: '站点ID' },
      { name: 'status', type: 'Enum', description: '占用/空闲/故障' },
      { name: 'current_wait_time', type: 'Int', description: '预估等待时间(分)' }
    ],
    pricing: '0.1元/次调用'
  },
  { 
    id: 'DP-HIS-001', 
    name: '跨境电商进出口商品归类样本库', 
    provider: '海关总署', 
    industry: '商贸流通', 
    description: '用于训练AI自动归类模型的历史报关单脱敏样本。', 
    publishDate: '2024-05-21 14:20',
    status: 'REJECTED',
    auditFeedback: '样本数据中部分字段未完全脱敏，存在泄露企业商业秘密风险。',
    version: 'v1.0.0'
  },
   { 
    id: 'DP-HIS-002', 
    name: '重点区域电力消耗指数', 
    provider: '国家电网', 
    industry: '宏观经济', 
    description: '包含京津冀地区规上工业企业每日用电量指数。', 
    publishDate: '2024-05-20 09:00',
    status: 'PUBLISHED',
    version: 'v3.0.0'
  }
];

// --- Sub-Components ---

// 1. Identity Popover (Provider Info)
const IdentityModal = ({ isOpen, onClose, providerName }: { isOpen: boolean, onClose: () => void, providerName: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-gov-700" size={20} />
            主体身份核验
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                 <Building2 size={32} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-slate-900">{providerName}</h2>
                 <p className="text-slate-500 text-sm">统一社会信用代码: 11110000MB16685822</p>
                 <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">已实名认证</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">DID: cn:bj:gov:123456</span>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                 <div className="text-xs text-slate-400 mb-1">电子营业执照</div>
                 <div className="flex items-center gap-2 text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                    <FileText size={14} /> license_2024.pdf
                 </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                 <div className="text-xs text-slate-400 mb-1">法人授权书</div>
                 <div className="flex items-center gap-2 text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                    <FileText size={14} /> auth_letter_signed.pdf
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3 text-sm text-amber-800">
              <AlertTriangle size={16} className="shrink-0 mt-0.5"/>
              <p>该主体信用评级为 AA 级，近一年无违规记录。</p>
           </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-right">
           <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300">关闭</button>
        </div>
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'PUBLISHED' | 'REJECTED'>('PENDING');
  const [selectedProduct, setSelectedProduct] = useState<DataProduct | null>(null);
  const [auditQueue, setAuditQueue] = useState<DataProduct[]>(MOCK_PRODUCTS);
  const [auditComment, setAuditComment] = useState('');
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  // Filter List
  const displayList = auditQueue.filter(p => p.status === activeTab);

  // Actions
  const handleAction = (id: string, action: 'PUBLISHED' | 'REJECTED' | 'SUSPENDED') => {
    if (action === 'REJECTED' && !auditComment.trim()) {
      alert('驳回时必须填写审核意见');
      return;
    }
    
    if (confirm(`确定要${action === 'PUBLISHED' ? '通过' : action === 'REJECTED' ? '驳回' : '挂起'}该产品吗？`)) {
      setAuditQueue(prev => prev.map(p => 
        p.id === id ? { ...p, status: action, auditFeedback: auditComment } : p
      ));
      setSelectedProduct(null);
      setAuditComment('');
      // Show Toast (Mock)
      // alert(`Audit ${action} Successful`);
    }
  };

  // --- Detail View Render ---
  const renderDetail = (product: DataProduct) => {
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-4 duration-300 absolute inset-0 z-20">
        {/* Detail Header */}
        <div className="bg-white px-6 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-3">
              <button onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-slate-100 rounded text-slate-500">
                 <ArrowLeft size={20} />
              </button>
              <div>
                 <h2 className="font-bold text-slate-800 text-lg">{product.name}</h2>
                 <p className="text-xs text-slate-500 flex items-center gap-2">
                    ID: {product.id} 
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">{product.version}</span>
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div 
                 className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                 onClick={() => setShowIdentityModal(true)}
              >
                 <UserCheck size={16} />
                 <span className="text-sm font-medium">{product.provider}</span>
              </div>
           </div>
        </div>

        {/* Detail Body (Split View) */}
        <div className="flex-1 overflow-hidden flex">
           {/* Left: Metadata */}
           <div className="w-2/3 p-6 overflow-y-auto space-y-6 border-r border-slate-200 bg-white">
              {/* Basic Info Card */}
              <div className="space-y-4">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <FileText size={18} className="text-gov-700" /> 基础元数据
                 </h3>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="mb-4">
                       <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">产品描述</label>
                       <p className="text-slate-700 leading-relaxed">{product.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div><span className="text-slate-400">行业分类:</span> <span className="text-slate-800 font-medium">{product.industry}</span></div>
                       <div><span className="text-slate-400">主题分类:</span> <span className="text-slate-800 font-medium">{product.themeCategory} / {product.themeType}</span></div>
                       <div><span className="text-slate-400">提交时间:</span> <span className="text-slate-800 font-medium">{product.publishDate}</span></div>
                       <div><span className="text-slate-400">溯源连接器:</span> <span className="text-slate-800 font-mono">{product.connectorId}</span></div>
                    </div>
                 </div>
              </div>

              {/* Schema Table */}
              <div className="space-y-4">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Database size={18} className="text-gov-700" /> 数据结构 (Schema)
                 </h3>
                 <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                          <tr>
                             <th className="px-4 py-2">字段名</th>
                             <th className="px-4 py-2">类型</th>
                             <th className="px-4 py-2">描述</th>
                             <th className="px-4 py-2">敏感属性</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {product.schema?.map((field, idx) => (
                             <tr key={idx}>
                                <td className="px-4 py-2 font-mono text-slate-700">{field.name}</td>
                                <td className="px-4 py-2 text-slate-500">{field.type}</td>
                                <td className="px-4 py-2 text-slate-600">{field.description}</td>
                                <td className="px-4 py-2">
                                   {field.sensitive && (
                                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200">Sensitive</span>
                                   )}
                                </td>
                             </tr>
                          ))}
                          {!product.schema && <tr><td colSpan={4} className="px-4 py-2 text-center text-slate-400">暂无结构信息</td></tr>}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Right: Policy & Risks */}
           <div className="w-1/3 bg-slate-50 p-6 overflow-y-auto space-y-6">
              {/* Constraints */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                 <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Lock size={16} className="text-slate-400" /> 使用控制策略
                 </h4>
                 <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                       <span className="text-slate-500">最大调用量</span>
                       <span className="font-medium text-slate-800">{product.usageConstraints?.maxCalls || '-'}</span>
                    </li>
                    <li className="flex justify-between">
                       <span className="text-slate-500">有效期至</span>
                       <span className="font-medium text-slate-800">{product.usageConstraints?.expiryDate || '-'}</span>
                    </li>
                    <li className="flex justify-between">
                       <span className="text-slate-500">地域限制</span>
                       <span className="font-medium text-slate-800 text-right max-w-[150px]">{product.usageConstraints?.geoRestriction || '无'}</span>
                    </li>
                 </ul>
              </div>

               {/* Pricing */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                 <h4 className="font-bold text-slate-800 mb-2">定价策略</h4>
                 <p className="text-2xl font-bold text-gov-700">{product.pricing || '免费'}</p>
              </div>
           </div>
        </div>

        {/* Bottom Action Bar */}
        {product.status === 'PENDING' && (
           <div className="bg-white border-t border-slate-200 p-4 flex items-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
              <div className="flex-1">
                 <input 
                    type="text" 
                    placeholder="输入审核意见 (驳回时必填)..." 
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 transition-all"
                    value={auditComment}
                    onChange={(e) => setAuditComment(e.target.value)}
                 />
              </div>
              <div className="flex gap-2">
                 <button 
                    onClick={() => handleAction(product.id, 'SUSPENDED')}
                    className="px-4 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors"
                 >
                    <PauseCircle size={18} /> 挂起
                 </button>
                 <button 
                    onClick={() => handleAction(product.id, 'REJECTED')}
                    className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 font-medium rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors"
                 >
                    <XCircle size={18} /> 驳回
                 </button>
                 <button 
                    onClick={() => handleAction(product.id, 'PUBLISHED')}
                    className="px-6 py-2.5 bg-gov-700 text-white font-bold rounded-lg hover:bg-gov-800 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-colors"
                 >
                    <CheckCircle2 size={18} /> 通过发布
                 </button>
              </div>
           </div>
        )}
        
        {/* Identity Modal Portal */}
        <IdentityModal isOpen={showIdentityModal} onClose={() => setShowIdentityModal(false)} providerName={product.provider} />
      </div>
    );
  };

  // --- List View Render ---
  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-300 relative">
      {/* If detail is selected, show detail view overlaying the list (or replacing it depending on pref) */}
      {selectedProduct && renderDetail(selectedProduct)}

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
               <ShieldCheck className="text-gov-700" size={28} />
               数据产品审核中心
            </h2>
            <div className="flex gap-2">
               <span className="text-sm text-slate-500 self-center mr-2">今日待办: <b className="text-amber-600">{auditQueue.filter(p=>p.status==='PENDING').length}</b></span>
            </div>
         </div>

         {/* Filter Bar */}
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
             <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                 {/* Tabs */}
                 <div className="flex p-1 bg-slate-100 rounded-lg">
                    {(['PENDING', 'PUBLISHED', 'REJECTED'] as const).map((status) => (
                       <button
                          key={status}
                          onClick={() => setActiveTab(status)}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                             activeTab === status 
                             ? 'bg-white text-gov-700 shadow-sm' 
                             : 'text-slate-500 hover:text-slate-700'
                          }`}
                       >
                          {status === 'PENDING' ? '待审核' : status === 'PUBLISHED' ? '已通过' : '已驳回'}
                       </button>
                    ))}
                 </div>
                 
                 {/* Search */}
                 <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                       type="text" 
                       placeholder="搜索产品名称、提供方..." 
                       className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-gov-500 focus:ring-1 focus:ring-gov-500" 
                    />
                 </div>
             </div>
             
             {/* Advanced Filters */}
             <div className="flex gap-4">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 bg-white">
                   <Filter size={14} /> 行业分类
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 bg-white">
                   <AlertTriangle size={14} /> 风险等级
                </button>
             </div>
         </div>

         {/* Table */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0 z-10 shadow-sm">
                   <tr>
                      <th className="px-6 py-4 font-semibold">产品信息</th>
                      <th className="px-6 py-4 font-semibold">提供方</th>
                      <th className="px-6 py-4 font-semibold">行业 / 分类</th>
                      <th className="px-6 py-4 font-semibold">提交时间</th>
                      <th className="px-6 py-4 font-semibold text-right">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                   {displayList.length === 0 ? (
                      <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            没有{activeTab === 'PENDING' ? '待审核' : '符合条件'}的记录
                         </td>
                      </tr>
                   ) : (
                      displayList.map(product => (
                         <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                               <div 
                                  className="font-bold text-slate-800 group-hover:text-gov-700 cursor-pointer"
                                  onClick={() => setSelectedProduct(product)}
                               >
                                  {product.name}
                               </div>
                               <div className="text-xs text-slate-400 mt-1">{product.id} • {product.version}</div>
                            </td>
                            <td className="px-6 py-4">
                               <div 
                                 className="flex items-center gap-2 cursor-pointer hover:underline decoration-slate-400 underline-offset-2"
                                 onClick={() => { setSelectedProduct(product); setTimeout(() => setShowIdentityModal(true), 100); }}
                               >
                                  <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                     {product.provider.substring(0,1)}
                                  </div>
                                  <span className="text-slate-700 font-medium">{product.provider}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs mb-1 mr-1">
                                 {product.industry}
                               </span>
                               <div className="text-xs text-slate-400">{product.themeType}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                               <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-slate-400"/>
                                  {product.publishDate}
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => setSelectedProduct(product)}
                                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 text-xs font-medium transition-colors"
                                  >
                                    详情
                                  </button>
                                  {product.status === 'PENDING' && (
                                     <button 
                                       onClick={() => handleAction(product.id, 'PUBLISHED')}
                                       className="px-3 py-1.5 bg-gov-700 text-white rounded hover:bg-gov-800 text-xs font-bold shadow-sm transition-colors"
                                     >
                                       快速通过
                                     </button>
                                  )}
                               </div>
                            </td>
                         </tr>
                      ))
                   )}
                </tbody>
              </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Admin;