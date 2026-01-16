import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Upload, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Save, 
  X,
  User,
  Building2,
  UserCog,
  ArrowLeft,
  FileText,
  AlertCircle
} from 'lucide-react';

// --- Types ---

type IdentityStatus = 'unverified' | 'pending' | 'verified';
type UserType = 'individual' | 'organization' | 'operator';
type ViewState = 'view' | 'selecting_type' | 'editing';

interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'file' | 'number';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  width?: 'full' | 'half';
  readonly?: boolean;
  helperText?: string;
}

interface FormSection {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

// --- Configuration (Synced with Register.tsx) ---

const INDIVIDUAL_CONFIG: FormSection[] = [
  {
    title: '基础信息',
    description: '个人身份基础信息',
    fields: [
      { id: 'name', label: '姓名', type: 'text', required: true, width: 'half' },
      { id: 'idType', label: '证件类型', type: 'select', options: ['居民身份证', '护照', '军官证'], required: true, width: 'half' },
      { id: 'idNumber', label: '证件号码', type: 'text', required: true, width: 'full' },
      { id: 'phone', label: '手机号', type: 'text', required: true, width: 'half' },
      { id: 'authMethod', label: '实名认证方式', type: 'select', options: ['公安部/人社部实名服务', '国家政务服务平台', '第三方平台'], required: true, width: 'half' },
    ]
  },
  {
    title: '附属信息',
    fields: [
      { id: 'nationality', label: '国籍', type: 'text', width: 'half' },
      { id: 'email', label: '邮箱', type: 'text', width: 'half' },
      { id: 'address', label: '联系地址', type: 'text', width: 'full' },
    ]
  }
];

const ORGANIZATION_CONFIG: FormSection[] = [
  {
    title: '法人基础信息',
    description: '营业执照或登记证书上的法定信息',
    fields: [
      { id: 'orgName', label: '法人或其他组织名称', type: 'text', required: true, width: 'full' },
      { id: 'uscc', label: '统一社会信用代码', type: 'text', required: true, width: 'full' },
      { id: 'orgType', label: '组织类型', type: 'select', options: ['机关法人', '企事业单位法人', '社会团体法人'], required: true, width: 'half' },
      { id: 'repName', label: '法定代表人姓名', type: 'text', required: true, width: 'half' },
      { id: 'repId', label: '法定代表人证件号', type: 'text', required: true, width: 'half' },
    ]
  },
  {
    title: '附属信息',
    fields: [
      { id: 'regAddr', label: '注册地址', type: 'text', width: 'full' },
      { id: 'industry', label: '行业类型', type: 'text', width: 'half' },
      { id: 'regCapital', label: '注册金额 (万元)', type: 'number', width: 'half' },
    ]
  },
  {
    title: '可验附件',
    fields: [
      { id: 'bizLicense', label: '电子营业执照', type: 'file', required: true, width: 'full' },
      { id: 'authLetter', label: '法人授权书', type: 'file', width: 'half' },
    ]
  }
];

const OPERATOR_CONFIG: FormSection[] = [
  {
    title: '经办人基础信息',
    description: '受法人单位委托办理业务的人员信息',
    fields: [
      { id: 'name', label: '经办人姓名', type: 'text', required: true, width: 'half' },
      { id: 'idNumber', label: '经办人证件号码', type: 'text', required: true, width: 'full' },
      { id: 'orgUscc', label: '所属法人统一社会信用代码', type: 'text', required: true, width: 'full' },
      { id: 'authType', label: '授权方式', type: 'select', options: ['上传授权书', '管理员确认'], required: true, width: 'half' },
    ]
  },
  {
    title: '附属信息',
    fields: [
      { id: 'email', label: '联系邮箱', type: 'text', width: 'half' },
      { id: 'department', label: '所属部门', type: 'text', width: 'half' },
    ]
  }
];

// --- Helper: Masking Function ---
const maskValue = (value: string | undefined) => {
  if (!value) return '-';
  if (value.length < 4) return value;
  if (value.length === 11) return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'); // Phone
  if (value.length > 14) return value.substring(0, 4) + '**********' + value.substring(value.length - 4); // ID/USCC
  return value.substring(0, 2) + '******'; // Other
};

// --- Main Component ---

const Identity: React.FC = () => {
  // Demo State
  const [status, setStatus] = useState<IdentityStatus>('verified');
  const [viewState, setViewState] = useState<ViewState>('view'); // controls flow
  const [userType, setUserType] = useState<UserType>('organization'); // default for demo
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'section-0': true, 'section-1': true, 'section-2': true
  });

  // Mock Data
  const [formData, setFormData] = useState<any>({
    orgName: '北京市大数据局',
    uscc: '11110000MB16685822',
    orgType: '机关法人',
    repName: '张建国',
    repId: '110101197001011234',
    regAddr: '北京市通州区运河东大街57号',
    industry: '公共管理',
    name: '张三', // for individual/operator demo
    idNumber: '110101199001011234', // for individual/operator demo
    phone: '13800138000'
  });

  const toggleSection = (idx: number) => {
    setOpenSections(prev => ({ ...prev, [`section-${idx}`]: !prev[`section-${idx}`] }));
  };

  const getConfig = () => {
    if (userType === 'individual') return INDIVIDUAL_CONFIG;
    if (userType === 'operator') return OPERATOR_CONFIG;
    return ORGANIZATION_CONFIG;
  };

  // --- Views ---

  // 1. Unverified Landing
  const UnverifiedView = () => (
    <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-300">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
        <Shield size={48} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">尚未完成主体身份认证</h2>
      <p className="text-slate-500 max-w-lg text-center mb-8">
        为了保障可信数据流通，所有参与方必须完成实名主体认证。认证通过后，您将获得数据空间数字身份 (DID) 及相关操作权限。
      </p>
      
      <button 
        onClick={() => setViewState('selecting_type')}
        className="px-8 py-3 bg-gov-700 text-white rounded-lg font-bold hover:bg-gov-800 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
      >
        立即申请认证 <ArrowRight size={18} />
      </button>
    </div>
  );

  // 2. Identity Type Selection (Step 1 of Verification)
  const TypeSelectionView = () => (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in slide-in-from-right-8 duration-300">
      <button 
        onClick={() => setViewState('view')}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-gov-700 transition-colors"
      >
        <ArrowLeft size={20} /> 返回
      </button>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">请选择您的身份类型</h2>
        <p className="text-slate-500">不同身份类型需提交的认证材料不同，请根据实际情况选择。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Individual */}
        <div 
          onClick={() => { setUserType('individual'); setViewState('editing'); }}
          className="bg-white rounded-xl border border-slate-200 p-8 hover:border-gov-500 hover:shadow-lg transition-all cursor-pointer group text-center"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
            <User size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">个人用户</h3>
          <p className="text-sm text-slate-500">以自然人身份参与数据流通活动的个体。</p>
        </div>

        {/* Organization */}
        <div 
          onClick={() => { setUserType('organization'); setViewState('editing'); }}
          className="bg-white rounded-xl border border-slate-200 p-8 hover:border-gov-500 hover:shadow-lg transition-all cursor-pointer group text-center"
        >
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
            <Building2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">法人或其他组织</h3>
          <p className="text-sm text-slate-500">政府机关、企事业单位、社会团体等。</p>
        </div>

        {/* Operator */}
        <div 
          onClick={() => { setUserType('operator'); setViewState('editing'); }}
          className="bg-white rounded-xl border border-slate-200 p-8 hover:border-gov-500 hover:shadow-lg transition-all cursor-pointer group text-center"
        >
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
            <UserCog size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">法人经办人</h3>
          <p className="text-sm text-slate-500">受法人委托负责办理数据事务的人员。</p>
        </div>
      </div>
    </div>
  );

  // 3. Form Editor (Step 2 of Verification OR Re-certification)
  const EditForm = () => {
    const config = getConfig();
    return (
     <div className="max-w-4xl mx-auto py-4 animate-in slide-in-from-right-8 duration-300">
        <div className="flex items-center justify-between mb-6">
           <div>
             <h2 className="text-xl font-bold text-slate-800">
               {status === 'unverified' ? '提交认证资料' : '变更主体信息'}
             </h2>
             <p className="text-sm text-slate-500 mt-1">
               当前身份类型：
               <span className="font-bold text-gov-700">
                 {userType === 'individual' ? '个人用户' : userType === 'organization' ? '法人或其他组织' : '法人经办人'}
               </span>
             </p>
           </div>
           <button 
             onClick={() => setViewState('view')} // Should probably go back to selection if unverified, but simple view for now
             className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
           >
             <X size={16} /> 取消
           </button>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setViewState('view'); setStatus('pending'); }}>
          {config.map((section, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button 
                type="button"
                onClick={() => toggleSection(idx)}
                className="w-full px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between hover:bg-slate-100 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-slate-800 text-left">{section.title}</h3>
                  {section.description && <p className="text-xs text-slate-500 mt-1 text-left">{section.description}</p>}
                </div>
                {openSections[`section-${idx}`] ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>
              
              {openSections[`section-${idx}`] && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field) => (
                    <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : ''}`}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <div className="relative">
                          <select 
                            defaultValue={formData[field.id]}
                            className="w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:border-transparent text-slate-700"
                          >
                            <option value="">请选择...</option>
                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      ) : field.type === 'file' ? (
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-8 w-8 text-slate-400 group-hover:text-gov-500" />
                            <div className="flex text-sm text-slate-600 justify-center">
                              <span className="font-medium text-gov-600 hover:text-gov-500">点击上传</span>
                              <p className="pl-1">或拖拽文件</p>
                            </div>
                            <p className="text-xs text-slate-500">支持 PDF, JPG (Max 10MB)</p>
                          </div>
                        </div>
                      ) : (
                        <input 
                          type={field.type} 
                          placeholder={field.placeholder}
                          readOnly={field.readonly}
                          defaultValue={formData[field.id]}
                          className={`w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:border-transparent transition-all ${
                            field.readonly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'text-slate-800'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-end gap-3 pt-4">
             <button 
                type="button" 
                onClick={() => setViewState('view')}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
             >
                取消
             </button>
             <button 
                type="submit" 
                className="px-8 py-2.5 bg-gov-700 text-white rounded-lg font-bold hover:bg-gov-800 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
             >
                <Save size={18} /> 提交审核
             </button>
          </div>
        </form>
     </div>
    );
  };

  // 4. Pending State View
  const PendingView = () => (
    <div className="max-w-3xl mx-auto py-12 animate-in slide-in-from-bottom-4 duration-300">
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
             <div>
               <h2 className="text-xl font-bold text-slate-800">资料审核中</h2>
               <p className="text-slate-500 text-sm mt-1">
                 您提交的
                 <span className="font-bold mx-1">
                    {userType === 'individual' ? '个人' : userType === 'organization' ? '法人' : '经办人'}
                 </span>
                 认证申请正在处理
               </p>
             </div>
             <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold rounded-full text-sm">
               Pending
             </span>
          </div>

          <div className="relative flex justify-between">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2"></div>
            {[
              { label: '提交资料', time: '刚刚', done: true },
              { label: '智能初审', time: '进行中...', done: true, active: true },
              { label: '人工复核', time: '待开始', done: false },
              { label: '认证完成', time: '-', done: false },
            ].map((step, idx) => (
               <div key={idx} className="flex flex-col items-center bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 mb-2 ${
                    step.done ? 'bg-green-500 border-green-500 text-white' : 
                    step.active ? 'bg-amber-100 border-amber-500 text-amber-700 animate-pulse' : 
                    'bg-slate-50 border-slate-300 text-slate-300'
                  }`}>
                    {step.done ? <CheckCircle2 size={16}/> : step.active ? <Clock size={16} /> : idx + 1}
                  </div>
                  <span className={`text-sm font-medium ${step.done || step.active ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</span>
               </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
             <button onClick={() => { setStatus('unverified'); setViewState('view'); }} className="text-slate-400 hover:text-slate-600 text-sm">
               撤回申请
             </button>
          </div>
       </div>
    </div>
  );

  // 5. Verified View (Read-only, Masked, No Operators)
  const VerifiedView = () => {
    const config = getConfig();
    const displayName = userType === 'organization' ? formData.orgName : formData.name;
    const displayId = userType === 'organization' ? formData.uscc : formData.idNumber;

    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg ${
              userType === 'organization' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : 
              userType === 'individual' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
              'bg-gradient-to-br from-teal-500 to-teal-700'
            }`}>
              {userType === 'organization' ? <Building2 size={32} /> : userType === 'individual' ? <User size={32} /> : <UserCog size={32} />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-800">{displayName}</h2>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200 uppercase">
                  {userType} Verified
                </span>
              </div>
              <p className="text-slate-500 text-sm font-mono">ID: {maskValue(displayId)}</p>
              <div className="mt-2 text-xs text-slate-400">
                最后更新时间: 2024-05-20 14:30:00
              </div>
            </div>
          </div>
          <div>
            <button 
              onClick={() => setViewState('editing')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
            >
              <Edit3 size={16} /> 变更信息 / 重新认证
            </button>
          </div>
        </div>

        {/* Read-Only Info Grids */}
        <div className="grid grid-cols-1 gap-6">
          {config.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <FileText size={18} className="text-slate-400" /> {section.title}
                 </h3>
               </div>
               <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                   {section.fields.map(field => {
                     // Determine value to show
                     const rawVal = formData[field.id] || '未填写';
                     // Mask value if it's sensitive (simple logic for demo)
                     const isSensitive = ['idNumber', 'uscc', 'phone', 'repId', 'socialCard'].includes(field.id);
                     const displayVal = isSensitive ? maskValue(rawVal) : rawVal;

                     return (
                       <div key={field.id} className={field.width === 'full' ? 'col-span-full' : ''}>
                          <div className="text-xs text-slate-400 mb-1">{field.label}</div>
                          <div className={`text-sm font-medium text-slate-800 truncate ${field.type === 'file' ? 'text-blue-600 underline cursor-pointer' : ''}`}>
                             {field.type === 'file' ? '查看已上传文件' : displayVal}
                          </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
           <AlertCircle size={18} className="text-blue-600 mt-0.5" />
           <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">关于信息安全与脱敏</p>
              <p className="opacity-80">
                为保护您的隐私与数据安全，以上展示的信息已进行脱敏处理。如需查看完整信息或进行业务办理，请使用实体 U-Key 进行二次验证。
                变更关键信息（如证件号、法定代表人）将触发重新审核流程，审核期间相关业务权限可能会受到限制。
              </p>
           </div>
        </div>

      </div>
    );
  };

  // --- Main Render Logic ---

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">身份管理 (Identity Management)</h2>
         <div className="flex items-center gap-4">
            {/* Developer Controls */}
            <div className="bg-slate-800 p-1 rounded-lg flex text-xs font-medium opacity-50 hover:opacity-100 transition-opacity">
               {(['unverified', 'pending', 'verified'] as const).map(s => (
                  <button 
                     key={s}
                     onClick={() => {
                       setStatus(s);
                       setViewState('view'); // reset view state
                     }}
                     className={`px-3 py-1 rounded-md transition-all ${
                        status === s ? 'bg-gov-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                     }`}
                  >
                     {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
               ))}
            </div>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${
               status === 'verified' ? 'bg-green-100 text-green-800 border-green-200' :
               status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
               'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
               <span className={`w-2 h-2 rounded-full ${
                  status === 'verified' ? 'bg-green-500' : 
                  status === 'pending' ? 'bg-amber-500 animate-pulse' : 
                  'bg-slate-400'
               }`}></span>
               {status === 'verified' ? '状态正常' : status === 'pending' ? '审核中' : '未认证'}
            </span>
         </div>
      </div>

      {/* Content Switcher */}
      
      {/* 1. Unverified State Flow */}
      {status === 'unverified' && viewState === 'view' && <UnverifiedView />}
      {status === 'unverified' && viewState === 'selecting_type' && <TypeSelectionView />}
      
      {/* 2. Pending State */}
      {status === 'pending' && <PendingView />}

      {/* 3. Verified View (Read Only) */}
      {status === 'verified' && viewState === 'view' && <VerifiedView />}

      {/* 4. Edit Form (Shared by Unverified->Edit and Verified->Edit) */}
      {viewState === 'editing' && <EditForm />}

    </div>
  );
};

export default Identity;