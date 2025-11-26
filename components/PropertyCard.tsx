import React from 'react';
import { Property, PropertyStatus } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Bed, Bath, Ruler, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card noPadding className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={property.status === PropertyStatus.Active ? 'success' : 'neutral'}>
            {property.status}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
           <p className="text-white font-bold text-lg">{formatPrice(property.price)}</p>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-900 mb-1 truncate">{property.title}</h3>
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{property.address}</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 text-slate-600 text-sm">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span>{property.beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler size={16} />
            <span>{property.sqft}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};