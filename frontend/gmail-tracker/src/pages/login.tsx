import { Check, Lock } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#fafafb] p-6 relative overflow-hidden font-sans select-none"
      id="echomail-login-root"
    >
      {/* Main Single-Column Premium Login Card (Extended Height & Balanced Hierarchy) */}
      <div
        className="w-full max-w-117.5 min-h-150 bg-white border border-slate-200/80 rounded-4xl p-8 sm:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.01)] relative z-10 flex flex-col justify-between transition-all duration-300"
        id="login-card"
      >
        <div className="flex flex-col items-center text-center space-y-7 my-auto animate-in fade-in duration-500">
          {/* EchoMail Brand Logo */}
          <div className="flex flex-col items-center gap-2 select-none">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-sans font-black text-base tracking-tighter shadow-xs hover:scale-105 transition-transform duration-200">
              E
            </div>
            <span className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-slate-400">
              EchoMail
            </span>
          </div>

          {/* Heading & Core Value Copy */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight">
              Welcome to EchoMail
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-normal px-1">
              Connect your account to let EchoMail quietly watch your sent
              threads, detect replies in real-time, and flag overdue
              conversations before they turn cold.
            </p>
          </div>

          {/* Core Login Call to Action */}
          <div className="w-full space-y-3.5 pt-1">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-slate-950 hover:bg-slate-900 active:scale-[0.98] rounded-xl font-sans text-xs font-bold text-white transition-all duration-150 shadow-xs cursor-pointer focus:outline-none disabled:opacity-75 relative overflow-hidden group"
              id="google-login-button"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                  <span className="font-medium text-slate-200">
                    Signing in...
                  </span>
                </div>
              ) : (
                <>
                  {/* Google SVG Vector Graphic */}
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#FFF"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      className="opacity-95"
                    />
                    <path
                      fill="#FFF"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      className="opacity-90"
                    />
                    <path
                      fill="#FFF"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                      className="opacity-85"
                    />
                    <path
                      fill="#FFF"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                      className="opacity-95"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Small trust/security micro-copy */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium select-none">
              <Lock size={11} className="text-slate-400" />
              <span>Google OAuth 2.0 verified authentication</span>
            </div>
          </div>

          {/* Simple, Monochromatic Feature Summary (Placed below the login button) */}
          <div className="w-full pt-4 border-t border-slate-100 space-y-2.5 text-left">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Check size={11} className="text-slate-600 stroke-[2.5]" />
              </div>
              <span className="font-medium">
                Direct inbox sync with zero extensions required
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Check size={11} className="text-slate-600 stroke-[2.5]" />
              </div>
              <span className="font-medium">
                Automated response alerts and follow-up reminders
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Check size={11} className="text-slate-600 stroke-[2.5]" />
              </div>
              <span className="font-medium">
                Read-only audit safety without altering messages
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating minimalistic footer */}
      <footer className="absolute bottom-6 text-[11px] text-slate-400 font-medium font-sans space-x-3 select-none animate-in fade-in duration-1000">
        <span>© 2026 EchoMail</span>
        <span className="text-slate-300">•</span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-slate-600 transition-colors"
        >
          Privacy Policy
        </a>
        <span className="text-slate-300">•</span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-slate-600 transition-colors"
        >
          Terms of Service
        </a>
      </footer>
    </div>
  );
}
