import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Aletheia Lens Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('aletheia_lens_v1');
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-[#0d0d0d] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
             {/* Decorative background glow */}
             <div className="absolute -top-24 -left-24 w-48 h-48 bg-aetheric-pink/10 blur-[100px] rounded-full"></div>
             
             <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-aetheric-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AlertTriangle className="text-aetheric-red" size={32} />
                </div>
                
                <h1 className="text-2xl font-bold mb-3 tracking-tight">System Anomaly Detected</h1>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  The Aetheric interface encountered an unexpected interruption. This is often caused by mismatched session data in your local storage.
                </p>

                <div className="space-y-3">
                   <button 
                     onClick={this.handleReload}
                     className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold uppercase tracking-widest transition"
                   >
                     <RefreshCw size={16} /> Attempt Re-sync
                   </button>
                   
                   <button 
                     onClick={this.handleReset}
                     className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-aetheric-pink hover:bg-purple-500 rounded-xl text-white text-sm font-bold uppercase tracking-widest transition shadow-[0_0_15px_rgba(224,75,245,0.3)]"
                   >
                     <Trash2 size={16} /> Reset Application Data
                   </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800/50">
                   <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest break-all">
                     Error Trace: {this.state.error?.message || this.state.error?.name || 'UNKNOWN_CORE_FAILURE'}
                   </p>
                </div>
             </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
