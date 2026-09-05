import { AlertCircle, RefreshCcw } from "lucide-react";

export interface ConversationErrorStateProps {
  title?: string;
  errorMessage?: string;
  onRetry?: () => Promise<unknown> | undefined;
  isRetrying: boolean;
}

const ConversationError = ({
  title = "Unable to load conversation",
  errorMessage = "We couldn't fetch the responses for this email. Please check your connection and try again.",
  onRetry,
  isRetrying = false,
}: ConversationErrorStateProps) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      <div className="py-12 px-6 rounded-xl border border-slate-200/90 bg-slate-50/50 text-center flex flex-col items-center justify-center space-y-3.5 shadow-2xs">
        <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/70 text-rose-600 flex items-center justify-center shadow-2xs">
          <AlertCircle />
        </div>
        <div className="max-w-md space-y-1">
          <h4 className="font-sans text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            {title}
          </h4>
          <p className="font-sans text-xs text-slate-500 leading-relaxed">
            {errorMessage}
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-1 inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-sans text-xs font-semibold px-4 py-2 rounded-xl shadow-2xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <RefreshCcw
              size={13}
              className={`text-slate-600 ${isRetrying ? "animate-spin" : ""}`}
            />
            <span>{isRetrying ? "Retrying..." : "Try again"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversationError;
