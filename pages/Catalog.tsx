import React from 'react';
import { Filter, Search, Grid, List, Plus, Calendar } from 'lucide-react';
import { DataProduct } from '../types';

const products: DataProduct[] = [
  { id: 'DP-001', name: '企业工商信用评分模型', provider: '国家市监总局', industry: '金融监管', description: '基于全国企业信用信息公示系统数据，提供实时信用评分查询接口。', publishDate: '2024-02-15' },
  { id: 'DP-002', name: '重点区域电力消耗指数', provider: '国家电网', industry: '宏观经济', description: '包含京津冀地区规上工业企业每日用电量指数，用于经济活力监测。', publishDate: '2024-03-01' },
  { id: 'DP-003', name: '医保药品结算清单脱敏数据', provider: '北京市医保局', industry: '医疗卫生', description: '已完成K-anonymity脱敏处理，仅限科研机构申请使用。', publishDate: '2024-01-20' },
  { id: 'DP-004', name: '道路货运车辆轨迹热力图', provider: '交通运输部', industry: '交通物流', description: '基于北斗车载终端数据，生成全国高速公路货运密度热力图。', publishDate: '2024-03-10' },
];

const Catalog: React.FC = () => {
  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Filters */}
      <div className="w-64 flex-shrink-0 space-y-6">
         <button className="w-full bg-gov-700 hover:bg-gov-800 text-white py-2.5 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2 transition-colors">
           <Plus size={18} /> 登记新产品
         </button>

         <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
               <Filter size={16} /> 筛选 (Filters)
            </div>
            
            <div className="space-y-4">
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">所属行业</h4>
                  <div className="space-y-2">
                     {['全部', '金融监管', '医疗卫生', '交通物流', '宏观经济'].map(i => (
                        <label key={i} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
                           <input type="checkbox" className="rounded text-gov-700 focus:ring-gov-500 border-slate-300" />
                           {i}
                        </label>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-4">
         {/* Toolbar */}
         <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div className="relative w-96">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
               <input type="text" placeholder="在目录中搜索..." className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-gov-500" />
            </div>
            <div className="flex gap-2">
               <button className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"><List size={18}/></button>
               <button className="p-2 bg-white text-slate-400 rounded hover:text-slate-600"><Grid size={18}/></button>
            </div>
         </div>

         {/* List View */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 font-semibold">产品名称 / 描述</th>
                     <th className="px-6 py-4 font-semibold">提供方</th>
                     <th className="px-6 py-4 font-semibold">行业</th>
                     <th className="px-6 py-4 font-semibold">发布日期</th>
                     <th className="px-6 py-4 font-semibold text-right">操作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm">
                  {products.map(p => (
                     <tr key={p.id} className="hover:bg-slate-50 group cursor-pointer transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800 text-base mb-1 group-hover:text-gov-700">{p.name}</div>
                           <p className="text-slate-500 text-xs line-clamp-1 max-w-md">{p.description}</p>
                           <div className="mt-2 flex gap-2">
                              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">HTTP API</span>
                              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">JSON</span>
                           </div>
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
                        <td className="px-6 py-4 text-right">
                           <button className="text-gov-700 hover:text-gov-800 font-medium text-sm px-3 py-1.5 rounded hover:bg-gov-50 border border-transparent hover:border-gov-200 transition-all">
                              查看详情
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Catalog;
