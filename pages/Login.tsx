import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowRight, GripHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  // Captcha State
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random code
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserCaptcha(''); // Clear input on regeneration
    setCaptchaError(false);
  };

  // Draw captcha on canvas
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Noise dots
    for (let i = 0; i < 30; i++) {
       ctx.fillStyle = `rgba(${Math.random()*100 + 100},${Math.random()*100 + 100},${Math.random()*100 + 100}, 0.5)`;
       ctx.beginPath();
       ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
       ctx.fill();
    }

    // Text with rotation
    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    const startX = 20;
    for (let i = 0; i < captchaCode.length; i++) {
       ctx.save();
       const x = startX + i * 24;
       const y = canvas.height / 2;
       ctx.translate(x, y);
       // Random rotation between -0.3 and 0.3 rad
       ctx.rotate((Math.random() - 0.5) * 0.5);
       ctx.fillStyle = `rgb(${Math.random()*100},${Math.random()*100},${Math.random()*150})`;
       ctx.fillText(captchaCode[i], 0, 0);
       ctx.restore();
    }
    
    // Interference line
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${Math.random()*100},${Math.random()*100},${Math.random()*200}, 0.4)`;
    ctx.lineWidth = 2;
    ctx.moveTo(5, Math.random() * 40);
    ctx.bezierCurveTo(30, Math.random() * 40, 80, Math.random() * 40, 115, Math.random() * 40);
    ctx.stroke();
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (captchaCode) drawCaptcha();
  }, [captchaCode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Captcha
    if (userCaptcha.toUpperCase() !== captchaCode) {
        setCaptchaError(true);
        generateCaptcha(); // Regenerate on failure to prevent brute force
        return;
    }

    setLoading(true);
    // Mock login delay
    setTimeout(() => {
        setLoading(false);
        navigate('/'); // Go to dashboard
    }, 1000);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">
       {/* Top Bar */}
       <div className="bg-slate-900 text-white px-8 py-4 flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Trusted Data Space Platform</span>
       </div>

       <div className="flex-1 flex items-center justify-center px-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-blue-900/5 p-10 w-full max-w-md relative overflow-hidden">
             {/* Decorative Background Element */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gov-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50 pointer-events-none"></div>
             
             <div className="text-center mb-8 relative z-10">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">欢迎登录</h1>
                <p className="text-slate-500 text-sm">请输入您的账号凭证以访问平台</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">账号</label>
                   <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gov-600 transition-colors">
                         <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:bg-white transition-all text-slate-800 font-medium"
                        placeholder="用户名 / 手机号 / 邮箱"
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                      />
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-1.5 ml-1">
                      <label className="block text-sm font-bold text-slate-700">密码</label>
                      <button type="button" className="text-xs text-gov-600 hover:text-gov-800 font-medium">忘记密码?</button>
                   </div>
                   <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gov-600 transition-colors">
                         <Lock size={18} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:bg-white transition-all text-slate-800 font-medium"
                        placeholder="请输入密码"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">验证码</label>
                   <div className="flex gap-3">
                     <div className="relative group flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gov-600 transition-colors">
                           <GripHorizontal size={18} />
                        </div>
                        <input 
                           type="text" 
                           required
                           className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:bg-white transition-all text-slate-800 font-medium uppercase tracking-widest ${
                              captchaError ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'
                           }`}
                           placeholder="验证码"
                           value={userCaptcha}
                           onChange={e => { setUserCaptcha(e.target.value); if(captchaError) setCaptchaError(false); }}
                           maxLength={4}
                        />
                     </div>
                     <canvas 
                        ref={canvasRef}
                        width={120}
                        height={48}
                        onClick={generateCaptcha}
                        className="rounded-xl border border-slate-200 cursor-pointer hover:border-gov-400 transition-colors shadow-sm"
                        title="点击刷新验证码"
                     />
                   </div>
                   {captchaError && (
                      <p className="text-xs text-red-500 mt-1.5 ml-1">验证码错误，请重新输入</p>
                   )}
                </div>

                <div className="pt-2">
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full py-3 bg-gov-700 text-white rounded-xl font-bold hover:bg-gov-800 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                   >
                     {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          登录中...
                        </>
                     ) : (
                        <>登录 <ArrowRight size={18} opacity={0.8} /></>
                     )}
                   </button>
                </div>
             </form>

             <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-sm text-slate-500">
                   还没有账号? 
                   <button onClick={() => navigate('/register')} className="ml-2 text-gov-700 font-bold hover:underline">
                      立即注册
                   </button>
                </p>
             </div>
          </div>
       </div>

       {/* Footer */}
       <div className="py-6 text-center text-xs text-slate-400">
          &copy; 2024 Trusted Data Space Platform. All rights reserved.
       </div>
    </div>
  );
};

export default Login;