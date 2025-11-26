import React, { useState } from 'react';
import { Property, PropertyStatus, PropertyType } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, Search, Sparkles, X } from 'lucide-react';
import { generatePropertyDescription } from '../services/geminiService';

// Mock Data
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    address: '123 Main St, Downtown, Seattle',
    price: 450000,
    image: 'https://picsum.photos/400/300?random=1',
    beds: 1,
    baths: 1,
    sqft: 850,
    type: PropertyType.Apartment,
    status: PropertyStatus.Active,
  },
  {
    id: '2',
    title: 'Family Home with Garden',
    address: '456 Oak Ave, Suburbia, Portland',
    price: 850000,
    image: 'https://picsum.photos/400/300?random=2',
    beds: 4,
    baths: 2.5,
    sqft: 2400,
    type: PropertyType.House,
    status: PropertyStatus.Active,
  },
  {
    id: '3',
    title: 'Luxury Penthouse Suite',
    address: '789 High Rise Blvd, Metropolis',
    price: 1200000,
    image: 'https://picsum.photos/400/300?random=3',
    beds: 3,
    baths: 3,
    sqft: 1800,
    type: PropertyType.Apartment,
    status: PropertyStatus.Sold,
  },
  {
    id: '4',
    title: 'Cozy Cottage',
    address: '101 Pine Ln, Forest Edge',
    price: 350000,
    image: 'https://picsum.photos/400/300?random=4',
    beds: 2,
    baths: 1,
    sqft: 950,
    type: PropertyType.House,
    status: PropertyStatus.Draft,
  },
];

export const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Add Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    address: '',
    price: '',
    specs: '', // For AI context
    vibe: '', // For AI context
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.address.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAiGenerate = async () => {
    if (!newProp.title || !newProp.specs) return;
    setIsGenerating(true);
    try {
      const desc = await generatePropertyDescription(newProp.title, newProp.specs, newProp.vibe || 'Professional and inviting');
      setNewProp(prev => ({ ...prev, description: desc }));
    } catch (error) {
      alert('Failed to generate description. Check console or API Key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Property = {
      id: Date.now().toString(),
      title: newProp.title,
      address: newProp.address,
      price: Number(newProp.price),
      image: `https://picsum.photos/400/300?random=${Date.now()}`,
      beds: 3, // Mock default
      baths: 2, // Mock default
      sqft: 1500, // Mock default
      type: PropertyType.House,
      status: PropertyStatus.Active,
      description: newProp.description
    };
    setProperties([p, ...properties]);
    setIsModalOpen(false);
    setNewProp({ title: '', address: '', price: '', specs: '', vibe: '', description: '' });
  };

  return (
    <div>
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Search properties..." 
            className="pl-10" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={18} />}>
          Add Property
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Add Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Add New Property</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Property Title" 
                  placeholder="e.g. Sunny Villa" 
                  value={newProp.title}
                  onChange={e => setNewProp({...newProp, title: e.target.value})}
                  required
                />
                <Input 
                  label="Price ($)" 
                  type="number" 
                  placeholder="500000" 
                  value={newProp.price}
                  onChange={e => setNewProp({...newProp, price: e.target.value})}
                  required
                />
                <Input 
                  label="Address" 
                  className="md:col-span-2" 
                  placeholder="123 Street Name" 
                  value={newProp.address}
                  onChange={e => setNewProp({...newProp, address: e.target.value})}
                  required
                />
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">AI Description Generator</h3>
                  {/* Fixed: Badge is now imported */}
                  <Badge variant="info">Gemini 2.5 Flash</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <Input 
                    label="Key Features/Specs" 
                    placeholder="3 bed, 2 bath, garden, renovated kitchen" 
                    value={newProp.specs}
                    onChange={e => setNewProp({...newProp, specs: e.target.value})}
                  />
                  <Input 
                    label="Vibe/Tone" 
                    placeholder="Luxury, Cozy, Modern, Family-friendly" 
                    value={newProp.vibe}
                    onChange={e => setNewProp({...newProp, vibe: e.target.value})}
                  />
                </div>

                <div className="flex justify-end mb-4">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleAiGenerate}
                    isLoading={isGenerating}
                    icon={<Sparkles size={16} className="text-purple-600" />}
                    disabled={!newProp.title || !newProp.specs}
                  >
                    Generate Description
                  </Button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent h-32"
                    value={newProp.description}
                    onChange={e => setNewProp({...newProp, description: e.target.value})}
                    placeholder="Property description will appear here..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Listing</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};