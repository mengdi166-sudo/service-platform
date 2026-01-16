import React, { useState } from 'react';
import { FileText, MessageSquare, History, Check, ShieldCheck, AlertCircle, FileDigit } from 'lucide-react';
import { Contract, ContractStatus } from '../types';

const Contracts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'negotiation' | 'archive'>('negotiation');

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('negotiation')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'negotiation' 
              ? 'border-gov-700 text-gov-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare size={16} /> 协商中心 (Negotiation Hub)
        </button>
        <button 
           onClick={() => setActiveTab('archive')}
           className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'archive' 
              ? 'border-gov-700 text-gov-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <History size={16} /> 电子账本 & 履约 (Archive)
        </button>
      </div>

      {activeTab === 'negotiation' ? (
        <div className="flex-1 grid grid-cols-12 gap-6 h-full overflow-hidden pb-4">
          {/* Contract Diff View */}
          <div className="col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                   <h3 className="font-bold text-slate-800">CT-20240901-008: 医保数据跨省共享协议</h3>
                   <p className="text-xs text-slate-500">Version 3.0 (Draft) • Last modified by Party B</p>
                </div>
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">Pending Review</span>
                </div>
             </div>
             <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed text-slate-700">
                <div className="space-y-4">
                   <div className="p-2 hover:bg-slate-50 rounded">
                      <p className="font-bold text-slate-900 mb-1">3. 数据使用限制</p>
                      <p>3.1 乙方仅可将数据用于 <span className="bg-red-100 text-red-700 line-through">商业营销</span> <span className="bg-green-100 text-green-700">医学科研</span> 目的。</p>
                      <p>3.2 数据留存期限不得超过 <span className="bg-red-100 text-red-700 line-through">12个月</span> <span className="bg-green-100 text-green-700">6个月</span>，到期后需提供销毁证明。</p>
                   </div>
                   <div className="p-2 border border-gov-100 bg-gov-50 rounded">
                      <p className="font-bold text-slate-900 mb-1">4. 访问控制策略 (Policy Code)</p>
                      <pre className="text-xs text-gov-800 bg-white p-2 rounded border border-gov-100 mt-1">
{`{
  "constraint": {
    "max_api_calls": 5000,
    "ip_whitelist": ["10.20.4.15/32"],
    "time_window": "09:00-18:00"
  }
}`}
                      </pre>
                   </div>
                </div>
             </div>
             <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">退回修改</button>
                <button className="px-4 py-2 bg-gov-700 text-white rounded-lg text-sm font-medium hover:bg-gov-800 shadow-sm flex items-center gap-2">
                   <Check size={16} /> 确认条款并签名
                </button>
             </div>
          </div>

          {/* Chat / Comments */}
          <div className="col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-200 font-bold text-slate-800">
                协商记录 (Comments)
             </div>
             <div className="flex-1 overflow-auto p-4 space-y-4">
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">A</div>
                   <div>
                      <div className="bg-slate-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700">
                         我们无法接受12个月的留存期，合规要求最多6个月。
                      </div>
                      <p className="text-xs text-slate-400 mt-1">10:42 AM</p>
                   </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                   <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs flex-shrink-0">B</div>
                   <div>
                      <div className="bg-gov-50 border border-gov-100 p-3 rounded-lg rounded-tr-none text-sm text-slate-700">
                         已修改为6个月，并更新了使用目的范围。请审核。
                      </div>
                      <p className="text-xs text-slate-400 mt-1 text-right">10:55 AM</p>
                   </div>
                </div>
             </div>
             <div className="p-3 border-t border-slate-200">
                <div className="relative">
                   <input type="text" placeholder="输入协商意见..." className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500" />
                   <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gov-700 hover:bg-gov-50 p-1 rounded">
                      <MessageSquare size={16} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-6">
          {/* Archive Cards */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 font-bold text-xs">
                   <ShieldCheck size={14} /> 区块链存证已确认
                </div>
             </div>
             
             <div className="flex gap-8 items-start">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center min-w-[120px]">
                   <FileDigit size={32} className="mx-auto text-slate-400 mb-2" />
                   <div className="text-xs font-mono text-slate-500">Hash (SHA-256)</div>
                   <div className="text-sm font-bold text-slate-800">e3b0c44...</div>
                </div>
                <div className="flex-1 space-y-4">
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg">交通大数据融合分析协议</h3>
                      <p className="text-slate-500 text-sm">Contract ID: CT-20231105-992</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-xs text-slate-400 uppercase">Signer A</p>
                         <p className="text-sm font-medium">北京市交通委 (0x7f...3a)</p>
                         <p className="text-xs font-mono text-slate-500 truncate w-48">SM2: 3045022100...</p>
                      </div>
                      <div>
                         <p className="text-xs text-slate-400 uppercase">Signer B</p>
                         <p className="text-sm font-medium">百度地图 (0x4b...1c)</p>
                         <p className="text-xs font-mono text-slate-500 truncate w-48">SM2: 3045022031...</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">履约轨迹 (Execution Log)</h3>
             <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
                {[
                   { time: '2024-03-15 09:00:01', action: 'Daily Sync Job Started', status: 'success' },
                   { time: '2024-03-15 09:05:23', action: 'Transferred 1.2GB Data', status: 'success' },
                   { time: '2024-03-14 14:30:00', action: 'Policy Check Failed (IP Mismatch)', status: 'failure' },
                   { time: '2024-03-14 09:00:00', action: 'Daily Sync Job Started', status: 'success' },
                ].map((log, idx) => (
                   <div key={idx} className="relative pl-6">
                      <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                         log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-sm font-bold text-slate-800">{log.action}</p>
                            <p className="text-xs text-slate-400 font-mono">{log.time}</p>
                         </div>
                         {log.status === 'failure' && (
                            <button className="text-xs text-red-600 hover:underline flex items-center gap-1">
                               <AlertCircle size={12} /> View Details
                            </button>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
