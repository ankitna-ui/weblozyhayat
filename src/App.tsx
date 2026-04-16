/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Cpu, 
  ShieldCheck, 
  ShoppingCart, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck,
  FileText,
  Activity,
  ChevronRight,
  Filter,
  Download,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Globe,
  Anchor,
  FlaskConical,
  Info,
  History,
  ArrowUpRight,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Background } from './components/Background';
import { cn, formatCurrency, formatDate } from './lib/utils';
import { 
  INITIAL_FARMERS, 
  INITIAL_SUPPLIERS, 
  INITIAL_RM_BATCHES, 
  INITIAL_EXTRACT_BATCHES, 
  INITIAL_ORDERS, 
  INITIAL_TASKS 
} from './mockData';
import { 
  Farmer, 
  Supplier, 
  RawMaterialBatch, 
  ExtractBatch, 
  Order, 
  TeamTask, 
  AppState 
} from './types';

// --- Constants ---

const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvVujcaztP-Ta_XV1QUQF5n0nU_2sy_-MyLA&s";

// --- Components ---

const Logo = ({ size = 'md', animated = true, className }: { size?: 'sm' | 'md' | 'lg' | 'xl'; animated?: boolean; className?: string }) => {
  const sizes = {
    sm: "h-12 w-12 p-1.5",
    md: "h-20 w-20 p-2",
    lg: "h-32 w-32 p-3",
    xl: "h-48 w-48 p-4"
  };

  return (
    <motion.div
      animate={animated ? { 
        scale: [1, 1.02, 1],
        filter: [
          "drop-shadow(0 0 10px rgba(0,240,255,0.3))", 
          "drop-shadow(0 0 25px rgba(0,240,255,0.6))", 
          "drop-shadow(0 0 10px rgba(0,240,255,0.3))"
        ]
      } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "relative flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-white/15 to-white/5 border border-white/20 shadow-2xl backdrop-blur-xl",
        sizes[size],
        className
      )}
    >
      <div className="absolute inset-0 rounded-[2rem] bg-cyan-500/5 mix-blend-overlay" />
      <img 
        src={LOGO_URL} 
        alt="Weblozy Logo" 
        className="relative z-10 h-full w-full object-contain brightness-110 contrast-125"
        referrerPolicy="no-referrer"
      />
      {/* Decorative corners - moved slightly inward to prevent cutting */}
      <div className="absolute -top-1 -left-1 h-5 w-5 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl" />
      <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl" />
    </motion.div>
  );
};

const GlassCard = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void; key?: React.Key }) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.005 }}
    onClick={onClick}
    className={cn(
      "glass-effect relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]",
      className
    )}
  >
    {children}
  </motion.div>
);

const NeonButton = ({ children, onClick, variant = 'primary', className }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'outline'; className?: string }) => {
  const variants = {
    primary: "border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]",
    secondary: "border border-purple-500 text-purple-400 hover:bg-purple-500/10 shadow-[0_0_10px_rgba(176,38,255,0.2)]",
    outline: "border border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
};

const Badge = ({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'info' | 'success' | 'warning' | 'danger' }) => {
  const variants = {
    info: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/20 text-rose-400 border-rose-500/30"
  };

  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

const Chip = ({ label, onClick }: { label: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-cyan-300 ring-1 ring-inset ring-cyan-400/30 hover:bg-white/20 transition-colors"
  >
    {label}
  </button>
);

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveMetrics, setLiveMetrics] = useState({
    temp: 48.2,
    pressure: 1.4,
    flow: 2.8,
    progress: 72.4
  });

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        temp: +(prev.temp + (Math.random() * 0.4 - 0.2)).toFixed(1),
        pressure: +(prev.pressure + (Math.random() * 0.1 - 0.05)).toFixed(2),
        flow: +(prev.flow + (Math.random() * 0.2 - 0.1)).toFixed(1),
        progress: prev.progress < 99 ? +(prev.progress + 0.01).toFixed(2) : prev.progress
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [state, setState] = useState<AppState>({
    farmers: INITIAL_FARMERS,
    suppliers: INITIAL_SUPPLIERS,
    rawMaterials: INITIAL_RM_BATCHES,
    extracts: INITIAL_EXTRACT_BATCHES,
    orders: INITIAL_ORDERS,
    tasks: INITIAL_TASKS,
    notifications: [
      { id: '1', message: 'New raw material received from Farmer Khan', time: '2 mins ago', type: 'success' },
      { id: '2', message: 'Batch EXT001 pending QC approval', time: '1 hour ago', type: 'warning' },
    ]
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ type: string; data: any } | null>(null);
  const [procurementTab, setProcurementTab] = useState<'farmers' | 'suppliers'>('farmers');
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [isCOAModalOpen, setIsCOAModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [isReceivingBiomass, setIsReceivingBiomass] = useState(false);
  const [activeQCBatch, setActiveQCBatch] = useState<ExtractBatch | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Stats for Dashboard
  const stats = useMemo(() => {
    const totalRM = state.rawMaterials.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalExtract = state.extracts.reduce((acc, curr) => acc + curr.quantity, 0);
    const pendingQC = state.extracts.filter(e => e.status === 'Pending QC').length;
    const fulfillmentRate = 85; // Mocked

    return { totalRM, totalExtract, pendingQC, fulfillmentRate };
  }, [state]);

  const chartData = [
    { name: 'Jan', rm: 4000, ext: 2400 },
    { name: 'Feb', rm: 3000, ext: 1398 },
    { name: 'Mar', rm: 2000, ext: 9800 },
    { name: 'Apr', rm: 2780, ext: 3908 },
  ];

  const pieData = [
    { name: 'Nutraceutical', value: 400, color: '#00F0FF' },
    { name: 'Pharma', value: 300, color: '#FF3366' },
    { name: 'Cosmetic', value: 300, color: '#B026FF' },
    { name: 'Food', value: 200, color: '#FACC15' },
  ];

  // --- Handlers ---

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setState(prev => ({
      ...prev,
      notifications: [{ id, message, time: 'Just now', type }, ...prev.notifications].slice(0, 5)
    }));
  };

  const handleStartProcessing = (rmId: string) => {
    const rm = state.rawMaterials.find(r => r.id === rmId);
    if (!rm) return;

    setState(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map(r => r.id === rmId ? { ...r, status: 'Processing' } : r)
    }));

    addNotification(`Processing started for ${rm.name}`, 'info');

    // Simulate processing delay
    setTimeout(() => {
      const newExtractId = `EXT${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const newExtract: ExtractBatch = {
        id: newExtractId,
        name: `${rm.name.split(' - ')[0]} Extract 5%`,
        type: 'Extract',
        potency: '5% Standardized',
        quantity: rm.quantity * 0.1, // 10% yield
        rawMaterialBatchId: rmId,
        processedDate: new Date().toISOString().split('T')[0],
        status: 'Pending QC'
      };

      setState(prev => ({
        ...prev,
        rawMaterials: prev.rawMaterials.map(r => r.id === rmId ? { ...r, status: 'Passed' } : r),
        extracts: [...prev.extracts, newExtract],
        tasks: [...prev.tasks, {
          id: `T${Math.random().toString(36).substr(2, 5)}`,
          team: 'QC',
          description: `QC check required for ${newExtractId}`,
          priority: 'High',
          status: 'Todo',
          linkedId: newExtractId
        }]
      }));

      addNotification(`Processing complete. New batch ${newExtractId} created.`, 'success');
    }, 3000);
  };

  const handleApproveQC = (extractId: string) => {
    setState(prev => ({
      ...prev,
      extracts: prev.extracts.map(e => e.id === extractId ? { 
        ...e, 
        status: 'Approved', 
        coaUrl: '#',
        qcMetrics: { 
          pesticides: 'Pass', 
          heavyMetals: 'Pass', 
          hplc: 5.0 + Math.random(),
          microbial: 'Pass',
          solventResidue: 'Pass'
        },
        testerName: 'Dr. Sarah Chen',
        testDate: new Date().toISOString().split('T')[0]
      } : e),
      tasks: prev.tasks.map(t => t.linkedId === extractId ? { ...t, status: 'Done' } : t)
    }));
    addNotification(`Batch ${extractId} approved by QC.`, 'success');
    setIsQCModalOpen(false);
  };

  const handleAllocateStock = (orderId: string, batchId: string) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? { 
        ...o, 
        status: 'Allocated', 
        allocatedBatchId: batchId,
        shippingMethod: 'Air',
        trackingNumber: `HAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      } : o),
      tasks: [...prev.tasks, {
        id: `T${Math.random().toString(36).substr(2, 5)}`,
        team: 'Dispatch',
        description: `Prepare shipment for Order ${orderId}`,
        priority: 'High',
        status: 'Todo',
        linkedId: orderId
      }]
    }));
    addNotification(`Stock allocated to Order ${orderId}`, 'success');
    setIsAllocationModalOpen(false);
  };

  const handleReceiveBiomass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRM: RawMaterialBatch = {
      id: `RM${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: formData.get('name') as string,
      quantity: Number(formData.get('quantity')),
      farmerId: formData.get('farmerId') as string,
      receivedDate: new Date().toISOString().split('T')[0],
      status: 'Awaiting Processing',
      imageUrl: `https://picsum.photos/seed/${formData.get('name')}/800/600`,
      storageLocation: formData.get('storage') as string,
      harvestMethod: 'Standard',
      dryingMethod: 'Natural'
    };
    setState(prev => ({ ...prev, rawMaterials: [...prev.rawMaterials, newRM] }));
    addNotification(`Biomass intake ${newRM.id} recorded.`, 'success');
    setIsReceivingBiomass(false);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    return {
      farmers: state.farmers.filter(f => f.name.toLowerCase().includes(query) || f.id.toLowerCase().includes(query)),
      batches: [...state.rawMaterials, ...state.extracts].filter(b => b.id.toLowerCase().includes(query) || b.name.toLowerCase().includes(query)),
      orders: state.orders.filter(o => o.clientName.toLowerCase().includes(query) || o.id.toLowerCase().includes(query))
    };
  }, [searchQuery, state]);

  const handleOnboardPartner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('partnerType') as 'farmer' | 'supplier';
    
    if (type === 'farmer') {
      const newFarmer: Farmer = {
        id: `F${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: formData.get('name') as string,
        cropType: formData.get('cropType') as string,
        location: formData.get('location') as string,
        estimatedYield: Number(formData.get('yield')),
        lastDeliveryDate: 'N/A',
        rating: 5.0,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        joinedDate: new Date().toISOString().split('T')[0],
        certifications: (formData.get('certs') as string).split(',').map(s => s.trim())
      };
      setState(prev => ({ ...prev, farmers: [...prev.farmers, newFarmer] }));
      addNotification(`Farmer ${newFarmer.name} onboarded successfully`, 'success');
    } else {
      const newSupplier: Supplier = {
        id: `S${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: formData.get('name') as string,
        country: formData.get('country') as string,
        productType: formData.get('productType') as string,
        pricePerKg: Number(formData.get('price')),
        leadTime: Number(formData.get('leadTime')),
        rating: 5.0,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        joinedDate: new Date().toISOString().split('T')[0],
        certifications: (formData.get('certs') as string).split(',').map(s => s.trim())
      };
      setState(prev => ({ ...prev, suppliers: [...prev.suppliers, newSupplier] }));
      addNotification(`Supplier ${newSupplier.name} onboarded successfully`, 'success');
    }
    
    setIsOnboarding(false);
  };

  // --- Render Modules ---

  const renderDashboard = () => (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/10 p-10 border border-white/10 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80">System Status: Operational</span>
            </motion.div>
            <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Administrator</span>
            </h2>
            <p className="text-lg font-medium text-slate-400">
              Monitoring global operations and supply chain intelligence in real-time.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-effect flex flex-col items-center rounded-2xl px-6 py-4 border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Nodes</span>
              <span className="text-2xl font-black text-white">24</span>
            </div>
            <div className="glass-effect flex flex-col items-center rounded-2xl px-6 py-4 border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Level</span>
              <span className="text-2xl font-black text-emerald-400">MAX</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Raw Biomass', value: stats.totalRM, unit: 'kg', icon: Package, color: 'cyan', trend: '+12%' },
          { label: 'Finished Extract', value: stats.totalExtract, unit: 'kg', icon: Cpu, color: 'purple', trend: '+5%' },
          { label: 'Pending QC', value: stats.pendingQC, unit: 'Batches', icon: ShieldCheck, color: 'amber', trend: 'Avg. 4h' },
          { label: 'Fulfillment Rate', value: stats.fulfillmentRate, unit: '%', icon: ShoppingCart, color: 'rose', trend: '2 delayed' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className={cn("group relative border-t-2", `border-t-${item.color}-500/50`)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value} 
                    <span className="ml-1 text-sm font-bold text-slate-500">{item.unit}</span>
                  </h3>
                </div>
                <div className={cn("rounded-2xl p-3 transition-transform group-hover:scale-110", `bg-${item.color}-500/10 text-${item.color}-400`)}>
                  <item.icon size={24} />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div className={cn("flex items-center gap-1 text-[10px] font-bold", item.color === 'rose' ? 'text-rose-400' : 'text-emerald-400')}>
                  {item.color === 'rose' ? <AlertCircle size={10} /> : <Activity size={10} />}
                  <span>{item.trend}</span>
                </div>
                <div className="h-1 w-16 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    className={cn("h-full", `bg-${item.color}-500`)} 
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h3 className="mb-6 text-lg font-bold text-white">Inventory Trends (6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B026FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B026FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1A2E', borderColor: '#ffffff20', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="rm" stroke="#00F0FF" fillOpacity={1} fill="url(#colorRm)" />
                <Area type="monotone" dataKey="ext" stroke="#B026FF" fillOpacity={1} fill="url(#colorExt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-6 text-lg font-bold text-white">Industry Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1A2E', borderColor: '#ffffff20', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white/60">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value} units</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Operations</h3>
            <button className="text-xs text-cyan-400 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {state.notifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-4 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                <div className={cn(
                  "mt-1 rounded-full p-2",
                  notif.type === 'success' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                )}>
                  {notif.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                </div>
                <div>
                  <p className="text-sm text-white">{notif.message}</p>
                  <p className="mt-1 text-xs text-white/40">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Team Tasks</h3>
            <button className="text-xs text-cyan-400 hover:underline">Manage Board</button>
          </div>
          <div className="space-y-4">
            {state.tasks.filter(t => t.status !== 'Done').map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "rounded-lg px-2 py-1 text-[10px] font-bold uppercase",
                    task.team === 'Processing' ? "bg-cyan-500/20 text-cyan-400" : 
                    task.team === 'QC' ? "bg-amber-500/20 text-amber-400" : "bg-purple-500/20 text-purple-400"
                  )}>
                    {task.team}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{task.description}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={task.priority === 'High' ? 'danger' : 'warning'}>{task.priority} Priority</Badge>
                      {task.linkedId && <Chip label={task.linkedId} onClick={() => setActiveTab(task.team.toLowerCase())} />}
                    </div>
                  </div>
                </div>
                <button className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white">
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderProcurement = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Procurement & Sourcing</h2>
        <NeonButton onClick={() => setIsOnboarding(true)}>
          <Plus size={20} />
          Onboard Partner
        </NeonButton>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setProcurementTab('farmers')} 
          className={cn(
            "relative px-4 py-2 text-sm font-bold transition-all",
            procurementTab === 'farmers' 
              ? "text-cyan-400 after:absolute after:bottom-[-17px] after:left-0 after:h-1 after:w-full after:bg-cyan-500 after:shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
              : "text-white/60 hover:text-white"
          )}
        >
          Farmers (Local Biomass)
        </button>
        <button 
          onClick={() => setProcurementTab('suppliers')} 
          className={cn(
            "relative px-4 py-2 text-sm font-bold transition-all",
            procurementTab === 'suppliers' 
              ? "text-cyan-400 after:absolute after:bottom-[-17px] after:left-0 after:h-1 after:w-full after:bg-cyan-500 after:shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
              : "text-white/60 hover:text-white"
          )}
        >
          Certified Suppliers (Global)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {procurementTab === 'farmers' ? (
          state.farmers.map((farmer) => (
            <GlassCard key={farmer.id} className="group">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{farmer.name}</h4>
                  <p className="text-sm text-white/60">{farmer.location}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-500">
                  <span>★</span>
                  <span>{farmer.rating}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Crop Type</span>
                  <span className="font-medium text-white">{farmer.cropType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Est. Yield</span>
                  <span className="font-medium text-white">{farmer.estimatedYield.toLocaleString()} kg</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Chip label={farmer.id} onClick={() => setSelectedItem({ type: 'farmer', data: farmer })} />
                <Badge variant="success">Verified</Badge>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <button 
                  onClick={() => setSelectedItem({ type: 'farmer', data: farmer })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  View Profile
                  <ArrowRight size={16} />
                </button>
              </div>
            </GlassCard>
          ))
        ) : (
          state.suppliers.map((supplier) => (
            <GlassCard key={supplier.id} className="group">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{supplier.name}</h4>
                  <p className="text-sm text-white/60">{supplier.country}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-500">
                  <span>★</span>
                  <span>{supplier.rating}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Product Type</span>
                  <span className="font-medium text-white">{supplier.productType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Lead Time</span>
                  <span className="font-medium text-white">{supplier.leadTime} Days</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Chip label={supplier.id} onClick={() => setSelectedItem({ type: 'supplier', data: supplier })} />
                <Badge variant="info">Certified</Badge>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <button 
                  onClick={() => setSelectedItem({ type: 'supplier', data: supplier })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  View Profile
                  <ArrowRight size={16} />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {isOnboarding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOnboarding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-effect relative w-full max-w-xl overflow-hidden rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsOnboarding(false)}
                className="absolute right-6 top-6 text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-black text-white">Onboard New Partner</h2>
              <p className="text-sm text-white/40">Register a new farmer or supplier to the Weblozy network.</p>

              <form onSubmit={handleOnboardPartner} className="mt-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Partner Type</label>
                    <select name="partnerType" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50">
                      <option value="farmer">Farmer</option>
                      <option value="supplier">Supplier</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name / Entity</label>
                    <input name="name" required type="text" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Location / Country</label>
                    <input name="location" required type="text" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Product / Crop Type</label>
                    <input name="cropType" required type="text" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                    <input name="email" required type="email" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                    <input name="phone" required type="text" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Certifications (Comma separated)</label>
                  <input name="certs" type="text" placeholder="Organic, GMP, ISO..." className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Address</label>
                  <textarea name="address" rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                </div>

                <div className="pt-4">
                  <NeonButton className="w-full">Complete Registration</NeonButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Inventory Hub</h2>
        <div className="flex gap-4">
          <button className="rounded-xl bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">
            Export Manifest
          </button>
          <NeonButton onClick={() => setIsReceivingBiomass(true)}>
            <Plus size={20} />
            Receive Biomass
          </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Raw Materials */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="text-cyan-400" size={20} />
              Raw Material Stock
            </h3>
            <Badge variant="info">{state.rawMaterials.length} Batches</Badge>
          </div>
          <div className="space-y-4">
            {state.rawMaterials.map((rm) => (
              <GlassCard key={rm.id} className="p-0 overflow-hidden group">
                <div className="flex h-32">
                  <div className="w-32 shrink-0 overflow-hidden border-r border-white/5">
                    <img 
                      src={rm.imageUrl || `https://picsum.photos/seed/${rm.id}/400/400`} 
                      alt={rm.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{rm.name}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Batch: {rm.id}</p>
                      </div>
                      <Badge variant={rm.status === 'Passed' ? 'success' : 'info'}>{rm.status}</Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-black text-white">{rm.quantity.toLocaleString()} <span className="text-xs font-normal text-white/40">kg</span></div>
                      <button 
                        onClick={() => setSelectedItem({ type: 'batch', data: rm })}
                        className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-colors"
                      >
                        Inspect Batch →
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Finished Goods */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="text-purple-400" size={20} />
              Finished Extracts
            </h3>
            <Badge variant="success">{state.extracts.length} Batches</Badge>
          </div>
          <div className="space-y-4">
            {state.extracts.map((ext) => (
              <GlassCard key={ext.id} className="p-0 overflow-hidden group">
                <div className="flex h-32">
                  <div className="w-32 shrink-0 overflow-hidden border-r border-white/5">
                    <img 
                      src={ext.imageUrl || `https://picsum.photos/seed/${ext.id}/400/400`} 
                      alt={ext.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">{ext.name}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Batch: {ext.id}</p>
                      </div>
                      <Badge variant={ext.status === 'Approved' ? 'success' : 'info'}>{ext.status}</Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-black text-white">{ext.quantity.toLocaleString()} <span className="text-xs font-normal text-white/40">kg</span></div>
                      <button 
                        onClick={() => setSelectedItem({ type: 'batch', data: ext })}
                        className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-white transition-colors"
                      >
                        Inspect Batch →
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>

      {/* Receive Biomass Modal */}
      <AnimatePresence>
        {isReceivingBiomass && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReceivingBiomass(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-effect relative w-full max-w-xl overflow-hidden rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsReceivingBiomass(false)}
                className="absolute right-6 top-6 text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-black text-white">Biomass Intake</h2>
              <p className="text-sm text-white/40">Record new raw material arrival at the facility.</p>

              <form onSubmit={handleReceiveBiomass} className="mt-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Material Name</label>
                  <input name="name" required type="text" placeholder="e.g. Ashwagandha Root - Grade A" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quantity (kg)</label>
                    <input name="quantity" required type="number" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Farmer / Source</label>
                    <select name="farmerId" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50">
                      {state.farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Storage Location</label>
                  <input name="storage" required type="text" placeholder="e.g. Warehouse A, Bin 4" className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white outline-none focus:border-cyan-500/50" />
                </div>

                <div className="pt-4">
                  <NeonButton className="w-full">Confirm Intake</NeonButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Advanced Extraction Control</h2>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">System Optimal</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-1.5 border border-purple-500/20">
            <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">4 Units Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Processing Queue */}
        <GlassCard className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Cpu className="text-cyan-400" size={20} />
              Active Extraction Units
            </h3>
            <div className="flex gap-2">
              <button className="rounded-lg bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                <Filter size={16} />
              </button>
              <button className="rounded-lg bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.rawMaterials.filter(rm => rm.status === 'Processing' || rm.status === 'Awaiting Processing').map(rm => (
              <div key={rm.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500",
                      rm.status === 'Processing' ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "bg-white/5 text-white/20"
                    )}>
                      <Cpu size={24} className={rm.status === 'Processing' ? "animate-spin-slow" : ""} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{rm.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Unit: {rm.id.replace('RM', 'UNIT-')}</p>
                    </div>
                  </div>
                  <Badge variant={rm.status === 'Processing' ? 'info' : 'warning'}>{rm.status}</Badge>
                </div>
                
                {rm.status === 'Processing' && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-white/40">
                        <span>Extraction Yield Progress</span>
                        <span className="text-cyan-400">{liveMetrics.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${liveMetrics.progress}%` }}
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-black/40 p-3 border border-white/5">
                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Temp</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-sm font-black text-white">{liveMetrics.temp}</p>
                          <span className="text-[8px] text-white/40">°C</span>
                        </div>
                        <div className="mt-1 h-1 w-full rounded-full bg-white/5">
                          <div className="h-full bg-orange-500" style={{ width: `${(liveMetrics.temp / 60) * 100}%` }} />
                        </div>
                      </div>
                      <div className="rounded-xl bg-black/40 p-3 border border-white/5">
                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Pressure</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-sm font-black text-white">{liveMetrics.pressure}</p>
                          <span className="text-[8px] text-white/40">bar</span>
                        </div>
                        <div className="mt-1 h-1 w-full rounded-full bg-white/5">
                          <div className="h-full bg-cyan-500" style={{ width: `${(liveMetrics.pressure / 2) * 100}%` }} />
                        </div>
                      </div>
                      <div className="rounded-xl bg-black/40 p-3 border border-white/5">
                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Flow</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-sm font-black text-white">{liveMetrics.flow}</p>
                          <span className="text-[8px] text-white/40">L/m</span>
                        </div>
                        <div className="mt-1 h-1 w-full rounded-full bg-white/5">
                          <div className="h-full bg-emerald-500" style={{ width: `${(liveMetrics.flow / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white/40">Sensor Data Syncing...</span>
                      </div>
                      <button className="text-[10px] font-bold text-cyan-400 hover:text-white transition-colors">View Live Feed</button>
                    </div>
                  </div>
                )}
                
                {rm.status === 'Awaiting Processing' && (
                  <div className="mt-6">
                    <button 
                      onClick={() => handleStartProcessing(rm.id)}
                      className="w-full rounded-xl bg-cyan-500/10 border border-cyan-500/20 py-3 text-xs font-black uppercase tracking-widest text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    >
                      Initialize Unit {rm.id.replace('RM', '')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Live Logs & Analytics */}
        <div className="space-y-8">
          <GlassCard>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <Activity className="text-purple-400" size={20} />
              System Load & Analytics
            </h3>
            <div className="h-48 flex items-end justify-between gap-1 px-2">
              {[30, 50, 40, 80, 60, 90, 70, 85, 55, 75, 65, 95, 80, 70, 60].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.05 
                  }}
                  className={cn(
                    "w-full rounded-t-sm transition-colors duration-500",
                    h > 80 ? "bg-rose-500" : h > 60 ? "bg-purple-500" : "bg-cyan-500"
                  )}
                />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Avg Efficiency</p>
                <p className="text-2xl font-black text-white">94.2%</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <ArrowUpRight size={12} />
                  +2.4%
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Energy Usage</p>
                <p className="text-2xl font-black text-white">12.8 <span className="text-xs font-normal text-white/40">kWh</span></p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-cyan-400">
                  <Activity size={12} />
                  Stable
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-black/40">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
              <History className="text-slate-400" size={16} />
              Live Operational Log
            </h3>
            <div className="h-48 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {[
                { time: '15:31:02', msg: 'Unit-001: Pressure stabilized at 1.4 bar', type: 'success' },
                { time: '15:30:45', msg: 'Unit-004: Solvent recovery cycle started', type: 'info' },
                { time: '15:29:12', msg: 'Batch RM003: Extraction phase 2 complete', type: 'success' },
                { time: '15:28:30', msg: 'System: New intake RM014 verified by QC', type: 'info' },
                { time: '15:27:15', msg: 'Unit-002: Temperature warning - 52°C', type: 'warning' },
                { time: '15:26:00', msg: 'System: Daily calibration check passed', type: 'success' },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-[10px]">
                  <span className="font-mono text-white/20 shrink-0">{log.time}</span>
                  <span className={cn(
                    "font-bold",
                    log.type === 'success' ? "text-emerald-400" : log.type === 'warning' ? "text-orange-400" : "text-cyan-400"
                  )}>{log.msg}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );

  const renderQC = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Quality Control & Validation</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20">
            <ShieldCheck className="text-emerald-400" size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">ISO 17025 Certified Lab</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {state.extracts.map((ext) => (
          <GlassCard key={ext.id} className="group hover:border-emerald-500/30 transition-all duration-500">
            <div className="mb-6 flex items-center justify-between">
              <Badge variant={ext.status === 'Approved' ? 'success' : 'warning'}>
                {ext.status}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] font-bold text-white/40">
                <FlaskConical size={12} />
                {ext.id}
              </div>
            </div>
            
            <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{ext.name}</h4>
            <p className="mt-1 text-xs text-white/40">Lineage: {ext.rawMaterialBatchId} → {ext.type}</p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Potency (HPLC)</span>
                  <span className="text-sm font-black text-emerald-400">{ext.potency}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/5 p-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-white/60">Pesticides: PASS</span>
                </div>
                <div className="rounded-lg bg-white/5 p-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-white/60">Metals: PASS</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {ext.status === 'Pending QC' ? (
                <NeonButton 
                  onClick={() => { setActiveQCBatch(ext); setIsQCModalOpen(true); }}
                  className="flex-1 py-2 text-xs"
                >
                  Run Validation
                </NeonButton>
              ) : (
                <button 
                  onClick={() => { setActiveQCBatch(ext); setIsCOAModalOpen(true); }}
                  className="flex-1 rounded-xl bg-emerald-500/10 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                >
                  View Digital COA
                </button>
              )}
              <button 
                onClick={() => setSelectedItem({ type: 'batch', data: ext })}
                className="rounded-xl bg-white/5 p-2 text-white/40 hover:text-white hover:bg-white/10"
              >
                <Info size={18} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Logistics & Global Export</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-1.5 border border-rose-500/20">
            <Globe size={16} className="text-rose-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">12 Active Shipments</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {state.orders.map((order) => (
          <GlassCard key={order.id} className="group hover:border-rose-500/30 transition-all duration-500">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <Badge variant={order.status === 'Allocated' ? 'success' : order.status === 'Dispatched' ? 'info' : 'warning'}>
                    {order.status}
                  </Badge>
                  <span className="text-xs font-bold text-white/40">#{order.id}</span>
                  {order.priority === 'High' && (
                    <div className="flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[8px] font-black uppercase text-rose-400">
                      <AlertCircle size={10} />
                      Priority
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white group-hover:text-rose-400 transition-colors">{order.clientName}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Package size={14} className="text-cyan-400" />
                    {order.productName}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-rose-400" />
                    {order.destination || 'TBD'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-white/10 lg:border-l lg:pl-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quantity</p>
                  <p className="text-xl font-black text-white">{order.quantity} kg</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Timeline</p>
                  <p className="text-xs font-bold text-white">{order.estimatedDelivery ? `ETA: ${order.estimatedDelivery}` : `Requested: ${order.requestDate}`}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-white/10 lg:border-l lg:pl-8">
                {order.status === 'Confirmed' && (
                  <NeonButton 
                    onClick={() => { setActiveOrder(order); setIsAllocationModalOpen(true); }}
                    className="px-6 py-2 text-xs"
                  >
                    Allocate Stock
                  </NeonButton>
                )}
                {order.status === 'Allocated' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 border border-cyan-500/20">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
                      <span className="text-[10px] font-bold text-cyan-400">Batch {order.allocatedBatchId} Linked</span>
                    </div>
                    <button 
                      onClick={() => setSelectedItem({ type: 'order', data: order })}
                      className="w-full rounded-xl bg-white/5 py-2 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    >
                      Track Shipment
                    </button>
                  </div>
                )}
                {order.status === 'Enquiry' && (
                  <button className="rounded-xl bg-white/5 px-6 py-2 text-xs font-bold text-white/40 hover:bg-white/10">
                    Review Enquiry
                  </button>
                )}
              </div>
            </div>
            
            {order.status === 'Allocated' && (
              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/5 pt-6 md:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl bg-black/20 p-3">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] text-white/40 uppercase">Carrier</p>
                    <p className="text-[10px] font-bold text-white">{order.vesselName || 'Pending Assignment'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-black/20 p-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Anchor size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] text-white/40 uppercase">Port of Exit</p>
                    <p className="text-[10px] font-bold text-white">{order.portOfExit || 'Mumbai Port'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-black/20 p-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] text-white/40 uppercase">Documents</p>
                    <p className="text-[10px] font-bold text-emerald-400">Verified & Ready</p>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderTraceability = () => {
    const lastBatch = state.extracts[state.extracts.length - 1];
    const rmBatch = state.rawMaterials.find(rm => rm.id === lastBatch.rawMaterialBatchId);
    const farmer = state.farmers.find(f => f.id === rmBatch?.farmerId);
    const order = state.orders.find(o => o.allocatedBatchId === lastBatch.id);

    const steps = [
      { 
        step: 'Sourcing', 
        icon: Users, 
        color: 'text-cyan-400', 
        bg: 'bg-cyan-500/10', 
        title: farmer?.name || 'Farmer Khan', 
        desc: `${farmer?.cropType || 'Ashwagandha'} harvested in ${farmer?.location || 'Mysore'}`, 
        date: farmer?.lastDeliveryDate || 'Mar 15, 2024',
        details: [
          { label: 'Method', value: rmBatch?.harvestMethod || 'Manual' },
          { label: 'Drying', value: rmBatch?.dryingMethod || 'Solar' }
        ]
      },
      { 
        step: 'Intake', 
        icon: Package, 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10', 
        title: `Raw Material Batch ${lastBatch.rawMaterialBatchId}`, 
        desc: 'Batch received and QC passed', 
        date: 'Mar 25, 2024',
        details: [
          { label: 'Purity', value: `${rmBatch?.qcResults?.purity}%` },
          { label: 'Moisture', value: `${rmBatch?.qcResults?.moisture}%` }
        ]
      },
      { 
        step: 'Processing', 
        icon: Cpu, 
        color: 'text-purple-400', 
        bg: 'bg-purple-500/10', 
        title: `Extraction Batch ${lastBatch.id}`, 
        desc: `Processed into ${lastBatch.potency}`, 
        date: lastBatch.processedDate,
        details: [
          { label: 'Method', value: lastBatch.extractionMethod || 'Ethanol' },
          { label: 'Yield', value: `${lastBatch.yieldPercentage}%` }
        ]
      },
      { 
        step: 'Validation', 
        icon: ShieldCheck, 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/10', 
        title: 'QC Approval & COA', 
        desc: lastBatch.status === 'Approved' ? 'Full certification completed' : 'Pending final validation', 
        date: lastBatch.testDate || 'Pending',
        details: [
          { label: 'HPLC', value: `${lastBatch.qcMetrics?.hplc}%` },
          { label: 'Tester', value: lastBatch.testerName || 'Dr. Chen' }
        ]
      },
      { 
        step: 'Fulfillment', 
        icon: ShoppingCart, 
        color: 'text-rose-400', 
        bg: 'bg-rose-500/10', 
        title: order ? `Order ${order.id}` : 'Inventory Stock', 
        desc: order ? `Allocated to ${order.clientName}` : 'Available for global export', 
        date: order?.requestDate || 'N/A',
        details: [
          { label: 'Destination', value: order?.destination || 'Global' },
          { label: 'Carrier', value: order?.vesselName || 'TBD' }
        ]
      },
    ];

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Global Traceability</h2>
          <div className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-1.5 border border-cyan-500/20">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Live Tracking Active</span>
          </div>
        </div>
        
        <GlassCard className="p-0 overflow-hidden">
          <div className="flex items-center gap-4 border-b border-white/10 p-4 bg-white/5">
            <Search className="text-white/40" size={20} />
            <input 
              type="text" 
              placeholder="Enter Batch # or Order # to trace lineage..." 
              className="flex-1 bg-transparent text-white outline-none placeholder:text-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="p-12">
            <div className="relative">
              {/* Traceability Line */}
              <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-purple-500 to-emerald-500 opacity-20" />
              
              <div className="space-y-16">
                {steps.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                      "relative flex items-center gap-12",
                      idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    <div className={cn("w-1/2", idx % 2 === 0 ? "text-right" : "text-left")}>
                      <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", item.color)}>{item.step}</p>
                      <h4 className="mt-2 text-xl font-black text-white">{item.title}</h4>
                      <p className="mt-2 text-sm text-white/60 leading-relaxed">{item.desc}</p>
                      
                      <div className={cn("mt-4 flex gap-3", idx % 2 === 0 ? "justify-end" : "justify-start")}>
                        {item.details.map((detail, dIdx) => (
                          <div key={dIdx} className="rounded-lg bg-white/5 px-3 py-1.5 border border-white/5">
                            <p className="text-[8px] text-white/40 uppercase">{detail.label}</p>
                            <p className="text-[10px] font-bold text-white">{detail.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className={cn("mt-4 flex items-center gap-2 text-[10px] font-bold text-white/40", idx % 2 === 0 ? "justify-end" : "justify-start")}>
                        <Calendar size={12} />
                        {item.date}
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1A2E] shadow-[0_0_30px_rgba(0,240,255,0.15)] group hover:border-cyan-500/50 transition-all duration-500">
                      <item.icon className={cn(item.color, "transition-transform duration-500 group-hover:scale-110")} size={32} />
                    </div>
                    
                    <div className="w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin') {
      setIsLoading(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        setLoginError('');
        addNotification('Welcome back, Administrator', 'success');
      }, 2000);
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const renderLogin = () => (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#020408]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.img 
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
          transition={{ duration: 3, ease: "easeOut" }}
          src="https://hayteinternational.com/wp-content/uploads/2026/03/nature-concept-top-view-green-leaves-texture-tr-2026-01-05-05-09-02-utc-scaled.jpg" 
          alt="Background" 
          className="h-full w-full object-cover blur-[4px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408]/20 via-[#020408]/80 to-[#020408]" />
        
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-10"
        />

        {/* Floating Particles Simulation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5
              }}
              animate={{ 
                y: [null, Math.random() * -100 + "px"],
                opacity: [null, 0]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
              }}
              className="absolute h-1 w-1 rounded-full bg-cyan-400/30"
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-6xl gap-16 p-8">
        {/* System Info Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden flex-1 flex-col justify-center space-y-12 lg:flex"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-5 py-2 backdrop-blur-md"
            >
              <div className="relative flex h-2.5 w-2.5">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></div>
                <div className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#00F0FF]"></div>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">Secure Node: Alpha-01</span>
            </motion.div>
            
            <h1 className="text-7xl font-black tracking-tighter text-white leading-[0.9]">
              WEBLOZY<br />
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">INTELLIGENCE</span>
            </h1>
            
            <p className="max-w-lg text-xl font-medium leading-relaxed text-slate-400/80">
              The next generation of herbal supply chain management. Real-time traceability, advanced extraction telemetry, and global logistics orchestration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Global Uplink', value: 'Active', icon: Globe, color: 'text-cyan-400' },
              { label: 'Neural Core', value: 'Synchronized', icon: Cpu, color: 'text-emerald-400' },
              { label: 'Data Integrity', value: 'Verified', icon: ShieldCheck, color: 'text-blue-400' },
              { label: 'System Load', value: 'Nominal', icon: Activity, color: 'text-purple-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/10 hover:bg-white/10"
              >
                <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110">
                  <stat.icon size={80} />
                </div>
                <stat.icon size={20} className={cn("mb-4", stat.color)} />
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</div>
                <div className="mt-1 text-2xl font-black text-white">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: 60 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="relative w-full max-w-md"
        >
          {/* Decorative Glow */}
          <div className="absolute -inset-4 bg-cyan-500/10 blur-3xl rounded-[3rem] -z-10" />
          
          <div className="glass-effect rounded-[3rem] border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-2xl">
            <div className="mb-12 text-center">
              <Logo size="lg" className="mx-auto mb-8" />
              <h2 className="text-3xl font-black tracking-tight text-white">Operator Login</h2>
              <p className="mt-3 text-sm font-bold uppercase tracking-widest text-slate-500">Secure Access Required</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Operator Identity</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 pl-14 pr-6 text-sm font-medium text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Enter Operator ID"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Authorization Key</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 pl-14 pr-6 text-sm font-medium text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-500"
                >
                  <AlertCircle size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">{loginError}</span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 240, 255, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 bg-[length:200%_auto] py-5 text-sm font-black uppercase tracking-[0.3em] text-[#020408] transition-all hover:bg-right"
              >
                Authenticate System
              </motion.button>
            </form>

            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 w-full">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Secure Protocol v4.2</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
              </div>
              
              <div className="flex gap-6">
                {[Globe, ShieldCheck, Activity].map((Icon, i) => (
                  <Icon key={i} size={16} className="text-slate-700 hover:text-cyan-500/50 transition-colors cursor-help" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050810]">
      <Background />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center"
      >
        <div className="relative flex h-48 w-48 items-center justify-center">
          {/* Animated Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-cyan-500/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-emerald-500/20"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          />
          
          <Logo size="xl" className="shadow-2xl" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500"></span>
            <h2 className="text-2xl font-black tracking-[0.4em] text-white">WEBLOZY<span className="text-cyan-400">.INTL</span></h2>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500"></span>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/5">
              <motion.div 
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" 
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/60">Establishing Secure Uplink</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  // --- Layout ---

  return (
    <div className="text-white selection:bg-cyan-500/30">
      <Background />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderLoading()}
          </motion.div>
        ) : !isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderLogin()}
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid h-screen grid-cols-[220px_1fr] grid-rows-[60px_1fr] gap-3 p-2.5"
          >
            {/* Sidebar */}
            <aside className="glass-effect row-span-2 flex flex-col gap-8 rounded-2xl p-5">
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Logo size="sm" animated={false} className="shadow-cyan-500/20" />
            <div className="flex flex-col">
              <div className="text-xl font-black tracking-[0.2em] text-white leading-none">WEBLOZY</div>
              <div className="text-[10px] font-black tracking-[0.4em] text-cyan-400">INTELLIGENCE</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-3">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'COMMAND CENTER' },
            { id: 'procurement', icon: Users, label: 'PROCUREMENT' },
            { id: 'inventory', icon: Package, label: 'INVENTORY HUB' },
            { id: 'processing', icon: Cpu, label: 'BATCH PROCESSING', live: true },
            { id: 'qc', icon: ShieldCheck, label: 'QUALITY CONTROL' },
            { id: 'orders', icon: ShoppingCart, label: 'LOGISTICS & EXPORT' },
            { id: 'traceability', icon: Search, label: 'TRACEABILITY' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-bold transition-all duration-200",
                activeTab === item.id 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
              {item.live && (
                <span className="absolute right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="border-t border-white/10 pt-4">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Activity</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_var(--accent-pink)]" />
                <span>Batch #EXT004 Passed HPLC</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_var(--accent-cyan)]" />
                <span>Shipment #S99 Dispatching</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
          >
            <LogOut size={18} className="shrink-0" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="glass-effect flex items-center justify-between rounded-2xl px-5">
        <div className="flex items-center gap-10">
          <Logo size="sm" className="shadow-cyan-500/20" />
          <div className="flex gap-10">
            <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Herbal Biomass</span>
            <span className="text-lg font-bold text-cyan-400">{stats.totalRM.toLocaleString()} kg</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Finished Extracts</span>
            <span className="text-lg font-bold text-cyan-400">{stats.totalExtract.toLocaleString()} kg</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending QC</span>
            <span className="text-lg font-bold text-cyan-400">{stats.pendingQC} Batches</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
          <div className="relative hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 md:flex">
            <Search size={16} className="text-white/40" />
            <input 
              type="text" 
              placeholder="Search Batch, Farmer, Order..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[11px] outline-none placeholder:text-white/20 w-48" 
            />
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchQuery && filteredData && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="glass-effect absolute top-full left-0 mt-2 w-80 rounded-2xl p-4 shadow-2xl z-[110]"
                >
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {filteredData.farmers.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Partners</p>
                        {filteredData.farmers.map(f => (
                          <button 
                            key={f.id} 
                            onClick={() => { setSelectedItem({ type: 'farmer', data: f }); setSearchQuery(''); }}
                            className="w-full text-left p-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
                          >
                            <span className="text-xs text-white">{f.name}</span>
                            <span className="text-[10px] text-white/40">{f.id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {filteredData.batches.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Batches</p>
                        {filteredData.batches.map(b => (
                          <button 
                            key={b.id} 
                            onClick={() => { setSelectedItem({ type: 'batch', data: b }); setSearchQuery(''); }}
                            className="w-full text-left p-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
                          >
                            <span className="text-xs text-white">{b.name || b.id}</span>
                            <span className="text-[10px] text-white/40">{b.id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {filteredData.orders.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Orders</p>
                        {filteredData.orders.map(o => (
                          <button 
                            key={o.id} 
                            onClick={() => { setSelectedItem({ type: 'order', data: o }); setSearchQuery(''); }}
                            className="w-full text-left p-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
                          >
                            <span className="text-xs text-white">{o.clientName}</span>
                            <span className="text-[10px] text-white/40">{o.id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {filteredData.farmers.length === 0 && filteredData.batches.length === 0 && filteredData.orders.length === 0 && (
                      <p className="text-xs text-white/40 text-center py-4">No results found.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-white">Bangalore HQ</p>
            <p className="text-[11px] text-slate-500">09:42 AM IST</p>
          </div>
          <div className="h-8 w-8 rounded-full border-2 border-cyan-500 bg-purple-600">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit" 
              alt="Avatar" 
              className="h-full w-full rounded-full"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'procurement' && renderProcurement()}
            {activeTab === 'inventory' && renderInventory()}
            {activeTab === 'processing' && renderProcessing()}
            {activeTab === 'qc' && renderQC()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'traceability' && renderTraceability()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-effect relative w-full max-w-4xl overflow-hidden rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute right-6 top-6 text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-8 border-b border-white/10 pb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-500 shadow-[0_0_20px_rgba(0,240,255,0.2)] overflow-hidden">
                  {selectedItem.data.imageUrl ? (
                    <img src={selectedItem.data.imageUrl} alt={selectedItem.data.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    selectedItem.type === 'farmer' ? <Users size={48} /> : 
                    selectedItem.type === 'supplier' ? <ShoppingCart size={48} /> : <Package size={48} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <Badge variant="info">{selectedItem.type.toUpperCase()}</Badge>
                    <span className="text-xs text-white/40">ID: {selectedItem.data.id}</span>
                  </div>
                  <h2 className="mt-2 text-4xl font-black text-white">{selectedItem.data.name}</h2>
                  <div className="mt-2 flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-cyan-400" />
                      {selectedItem.data.location || selectedItem.data.country || selectedItem.data.storageLocation}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-purple-400" />
                      {selectedItem.data.joinedDate ? `Joined ${selectedItem.data.joinedDate}` : `Received ${selectedItem.data.receivedDate || selectedItem.data.processedDate}`}
                    </div>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm font-bold text-amber-500">{selectedItem.type === 'batch' ? 'TOTAL QUANTITY' : 'PARTNER RATING'}</div>
                  <div className="text-3xl font-black text-white">
                    {selectedItem.type === 'batch' ? `${selectedItem.data.quantity} kg` : `${selectedItem.data.rating} / 5.0`}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-cyan-400" />
                      Partner Profile Details
                    </h3>
                    <div className="grid grid-cols-2 gap-6 rounded-2xl bg-white/5 p-6 border border-white/5">
                      {Object.entries(selectedItem.data).map(([key, value]) => {
                        if (typeof value === 'object' || key === 'id' || key === 'name' || key === 'rating' || key === 'joinedDate') return null;
                        return (
                          <div key={key}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="mt-1 text-sm font-medium text-white">{String(value)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {selectedItem.type === 'farmer' && (
                    <section>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Package size={18} className="text-purple-400" />
                        Supply History (Raw Material Batches)
                      </h3>
                      <div className="space-y-3">
                        {state.rawMaterials.filter(rm => rm.farmerId === selectedItem.data.id).length > 0 ? (
                          state.rawMaterials.filter(rm => rm.farmerId === selectedItem.data.id).map(rm => (
                            <div key={rm.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition-colors">
                              <div>
                                <p className="font-bold text-white">{rm.name}</p>
                                <p className="text-xs text-white/40">Received: {formatDate(rm.receivedDate)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-cyan-400">{rm.quantity} kg</p>
                                <Badge variant={rm.status === 'Passed' ? 'success' : 'info'}>{rm.status}</Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-white/40 italic">No supply history found for this farmer.</p>
                        )}
                      </div>
                    </section>
                  )}

                  {selectedItem.type === 'batch' && (
                    <section>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <History size={18} className="text-purple-400" />
                        Processing History & Parameters
                      </h3>
                      <div className="space-y-4">
                        {selectedItem.data.status === 'Processing' && (
                          <div className="rounded-2xl bg-cyan-500/5 p-6 border border-cyan-500/20">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Live Telemetry</p>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                <span className="text-[8px] font-bold text-cyan-500 uppercase tracking-widest">Active Feed</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <p className="text-[8px] text-white/40 uppercase">Temperature</p>
                                <p className="text-xl font-black text-white">{liveMetrics.temp}°C</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-white/40 uppercase">Pressure</p>
                                <p className="text-xl font-black text-white">{liveMetrics.pressure} bar</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] text-white/40 uppercase">Flow Rate</p>
                                <p className="text-xl font-black text-white">{liveMetrics.flow} L/m</p>
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-[8px] font-bold text-white/40 uppercase">
                                <span>Batch Progress</span>
                                <span>{liveMetrics.progress}%</span>
                              </div>
                              <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                                <motion.div 
                                  animate={{ width: `${liveMetrics.progress}%` }}
                                  className="h-full bg-cyan-500"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedItem.data.processingParameters && (
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(selectedItem.data.processingParameters).map(([key, value]) => (
                              <div key={key} className="rounded-xl bg-white/5 p-3 border border-white/5">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">{key}</p>
                                <p className="text-xs font-bold text-white">{value as string}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedItem.data.processingHistory && (
                          <div className="rounded-2xl bg-white/5 p-6 border border-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Operational Log</p>
                            <div className="space-y-6">
                              {(selectedItem.data.processingHistory as any[]).map((log, idx) => (
                                <div key={idx} className="relative pl-6 border-l border-white/10">
                                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                  <div className="flex justify-between items-start">
                                    <p className="text-xs font-bold text-white">{log.stage}</p>
                                    <span className="text-[10px] text-white/40">{log.timestamp}</span>
                                  </div>
                                  <p className="mt-1 text-[10px] text-white/60">{log.notes}</p>
                                  <p className="mt-1 text-[8px] font-bold text-purple-400 uppercase">Operator: {log.operator}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {selectedItem.type === 'order' && (
                    <section>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ShoppingCart size={18} className="text-rose-400" />
                        Order Fulfillment & Logistics
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Shipping Method</p>
                            <p className="mt-1 text-sm font-bold text-white">{selectedItem.data.shippingMethod || 'Not Assigned'}</p>
                          </div>
                          <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tracking Number</p>
                            <p className="mt-1 text-sm font-bold text-cyan-400">{selectedItem.data.trackingNumber || 'Pending'}</p>
                          </div>
                        </div>

                        {selectedItem.data.documents && (
                          <div className="rounded-2xl bg-white/5 p-6 border border-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Export Documentation</p>
                            <div className="space-y-3">
                              {Object.entries(selectedItem.data.documents).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between rounded-lg bg-black/20 p-3">
                                  <div className="flex items-center gap-3">
                                    <FileText size={16} className="text-emerald-400" />
                                    <span className="text-xs font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-white/40">{value as string}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="rounded-2xl bg-white/5 p-6 border border-white/5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Logistics Status</p>
                          <div className="flex items-center justify-between">
                            {['Confirmed', 'Allocated', 'Dispatched', 'Delivered'].map((step, idx) => {
                              const steps = ['Confirmed', 'Allocated', 'Dispatched', 'Delivered'];
                              const currentIdx = steps.indexOf(selectedItem.data.status);
                              const isDone = idx <= currentIdx;
                              return (
                                <div key={step} className="flex flex-col items-center gap-2">
                                  <div className={cn(
                                    "h-3 w-3 rounded-full",
                                    isDone ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/10"
                                  )} />
                                  <span className={cn("text-[10px] font-bold", isDone ? "text-white" : "text-white/20")}>{step}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {selectedItem.data.certifications && (
                    <section>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-400" />
                        Compliance & Certifications
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedItem.data.certifications.map((cert: string) => (
                          <div key={cert} className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 border border-emerald-500/20">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span className="text-xs font-bold text-white">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-6">
                  <GlassCard className="bg-cyan-500/5 border-cyan-500/20">
                    <h4 className="text-sm font-bold text-white mb-4">Contact Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">
                          <Mail size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Email</p>
                          <p className="text-xs text-white">{selectedItem.data.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-400">
                          <Phone size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Phone</p>
                          <p className="text-xs text-white">{selectedItem.data.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="bg-purple-500/5 border-purple-500/20">
                    <h4 className="text-sm font-bold text-white mb-4">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full rounded-lg bg-cyan-500/10 py-2 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all">
                        Generate Performance Report
                      </button>
                      <button className="w-full rounded-lg bg-purple-500/10 py-2 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition-all">
                        Schedule Audit
                      </button>
                      <button className="w-full rounded-lg bg-rose-500/10 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all">
                        Suspend Partner
                      </button>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* QC Checklist Modal */}
      <AnimatePresence>
        {isQCModalOpen && activeQCBatch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQCModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-effect relative w-full max-w-lg overflow-hidden rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white">QC Validation</h2>
              <p className="text-sm text-white/40">Batch: {activeQCBatch.id} - {activeQCBatch.name}</p>

              <div className="mt-8 space-y-4">
                {[
                  { label: 'Pesticide Residue Analysis', key: 'pesticides' },
                  { label: 'Heavy Metal Screening', key: 'heavyMetals' },
                  { label: 'Microbial Load Test', key: 'microbial' },
                  { label: 'Residual Solvent Test', key: 'solventResidue' },
                ].map((test) => (
                  <div key={test.key} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/5">
                    <span className="text-sm font-medium text-white">{test.label}</span>
                    <Badge variant="success">PASS</Badge>
                  </div>
                ))}
                
                <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/5">
                  <span className="text-sm font-medium text-white">HPLC Potency Assay</span>
                  <span className="text-sm font-bold text-cyan-400">5.24%</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <NeonButton onClick={() => handleApproveQC(activeQCBatch.id)} className="w-full">
                  Approve & Generate COA
                </NeonButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COA View Modal */}
      <AnimatePresence>
        {isCOAModalOpen && activeQCBatch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCOAModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white p-12 text-slate-900 shadow-2xl"
            >
              <div className="flex justify-between border-b-4 border-slate-900 pb-8">
                <div>
                  <h1 className="text-3xl font-black tracking-tighter">WEBLOZY INTELLIGENCE</h1>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Certificate of Analysis (COA)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">COA #COA-{activeQCBatch.id}</p>
                  <p className="text-xs text-slate-500">Date: {activeQCBatch.testDate || '2024-04-03'}</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 mb-2">Product Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-bold">Product:</span> {activeQCBatch.name}</p>
                    <p><span className="font-bold">Batch ID:</span> {activeQCBatch.id}</p>
                    <p><span className="font-bold">Potency:</span> {activeQCBatch.potency}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 mb-2">Testing Facility</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-bold">Lab:</span> Weblozy Central QC Lab</p>
                    <p><span className="font-bold">Analyst:</span> {activeQCBatch.testerName || 'Sarah Chen'}</p>
                    <p><span className="font-bold">Method:</span> HPLC-DAD / GC-MS</p>
                  </div>
                </div>
              </div>

              <table className="mt-12 w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-2">Test Parameter</th>
                    <th className="py-2">Specification</th>
                    <th className="py-2">Result</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-medium">Assay (HPLC)</td>
                    <td className="py-3">Min 5.0%</td>
                    <td className="py-3 font-bold">{activeQCBatch.qcMetrics?.hplc.toFixed(2)}%</td>
                    <td className="py-3 text-emerald-600 font-bold">PASS</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Pesticides</td>
                    <td className="py-3">Negative</td>
                    <td className="py-3">Not Detected</td>
                    <td className="py-3 text-emerald-600 font-bold">PASS</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Heavy Metals</td>
                    <td className="py-3">&lt; 10 ppm</td>
                    <td className="py-3">Conforms</td>
                    <td className="py-3 text-emerald-600 font-bold">PASS</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Microbial Load</td>
                    <td className="py-3">&lt; 1000 cfu/g</td>
                    <td className="py-3">Conforms</td>
                    <td className="py-3 text-emerald-600 font-bold">PASS</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-12 flex items-end justify-between">
                <div className="text-xs text-slate-400">
                  <p>This document is electronically generated and valid without signature.</p>
                  <p>Weblozy Intelligence, Bangalore, India.</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-32 border-b border-slate-900 mb-2 italic font-serif text-slate-400 flex items-center justify-center">Sarah Chen</div>
                  <p className="text-[10px] font-bold uppercase">Quality Assurance Manager</p>
                </div>
              </div>

              <button 
                onClick={() => setIsCOAModalOpen(false)}
                className="mt-12 w-full rounded-xl bg-slate-900 py-3 font-bold text-white transition-all hover:bg-slate-800"
              >
                Download PDF Report
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stock Allocation Modal */}
      <AnimatePresence>
        {isAllocationModalOpen && activeOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllocationModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-effect relative w-full max-w-xl overflow-hidden rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white">Stock Allocation</h2>
              <p className="text-sm text-white/40">Order: {activeOrder.id} - {activeOrder.clientName}</p>
              <p className="mt-1 text-sm text-cyan-400">Required: {activeOrder.quantity} kg of {activeOrder.productName}</p>

              <div className="mt-8 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Available Approved Batches</h4>
                {state.extracts.filter(e => e.status === 'Approved' && e.name.includes(activeOrder.productName)).length > 0 ? (
                  state.extracts.filter(e => e.status === 'Approved' && e.name.includes(activeOrder.productName)).map(batch => (
                    <div key={batch.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition-colors">
                      <div>
                        <p className="font-bold text-white">{batch.id}</p>
                        <p className="text-xs text-white/40">Potency: {batch.potency}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-cyan-400">{batch.quantity} kg avail.</p>
                        <button 
                          onClick={() => handleAllocateStock(activeOrder.id, batch.id)}
                          className="mt-1 text-[10px] font-black uppercase tracking-widest text-white underline hover:text-cyan-400"
                        >
                          Select Batch
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/40 italic">No matching approved batches found. Check QC status.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
