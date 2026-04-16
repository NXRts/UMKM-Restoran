"use client";

import { storage } from "@/lib/storage";
import { Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PinModalProps {
  onSuccess: () => void;
  isOpen: boolean;
}

export function PinModal({ onSuccess, isOpen }: PinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = storage.getSettings();
    if (pin === settings.pin) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-4 rotate-3">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 text-center tracking-tight">Otorisasi Kasir</h2>
          <p className="text-slate-500 text-sm mt-1 text-center font-medium">Masukkan 4 digit PIN admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError(false);
              }}
              placeholder="••••"
              className={`w-full px-4 py-4 text-center text-3xl tracking-[0.5em] rounded-2xl border-2 transition-all focus:outline-none ${
                error 
                  ? "border-red-400 focus:border-red-500 bg-red-50 text-red-600" 
                  : "border-slate-200 focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 bg-slate-50 font-bold"
              }`}
              autoFocus
            />
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center mt-3 font-bold"
                >
                  PIN salah, silakan coba lagi.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <button
            type="submit"
            disabled={pin.length < 4}
            className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-[0_4px_14px_0_rgba(234,88,12,0.39)]"
          >
            Buka Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
}
