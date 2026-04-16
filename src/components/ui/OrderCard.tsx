"use client";

import { Order, OrderStatus } from "@/lib/storage";
import { formatCurrency, cn } from "@/lib/utils";
import { Clock, CheckCircle2, ChefHat, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const statusMap = {
  baru: { label: "Baru", color: "bg-red-50 text-red-600 border-red-200", icon: AlertCircle },
  diproses: { label: "Diproses", color: "bg-amber-50 text-amber-600 border-amber-200", icon: ChefHat },
  selesai: { label: "Selesai", color: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: CheckCircle2 },
};

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const currentStatus = statusMap[order.status];
  const StatusIcon = currentStatus.icon;

  const timeAgo = Math.floor((Date.now() - order.createdAt) / 60000); // in minutes

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className={cn("px-4 py-3 border-b flex justify-between items-center", currentStatus.color)}>
        <div className="flex items-center gap-2 font-semibold">
          <StatusIcon size={18} />
          <span>{currentStatus.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium opacity-80">
          <Clock size={14} />
          {timeAgo < 1 ? "Baru saja" : `${timeAgo}m lalu`}
        </div>
      </div>
      
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
              Pelanggan / Meja
            </p>
            <h4 className="font-bold text-lg text-slate-800">{order.customerName}</h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="font-bold text-orange-600 text-lg">
              {formatCurrency(order.totalPrice)}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm items-center">
              <span className="text-slate-700">
                <span className="font-semibold text-slate-900">{item.quantity}x</span> {item.name}
              </span>
              <span className="text-slate-500">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 w-full mt-auto">
          {order.status === 'baru' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'diproses')}
              className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors shadow-sm"
            >
              Proses Pesanan
            </button>
          )}
          {order.status === 'diproses' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'selesai')}
              className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-sm"
            >
              Tandai Selesai
            </button>
          )}
          {order.status === 'selesai' && (
            <div className="flex-1 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-sm text-center cursor-not-allowed border border-slate-200">
              Pesanan Selesai
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
