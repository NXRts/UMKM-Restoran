"use client";

import { useState, useEffect, useRef } from "react";
import { storage, Settings } from "@/lib/storage";
import { Save, QrCode, Download, RefreshCw, KeyRound, LayoutGrid } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    storeName: "",
    pin: "",
  });
  
  const [menuUrl, setMenuUrl] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettings(storage.getSettings());
    // Get absolute URL for the home page
    if (typeof window !== "undefined") {
      setMenuUrl(window.location.origin);
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.pin.length !== 4) {
      toast.error("PIN harus 4 digit");
      return;
    }
    storage.saveSettings(settings);
    toast.success("Pengaturan berhasil disimpan");
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qr-menu-${settings.storeName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = url;
      link.click();
      toast.success("QR Code berhasil diunduh");
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Pengaturan</h2>
        <p className="text-slate-500 font-medium">Atur profil toko, keamanan, dan bagikan menu digital Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile & Security */}
        <section className="space-y-6">
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <div className="p-2 bg-slate-900 text-white rounded-xl">
                <LayoutGrid size={18} />
              </div>
              <h3 className="font-bold text-slate-800">Profil Toko</h3>
            </div>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nama Restoran / UMKM</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound size={14} className="text-slate-400" />
                  <label className="text-sm font-bold text-slate-700">PIN Akses Kasir</label>
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={settings.pin}
                  onChange={(e) => setSettings({ ...settings, pin: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-mono tracking-widest text-lg"
                  placeholder="••••"
                />
                <p className="text-[10px] text-slate-400 italic">PIN digunakan untuk masuk ke dashboard admin ini.</p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-slate-200"
              >
                <Save size={18} />
                Simpan Konfigurasi
              </button>
            </form>
          </div>
        </section>

        {/* QR Code Sharing */}
        <section className="space-y-6">
          <div className="bg-white p-8 rounded-4xl border border-orange-100 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16" />
            
            <div className="flex items-center gap-3 border-b border-orange-50 pb-4 relative z-10">
              <div className="p-2 bg-orange-600 text-white rounded-xl">
                <QrCode size={18} />
              </div>
              <h3 className="font-bold text-slate-800">QR Menu Digital</h3>
            </div>

            <div className="flex flex-col items-center gap-6 relative z-10">
              <div 
                ref={qrRef} 
                className="p-6 bg-white rounded-3xl border-2 border-slate-100 shadow-inner flex items-center justify-center"
              >
                {menuUrl && (
                  <QRCodeCanvas
                    value={menuUrl}
                    size={160}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "https://nextjs.org/favicon.ico",
                      x: undefined,
                      y: undefined,
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Buka Menu Digital</p>
                <p className="text-xs text-slate-400 mt-1 break-all max-w-[240px] font-medium">{menuUrl}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={downloadQR}
                  className="py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Unduh PNG
                </button>
                <button
                  onClick={() => {
                    if (confirm("Reset seluruh data menu ke pengaturan awal? Semua perubahan menu yang Anda buat akan hilang.")) {
                      storage.resetMenu();
                      toast.success("Data menu berhasil direset ke pengaturan awal.");
                      window.location.reload();
                    }
                  }}
                  className="py-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Reset Menu
                </button>
              </div>
            </div>

            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
              <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                Cetak QR code ini dan letakkan di meja pelanggan. Pelanggan cukup scan untuk melihat menu dan memesan.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
