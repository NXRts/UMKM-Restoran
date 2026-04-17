"use client";

import { useState, useEffect } from "react";
import { PinModal } from "@/components/ui/PinModal";
import { LayoutDashboard, Utensils, Settings, LogOut, Store } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { storage } from "@/lib/storage";

export default function KasirLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storeName, setStoreName] = useState("Restoran Nusantara");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if session exists (could use a simple sessionStorage item for this prototype)
    const session = sessionStorage.getItem("pos_admin_auth");
    if (session === "true") {
      setIsAuthenticated(true);
    }
    
    setStoreName(storage.getSettings().storeName);
  }, []);

  const handleAuthSuccess = () => {
    sessionStorage.setItem("pos_admin_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pos_admin_auth");
    setIsAuthenticated(false);
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", href: "/kasir", icon: LayoutDashboard },
    { name: "Menu", href: "/kasir/menu", icon: Utensils },
    { name: "Settings", href: "/kasir/settings", icon: Settings },
  ];

  if (!isAuthenticated) {
    return <PinModal isOpen={true} onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold">
            <Store size={18} />
          </div>
          <span className="font-bold text-sm tracking-tight">{storeName}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-white"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white sticky top-0 h-screen overflow-y-auto z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-orange-600/20">
              <Store size={22} />
            </div>
            <div>
              <h1 className="font-black text-lg leading-none truncate w-32">{storeName}</h1>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? "text-orange-600" : "text-slate-400"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? "bg-orange-100" : ""}`}>
                <Icon size={22} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
