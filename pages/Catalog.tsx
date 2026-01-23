import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Grid, 
  List, 
  Calendar, 
  FileText, 
  ArrowLeft, 
  Shield, 
  Activity, 
  Layers, 
  Briefcase, 
  Landmark, 
  Target, 
  Database,
  ShieldCheck,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Server,
  UserCheck,
  Building2,
  Lock,
  PauseCircle,
  Star,
  FileCode,
  Download,
  Link,
  Scale,
  Info,
  CheckSquare,
  FileJson,
  FileSignature,
  MessageSquare
} from 'lucide-react';
import { DataProduct } from '../types';

// --- Mock Data ---

const products: DataProduct[] = [
  { 
    id: 'DP-001', 
    name: '企业工商信用评分模型', 
    provider: '国家市监总局', 
    industry: '金融监管', 
    description: '基于全国企业信用信息公示系统数据，提供实时信用评分查询接口。', 
    publishDate: '2024-02-15',
    themeCategory: '企业信用',
    themeType: '评分数据',
    orgType: '政府部门',
    scenarioCategory: '金融服务',
    scenarioType: '信贷评估',
    pricing: '0.5元/次',
    usageConstraints: { maxCalls: '10000/天', expiryDate: '2025-12-31' },
    schema: [
        { name: 'ent_id', type: 'String', description: '企业唯一标识' },
        { name: 'credit_score', type: 'Integer', description: '信用评分 (0-100)' },
        { name: 'risk_level', type: 'Enum', description: '风险等级' },
        { name: 'update_time', type: 'DateTime', description: '更新时间' }
    ]
  },
  { 
    id: 'DP-002', 
    name: '重点区域电力消耗指数', 
    provider: '国家电网', 
    industry: '宏观经济', 
    description: '包含京津冀地区规上工业企业每日用电量指数，用于经济活力监测。', 
    publishDate: '2024-03-01',
    themeCategory: '能源数据', 
    themeType: '电力消耗', 
    orgType: '央企', 
    scenarioCategory: '经济监测', 
    scenarioType: '宏观分析',
    schema: [
        { name: 'region_code', type: 'String', description: '区域代码' },
        { name: 'power_usage_index', type: 'Float', description: '用电指数' },
        { name: 'industry_type', type: 'String', description: '工业类型' },
        { name: 'date', type: 'Date', description: '统计日期' }
    ]
  },
  { id: 'DP-003', name: '医保药品结算清单脱敏数据', provider: '北京市医保局', industry: '医疗卫生', description: '已完成K-anonymity脱敏处理，仅限科研机构申请使用。', publishDate: '2024-01-20', themeCategory: '医疗健康', themeType: '医保结算', orgType: '政府部门' },
  { id: 'DP-004', name: '道路货运车辆轨迹热力图', provider: '交通运输部', industry: '交通物流', description: '基于北斗车载终端数据，生成全国高速公路货运密度热力图。', publishDate: '2024-03-10', themeCategory: '交通运输', themeType: '车辆轨迹', orgType: '政府部门' },
  { id: 'DP-005', name: '环境空气质量实时监测数据', provider: '生态环境部', industry: '生态环保', description: '全国300+城市空气质量监测站点实时PM2.5、PM10数据。', publishDate: '2024-03-12', themeCategory: '生态环境', themeType: '空气质量', orgType: '政府部门' },
  { id: 'DP-006', name: '公共交通刷卡出行数据集', provider: '公交集团', industry: '交通物流', description: '脱敏后的公交IC卡刷卡记录，包含上下车站点及时间信息。', publishDate: '2024-02-28', themeCategory: '交通运输', themeType: '公共出行', orgType: '企业单位' },
];

// --- Sub-Components ---

// 1. Identity Popover (Provider Info) - Copied from Admin for consistency
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

// 2. Catalog Detail View
const CatalogProductDetail = ({ product, onBack }: { product: DataProduct, onBack: () => void }) => {
  const [detailTab, setDetailTab] = useState<'info' | 'resource' | 'sample' | 'policy'>('info');
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  // --- Render Tabs (Consistent with Admin) ---

  const renderProductInfoTab = (product: DataProduct) => (
    <div className="space-y-6">
       {/* 1. Basic Description */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-gov-700"/> 核心编目信息
             </h3>
             <div className="flex gap-2">
               {['API服务', '高价值数据', '实时更新'].map(tag => (
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
                    <div className="text-xs text-slate-400 mb-1.5 font-medium">应用场景</div>
                    <div className="font-medium text-slate-800 text-sm">{product.scenarioCategory || '通用'}</div>
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
                       <span className="font-bold">分级依据：</span> 包含部分行业敏感信息，精度已脱敏处理。符合《数据安全法》相关要求。
                    </div>
                 </div>
                 
                 {/* Compliance Check Link/Summary */}
                 <div className="pt-2 mt-auto">
                    <div className="flex items-center justify-between text-sm text-green-700 bg-green-50 px-3 py-2.5 rounded-lg border border-green-100">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          <span className="font-bold">合规性检查通过</span>
                       </div>
                       <span className="text-xs bg-white px-2 py-0.5 rounded border border-green-200">已存证</span>
                    </div>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderResourcesTab = (product: DataProduct) => {
    const resources = [
        { name: `${product.id}_dataset.csv`, type: 'CSV File', status: 'NORMAL', owner: 'System Node', lastVerified: '2024-05-22' },
        { name: 'API Gateway (Read-Only)', type: 'Connector', status: 'NORMAL', owner: 'System Node', lastVerified: '2024-05-22' }
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
             <h4 className="font-bold text-blue-900 text-sm">资源可访问性说明</h4>
             <p className="text-xs text-blue-700 mt-1">您当前具有该数据产品的元数据查看权限。如需获取实体数据资源，请发起合约协商。</p>
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
                <p className="text-xs text-slate-500">128 KB • 上传于 {product.publishDate}</p>
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
    "id": "REC-001",
    "value": 45.2,
    "status": "NORMAL",
    "timestamp": "2024-05-20T10:00:00Z"
  },
  {
    "id": "REC-002",
    "value": 48.1,
    "status": "NORMAL",
    "timestamp": "2024-05-20T10:05:00Z"
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
                   <span className="text-sm font-medium text-slate-700">Sensitive Fields</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                   <span className="text-slate-500">处理算法: <span className="font-mono text-slate-800">K-Anonymity</span></span>
                   <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 已通过</span>
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
             <div className="font-bold text-slate-800">通用数据流通策略 v1</div>
          </div>
          <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold mb-1">定价模式</div>
             <div className="font-bold text-gov-700">{product.pricing || '免费共享'}</div>
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
    </div>
  );

  return (
      <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-4 duration-300 absolute inset-0 z-20">
        {/* Detail Header */}
        <div className="bg-white px-6 pt-4 border-b border-slate-200 shadow-sm flex-shrink-0">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded text-slate-500">
                    <ArrowLeft size={20} />
                 </button>
                 <div>
                    <h2 className="font-bold text-slate-800 text-lg">{product.name}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                       ID: {product.id} 
                       <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">{product.version || 'v1.0.0'}</span>
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

        {/* Bottom Action Bar (Negotiation Actions) */}
        <div className="bg-white border-t border-slate-200 p-4 flex items-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
           <div className="flex-1 max-w-5xl mx-auto flex justify-end gap-4 w-full">
               <button className="px-4 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
                  <MessageSquare size={18} /> 咨询服务
               </button>
               <button className="px-6 py-2.5 bg-gov-700 text-white font-bold rounded-lg hover:bg-gov-800 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-colors">
                  <FileSignature size={18} /> 发起合约协商
               </button>
           </div>
        </div>
        
        {/* Identity Modal Portal */}
        <IdentityModal isOpen={showIdentityModal} onClose={() => setShowIdentityModal(false)} providerName={product.provider} />
      </div>
  )
}

const Catalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<DataProduct | null>(null);

  if (selectedProduct) {
     return <CatalogProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="flex h-full gap-6 relative">
      {/* Sidebar Filters */}
      <div className="w-64 flex-shrink-0 space-y-6">
         <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold">
               <Filter size={18} /> 筛选 (Filters)
            </div>
            
            <div className="space-y-8">
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">所属行业</h4>
                  <div className="space-y-3">
                     {['全部', '金融监管', '医疗卫生', '交通物流', '宏观经济', '生态环保', '公共管理'].map(i => (
                        <label key={i} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-gov-700 transition-colors">
                           <input type="checkbox" className="rounded text-gov-700 focus:ring-gov-500 border-slate-300 w-4 h-4" />
                           {i}
                        </label>
                     ))}
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">数据格式</h4>
                  <div className="space-y-3">
                     {['JSON API', 'CSV / Excel', 'GeoJSON', 'Binary Stream'].map(i => (
                        <label key={i} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-gov-700 transition-colors">
                           <input type="checkbox" className="rounded text-gov-700 focus:ring-gov-500 border-slate-300 w-4 h-4" />
                           {i}
                        </label>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6">
         {/* Toolbar */}
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div className="relative w-96">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
               <input type="text" placeholder="在目录中搜索..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-gov-500 focus:ring-1 focus:ring-gov-500 transition-all focus:bg-white" />
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
               <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-gov-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  title="List View"
               >
                  <List size={18}/>
               </button>
               <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-gov-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Grid View"
               >
                  <Grid size={18}/>
               </button>
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto min-h-0">
             {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-6">
                   {products.map(p => (
                      <div 
                         key={p.id} 
                         onClick={() => setSelectedProduct(p)}
                         className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-gov-300 transition-all p-5 flex flex-col h-full group cursor-pointer relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:from-gov-50 transition-colors"></div>
                         
                         <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-bold shadow-sm group-hover:bg-gov-50 group-hover:text-gov-600 group-hover:border-gov-100 transition-all">
                               <FileText size={20} />
                            </div>
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                               p.industry === '金融监管' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                               p.industry === '宏观经济' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                               p.industry === '生态环保' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                               'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                               {p.industry}
                            </span>
                         </div>
                         
                         <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-gov-700 transition-colors pr-4">{p.name}</h3>
                         <p className="text-slate-500 text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">{p.description}</p>
                         
                         <div className="flex flex-wrap gap-2 mb-5">
                            <span className="text-[10px] font-medium bg-slate-50 px-2 py-1 rounded text-slate-500 border border-slate-200">HTTP API</span>
                            <span className="text-[10px] font-medium bg-slate-50 px-2 py-1 rounded text-slate-500 border border-slate-200">JSON</span>
                         </div>

                         <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                               <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                                  {p.provider.substring(0,1)}
                               </div>
                               <span className="font-medium text-slate-700 truncate max-w-[100px]" title={p.provider}>{p.provider}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                               <Calendar size={12}/> {p.publishDate}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                          <tr>
                             <th className="px-6 py-4 font-semibold">产品名称 / 描述</th>
                             <th className="px-6 py-4 font-semibold">提供方</th>
                             <th className="px-6 py-4 font-semibold">行业</th>
                             <th className="px-6 py-4 font-semibold">发布日期</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 text-sm">
                          {products.map(p => (
                             <tr 
                                key={p.id} 
                                onClick={() => setSelectedProduct(p)}
                                className="hover:bg-slate-50 group cursor-pointer transition-colors"
                             >
                                <td className="px-6 py-4">
                                   <div className="font-bold text-slate-800 text-base mb-1 group-hover:text-gov-700">{p.name}</div>
                                   <p className="text-slate-500 text-xs line-clamp-1 max-w-md">{p.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                         {p.provider.substring(0,1)}
                                      </div>
                                      <span className="text-slate-700 font-medium">{p.provider}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                     p.industry === '金融监管' ? 'bg-indigo-50 text-indigo-700' :
                                     p.industry === '宏观经济' ? 'bg-orange-50 text-orange-700' :
                                     'bg-blue-50 text-blue-700'
                                   }`}>
                                     {p.industry}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                   <div className="flex items-center gap-2">
                                      <Calendar size={14} className="text-slate-400"/>
                                      <span>{p.publishDate}</span>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default Catalog;