"use client";

import { MenuItem } from "@/lib/storage";
import { formatCurrency, cn } from "@/lib/utils";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface MenuCardProps {
  item: MenuItem;
  isAdmin?: boolean;
  onAddToCart?: (item: MenuItem) => void;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
}

export function MenuCard({ item, isAdmin = false, onAddToCart, onEdit, onDelete }: MenuCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn(
        "bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col transition-shadow hover:shadow-md",
        !item.available && "opacity-60"
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-black/80 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Habis
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-slate-800 text-lg leading-tight">{item.name}</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 grow">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-orange-600 text-lg">
            {formatCurrency(item.price)}
          </span>
          
          {isAdmin ? (
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit?.(item)}
                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
                aria-label="Edit item"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete?.(item)}
                className="p-2 bg-red-50 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                aria-label="Delete item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <button 
              disabled={!item.available}
              onClick={() => onAddToCart?.(item)}
              className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-orange-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
              aria-label="Add to cart"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
