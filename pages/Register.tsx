import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2,
  User,
  Lock,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0); // 0: Form, 1: Success
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(1);
    }, 1000);
  };

  const renderForm = () => (
    <div className="max-w-md mx-auto py-12 px-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">注册账号</h1>
        <p className="text-slate-500">
          欢迎加入可信数据空间，请填写账户信息完成注册。
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-blue-500/5 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">用户名</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                placeholder="请输入用户名"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="设置登录密码"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:bg-white transition-all text-slate-800"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">确认密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                placeholder="再次输入密码"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">验证码</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="请输入验证码"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
              <button type="button" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-200 transition-colors whitespace-nowrap">
                获取验证码
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gov-700 text-white rounded-lg font-bold hover:bg-gov-800 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                注册中...
              </>
            ) : (
              '立即注册'
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-slate-600 text-sm flex items-center justify-center gap-1 mx-auto hover:underline">
           <ArrowLeft size={16} /> 返回登录
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in zoom-in duration-300">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
        <CheckCircle2 size={48} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">注册成功！</h2>
      <p className="text-slate-500 max-w-md mb-8">
        您的账号已创建成功。请使用该账号登录平台，并在<span className="font-bold text-slate-700">“身份管理”</span>页面完成主体实名认证，认证通过后即可获取完整权限。
      </p>
      
      <button onClick={() => navigate('/login')} className="px-8 py-2.5 bg-gov-700 text-white rounded-lg font-medium hover:bg-gov-800 transition-colors shadow-lg shadow-blue-500/20">
        去登录
      </button>
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto bg-slate-50">
      {/* Simple Topbar */}
      <div className="bg-slate-900 text-white px-8 py-4 flex items-center gap-3 shadow-md sticky top-0 z-10">
         <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
         </div>
         <span className="font-bold text-lg tracking-tight">Trusted Data Space Platform</span>
      </div>

      {step === 0 && renderForm()}
      {step === 1 && renderSuccess()}
    </div>
  );
};

export default Register;