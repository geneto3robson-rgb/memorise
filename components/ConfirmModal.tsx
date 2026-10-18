"use client";

import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fond flouté */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Contenu du modal */}
      <div className="relative bg-white dark:bg-[#0A1E1E] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#CEEC22]/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-[#184F53] dark:text-[#CEEC22]" />
          </div>
          <h3 className="text-xl font-bold text-[#0A1E1E] dark:text-white">{title}</h3>
        </div>
        
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-full bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm font-bold transition-all shadow-md"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}