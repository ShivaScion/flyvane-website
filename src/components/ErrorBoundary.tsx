import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled component error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#040406] text-neutral-200 flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-[#0c0d12] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 block font-semibold">
                SYSTEM INTERFACE RECOVERY
              </span>
              <h2 className="text-xl font-display font-bold text-white tracking-tight">
                An unexpected interface error occurred
              </h2>
              <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                A component failed to render. The error has been isolated so your session and browser stay intact.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#040406] p-3 rounded-lg border border-white/5 text-[11px] font-mono text-neutral-500 text-left overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-mono text-xs transition-colors"
              >
                Dismiss & Continue
              </button>
              <button
                onClick={this.handleReload}
                className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
