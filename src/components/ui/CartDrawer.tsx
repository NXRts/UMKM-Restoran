"use client";

import { OrderItem } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  total: number;
  onUpdateQuantity: (id: string, amount: number) => void;
  onCheckout: (customerName: string) => void;
}

export function CartDrawer({ isOpen, onClose, items, total, onUpdateQuantity, onCheckout }: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("");

  const handleCheckout = () => {
    if (!customerName.trim()) return;
    onCheckout(customerName.trim());
    setCustomerName("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-3xl z-101 flex flex-col h-[85vh] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="p-4 border-b flex justify-between items-center bg-slate-50/80 rounded-t-3xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Pesanan Anda</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white rounded-full text-slate-500 hover:bg-slate-100 transition-colors shadow-sm border border-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="opacity-30" />
                  </div>
                  <p className="font-medium text-slate-500">Keranjang masih kosong</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.menuItemId} 
                    className="flex justify-between items-center p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm"
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-orange-600 font-bold mt-0.5">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-1 py-1 rounded-xl border border-slate-100">
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItemId, -1)}
                        className="p-2 rounded-lg bg-white text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center font-bold text-sm text-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItemId, 1)}
                        className="p-2 rounded-lg bg-white text-orange-600 shadow-sm transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
              
              {items.length > 0 && (
                <div className="mt-8 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 -mr-12 -mt-12 rounded-full" />
                  <label className="block text-sm font-bold text-slate-700 mb-2 relative z-10">Nama Pemesan / Meja</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi atau Meja 4"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-slate-50 transition-all font-medium text-slate-800 relative z-10"
                    required
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t rounded-b-3xl">
              <div className="flex justify-between items-end mb-4 px-2">
                <span className="text-slate-500 font-semibold mb-1">Total Pembayaran</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(total)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || !customerName.trim()}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-[0_8px_20px_rgba(234,88,12,0.2)] hover:shadow-[0_8px_25px_rgba(234,88,12,0.3)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Kiriman Pesanan Sekarang
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
