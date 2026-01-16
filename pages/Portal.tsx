import React, { useState } from 'react';
import { Lock, Users, Database, ArrowRight, CheckCircle2, Circle, Search, Filter, FileText, Shield, Activity, ArrowLeft, Layers, Landmark, Briefcase, Target } from 'lucide-react';
import { Space, SpaceType, DataProduct } from '../types';

// Mock Data: Spaces
const spaces: Space[] = [
  { id: '1', name: '京津冀医疗健康数据专区', type: SpaceType.PUBLIC, industry: '医疗卫生', members: 142, dataCount: 3500, isJoined: true },
  { id: '2', name: '国家气象科学共享空间', type: SpaceType.PUBLIC, industry: '气象科研', members: 89, dataCount: 1200, isJoined: false },
  { id: '3', name: '金融风险联防联控空间', type: SpaceType.RESTRICTED, industry: '金融监管', members: 24, dataCount: 8500, isJoined: false },
  { id: '4', name: '智慧交通车路协同试验区', type: SpaceType.RESTRICTED, industry: '交通运输', members: 56, dataCount: 4100, isJoined: false },
];

// Mock Data: Products for Space Detail with Classification info
const spaceProducts: DataProduct[] = [
  { 
    id: 'SP-001', 
    name: '京津冀呼吸道传染病监测数据', 
    provider: '北京市疾控中心', 
    industry: '卫生和社会工作', 
    description: '包含近三年流感、支原体等呼吸道传染病的发病率、就诊趋势及区域分布热力图数据。', 
    publishDate: '2024-03-20',
    themeCategory: '社会民生类',
    themeType: '医疗卫生数据',
    orgType: '政府部门',
    scenarioCategory: '安全应急',
    scenarioType: '公共安全'
  },
  { 
    id: 'SP-002', 
    name: '三甲医院门诊处方流转数据集', 
    provider: '朝阳医院', 
    industry: '卫生和社会工作', 
    description: '脱敏后的门诊处方数据，包含药品名称、剂量、诊断编码等，用于药物依从性分析。', 
    publishDate: '2024-03-18',
    themeCategory: '社会民生类',
    themeType: '医疗卫生数据',
    orgType: '事业单位',
    scenarioCategory: '民生服务',
    scenarioType: '医疗健康'
  },
  { 
    id: 'SP-003', 
    name: '区域医保基金结算清单样本', 
    provider: '北京市医保局', 
    industry: '公共管理、社会保障和社会组织', 
    description: '按月度汇总的医保结算清单样本数据，支持DRG/DIP支付方式改革研究。', 
    publishDate: '2024-03-15',
    themeCategory: '社会民生类',
    themeType: '社会保障数据',
    orgType: '政府部门',
    scenarioCategory: '政府治理',
    scenarioType: '公共管理'
  },
  { 
    id: 'SP-004', 
    name: '社区卫生服务中心资源配置表', 
    provider: '卫健委', 
    industry: '卫生和社会工作', 
    description: '全市社区卫生服务中心的人员配置、设备设施及服务覆盖范围统计。', 
    publishDate: '2024-03-10',
    themeCategory: '社会民生类',
    themeType: '医疗卫生数据',
    orgType: '政府部门',
    scenarioCategory: '民生服务',
    scenarioType: '医疗健康'
  },
  { 
    id: 'SP-005', 
    name: '突发公共卫生事件应急资源库', 
    provider: '应急管理局', 
    industry: '公共管理、社会保障和社会组织', 
    description: '应急物资储备、救援队伍分布及定点收治医院床位动态数据。', 
    publishDate: '2024-03-01',
    themeCategory: '政务服务类',
    themeType: '应急管理数据',
    orgType: '政府部门',
    scenarioCategory: '安全应急',
    scenarioType: '公共安全'
  },
  { 
    id: 'SP-006', 
    name: '互联网医院在线问诊行为日志', 
    provider: '好大夫在线', 
    industry: '信息传输、软件和信息技术服务业', 
    description: '基于真实问诊场景的脱敏对话日志与用户行为轨迹数据，用于AI辅诊模型训练。', 
    publishDate: '2024-02-28',
    themeCategory: '行业资源类',
    themeType: '工业和信息化数据',
    orgType: '企业单位',
    scenarioCategory: '产业发展',
    scenarioType: '科技创新'
  },
];

// --- Sub-Components ---

// 1. Space Directory (Home View)
const SpaceDirectory = ({ onEnterSpace }: { onEnterSpace: (id: string) => void }) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Onboarding Wizard */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-gov-700 rounded-full"></span>
          入驻引导 (Onboarding)
        </h3>
        <div className="relative flex items-center justify-between px-10">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
          
          {[
            { label: '发现空间', status: 'completed' },
            { label: '主体注册', status: 'completed' },
            { label: '部署连接器', status: 'active' },
            { label: '申请准入', status: 'pending' },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white px-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step.status === 'completed' ? 'bg-green-50 border-green-500 text-green-600' :
                step.status === 'active' ? 'bg-gov-50 border-gov-500 text-gov-600' :
                'bg-slate-50 border-slate-300 text-slate-300'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 size={20} /> : <Circle size={20} className={step.status === 'active' ? 'fill-current' : ''} />}
              </div>
              <span className={`mt-2 text-sm font-medium ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-700'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">空间黄页 (Space Directory)</h2>
        <button className="text-gov-700 text-sm font-medium hover:underline">查看全部空间 &rarr;</button>
      </div>

      {/* Space Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {spaces.map((space) => (
          <div key={space.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col">
            {space.type === SpaceType.RESTRICTED && (
              <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                <Lock size={12} /> 仅限邀请
              </div>
            )}
            
            <div className="mb-4">
               <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-3 ${
                 space.industry === '医疗卫生' ? 'bg-rose-50 text-rose-700' : 
                 space.industry === '金融监管' ? 'bg-indigo-50 text-indigo-700' : 
                 'bg-blue-50 text-blue-700'
               }`}>
                 {space.industry}
               </span>
               <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-gov-700 transition-colors">
                 {space.name}
               </h3>
               <p className="text-xs text-slate-400">ID: SPACE-{space.id.padStart(4, '0')}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 mb-6 mt-auto">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{space.members}</span>
              </div>
              <div className="flex items-center gap-1">
                <Database size={16} />
                <span>{space.dataCount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if(space.isJoined) onEnterSpace(space.id);
              }}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              space.isJoined 
                ? 'bg-gov-50 text-gov-700 border border-gov-200 hover:bg-gov-100'
                : space.type === SpaceType.RESTRICTED 
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                  : 'bg-gov-700 text-white hover:bg-gov-800'
            }`}>
              {space.isJoined ? '进入空间' : space.type === SpaceType.RESTRICTED ? '申请咨询' : '立即加入'}
              {!space.isJoined && <ArrowRight size={16} />}
            </button>
          </div>
        ))}
      </div>

      {/* Global Catalog Preview */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6">空间数据产品目录</h2>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
           {[1, 2, 3].map((i) => (
             <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0">
                    <img src={`https://picsum.photos/100/100?random=${i}`} alt="Product" className="w-full h-full object-cover rounded-lg mix-blend-multiply" />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800">北京市实时路况拥堵指数数据集 (2024-Q3)</h4>
                   <p className="text-xs text-slate-500 mt-1">提供方: 北京市交通委员会 • 更新于: 2小时前</p>
                 </div>
               </div>
               <div className="text-right">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">
                     API 调用次数: 无限
                  </span>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// 2. Space Detail View
const SpaceDetail = ({ spaceId, onBack, onSelectProduct }: { spaceId: string, onBack: () => void, onSelectProduct: (product: DataProduct) => void }) => {
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return <div>Space not found</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in zoom-in duration-300">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <button className="flex items-center gap-1 hover:text-gov-700 transition-colors" onClick={onBack}>
          <ArrowLeft size={16} />
          空间黄页
        </button>
        <span>/</span>
        <span className="font-bold text-slate-800">{space.name}</span>
      </div>
      
      {/* Space Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gov-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="relative z-10">
            <div className="flex items-start justify-between">
                <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                         space.industry === '医疗卫生' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {space.industry}
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{space.name}</h1>
                    <p className="text-slate-500 max-w-2xl">
                        本空间汇聚{space.industry}领域的高价值数据资源，致力于推动跨机构数据安全共享与协同计算。
                        当前包含 {space.dataCount} 个数据集，服务 {space.members} 个成员机构。
                    </p>
                </div>
                <div className="text-right space-y-2">
                    <div className="text-sm text-slate-500">空间 ID</div>
                    <div className="font-mono font-bold text-slate-800">SPACE-{space.id.padStart(4, '0')}</div>
                </div>
            </div>
            {/* Stats */}
            <div className="flex gap-8 mt-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Database size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-800">{space.dataCount}</div>
                        <div className="text-xs text-slate-500">数据产品</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Users size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-800">{space.members}</div>
                        <div className="text-xs text-slate-500">参与成员</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Catalog Section */}
      <div>
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Database size={20} className="text-gov-700"/>
                空间数据目录
            </h2>
            <div className="flex gap-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="在空间内搜索..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gov-500 bg-white" />
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 bg-white text-slate-600">
                    <Filter size={16} /> 筛选
                 </button>
            </div>
         </div>

         {/* Product Grid (Cards) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {spaceProducts.map(product => (
                 <div key={product.id} 
                      onClick={() => onSelectProduct(product)}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-gov-300 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-10 -mt-10 z-0 group-hover:bg-gov-50 transition-colors"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-gov-50 group-hover:text-gov-600 transition-colors shadow-sm border border-slate-50">
                                <FileText size={24} />
                            </div>
                            <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded border border-slate-100">API 服务</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-gov-700 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">
                            {product.description}
                        </p>
                        <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Shield size={12} className="text-green-500" />
                                <span className="font-medium">{product.provider}</span>
                            </div>
                            <div>{product.publishDate}</div>
                        </div>
                    </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};

// 3. Product Detail View
const ProductDetail = ({ product, onBack }: { product: DataProduct, onBack: () => void }) => {
    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <button className="flex items-center gap-1 hover:text-gov-700 transition-colors" onClick={onBack}>
                   <ArrowLeft size={16} />
                   返回目录
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">产品详情</span>
            </div>

            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-24 h-24 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 border border-slate-200">
                        <FileText size={48} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-3">{product.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-100">
                                        <Shield size={14} className="text-green-500"/> {product.provider}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-100">
                                        <Activity size={14} className="text-blue-500"/> 每日更新
                                    </span>
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 text-xs font-bold">
                                        {product.industry}
                                    </span>
                                </div>
                            </div>
                            <button className="px-6 py-2.5 bg-gov-700 text-white rounded-lg font-medium hover:bg-gov-800 transition-colors shadow-sm shadow-blue-200">
                                申请访问
                            </button>
                        </div>
                        <p className="mt-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                            {product.description} 本数据产品经过严格脱敏处理，符合国家数据安全标准。支持通过 RESTful API 进行实时查询，适用于{product.industry}领域的科研分析与业务协同。
                        </p>
                    </div>
                </div>
            </div>

            {/* Classification Dimensions - NEW SECTION */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layers size={18} className="text-gov-700"/>
                        数据资产维度
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Theme */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Layers size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-medium uppercase mb-1">主题分类</div>
                            <div className="font-bold text-slate-800">{product.themeCategory || 'N/A'}</div>
                            <div className="text-sm text-slate-600">{product.themeType || 'N/A'}</div>
                        </div>
                    </div>
                    {/* Industry */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-medium uppercase mb-1">行业分类</div>
                            <div className="font-bold text-slate-800">{product.industry}</div>
                        </div>
                    </div>
                    {/* Organization */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                            <Landmark size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-medium uppercase mb-1">机构分类</div>
                            <div className="font-bold text-slate-800">{product.orgType || 'N/A'}</div>
                        </div>
                    </div>
                    {/* Scenario */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <Target size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-medium uppercase mb-1">应用场景</div>
                            <div className="font-bold text-slate-800">{product.scenarioCategory || 'N/A'}</div>
                            <div className="text-sm text-slate-600">{product.scenarioType || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50 flex items-center gap-2">
                            <Database size={18} className="text-slate-500"/>
                            <span className="font-bold text-slate-800">数据结构 (Schema)</span>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="text-slate-500 bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">字段名称</th>
                                        <th className="px-6 py-3 font-medium">类型</th>
                                        <th className="px-6 py-3 font-medium">描述</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-mono text-slate-700 font-medium">record_id</td><td className="px-6 py-3 text-slate-500">String</td><td className="px-6 py-3 text-slate-600">唯一记录标识符</td></tr>
                                    <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-mono text-slate-700 font-medium">timestamp</td><td className="px-6 py-3 text-slate-500">DateTime</td><td className="px-6 py-3 text-slate-600">数据采集时间</td></tr>
                                    <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-mono text-slate-700 font-medium">value</td><td className="px-6 py-3 text-slate-500">Float</td><td className="px-6 py-3 text-slate-600">监测数值</td></tr>
                                    <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-mono text-slate-700 font-medium">region_code</td><td className="px-6 py-3 text-slate-500">String</td><td className="px-6 py-3 text-slate-600">行政区划代码</td></tr>
                                    <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-mono text-slate-700 font-medium">status</td><td className="px-6 py-3 text-slate-500">Enum</td><td className="px-6 py-3 text-slate-600">状态码 [NORMAL, ALERT]</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-slate-500"/>
                            调用示例
                        </h3>
                        <div className="bg-slate-900 rounded-lg p-4 text-xs text-slate-300 font-mono overflow-x-auto shadow-inner">
                            <p className="text-green-400 font-bold">GET /api/v1/query?id=...</p>
                            <p className="mt-2 text-slate-500"># Response</p>
                            <p>{`{`}</p>
                            <p className="pl-4 text-blue-300">"code": 200,</p>
                            <p className="pl-4 text-blue-300">"data": {`{`}</p>
                            <p className="pl-8 text-orange-300">"record_id": "R-9921",</p>
                            <p className="pl-8 text-orange-300">"value": 42.5</p>
                            <p className="pl-4 text-blue-300">{`}`}</p>
                            <p>{`}`}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                             <h4 className="text-sm font-bold text-slate-700 mb-2">服务等级协议 (SLA)</h4>
                             <ul className="text-xs text-slate-500 space-y-1">
                                 <li className="flex justify-between"><span>可用性</span> <span className="font-medium text-slate-800">99.9%</span></li>
                                 <li className="flex justify-between"><span>最大并发</span> <span className="font-medium text-slate-800">500 QPS</span></li>
                             </ul>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    )
}

// --- Main Portal Controller ---

const Portal: React.FC = () => {
  const [view, setView] = useState<'directory' | 'space' | 'product'>('directory');
  const [currentSpaceId, setCurrentSpaceId] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<DataProduct | null>(null);

  const handleEnterSpace = (id: string) => {
    setCurrentSpaceId(id);
    setView('space');
  };

  const handleSelectProduct = (product: DataProduct) => {
    setCurrentProduct(product);
    setView('product');
  };

  const handleBackToDirectory = () => {
    setView('directory');
    setCurrentSpaceId(null);
  };

  const handleBackToSpace = () => {
    setView('space');
    setCurrentProduct(null);
  };

  if (view === 'space' && currentSpaceId) {
    return (
      <SpaceDetail 
        spaceId={currentSpaceId} 
        onBack={handleBackToDirectory} 
        onSelectProduct={handleSelectProduct} 
      />
    );
  }

  if (view === 'product' && currentProduct) {
    return (
      <ProductDetail 
        product={currentProduct} 
        onBack={handleBackToSpace} 
      />
    );
  }

  return <SpaceDirectory onEnterSpace={handleEnterSpace} />;
};

export default Portal;
