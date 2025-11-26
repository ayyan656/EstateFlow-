import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, LeadStatus } from '../types';

const MOCK_LEADS: Lead[] = [
  { 
    id: '1', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    phone: '(555) 123-4567', 
    budget: 450000, 
    status: LeadStatus.New, 
    interest: '2BR Condo in Downtown',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'First time home buyer. Pre-approved for $450k. Interested in amenities like gym and pool. Available for viewings on weekends only.',
    assignedTo: 'Sarah Miller',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    email: 'bob@example.com', 
    phone: '(555) 987-6543', 
    budget: 600000, 
    status: LeadStatus.New, 
    interest: 'Family House with backyard',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Looking for a school district area. Needs a fenced yard for dogs. Prefer move-in ready but open to minor renovations.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  { 
    id: '3', 
    name: 'Charlie Brown', 
    email: 'charlie@example.com', 
    phone: '(555) 456-7890', 
    budget: 300000, 
    status: LeadStatus.Contacted, 
    interest: 'Fixer upper investment',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Cash buyer. Looking for ROI properties. Experienced investor.',
    assignedTo: 'Mike Ross',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  { 
    id: '4', 
    name: 'Diana Prince', 
    email: 'diana@example.com', 
    phone: '(555) 222-3333', 
    budget: 1200000, 
    status: LeadStatus.Viewing, 
    interest: 'Luxury Penthouse',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'High net worth client. Requires 24/7 security building. Wants a view of the water.',
    assignedTo: 'Sarah Miller',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  { 
    id: '5', 
    name: 'Evan Wright', 
    email: 'evan@example.com', 
    phone: '(555) 777-8888', 
    budget: 500000, 
    status: LeadStatus.Negotiation, 
    interest: 'Suburban Home',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Offer submitted on 123 Maple Dr. Negotiating closing costs.',
    assignedTo: 'Jessica Pearson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
];

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const addLead = (lead: Lead) => {
    // Add createdAt timestamp if missing
    const newLead = { 
      ...lead, 
      createdAt: lead.createdAt || new Date().toISOString() 
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLeadStatus }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};