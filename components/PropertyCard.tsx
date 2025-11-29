import React, { useState, useRef, useEffect } from 'react';
import { Property, PropertyStatus } from '../types';
import { Badge } from './ui/Badge';
import { Bed, Bath, Ruler, MapPin, Edit2, Trash2, MoreVertical } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusVariant = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.Active: return 'success';
      case PropertyStatus.Sold: return 'danger';
      case PropertyStatus.Draft: return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className="h-full relative group">
      <div 
        className="bg-surface dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col hover:shadow-md transition-all h-full relative overflow-hidden"
      >
          {/* Image Section */}
          <div className="relative h-48 w-full shrink-0">
             <img 
               src={property.image} 
               alt={property.title} 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-80 pointer-events-none" />
             
             {/* Badge - Top Left */}
             <div className="absolute top-3 left-3 z-10">
               <Badge variant={getStatusVariant(property.status)}>
                 {property.status}
               </Badge>
             </div>

             {/* Menu Button - Top Right */}
             <div className="absolute top-3 right-3 z-20" ref={menuRef}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-1.5 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-colors border border-white/10"
                >
                  <MoreVertical size={16} />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                     <button 
                       onClick={(e) => { e.stopPropagation(); onClick?.(); setShowMenu(false); }}
                       className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                     >
                       <Edit2 size={14} /> Edit Details
                     </button>
                     {onDelete && (
                       <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(e); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-50 dark:border-slate-800"
                       >
                         <Trash2 size={14} /> Delete
                       </button>
                     )}
                  </div>
                )}
             </div>

             {/* Price - Bottom Left of Image */}
             <div className="absolute bottom-3 left-3 text-white z-10">
                <p className="font-bold text-lg drop-shadow-md">{formatPrice(property.price)}</p>
             </div>
          </div>
          
          {/* Content Section */}
          <div className="p-4 flex-1 flex flex-col cursor-pointer" onClick={onClick}>
             <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 truncate group-hover:text-accent transition-colors">{property.title}</h3>
             
             <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
               <MapPin size={14} className="mr-1 shrink-0" />
               <span className="truncate">{property.address}</span>
             </div>
             
             <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm">
               <div className="flex items-center gap-1.5" title={`${property.beds} Bedrooms`}>
                 <Bed size={16} className="text-slate-400" />
                 <span>{property.beds} <span className="text-xs text-slate-400 hidden sm:inline">Beds</span></span>
               </div>
               <div className="flex items-center gap-1.5" title={`${property.baths} Bathrooms`}>
                 <Bath size={16} className="text-slate-400" />
                 <span>{property.baths} <span className="text-xs text-slate-400 hidden sm:inline">Baths</span></span>
               </div>
               <div className="flex items-center gap-1.5" title={`${property.sqft} Square Feet`}>
                 <Ruler size={16} className="text-slate-400" />
                 <span>{property.sqft} <span className="text-xs text-slate-400 hidden sm:inline">sqft</span></span>
               </div>
             </div>
          </div>
      </div>
    </div>
  );
};