import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-gov-navy border border-red-500/30 w-full max-w-sm rounded-lg overflow-hidden shadow-2xl"
      >
        {/* Tricolor top line */}
        <div className="tricolor-bar-h h-1 w-full" />

        {/* Modal Header */}
        <div className="border-b border-gov-border px-5 py-3.5 flex items-center gap-3 bg-[#050f1d]">
          <div className="w-8 h-8 rounded-full border border-red-500/40 bg-red-950/40 flex items-center justify-center shrink-0 text-red-400">
            <LogOut className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold font-serif text-white leading-tight">
              Sign Out of Portal
            </h2>
            <p className="text-[10px] text-gov-slate font-mono">
              JanSahayak Session Management
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          <div className="border border-red-500/20 bg-red-950/20 rounded p-3 mb-3">
            <p className="text-xs text-red-200/90 leading-relaxed font-sans">
              Are you sure you want to log out? Any unsaved changes in grievance drafts will be discarded.
            </p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            To protect your citizen credentials, remember to sign out whenever you use a shared or public computer.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-5 pb-5 pt-1 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-3 rounded border border-gov-border text-slate-300 hover:text-white hover:bg-white/[0.04] transition text-xs font-semibold uppercase tracking-wider active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-3 rounded bg-red-600 hover:bg-red-500 text-white transition text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-red-900/30 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Confirm</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
