import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Settings,
  User,
  FlaskConical,
  BookOpen,
  LayoutDashboard,
  FileText,
  HelpCircle,
  Plus,
  GitCompare,
  Activity,
  X,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import { useApp } from '../context/AppContext';

const SIDEBAR_ITEMS = [
  { to: '/playground', label: 'Input Playground', icon: FileText },
  { to: '/comparison', label: 'Comparison View', icon: GitCompare },
  { to: '/workbench', label: 'Validation Workbench', icon: Activity },
  { to: '/dashboard', label: 'Learning Dashboard', icon: LayoutDashboard },
];

export default function Layout() {
  const { notifications, removeNotification, startNewSession } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleStartNewSession = () => {
    startNewSession();
    navigate('/playground');
  };

  return (
    <div className="flex flex-col h-screen bg-aetheric-bg text-aetheric-text font-sans overflow-hidden selection:bg-aetheric-pink selection:text-white">
      {/* Top Bar */}
      <header className="h-14 flex-shrink-0 flex items-center px-6 border-b border-aetheric-border bg-aetheric-bg z-20 w-full relative justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Aletheia <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-aetheric-pink">Lens</span></span>
        </div>

        <nav className="flex space-x-8 absolute left-1/2 transform -translate-x-1/2 h-full items-center">
          <NavLink to="/playground" className={({isActive}) => clsx("text-xs font-semibold tracking-wider uppercase transition-colors uppercase", isActive ? "text-aetheric-pink border-b-2 border-aetheric-pink h-full flex items-center pt-0.5" : "text-gray-400 hover:text-white pt-0.5")}>Playground</NavLink>
          <NavLink to="/workbench" className={({isActive}) => clsx("text-xs font-semibold tracking-wider uppercase transition-colors uppercase", isActive ? "text-aetheric-pink border-b-2 border-aetheric-pink h-full flex items-center pt-0.5" : "text-gray-400 hover:text-white pt-0.5")}>Workbench</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => clsx("text-xs font-semibold tracking-wider uppercase transition-colors uppercase", isActive ? "text-aetheric-pink border-b-2 border-aetheric-pink h-full flex items-center pt-0.5" : "text-gray-400 hover:text-white pt-0.5")}>Dashboard</NavLink>
        </nav>

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={clsx("text-gray-400 hover:text-white transition relative", showNotifications && "text-white")}
            >
              <Bell size={18} />
              {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-aetheric-pink rounded-full shadow-[0_0_5px_rgba(224,75,245,0.8)]"></span>}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-[#111] border border-aetheric-border rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-aetheric-border flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-500 italic">No new alerts</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-aetheric-border/50 flex gap-3 hover:bg-white/5 transition group">
                        <div className="mt-0.5">
                          {n.type === 'success' && <CheckCircle size={14} className="text-aetheric-green" />}
                          {n.type === 'info' && <Info size={14} className="text-blue-400" />}
                          {n.type === 'warning' && <AlertTriangle size={14} className="text-amber-400" />}
                          {n.type === 'error' && <AlertCircle size={14} className="text-aetheric-red" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-200 leading-normal">{n.message}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <button onClick={() => removeNotification(n.id)} className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button onClick={() => navigate('/settings')} className="text-gray-400 hover:text-white transition"><Settings size={18} /></button>
          
          <div 
            onClick={() => navigate('/account')}
            className="w-7 h-7 rounded-full bg-gradient-to-tr from-aetheric-pink to-indigo-500 flex items-center justify-center p-0.5 cursor-pointer hover:scale-105 transition shadow-[0_0_10px_rgba(224,75,245,0.2)]"
          >
            <div className="w-full h-full rounded-full bg-aetheric-bg flex items-center justify-center">
              <User size={14} className="text-aetheric-pink" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 flex flex-col bg-aetheric-bg border-r border-aetheric-border relative z-10">
          <div className="pt-6 pb-8 px-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-aetheric-pink/20 flex items-center justify-center border border-aetheric-pink/30">
                  <FlaskConical size={18} className="text-aetheric-pink" />
               </div>
               <div>
                 <h2 className="text-sm font-bold text-white tracking-wide">Research Lab</h2>
                 <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase tracking-widest">v3.2.0-Alpha</p>
               </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {SIDEBAR_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group',
                    isActive
                       ? 'bg-aetheric-panel border border-aetheric-border text-white shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)]'
                       : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  )
                }
              >
                <Icon size={16} className={clsx("transition-colors", "group-hover:text-aetheric-pink")} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 mt-auto">
             <button 
                onClick={handleStartNewSession}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-aetheric-pink to-purple-600 rounded-xl text-white text-xs font-bold uppercase tracking-wider relative overflow-hidden group shadow-[0_0_15px_rgba(224,75,245,0.3)] hover:shadow-[0_0_25px_rgba(224,75,245,0.5)] transition-all"
             >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <Plus size={16} className="relative z-10" />
                <span className="relative z-10">Start New Session</span>
             </button>
             
             <div className="mt-8 space-y-4 px-2 pb-2">
                <button className="flex items-center gap-3 text-xs text-gray-400 hover:text-white uppercase tracking-wider font-semibold transition">
                   <BookOpen size={14} /> Documentation
                </button>
                <button className="flex items-center gap-3 text-xs text-gray-400 hover:text-white uppercase tracking-wider font-semibold transition">
                   <HelpCircle size={14} /> Support
                </button>
             </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-aetheric-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
