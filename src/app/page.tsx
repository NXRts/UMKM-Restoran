"use client";

import { useEffect, useState, useMemo } from "react";
import { MenuItem, OrderItem, storage, Settings } from "@/lib/storage";
import { MenuCard } from "@/components/ui/MenuCard";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { ShoppingBag, Search, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Load data from storage
    setMenuItems(storage.getMenuItems());
    setSettings(storage.getSettings());
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((item) => item.category)));
    return ["Semua", ...cats];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === "Semua" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    toast.success(`${item.name} ditambahkan ke keranjang`);
  };

  const updateCartQuantity = (id: string, amount: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.menuItemId === id) {
            const newQty = Math.max(0, item.quantity + amount);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleCheckout = (customerName: string) => {
    storage.saveOrder({
      customerName,
      items: cart,
      totalPrice: cartTotal,
      status: "baru",
    });
    setCart([]);
    setIsCartOpen(false);
    toast.success("Pesanan berhasil dikirim!", {
      description: "Silakan tunggu pesanan Anda diproses.",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header / Hero */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-900 tracking-tight leading-none">
                {settings?.storeName || "Nusantara"}
              </h1>
              <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mt-0.5">
                Digital Menu & POS
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 border border-slate-100 transition-all active:scale-95"
          >
            <ShoppingBag size={22} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <section className="px-4 py-8 md:py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-slate-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/10 rounded-full -ml-16 -mb-16 blur-2xl" />
            
            <div className="relative z-10 max-w-lg">
              <span className="inline-block px-4 py-1.5 bg-orange-600/20 text-orange-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Selamat Datang
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-[1.1]">
                Nikmati Hidangan <span className="text-orange-500">Terbaik</span> Kami.
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium">
                Pilih menu favorit Anda dan pesan langsung dari ponsel.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Search & Categories */}
        <section className="px-4 sticky top-[73px] md:top-[89px] z-40 py-2 bg-slate-50/80 backdrop-blur-md">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Cari menu favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-slate-800"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all text-sm ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Menu Grid */}
        <section className="px-4 py-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <MenuCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="opacity-30" />
              </div>
              <p className="font-bold text-slate-500">Menu tidak ditemukan</p>
              <p className="text-sm">Coba kata kunci lain atau kategori lain.</p>
            </div>
          )}
        </section>
      </div>

      {/* Floating Cart (Mobile) */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.div 
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            className="fixed bottom-8 left-0 right-0 px-4 z-50 pointer-events-none"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="max-w-md mx-auto w-full h-16 bg-slate-900 text-white rounded-2xl shadow-2xl pointer-events-auto flex items-center justify-between px-6 active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold">
                  {cartCount}
                </div>
                <span className="font-bold">Lihat Pesanan</span>
              </div>
              <span className="font-black text-lg text-orange-400">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(cartTotal)}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        total={cartTotal}
        onUpdateQuantity={updateCartQuantity}
        onCheckout={handleCheckout}
      />
    </main>
  );
}
