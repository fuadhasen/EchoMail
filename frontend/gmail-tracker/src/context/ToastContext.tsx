import React, { createContext, useCallback, useContext, useState } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "info";
}

interface ToastContextType {
  toasts: Toast[];
  triggerToast: (message: string, type: "success" | "info") => void;
  removeToast: (id: number) => void;
}

// create global box
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const triggerToast = useCallback(
    (message: string, type: "success" | "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      // auto remove after 4 sec
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id != id));
      }, 4000);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id != id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, triggerToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  // read the global box
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
