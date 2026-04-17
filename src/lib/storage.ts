export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'baru' | 'diproses' | 'selesai';

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: number;
}

export interface Settings {
  storeName: string;
  pin: string;
}

const STORAGE_KEYS = {
  MENU: 'pos_menu',
  ORDERS: 'pos_orders',
  SETTINGS: 'pos_settings',
};

const DUMMY_MENU: MenuItem[] = [
  {
    id: "m-1",
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur ceplok, ayam suwir, krupuk dan acar.",
    price: 35000,
    category: "Makanan",
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600",
    available: true,
  },
  {
    id: "m-2",
    name: "Mie Goreng Jawa",
    description: "Mie kuning basah dengan bumbu jawa yang khas, irisan kol dan tomat.",
    price: 30000,
    category: "Makanan",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600",
    available: true,
  },
  {
    id: "d-1",
    name: "Es Teh Manis",
    description: "Teh melati seduh dengan es batu dan gula asli.",
    price: 8000,
    category: "Minuman",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600",
    available: true,
  },
  {
    id: "d-2",
    name: "Kopi Susu Gula Aren",
    description: "Espresso dengan susu segar dan sirup gula aren asli pilihan.",
    price: 22000,
    category: "Minuman",
    imageUrl: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=600",
    available: true,
  },
  {
    id: "s-1",
    name: "Tempe Mendoan",
    description: "Tempe goreng tepung setengah matang (5 pcs) + sambal kecap.",
    price: 15000,
    category: "Cemilan",
    imageUrl: "https://images.unsplash.com/photo-1635345750050-488972688b77?auto=format&fit=crop&q=80&w=600",
    available: true,
  }
];

const DEFAULT_SETTINGS: Settings = {
  storeName: "Restoran Nusantara",
  pin: "1234",
};

// Safe universal getter
const getFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
};

const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

export const storage = {
  // --- MENU ---
  getMenuItems: (): MenuItem[] => {
    if (typeof window === 'undefined') return [];
    const items = window.localStorage.getItem(STORAGE_KEYS.MENU);
    if (!items) {
      setToStorage(STORAGE_KEYS.MENU, DUMMY_MENU);
      return DUMMY_MENU;
    }
    
    // Auto-fix broken images for existing users
    let parsedItems: MenuItem[] = JSON.parse(items);
    let updated = false;
    parsedItems = parsedItems.map(item => {
      if (item.imageUrl.includes("photo-1612929633738-8fe01f7c8ec1")) {
        updated = true;
        return { ...item, imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600" };
      }
      if (item.imageUrl.includes("photo-1595853035070-59a39fe84da3")) {
        updated = true;
        return { ...item, imageUrl: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=600" };
      }
      if (item.imageUrl.includes("photo-1621217596005-24fd516baad7")) {
        updated = true;
        return { ...item, imageUrl: "https://images.unsplash.com/photo-1635345750050-488972688b77?auto=format&fit=crop&q=80&w=600" };
      }
      return item;
    });

    if (updated) setToStorage(STORAGE_KEYS.MENU, parsedItems);
    return parsedItems;
  },
  saveMenuItem: (item: MenuItem): void => {
    const items = storage.getMenuItems();
    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    setToStorage(STORAGE_KEYS.MENU, items);
  },
  deleteMenuItem: (id: string): void => {
    let items = storage.getMenuItems();
    items = items.filter((i) => i.id !== id);
    setToStorage(STORAGE_KEYS.MENU, items);
  },
  resetMenu: (): void => {
    setToStorage(STORAGE_KEYS.MENU, DUMMY_MENU);
  },
  
  // --- ORDERS ---
  getOrders: (): Order[] => {
    return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  },
  saveOrder: (order: Omit<Order, 'id' | 'createdAt'>): Order => {
    const orders = storage.getOrders();
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
    };
    orders.unshift(newOrder); // add to top
    setToStorage(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },
  updateOrderStatus: (id: string, status: OrderStatus): void => {
    const orders = storage.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index >= 0) {
      orders[index].status = status;
      setToStorage(STORAGE_KEYS.ORDERS, orders);
    }
  },

  // --- SETTINGS ---
  getSettings: (): Settings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const s = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!s) {
      setToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(s);
  },
  saveSettings: (settings: Settings): void => {
    setToStorage(STORAGE_KEYS.SETTINGS, settings);
  },
};
