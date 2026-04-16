"use client";

import { useEffect, useState, useMemo } from "react";
import { Order, storage, OrderStatus } from "@/lib/storage";
import { OrderCard } from "@/components/ui/OrderCard";
import { TrendingUp, Package, CheckCircle2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export default function KasirDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () => {
    setOrders(storage.getOrders());
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000); // Polling every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => o.createdAt >= today);
    const totalRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingOrders = orders.filter((o) => o.status !== "selesai").length;

    return [
      {
        label: "Pendapatan Hari Ini",
        value: formatCurrency(totalRevenue),
        icon: TrendingUp,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        label: "Total Pesanan Hari Ini",
        value: todayOrders.length.toString(),
        icon: ShoppingCart,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Pesanan Aktif",
        value: pendingOrders.toString(),
        icon: Package,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        label: "Selesai",
        value: orders.filter((o) => o.status === "selesai").length.toString(),
        icon: CheckCircle2,
        color: "text-slate-600",
        bg: "bg-slate-50",
      },
    ];
  }, [orders]);

  const updateStatus = (id: string, status: OrderStatus) => {
    storage.updateOrderStatus(id, status);
    fetchOrders();
  };

  const groupedOrders = useMemo(() => {
    return {
      baru: orders.filter((o) => o.status === "baru"),
      diproses: orders.filter((o) => o.status === "diproses"),
      selesai: orders.filter((o) => o.status === "selesai"),
    };
  }, [orders]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Pesanan</h2>
        <p className="text-slate-500 font-medium">Pantau dan kelola pesanan masuk secara real-time.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-slate-800">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Order Tables/Grids by Status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Baru */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              Pesanan Baru
            </h3>
            <span className="bg-red-50 text-red-600 text-xs font-black px-2 py-1 rounded-full border border-red-100">
              {groupedOrders.baru.length}
            </span>
          </div>
          <div className="space-y-4">
            {groupedOrders.baru.length > 0 ? (
              groupedOrders.baru.map((order) => (
                <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
              ))
            ) : (
              <div className="py-12 text-center bg-slate-100/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-sm">Belum ada pesanan baru</p>
              </div>
            )}
          </div>
        </section>

        {/* Diproses */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
              Sedang Diproses
            </h3>
            <span className="bg-amber-50 text-amber-600 text-xs font-black px-2 py-1 rounded-full border border-amber-100">
              {groupedOrders.diproses.length}
            </span>
          </div>
          <div className="space-y-4">
            {groupedOrders.diproses.length > 0 ? (
              groupedOrders.diproses.map((order) => (
                <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
              ))
            ) : (
              <div className="py-12 text-center bg-slate-100/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-sm">Tidak ada pesanan aktif</p>
              </div>
            )}
          </div>
        </section>

        {/* Selesai */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              Riwayat Selesai
            </h3>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-black px-2 py-1 rounded-full border border-emerald-100">
              {groupedOrders.selesai.length}
            </span>
          </div>
          <div className="space-y-4 opacity-75 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 transition-all">
            {groupedOrders.selesai.length > 0 ? (
              groupedOrders.selesai.slice(0, 5).map((order) => (
                <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
              ))
            ) : (
              <div className="py-12 text-center bg-slate-100/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-sm">Belum ada pesanan selesai</p>
              </div>
            )}
            {groupedOrders.selesai.length > 5 && (
              <p className="text-center text-xs text-slate-400 font-medium italic">
                Menampilkan 5 pesanan terakhir...
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
