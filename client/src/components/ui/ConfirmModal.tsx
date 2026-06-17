import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onCancel : undefined}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 p-8"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              {title}
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
              {description}
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 py-4 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-4 rounded-xl font-black tracking-wide text-sm text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
                  isDestructive 
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" 
                    : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                }`}
              >
                {isLoading ? "Processing..." : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
