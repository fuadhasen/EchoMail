import { useToast } from "@/context/ToastContext";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import React from "react";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#213145] text-white p-4 rounded-xl shadow-lg border border-white/10 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-sky-400 shrink-0" />
            )}
            <p className="font-sans text-xs font-semibold leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            className="opacity-75 hover:opacity-100 p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
            onClick={() => removeToast(toast.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
