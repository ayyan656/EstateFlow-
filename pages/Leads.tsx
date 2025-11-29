import React, { useState, useEffect, useRef } from 'react';
import { Lead, LeadStatus } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Phone, Mail, MoreHorizontal, Plus, X, User, DollarSign, Calendar, MapPin, MessageSquare, Filter, ShieldCheck, Edit2, Save, UserPlus, ChevronDown } from 'lucide-react';
import { useLeads } from '../context/LeadsContext';

const COLUMNS = [
  { id: LeadStatus.New, label: 'New Leads', color: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', dot: 'bg-blue-500' },
  { id: LeadStatus.Contacted, label: 'Contacted', color: 'border-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', dot: 'bg-yellow-500' },
  { id: LeadStatus.Viewing, label: 'Viewing', color: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-500' },
  { id: LeadStatus.Negotiation, label: 'Negotiation', color: 'border-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', dot: 'bg-orange-500' },
  { id: LeadStatus.Closed, label: 'Closed', color: 'border-green-500', bg: 'bg-green-50 dark:bg-green-900/20', dot: 'bg-green-500' },
];

const AGENTS = [
  { id: '1', name: 'Sarah Miller', role: 'Senior Agent', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80' },
  { id: '2', name: 'Mike Ross', role: 'Sales Associate', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80' },
  { id: '3', name: 'Jessica Pearson', role: 'Broker', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64&q=80' },
  { id: '4', name: 'Harvey Specter', role: 'Partner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80' },
];

export const Leads: React.FC = () => {
  const { leads, addLead, updateLeadStatus, updateLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [visibleStatuses, setVisibleStatuses] = useState<LeadStatus[]>([]);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    interest: '',
    notes: ''
  });

  const moveLead = (e: React.MouseEvent, id: string, newStatus: LeadStatus) => {
    e.stopPropagation();
    updateLeadStatus(id, newStatus);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead: Lead = {
      id: Date.now().toString(),
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      budget: Number(newLead.budget) || 0,
      interest: newLead.interest,
      status: LeadStatus.New,
      notes: newLead.notes,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newLead.name)}&background=random&color=fff`,
      createdAt: new Date().toISOString()
    };
    
    addLead(lead);
    setIsAddModalOpen(false);
    setNewLead({ name: '', email: '', phone: '', budget: '', interest: '', notes: '' });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault(); // Essential to allow dropping
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      updateLeadStatus(leadId, newStatus);
    }
  };

  // Filter Logic
  const toggleStatusFilter = (status: LeadStatus) => {
    setVisibleStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const displayedColumns = visibleStatuses.length > 0
    ? COLUMNS.filter(c => visibleStatuses.includes(c.id as LeadStatus))
    : COLUMNS;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const KanbanCard: React.FC<{ lead: Lead }> = ({ lead }) => {
    const assignedAgent = AGENTS.find(a => a.name === lead.assignedTo);
    const [showAgentMenu, setShowAgentMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowAgentMenu(false);
            }
        };
        if (showAgentMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAgentMenu]);

    const handleAssign = (agentName: string) => {
        updateLead(lead.id, { assignedTo: agentName });
        setShowAgentMenu(false);
    };

    return (
      <div 
        draggable
        onDragStart={(e) => handleDragStart(e, lead.id)}
        className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-accent/30 transition-all mb-3 cursor-grab active:cursor-grabbing group relative"
        onClick={() => setSelectedLead(lead)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {lead.avatar ? (
              <img 
                src={lead.avatar} 
                alt={lead.name}
                draggable={false}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-accent transition-all cursor-pointer hover:opacity-80"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 text-xs font-bold ring-2 ring-transparent group-hover:ring-accent transition-all cursor-pointer hover:opacity-80"
              >
                {lead.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="mb-1">
                <Badge variant={lead.status === LeadStatus.New ? 'info' : 'neutral'}>
                  {lead.status}
                </Badge>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{lead.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{lead.interest}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="neutral">${(lead.budget / 1000)}k</Badge>
          {lead.notes && (
            <span className="text-[10px] flex items-center gap-1 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              <MessageSquare size={10} /> Note
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-slate-700">
          <div className="flex gap-2">
            <button 
              className="p-1.5 rounded-full bg-gray-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors" 
              title="Call"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={14} />
            </button>
            <button 
              className="p-1.5 rounded-full bg-gray-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors" 
              title="Email"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail size={14} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            {/* Agent Avatar / Assign Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowAgentMenu(!showAgentMenu);
                }}
                className="relative group/avatar focus:outline-none"
                title={lead.assignedTo ? `Assigned to ${lead.assignedTo}` : "Assign Agent"}
            >
                {lead.assignedTo ? (
                    assignedAgent ? (
                        <img src={assignedAgent.avatar} alt={lead.assignedTo} className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 hover:ring-accent transition-all" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 ring-2 ring-white dark:ring-slate-800 hover:ring-accent transition-all">
                            {lead.assignedTo.charAt(0)}
                        </div>
                    )
                ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent transition-all">
                        <UserPlus size={12} />
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            {showAgentMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Assign to
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleAssign(''); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        Unassigned
                    </button>
                    {AGENTS.map(agent => (
                        <button
                            key={agent.id}
                            onClick={(e) => { e.stopPropagation(); handleAssign(agent.name); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                        >
                             <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full object-cover" />
                             <span className="text-slate-700 dark:text-slate-200">{agent.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Next Stage Button */}
            {lead.status !== LeadStatus.Closed && (
               <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = COLUMNS.findIndex(c => c.id === lead.status);
                    if(currentIndex < COLUMNS.length - 1) moveLead(e, lead.id, COLUMNS[currentIndex + 1].id as LeadStatus);
                  }}
                  className="text-[10px] font-bold text-accent hover:underline px-2 py-1 rounded hover:bg-accent/5 ml-1"
               >
                 Next &rarr;
               </button>
             )}
          </div>
        </div>
      </div>
    );
  };

  const LeadDetailModal: React.FC<{ lead: Lead; onClose: () => void }> = ({ lead, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      budget: lead.budget,
      interest: lead.interest,
      notes: lead.notes || '',
      assignedTo: lead.assignedTo || '',
      status: lead.status
    });

    const [isAgentOpen, setIsAgentOpen] = useState(false);
    const [isStageOpen, setIsStageOpen] = useState(false);
    const assignmentRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (assignmentRef.current && !assignmentRef.current.contains(event.target as Node)) {
                setIsAgentOpen(false);
            }
            if (stageRef.current && !stageRef.current.contains(event.target as Node)) {
                setIsStageOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        budget: lead.budget,
        interest: lead.interest,
        notes: lead.notes || '',
        assignedTo: lead.assignedTo || '',
        status: lead.status
      });
    }, [lead]);

    const handleSave = () => {
      updateLead(lead.id, {
        ...formData,
        budget: Number(formData.budget)
      });
      setIsEditing(false);
    };

    const assignedAgent = AGENTS.find(a => a.name === formData.assignedTo);
    const currentColumn = COLUMNS.find(c => c.id === formData.status) || COLUMNS[0];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
        <div 
          className="bg-surface dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200 border dark:border-slate-800 relative overflow-hidden" 
          onClick={e => e.stopPropagation()}
        >
          {/* Absolute Actions Container */}
          <div className="absolute top-4 right-4 z-50 flex gap-2">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm flex items-center gap-2 px-4 shadow-sm"
                >
                  <Edit2 size={16} /> <span className="text-sm font-medium">Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm px-4 text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="p-2 bg-accent hover:bg-accent/90 text-white rounded-full transition-colors backdrop-blur-sm px-4 flex items-center gap-2 shadow-sm"
                  >
                    <Save size={16} /> <span className="text-sm font-medium">Save Changes</span>
                  </button>
                </div>
              )}
              <button 
                onClick={onClose}
                className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm shadow-sm"
              >
                <X size={20} />
              </button>
          </div>
          
          {/* Scrollable Container including Header and Content */}
          <div className="flex-1 w-full overflow-y-auto">
            
            {/* Header Banner - Part of scroll flow */}
            <div className="h-32 bg-gradient-to-r from-primary to-slate-800 w-full shrink-0"></div>
            
            <div className="px-8 pb-8 flex flex-col">
              {/* Profile Header Info */}
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 -mt-12">
                <div className="relative z-10">
                  {lead.avatar ? (
                     <img 
                      src={lead.avatar} 
                      alt={lead.name} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                      className="w-24 h-24 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-800" 
                    />
                  ) : null}
                  <div className={`w-24 h-24 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 border-4 border-white dark:border-slate-800 shadow-md ${lead.avatar ? 'hidden' : ''}`}>
                    <User size={40} />
                  </div>
                </div>
                
                <div className="flex-1 mt-12 sm:mt-14">
                  {isEditing ? (
                    <Input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="text-lg font-bold"
                      placeholder="Lead Name"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{lead.name}</h2>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                     <div className="flex items-center gap-2">
                        <Badge variant="info">{lead.status}</Badge>
                     </div>
                     <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        <Calendar size={14} />
                        <span>Added {formatDate(lead.createdAt)}</span>
                     </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-14 hidden sm:flex">
                  <Button variant="secondary" icon={<Mail size={16}/>}>Email</Button>
                  <Button icon={<Phone size={16}/>}>Call</Button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-6">
                
                {/* Left Column: Contact & Assignment */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* System / Assignment Card */}
                  <Card className="bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 overflow-visible">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                       <ShieldCheck size={14} /> Assignment
                     </h3>
                     <div className="space-y-5">
                        {/* Custom Agent Selector */}
                        <div className="relative" ref={assignmentRef}>
                           <label className="text-xs text-slate-500 block mb-1.5">Assigned Agent</label>
                           <button
                             onClick={() => setIsAgentOpen(!isAgentOpen)}
                             className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-accent dark:hover:border-accent transition-colors shadow-sm text-left group"
                           >
                             <div className="flex items-center gap-3">
                               {assignedAgent ? (
                                 <img src={assignedAgent.avatar} alt={assignedAgent.name} className="w-8 h-8 rounded-full object-cover" />
                               ) : (
                                 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                   <User size={16} />
                                 </div>
                               )}
                               <div>
                                 <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                   {assignedAgent ? assignedAgent.name : "Unassigned"}
                                 </p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">
                                   {assignedAgent ? assignedAgent.role : "Select an agent"}
                                 </p>
                               </div>
                             </div>
                             <ChevronDown size={16} className={`text-slate-400 transition-transform ${isAgentOpen ? 'rotate-180' : ''}`} />
                           </button>

                           {isAgentOpen && (
                             <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                               <button
                                 onClick={() => {
                                   setFormData(prev => ({ ...prev, assignedTo: '' }));
                                   if(!isEditing) updateLead(lead.id, { assignedTo: '' });
                                   setIsAgentOpen(false);
                                 }}
                                 className="w-full text-left px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-50 dark:border-slate-700/50"
                               >
                                 Unassigned
                               </button>
                               {AGENTS.map(agent => (
                                 <button
                                   key={agent.id}
                                   onClick={() => {
                                      setFormData(prev => ({ ...prev, assignedTo: agent.name }));
                                      if(!isEditing) updateLead(lead.id, { assignedTo: agent.name });
                                      setIsAgentOpen(false);
                                   }}
                                   className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                                 >
                                   <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full object-cover" />
                                   <div className="text-left">
                                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{agent.name}</p>
                                      <p className="text-xs text-slate-500">{agent.role}</p>
                                   </div>
                                 </button>
                               ))}
                             </div>
                           )}
                        </div>

                        {/* Custom Stage Selector */}
                        <div className="relative" ref={stageRef}>
                           <label className="text-xs text-slate-500 block mb-1.5">Lead Stage</label>
                           <button
                             onClick={() => !isEditing && setIsStageOpen(!isStageOpen)}
                             disabled={isEditing}
                             className={`w-full flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl transition-colors shadow-sm text-left ${isEditing ? 'opacity-70 cursor-not-allowed' : 'hover:border-accent dark:hover:border-accent'}`}
                           >
                              <div className="flex items-center gap-3">
                                 <div className={`w-3 h-3 rounded-full ${currentColumn.dot}`}></div>
                                 <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                   {currentColumn.label}
                                 </span>
                              </div>
                              {!isEditing && <ChevronDown size={16} className={`text-slate-400 transition-transform ${isStageOpen ? 'rotate-180' : ''}`} />}
                           </button>

                           {isStageOpen && (
                             <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                {COLUMNS.map(col => (
                                   <button
                                     key={col.id}
                                     onClick={() => {
                                        const newStatus = col.id as LeadStatus;
                                        setFormData(prev => ({ ...prev, status: newStatus }));
                                        updateLeadStatus(lead.id, newStatus);
                                        setIsStageOpen(false);
                                     }}
                                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                   >
                                      <div className={`w-3 h-3 rounded-full ${col.dot}`}></div>
                                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{col.label}</span>
                                   </button>
                                ))}
                             </div>
                           )}
                        </div>
                     </div>
                  </Card>

                  {/* Contact Info Card */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</h3>
                    
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <Mail size={14} className="text-slate-400" /> Email
                      </label>
                      {isEditing ? (
                        <Input 
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                      ) : (
                        <p className="text-slate-900 dark:text-slate-100 truncate">{lead.email}</p>
                      )}
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <Phone size={14} className="text-slate-400" /> Phone
                      </label>
                      {isEditing ? (
                        <Input 
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})} 
                        />
                      ) : (
                        <p className="text-slate-900 dark:text-slate-100">{lead.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle/Right Column: Requirements & Notes */}
                <div className="lg:col-span-2 space-y-6">
                   
                   {/* Requirements Section */}
                   <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                         <Filter size={16} className="text-accent" /> Requirements & Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs text-slate-500 mb-1">Budget</label>
                            {isEditing ? (
                              <Input 
                                type="number"
                                value={formData.budget}
                                onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                                icon={<DollarSign size={14} />}
                              />
                            ) : (
                              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                ${lead.budget.toLocaleString()}
                              </p>
                            )}
                         </div>
                         <div>
                            <label className="block text-xs text-slate-500 mb-1">Looking For</label>
                            {isEditing ? (
                               <Input 
                                 value={formData.interest}
                                 onChange={e => setFormData({...formData, interest: e.target.value})}
                               />
                            ) : (
                               <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                 {lead.interest}
                               </p>
                            )}
                         </div>
                      </div>
                   </div>

                   {/* Notes Section */}
                   <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 border border-slate-100 dark:border-slate-700 h-full">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                        <MessageSquare size={18} className="text-slate-400"/> 
                        Notes & Activity
                      </h3>
                      {isEditing ? (
                         <Textarea 
                           value={formData.notes}
                           onChange={e => setFormData({...formData, notes: e.target.value})}
                           className="h-32 bg-white dark:bg-slate-900"
                           placeholder="Add notes about this lead..."
                         />
                      ) : (
                         <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-100 dark:border-slate-800 min-h-[100px]">
                            {lead.notes || <span className="text-slate-400 italic">No notes added.</span>}
                         </div>
                      )}
                      
                      {!isEditing && (
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Recent Timeline</h4>
                          
                          {lead.activities && lead.activities.length > 0 ? (
                            <div className="">
                              {lead.activities.slice(0, 5).map((activity, idx) => (
                                <div key={activity.id} className="flex gap-4 relative">
                                   <div className="flex flex-col items-center w-4 shrink-0">
                                     <div className={`w-2.5 h-2.5 rounded-full z-10 ${idx === 0 ? 'bg-accent ring-2 ring-blue-100 dark:ring-blue-900/30' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                     {idx !== (lead.activities?.length || 0) - 1 && (
                                        <div className="w-0.5 bg-slate-200 dark:bg-slate-700 absolute top-2.5 bottom-0 left-2 -translate-x-1/2 -mb-4"></div>
                                     )}
                                   </div>
                                   <div className="pb-6">
                                     <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activity.description}</p>
                                     <p className="text-xs text-slate-500 mt-0.5">{formatDate(activity.date)}</p>
                                   </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-400 italic">No activity recorded yet.</div>
                          )}
                        </div>
                      )}
                   </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Sales Pipeline</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your leads and drag them across stages.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} icon={<Plus size={18} />}>Add Lead</Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-2">
          <Filter size={14} /> Filter:
        </span>
        {COLUMNS.map(col => {
           const isSelected = visibleStatuses.includes(col.id as LeadStatus);
           return (
             <button
              key={col.id}
              onClick={() => toggleStatusFilter(col.id as LeadStatus)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${isSelected 
                  ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                }
              `}
             >
               {col.label}
             </button>
           );
        })}
        {visibleStatuses.length > 0 && (
          <button 
            onClick={() => setVisibleStatuses([])}
            className="text-xs text-accent hover:underline ml-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 h-full min-w-[1000px] pb-4">
          {displayedColumns.map(column => (
            <div 
              key={column.id} 
              className={`flex-1 min-w-[280px] flex flex-col h-full rounded-xl transition-colors duration-200 ${dragOverColumn === column.id ? 'bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700' : ''}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id as LeadStatus)}
            >
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color} px-2 pt-2`}>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">{column.label}</h3>
                <span className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                  {leads.filter(l => l.status === column.id).length}
                </span>
              </div>
              
              <div className="flex-1 rounded-xl p-2 overflow-y-auto hide-scrollbar bg-slate-50/50 dark:bg-slate-900/20">
                {leads.filter(l => l.status === column.id).map(lead => (
                  <KanbanCard key={lead.id} lead={lead} />
                ))}
                {leads.filter(l => l.status === column.id).length === 0 && (
                   <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg text-slate-400 dark:text-slate-600 text-sm m-1">
                     <span className="mb-1">No Leads</span>
                     <span className="text-xs text-slate-300 dark:text-slate-500">Drop here</span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
        />
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Add New Lead</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                 <Input 
                  label="Full Name" 
                  placeholder="Jane Doe" 
                  value={newLead.name}
                  onChange={e => setNewLead({...newLead, name: e.target.value})}
                  required
                />
                <Input 
                  label="Email" 
                  type="email"
                  placeholder="jane@example.com" 
                  value={newLead.email}
                  onChange={e => setNewLead({...newLead, email: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Phone" 
                  type="tel"
                  placeholder="(555) 123-4567" 
                  value={newLead.phone}
                  onChange={e => setNewLead({...newLead, phone: e.target.value})}
                  required
                />
                <Input 
                  label="Budget ($)" 
                  type="number" 
                  placeholder="450000" 
                  value={newLead.budget}
                  onChange={e => setNewLead({...newLead, budget: e.target.value})}
                />
              </div>

              <Input 
                label="Interested In / Requirements" 
                placeholder="e.g. 2BR downtown apartment with balcony" 
                value={newLead.interest}
                onChange={e => setNewLead({...newLead, interest: e.target.value})}
                required
              />

              <Textarea 
                label="Notes"
                placeholder="Add any specific requirements or notes..."
                value={newLead.notes}
                onChange={e => setNewLead({...newLead, notes: e.target.value})}
                className="h-24 resize-none"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit">Add Lead</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};