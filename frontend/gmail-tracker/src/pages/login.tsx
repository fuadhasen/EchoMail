import { Lock } from "lucide-react";
import { useState } from "react";

const login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafb] p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pionter-events-none bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-indigo-500/[0.03] rounded-full pointer-events-none blur-[130px] animate-pulse duration-[6s] " />
      <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-violet-500/[0.02] rounded-full  blur-[140px] pointer-events-none animate-pulse duration-[8s]" />

      {/* decorative center ring overlay for visual layering and depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-zinc-200/[0.15] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-zinc-200/[0.08] rounded-full pointer-events-none" />

      {/* main login card */}
      <div className="w-full max-w-[440px] bg-white border border-zinc-200/60 rounded-[28px] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.02),0_1px_3px_rgba(0,0,0,0.01),inset_0_1px_0_rgba(255,255,255,0.6)] relative z-10 transition-all duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.03)]">
        <div className="absolute inset-x-12 -top-px h-0.5 bg-linear-to from-transparent via-indigo-500/25 to-transparent" />

        <div className="flex flex-col items-center text-center space-y-10">
          {/* brand section */}
          <div className="flex flex-col items-center gap-2.5 select-none animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="w-10 h-10 bg-zinc-950 text-zinc-100 rounded-xl flex items-center justify-center font-sans font-black text-xs tracking-tighter shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:scale-105 transition-transform duration-200">
              E
            </div>
            <div className="space-y-0.5">
              <span className="font-sans text-[11px] font-black tracking-[0.25em] uppercase text-zinc-400">
                EchoMail
              </span>
              <span className="block font-sans text-[8px] text-zinc-400 font-semibold tracking-wide">
                v1.2.0
              </span>
            </div>
          </div>

          {/* Typography heading and descriptions */}
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="font-sans text-[24px] md:text-[27px] font-bold text-[#0b1c30] tracking-tight leading-[1.28] px-1">
              Track your important emails and make sure conversations get
              completed.
            </h1>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed font-medium px-2">
              EchoMail sits silently above your primary inbox to securely audit
              outgoing threads and guarantee every critical send meets its
              matching responses.
            </p>
          </div>

          {/* Core login call */}
          <div className="w-full space-y-4.5 pt-3 animate-in fade-in slide-in-from-top-5 duration-1000 ">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] rounded-xl font-sans text-xs font-bold text-white transition-all duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.15)] cursor-pointer focus:outline-none disabled:opacity-75 relative overflow-hidden group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                  <span className="font-medium text-zinc-200">
                    Connecting Securely...
                  </span>
                </div>
              ) : (
                <>
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

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-semibold select-none">
              <Lock size={11} className="text-zinc-300" />
              <span>
                Fully compliant with Google OAuth 2.0 security policies
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-10 text-[9.5px] text-zinc-400 font-bold font-sans tracking-wide space-x-4 select-none animate-in fade-in duration-1000">
        <span>© 2026 ECHOMAIL CORP.</span>
        <span className="text-zinc-300">•</span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-zinc-600 transition-colors"
        >
          PRIVACY POLICY
        </a>
        <span className="text-zinc-300">•</span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-zinc-600 transition-colors"
        >
          SECURITY AUDIT
        </a>
      </footer>
    </div>
  );
};

export default login;
