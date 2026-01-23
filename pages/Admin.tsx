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
  AlertOctagon,
  Star,
  Shield,
  FileCode,
  Download,
  Link,
  Layers,
  Scale,
  Info,
  CheckSquare,
  XSquare,
  FileJson
} from 'lucide-react';
import { DataProduct, ProductStatus, SensitiveRisk } from '../types';

// --- Mock Data ---

const MOCK_PRODUCTS: DataProduct[] = [
  { 
    id: 'DP-NEW-001', 
    name: '城市地下管网GIS矢量数据集', 
    provider: '北京市规划和自然资源委员会', 
    industry: '公共管理', 
    description: '包含核心城区供水、排水、燃气、热力等7大类地下管线的三维空间分布数据。数据已进行坐标偏转处理，符合测绘安全要求。', 
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
  const [detailTab, setDetailTab] = useState<'info' | 'resource' | 'sample' | 'policy'>('info');

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
      setDetailTab('info');
    }
  };

  // --- Render Detail Tabs ---

  const renderProductInfoTab = (product: DataProduct) => (
    <div className="space-y-6">
       {/* 1. Basic Description */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-gov-700"/> 核心编目信息
             </h3>
             <div className="flex gap-2">
               {['GIS', '地下管网', '三维数据'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">#{tag}</span>
               ))}
             </div>
          </div>
          
          <div className="space-y-4">
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">产品名称</label>
                  <div className="text-lg font-bold text-slate-800">{product.name}</div>
              </div>
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">描述</label>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 leading-relaxed text-sm">
                      {product.description}
                  </div>
              </div>
          </div>
       </div>

       {/* 2. Attributes Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Classification & Source */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
             <h4 className="font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Layers size={18} className="text-slate-500" /> 分类与来源
             </h4>
             <div className="grid grid-cols-2 gap-y-6 gap-x-4 flex-1">
                <div>
                    <div className="text-xs text-slate-400 mb-1.5 font-medium">主题分类 (Theme)</div>
                    <div className="font-bold text-slate-800 text-sm flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded w-fit">
                      {product.themeCategory || 'N/A'}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1.5 font-medium">行业分类 (GB/T 4754)</div>
                    <div className="font-bold text-slate-800 text-sm bg-slate-50 px-2 py-1.5 rounded w-fit">{product.industry}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1.5 font-medium">数据来源类型</div>
                    <div className="font-medium text-slate-800 text-sm">Original (原始取得)</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1.5 font-medium">更新频率</div>
                    <div className="font-medium text-slate-800 text-sm">每日 (Daily)</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1.5 font-medium">产品代码</div>
                    <div className="font-mono font-medium text-slate-800 text-sm text-slate-500">882001</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1.5 font-medium">数据量</div>
                    <div className="font-medium text-slate-800 text-sm">2.4 GB</div>
                </div>
             </div>
          </div>

          {/* Right: Quality & Security */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
             <h4 className="font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck size={18} className="text-slate-500" /> 质量与安全等级
             </h4>
             <div className="space-y-6 flex-1">
                 {/* Quality */}
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">质量等级</span>
                        <div className="flex items-center gap-2">
                            <span className="text-amber-500 font-bold text-lg">A级</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                           <div className="bg-amber-500 h-2.5 rounded-full shadow-sm" style={{width: '90%'}}></div>
                        </div>
                        <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i<=4 ? "text-amber-500 fill-amber-500" : "text-slate-200"} />)}
                        </div>
                    </div>
                    <div className="mt-2 flex gap-4 text-xs text-slate-500">
                        <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">完整性 98.5%</span>
                        <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">准确性 99.2%</span>
                    </div>
                 </div>

                 {/* Security */}
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">安全分级 (1-5)</span>
                        <span className="text-blue-600 font-bold text-lg">L2</span>
                    </div>
                     <div className="relative pt-1">
                        <input 
                           type="range" 
                           min="1" max="5" 
                           value="2" 
                           readOnly 
                           className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-not-allowed accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                           <span>L1</span><span>L2</span><span>L3</span><span>L4</span><span>L5</span>
                        </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-100 text-xs text-blue-800 leading-snug">
                       <span className="font-bold">分级依据：</span> 包含部分地理位置信息，精度已模糊处理。符合《测绘地理信息管理条例》。
                    </div>
                 </div>
                 
                 {/* Compliance Check Link/Summary */}
                 <div className="pt-2 mt-auto">
                    <div className="flex items-center justify-between text-sm text-green-700 bg-green-50 px-3 py-2.5 rounded-lg border border-green-100">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          <span className="font-bold">合规性检查通过</span>
                       </div>
                       <span className="text-xs bg-white px-2 py-0.5 rounded border border-green-200">4 项指标</span>
                    </div>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderResourcesTab = (product: DataProduct) => {
    const resources = [
      { name: 'bj_pipelines_2024.shp', type: 'SHP File', status: 'NORMAL', owner: 'BJ-Gov-Node', lastVerified: '2024-05-22 10:00' },
      { name: 'API Gateway (North)', type: 'Connector', status: 'WARNING', owner: 'BJ-Gov-Node', lastVerified: '2024-05-22 10:25' }
    ];

    return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res, idx) => (
             <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-gov-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm">{res.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{res.type}</p>
                   </div>
                   {res.status === 'NORMAL' ? (
                      <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-200">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 正常
                      </span>
                   ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs font-bold border border-amber-200">
                         <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 延迟较高
                      </span>
                   )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                   <div className="flex items-center gap-1">
                      <Shield size={12} /> {res.owner}
                   </div>
                   <div className="font-mono">{res.lastVerified}</div>
                </div>
             </div>
          ))}
       </div>

       <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <Link className="text-blue-600 mt-1" size={20}/>
          <div>
             <h4 className="font-bold text-blue-900 text-sm">资源关联合理性检查</h4>
             <p className="text-xs text-blue-700 mt-1">系统已自动核验关联资源的连通性与权限配置。检测到 1 个物理文件资源和 1 个 API 接口资源，所有权均匹配。</p>
          </div>
       </div>
    </div>
    );
  };

  const renderSamplesTab = (product: DataProduct) => (
    <div className="space-y-6">
       {/* File Info */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                <FileJson size={24}/>
             </div>
             <div>
                <h4 className="font-bold text-slate-800 text-sm">sample_data_v1.json</h4>
                <p className="text-xs text-slate-500">128 KB • 上传于 2024-05-22</p>
             </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
             <Download size={16}/> 下载样本
          </button>
       </div>

       {/* Code Preview */}
       <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
             <span className="text-xs text-slate-400 font-mono">Preview (Top 10 Rows)</span>
             <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 size={12}/> Valid JSON</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">
{`[
  {
    "pipeline_id": "PL-100293",
    "geo_coordinates": { 
       "type": "Point", 
       "coordinates": [116.39***, 39.90***] 
    },
    "depth": 2.5,
    "material": "PE"
  },
  {
    "pipeline_id": "PL-100294",
    "geo_coordinates": { 
       "type": "Point", 
       "coordinates": [116.39***, 39.90***] 
    },
    "depth": 3.1,
    "material": "Cast Iron"
  }
  ...
]`}
          </pre>
       </div>

       {/* Desensitization Check */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Eye size={18} className="text-gov-700"/> 脱敏检查报告
          </h4>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="text-sm font-medium text-slate-700">geo_coordinates</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                   <span className="text-slate-500">处理算法: <span className="font-mono text-slate-800">Masking (Partial)</span></span>
                   <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 已通过</span>
                </div>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                   <span className="text-sm font-medium text-slate-700">pipeline_id</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                   <span className="text-slate-500">处理算法: <span className="font-mono text-slate-800">None</span></span>
                   <span className="text-slate-400 font-medium">无需脱敏</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderPolicyTab = (product: DataProduct) => (
    <div className="space-y-6">
       {/* Policy Basic Info */}
       <div className="flex gap-4">
          <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold mb-1">策略名称</div>
             <div className="font-bold text-slate-800">通用政务共享策略 v2</div>
          </div>
          <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold mb-1">优先级</div>
             <div className="font-bold text-gov-700">High (P1)</div>
          </div>
          <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold mb-1">状态</div>
             <div className="font-bold text-green-600">Active</div>
          </div>
       </div>

       {/* Constraints */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Lock size={18} className="text-slate-500"/> 权限与约束条件
          </h4>
          <div className="grid grid-cols-2 gap-6">
             <div className="border border-slate-200 rounded-lg p-4 relative">
                <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-slate-500">访问频次</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{product.usageConstraints?.maxCalls || '∞'}</div>
                <div className="text-xs text-slate-400">次 / 天</div>
             </div>
             <div className="border border-slate-200 rounded-lg p-4 relative">
                <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-slate-500">有效期</div>
                <div className="text-lg font-bold text-slate-800 mb-1">{product.usageConstraints?.expiryDate || '永久'}</div>
                <div className="text-xs text-green-600 font-medium">有效期内自动续约</div>
             </div>
             <div className="border border-slate-200 rounded-lg p-4 relative">
                <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-slate-500">地域限制</div>
                <div className="text-sm font-medium text-slate-800">{product.usageConstraints?.geoRestriction || '无限制'}</div>
                <div className="text-xs text-slate-400 mt-1">基于 IP 归属地判定</div>
             </div>
             <div className="border border-slate-200 rounded-lg p-4 relative bg-slate-50">
                <div className="absolute -top-3 left-3 bg-slate-50 px-2 text-xs font-bold text-slate-500">义务要求</div>
                <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
                   <li>数据使用后需在 24 小时内销毁缓存</li>
                   <li>禁止将数据用于商业营销分析</li>
                </ul>
             </div>
          </div>
       </div>

       {/* Rationality Assessment */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Scale size={18} className="text-slate-500"/> 策略合理性评估
          </h4>
          <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-100 rounded-lg">
             <CheckSquare className="text-green-600 mt-0.5" size={20}/>
             <div>
                <h5 className="font-bold text-green-800 text-sm">策略匹配度高</h5>
                <p className="text-xs text-green-700 mt-1">当前策略（通用政务共享）与产品分类（基础地理类）及安全等级（L2）相匹配。未发现过度授权或限制不足的风险。</p>
             </div>
          </div>
       </div>
    </div>
  );

  // --- Detail View Render ---
  const renderDetail = (product: DataProduct) => {
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-4 duration-300 absolute inset-0 z-20">
        {/* Detail Header */}
        <div className="bg-white px-6 pt-4 border-b border-slate-200 shadow-sm flex-shrink-0">
           <div className="flex items-center justify-between mb-4">
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

           {/* Tabs Navigation */}
           <div className="flex gap-6 -mb-px">
              {[
                { id: 'info', label: '产品信息 & 质量 (Info & Quality)' },
                { id: 'resource', label: '关联资源' },
                { id: 'sample', label: '样本数据' },
                { id: 'policy', label: '使用策略' }
              ].map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as any)}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                       detailTab === tab.id 
                       ? 'border-gov-700 text-gov-700' 
                       : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                 >
                    {tab.label}
                 </button>
              ))}
           </div>
        </div>

        {/* Detail Body (Tab Content) */}
        <div className="flex-1 overflow-y-auto p-6">
           <div className="max-w-5xl mx-auto">
              {detailTab === 'info' && renderProductInfoTab(product)}
              {detailTab === 'resource' && renderResourcesTab(product)}
              {detailTab === 'sample' && renderSamplesTab(product)}
              {detailTab === 'policy' && renderPolicyTab(product)}
           </div>
        </div>

        {/* Bottom Action Bar */}
        {product.status === 'PENDING' && (
           <div className="bg-white border-t border-slate-200 p-4 flex items-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
              <div className="flex-1 max-w-5xl mx-auto flex gap-4 w-full">
                 <input 
                    type="text" 
                    placeholder="输入审核意见 (驳回时必填)..." 
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 transition-all"
                    value={auditComment}
                    onChange={(e) => setAuditComment(e.target.value)}
                 />
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