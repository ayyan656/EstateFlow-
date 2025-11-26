import React from 'react';
import { Card } from '../components/ui/Card';
import { DollarSign, Home, Users, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLeads } from '../context/LeadsContext';

const data = [
  { name: 'Jan', revenue: 4000, leads: 24 },
  { name: 'Feb', revenue: 3000, leads: 13 },
  { name: 'Mar', revenue: 2000, leads: 98 },
  { name: 'Apr', revenue: 2780, leads: 39 },
  { name: 'May', revenue: 1890, leads: 48 },
  { name: 'Jun', revenue: 2390, leads: 38 },
  { name: 'Jul', revenue: 3490, leads: 43 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ 
  title, value, trend, icon, color 
}) => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} text-white`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
        {trend}
      </span>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
  </Card>
);

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const Dashboard: React.FC = () => {
  const { leads } = useLeads();

  // Get recent leads (assuming leads array is ordered newest first by default in context)
  const recentLeads = leads.slice(0, 5);
  const newLeadsCount = leads.filter(l => l.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$128,430" 
          trend="+12.5%" 
          icon={<DollarSign size={24} />} 
          color="bg-primary"
        />
        <StatCard 
          title="Active Listings" 
          value="24" 
          trend="+4.2%" 
          icon={<Home size={24} />} 
          color="bg-accent"
        />
        <StatCard 
          title="New Leads" 
          value={newLeadsCount.toString()} 
          trend="+28.4%" 
          icon={<Users size={24} />} 
          color="bg-purple-600"
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.2%" 
          trend="+1.2%" 
          icon={<TrendingUp size={24} />} 
          color="bg-orange-500"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-96">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Revenue Overview</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                    itemStyle={{ color: '#0F172A' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex gap-3 pb-3 border-b border-gray-100 dark:border-slate-800 last:border-0">
                  <div className="shrink-0">
                     {lead.avatar ? (
                       <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full object-cover bg-slate-200" />
                     ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                          {lead.name.charAt(0)}
                        </div>
                     )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">New lead registered</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lead.name} is interested in {lead.interest.split(' ').slice(0, 3).join(' ')}...</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatTimeAgo(lead.createdAt)}</span>
                  </div>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <div className="text-center text-slate-400 py-10">
                  No recent activity
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};