
import React from 'react';
import { 
  Building2, 
  User, 
  UserCog, 
  Edit3, 
  FileText, 
  AlertCircle 
} from 'lucide-react';

// --- Configuration Constants (Exported for Form Usage) ---

export const INDIVIDUAL_CONFIG = [
  {
    title: '用户身份基础信息',
    description: '个人身份核心标识信息',
    fields: [
      { id: 'name', label: '姓名', type: 'text', required: true, width: 'half' },
      { id: 'idType', label: '证件类型', type: 'select', options: ['居民身份证', '护照', '军官证'], required: true, width: 'half' },
      { id: 'idNumber', label: '证件号码', type: 'text', required: true, width: 'full' },
      { id: 'idValidStart', label: '证件有效期起始', type: 'date', width: 'half' },
      { id: 'idValidEnd', label: '证件有效期截止', type: 'date', width: 'half' },
      { id: 'phone', label: '手机号', type: 'text', required: true, width: 'half' },
      { id: 'authMethod', label: '实名认证方式', type: 'select', options: ['公安部/人社部实名服务', '国家政务服务平台', '第三方平台'], required: true, width: 'half' },
    ]
  },
  {
    title: '用户身份附属信息',
    fields: [
      { id: 'nationality', label: '国籍', type: 'text', width: 'half' },
      { id: 'gender', label: '性别', type: 'select', options: ['男', '女'], width: 'half' },
      { id: 'birthDate', label: '出生年月', type: 'date', width: 'half' },
      { id: 'email', label: '邮箱', type: 'text', width: 'half' },
      { id: 'address', label: '联系地址', type: 'text', width: 'full' },
      { id: 'socialCard', label: '社保卡号', type: 'text', width: 'half' },
      { id: 'socialCardLoc', label: '社保卡发放地', type: 'text', width: 'half' },
      { id: 'alipay', label: '支付宝账号', type: 'text', width: 'half' },
      { id: 'wechat', label: '微信账号', type: 'text', width: 'half' },
      { id: 'others', label: '其它 (微博/学历等)', type: 'text', width: 'full' },
    ]
  },
  {
    title: '用户身份可验附件',
    fields: [
      { id: 'educationCert', label: '学历/学位证书', type: 'file', width: 'half' },
      { id: 'profCert', label: '职业资格证书', type: 'file', width: 'half' },
      { id: 'creditReport', label: '信用报告摘要', type: 'file', width: 'half' },
      { id: 'ipCert', label: '数字作品/知识产权登记', type: 'file', width: 'half' },
      { id: 'authLetter', label: '授权委托书', type: 'file', width: 'half' },
      { id: 'thirdPartyCert', label: '其他第三方认证信息', type: 'file', width: 'half' },
    ]
  }
];

export const ORGANIZATION_CONFIG = [
  {
    title: '法人用户身份基础信息',
    description: '法人或其他组织法定核心信息',
    fields: [
      { id: 'orgName', label: '法人或其他组织名称', type: 'text', required: true, width: 'full' },
      { id: 'uscc', label: '统一社会信用代码', type: 'text', required: true, width: 'full' },
      { id: 'orgType', label: '组织类型', type: 'select', options: ['机关法人', '企事业单位法人', '社会团体法人', '非法人组织', '其它'], required: true, width: 'half' },
      { id: 'opPeriodStart', label: '经营期限起始', type: 'date', width: 'half' },
      { id: 'opPeriodEnd', label: '经营期限截止', type: 'date', width: 'half' },
      { id: 'authMethod', label: '实名认证方式', type: 'select', options: ['人工核验', '对公账户打款', '市场监管总局认证', '其它'], required: true, width: 'half' },
      { id: 'repName', label: '法定代表人姓名', type: 'text', required: true, width: 'half' },
      { id: 'repId', label: '法定代表人证件号', type: 'text', required: true, width: 'half' },
    ]
  },
  {
    title: '法人用户身份附属信息',
    fields: [
      { id: 'regAddr', label: '注册地址', type: 'text', width: 'full' },
      { id: 'regCapital', label: '注册金额 (万元)', type: 'number', width: 'half' },
      { id: 'regDate', label: '注册日期', type: 'date', width: 'half' },
      { id: 'bizScope', label: '经营范围', type: 'text', width: 'full' },
      { id: 'industry', label: '行业类型', type: 'text', width: 'half' },
      { id: 'industrySub', label: '行业小类', type: 'text', width: 'half' },
      { id: 'approvalOrg', label: '核准机构', type: 'text', width: 'half' },
      { id: 'taxId', label: '纳税人识别号', type: 'text', width: 'half' },
      { id: 'socialCard', label: '法人社保卡号', type: 'text', width: 'half' },
      { id: 'socialCardLoc', label: '社保卡发放地', type: 'text', width: 'half' },
    ]
  },
  {
    title: '法人用户身份可验附件',
    fields: [
      { id: 'bizLicense', label: '电子营业执照', type: 'file', required: true, width: 'full' },
      { id: 'industryCert', label: '行业资质证书', type: 'file', width: 'half' },
      { id: 'complianceCert', label: '产品或服务合规认证', type: 'file', width: 'half' },
      { id: 'creditRating', label: '企业信用评级', type: 'file', width: 'half' },
      { id: 'taxRating', label: '纳税信用等级', type: 'file', width: 'half' },
      { id: 'trademarkCert', label: '商标/知识产权登记', type: 'file', width: 'half' },
      { id: 'thirdPartyTrust', label: '其他第三方可信声明', type: 'file', width: 'half' },
    ]
  }
];

export const OPERATOR_CONFIG = [
  {
    title: '经办人用户身份基础信息',
    description: '受法人委托办理业务的人员信息',
    fields: [
      { id: 'name', label: '经办人姓名', type: 'text', required: true, width: 'half' },
      { id: 'idType', label: '经办人证件类型', type: 'select', options: ['居民身份证', '护照', '军官证'], required: true, width: 'half' },
      { id: 'idNumber', label: '经办人证件号码', type: 'text', required: true, width: 'full' },
      { id: 'authMethod', label: '经办人实名认证方式', type: 'select', options: ['公安部/人社部实名服务', '国家政务服务平台', '第三方平台'], required: true, width: 'half' },
      { id: 'authType', label: '经办人授权方式', type: 'select', options: ['管理员确认', '上传授权书', '短信或邮件确认'], required: true, width: 'half' },
      { id: 'orgUscc', label: '所属法人统一社会信用代码', type: 'text', required: true, width: 'full' },
    ]
  },
  {
    title: '经办人用户身份附属信息',
    fields: [
      { id: 'orgName', label: '所属法人名称', type: 'text', width: 'full' },
      { id: 'socialCard', label: '社保卡卡号', type: 'text', width: 'half' },
      { id: 'socialCardLoc', label: '社保卡发放地', type: 'text', width: 'half' },
      { id: 'alipay', label: '支付宝账号', type: 'text', width: 'half' },
      { id: 'wechat', label: '微信账号', type: 'text', width: 'half' },
    ]
  },
  {
    title: '经办人身份可验附件',
    fields: [
      { id: 'authLetter', label: '授权书/委托书', type: 'file', required: true, width: 'full' },
      { id: 'notaryStmt', label: '公证处出具的代理声明', type: 'file', width: 'half' },
      { id: 'industryFiling', label: '行业资质类委托备案证明', type: 'file', width: 'half' },
      { id: 'thirdPartyInfo', label: '其他第三方可验证信息', type: 'file', width: 'half' },
    ]
  }
];

// --- Helper Functions ---

const maskValue = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  const strVal = String(value);
  if (strVal.length < 4) return strVal;
  if (strVal.length === 11) return strVal.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'); // Phone
  if (strVal.length > 14) return strVal.substring(0, 4) + '**********' + strVal.substring(strVal.length - 4); // ID/USCC
  return strVal.substring(0, 2) + '******'; // Other
};

export const getConfigByUserType = (userType: 'individual' | 'organization' | 'operator') => {
  if (userType === 'individual') return INDIVIDUAL_CONFIG;
  if (userType === 'operator') return OPERATOR_CONFIG;
  return ORGANIZATION_CONFIG;
};

// --- Component ---

interface IdentityProfileProps {
  userType: 'individual' | 'organization' | 'operator';
  data: any;
  onEdit?: () => void;
  readOnlyMode?: boolean; // If true, hides edit buttons
}

export const IdentityProfile: React.FC<IdentityProfileProps> = ({ userType, data, onEdit, readOnlyMode = false }) => {
  const config = getConfigByUserType(userType);
  const displayName = userType === 'organization' ? data.orgName : data.name;
  const displayId = userType === 'organization' ? data.uscc : data.idNumber;

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
              <h2 className="text-2xl font-bold text-slate-800">{displayName || '未命名'}</h2>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200 uppercase">
                {userType} Verified
              </span>
            </div>
            <p className="text-slate-500 text-sm font-mono">ID: {maskValue(displayId)}</p>
            <div className="mt-2 text-xs text-slate-400">
              最后更新时间: {data.lastUpdated || '2024-05-20 14:30:00'}
            </div>
          </div>
        </div>
        {!readOnlyMode && onEdit && (
          <div>
            <button 
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
            >
              <Edit3 size={16} /> 变更信息 / 重新认证
            </button>
          </div>
        )}
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
                   const rawVal = data[field.id];
                   // Mask value if it's sensitive (simple logic for demo)
                   const isSensitive = ['idNumber', 'uscc', 'phone', 'repId', 'socialCard'].includes(field.id);
                   const displayVal = isSensitive ? maskValue(rawVal) : (rawVal || '未填写');

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
              为保护隐私与数据安全，以上展示的信息已进行脱敏处理。如需查看完整信息，请使用高权限账号或实体 U-Key 进行二次验证。
            </p>
         </div>
      </div>

    </div>
  );
};
