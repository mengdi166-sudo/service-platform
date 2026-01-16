import React, { useState } from 'react';
import { Landmark, Edit2, Save, X, Upload, FileText, CheckCircle2, Shield, Globe, Server, Activity } from 'lucide-react';
import { PlatformIdentity } from '../types';

const INITIAL_PLATFORM_DATA: PlatformIdentity = {
  // Basic
  name: '京津冀数据协同公共服务平台',
  id: 'PF-BJ-2024-001',
  ips: ['10.20.100.1', '10.20.100.2'],
  domains: ['data-space.beijing.gov.cn', 'api.data-space.bj'],
  orgName: '北京市大数据中心',
  uscc: '12110000MB00123456',
  credential: 'DID:cn:bj:gov:12345678',
  issueDate: '2023-11-15',

  // Auxiliary
  nodeType: '1', // 区域功能节点
  industryCode: 'I65', // 软件和信息技术服务业
  serviceScope: '北京市行政区域',
  securityContact: '李安全 (010-66668888)',
  opsProvider: '北京数字认证股份有限公司',
  deploymentEnv: '混合部署 (北京政务云 + 本地私有化)',
  description: '本平台旨在支撑京津冀区域内的政务数据与社会数据安全融合，提供统一的身份认证、目录索引与存证服务。',

  // Attachments
  attachments: {
    filing: true,
    auditReport: true,
    apiGatewayCert: false,
    thirdPartyCert: true
  }
};

const PlatformIdentityPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PlatformIdentity>(INITIAL_PLATFORM_DATA);
  const [activeTab, setActiveTab] = useState<'basic' | 'aux' | 'attach'>('basic');

  const handleSave = () => {
    // API save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(INITIAL_PLATFORM_DATA);
    setIsEditing(false);
  };

  // --- Render Helpers ---

  const renderViewField = (label: string, value: string | undefined | React.ReactNode, fullWidth = false) => (
    <div className={`${fullWidth ? 'col-span-full' : ''}`}>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-sm font-medium text-slate-800 break-words">{value || '-'}</div>
    </div>
  );

  const renderInput = (
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    placeholder?: string,
    width: 'half' | 'full' = 'half',
    disabled = false
  ) => (
    <div className={width === 'full' ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 transition-all ${
          disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-800'
        }`}
      />
    </div>
  );

  // --- View Mode ---

  const renderViewMode = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex items-start justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gov-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="flex items-center gap-6 relative z-10">
           <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gov-700 to-gov-900 flex items-center justify-center text-white shadow-lg">
              <Landmark size={40} />
           </div>
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold text-slate-900">{formData.name}</h1>
                 <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                    {formData.nodeType === '0' ? '业务节点' : formData.nodeType === '1' ? '区域功能节点' : '全域功能节点'}
                 </span>
              </div>
              <p className="text-slate-500 font-mono mb-4">ID: {formData.id}</p>
              
              <div className="flex gap-6 text-sm text-slate-600">
                 <div className="flex items-center gap-2">
                    <Shield size={16} className="text-green-500" />
                    <span>已认证 (Valid)</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gov-500" />
                    <span>{formData.domains[0]}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative z-10">
           <button 
             onClick={() => setIsEditing(true)}
             className="flex items-center gap-2 px-6 py-2.5 bg-gov-700 text-white rounded-lg hover:bg-gov-800 shadow-md shadow-blue-500/20 transition-all font-medium"
           >
             <Edit2 size={18} /> 编辑平台信息
           </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Basic Info */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden col-span-2">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-800 flex items-center gap-2">
               <Server size={18} className="text-slate-400" /> 基础信息
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
               {renderViewField('平台身份标识', formData.id)}
               {renderViewField('凭证颁发日期', formData.issueDate)}
               {renderViewField('所属法人或其他组织名称', formData.orgName, true)}
               {renderViewField('统一社会信用代码', formData.uscc)}
               {renderViewField('可信身份凭证', <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{formData.credential}</span>)}
               {renderViewField('IP 地址列表', formData.ips.join(', '))}
               {renderViewField('域名列表', formData.domains.join(', '))}
            </div>
         </div>

         {/* Status / Compliance */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-800 flex items-center gap-2">
                <Shield size={18} className="text-slate-400" /> 合规与认证
             </div>
             <div className="p-6 space-y-4">
                {[
                  { label: '平台备案信息', active: formData.attachments.filing },
                  { label: '合规性审计报告', active: formData.attachments.auditReport },
                  { label: 'API 安全网关认证', active: formData.attachments.apiGatewayCert },
                  { label: '第三方评估/联盟认证', active: formData.attachments.thirdPartyCert },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                     <span className="text-sm text-slate-700">{item.label}</span>
                     {item.active ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                           <CheckCircle2 size={12} /> 已验证
                        </span>
                     ) : (
                        <span className="text-slate-400 text-xs">未上传</span>
                     )}
                  </div>
                ))}
             </div>
         </div>

         {/* Auxiliary Info */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden col-span-3">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-slate-400" /> 附属信息与环境
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                {renderViewField('平台节点类型', formData.nodeType === '0' ? '业务节点' : formData.nodeType === '1' ? '区域功能节点' : '全域功能节点')}
                {renderViewField('所属行业分类代码', formData.industryCode)}
                {renderViewField('服务覆盖范围', formData.serviceScope)}
                {renderViewField('安全责任人', formData.securityContact)}
                {renderViewField('运维服务商', formData.opsProvider)}
                {renderViewField('系统部署环境', formData.deploymentEnv)}
                {renderViewField('其他说明', formData.description, true)}
             </div>
         </div>
      </div>
    </div>
  );

  // --- Edit Mode ---

  const renderEditMode = () => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden flex flex-col min-h-[600px]">
        {/* Form Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
           <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
             <Edit2 size={18}/> 编辑平台身份信息
           </h3>
           <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
             <X size={20} />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: 'basic', label: '基本信息 (Basic)' },
            { id: 'aux', label: '附属信息 (Auxiliary)' },
            { id: 'attach', label: '可验附件 (Attachments)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-gov-700 text-gov-700 bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {activeTab === 'basic' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('平台名称', formData.name, v => setFormData({...formData, name: v}), '请输入平台名称', 'full')}
                {renderInput('平台身份标识', formData.id, v => {}, '', 'half', true)}
                {renderInput('凭证颁发日期', formData.issueDate, v => setFormData({...formData, issueDate: v}), '', 'half')}
                
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">平台 IP 地址列表</label>
                   <textarea 
                     rows={2}
                     value={formData.ips.join('\n')}
                     onChange={e => setFormData({...formData, ips: e.target.value.split('\n')})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
                     placeholder="每行一个 IP 地址"
                   />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">平台域名列表</label>
                   <textarea 
                     rows={2}
                     value={formData.domains.join('\n')}
                     onChange={e => setFormData({...formData, domains: e.target.value.split('\n')})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
                     placeholder="每行一个域名"
                   />
                </div>

                {renderInput('所属法人或其他组织名称', formData.orgName, v => setFormData({...formData, orgName: v}), '', 'full')}
                {renderInput('统一社会信用代码', formData.uscc, v => setFormData({...formData, uscc: v}), '', 'half')}
                {renderInput('可信身份凭证 (Credential)', formData.credential, v => setFormData({...formData, credential: v}), '', 'half')}
             </div>
          )}

          {activeTab === 'aux' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">平台节点类型</label>
                   <select 
                     value={formData.nodeType}
                     onChange={e => setFormData({...formData, nodeType: e.target.value as any})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gov-500"
                   >
                     <option value="0">0 - 业务节点</option>
                     <option value="1">1 - 区域功能节点</option>
                     <option value="2">2 - 全域功能节点</option>
                   </select>
                </div>
                {renderInput('所属行业分类代码 (GB/T 4754)', formData.industryCode, v => setFormData({...formData, industryCode: v}))}
                {renderInput('服务覆盖范围', formData.serviceScope, v => setFormData({...formData, serviceScope: v}))}
                {renderInput('安全责任人联系方式', formData.securityContact, v => setFormData({...formData, securityContact: v}))}
                {renderInput('运维服务商名称', formData.opsProvider, v => setFormData({...formData, opsProvider: v}), '', 'full')}
                {renderInput('系统部署环境说明', formData.deploymentEnv, v => setFormData({...formData, deploymentEnv: v}), '', 'full')}
                
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1.5">其他说明字段</label>
                   <textarea 
                     rows={3}
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
                   />
                </div>
             </div>
          )}

          {activeTab === 'attach' && (
             <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 mb-6">
                   <Shield className="text-blue-600 shrink-0" size={20} />
                   <div className="text-sm text-blue-800">
                      <p className="font-bold">认证材料上传</p>
                      <p>请上传最新的合规性证明文件。平台将定期对备案信息进行核验。</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { key: 'filing', label: '平台备案信息' },
                     { key: 'auditReport', label: '平台合规性审计报告' },
                     { key: 'apiGatewayCert', label: 'API安全网关认证' },
                     { key: 'thirdPartyCert', label: '第三方评估/联盟认证' }
                   ].map((item) => (
                      <div key={item.key} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                         <div>
                            <p className="font-medium text-slate-700 text-sm">{item.label}</p>
                            <p className="text-xs text-slate-400 mt-1">
                               {formData.attachments[item.key as keyof typeof formData.attachments] ? '已上传' : '未上传'}
                            </p>
                         </div>
                         <button className="flex items-center gap-1 text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-600">
                            <Upload size={14} /> {formData.attachments[item.key as keyof typeof formData.attachments] ? '更新' : '上传'}
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
           <button 
             onClick={handleCancel}
             className="px-6 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
           >
             取消
           </button>
           <button 
             onClick={handleSave}
             className="px-6 py-2 bg-gov-700 text-white rounded-lg hover:bg-gov-800 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-colors"
           >
             <Save size={18} /> 保存变更
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">平台身份管理 (Platform Identity)</h2>
       </div>
       {isEditing ? renderEditMode() : renderViewMode()}
    </div>
  );
};

export default PlatformIdentityPage;