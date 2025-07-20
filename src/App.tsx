import React, { useState, useEffect, useRef } from 'react';
import {
  BeakerIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Cog6ToothIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentArrowUpIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

// Type definitions
interface Module {
  id: string;
  name: string;
  enabled: boolean;
  status: 'green' | 'amber' | 'red';
  icon: React.ComponentType<{ className?: string }>;
}

interface PipelineCard {
  id: string;
  moduleId: string;
  order: number;
}

interface Metrics {
  targetsLoaded: number;
  designedSequences: number;
  lnpsScreened: number;
  gpuUtilization: number;
}

// Mock data
const initialModules: Module[] = [
  { id: 'target', name: 'Target Graph', enabled: true, status: 'green', icon: CubeTransparentIcon },
  { id: 'sequence', name: 'Sequence Designer', enabled: true, status: 'green', icon: BeakerIcon },
  { id: 'lnp', name: 'LNP Delivery', enabled: false, status: 'amber', icon: ChartBarIcon },
];

const App: React.FC = () => {
  // State management
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [pipelineCards, setPipelineCards] = useState<PipelineCard[]>([
    { id: '1', moduleId: 'target', order: 0 },
    { id: '2', moduleId: 'sequence', order: 1 },
  ]);
  const [metrics, setMetrics] = useState<Metrics>({
    targetsLoaded: 1247,
    designedSequences: 3892,
    lnpsScreened: 756,
    gpuUtilization: 78,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<PipelineCard | null>(null);

  // Simulate realtime metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        targetsLoaded: prev.targetsLoaded + Math.floor(Math.random() * 5),
        designedSequences: prev.designedSequences + Math.floor(Math.random() * 10),
        lnpsScreened: prev.lnpsScreened + Math.floor(Math.random() * 3),
        gpuUtilization: Math.min(95, Math.max(60, prev.gpuUtilization + (Math.random() - 0.5) * 10)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Toggle module handler
  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, enabled: !m.enabled } : m
    ));

    if (modules.find(m => m.id === moduleId)?.enabled) {
      // Remove from pipeline if disabling
      setPipelineCards(prev => prev.filter(card => card.moduleId !== moduleId));
    } else {
      // Add to pipeline if enabling
      const newCard: PipelineCard = {
        id: Date.now().toString(),
        moduleId,
        order: pipelineCards.length,
      };
      setPipelineCards(prev => [...prev, newCard]);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, card: PipelineCard) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCard: PipelineCard) => {
    e.preventDefault();
    if (!draggedCard || draggedCard.id === targetCard.id) return;

    const newCards = [...pipelineCards];
    const draggedIndex = newCards.findIndex(c => c.id === draggedCard.id);
    const targetIndex = newCards.findIndex(c => c.id === targetCard.id);

    newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, draggedCard);

    setPipelineCards(newCards.map((card, index) => ({ ...card, order: index })));
    setDraggedCard(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // TODO: Implement search API integration
  };

  // Get status indicator color
  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F2F5F9] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-white shadow-[0_4px_20px_rgba(209,217,230,0.2)] flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" className="text-[#4F8CFF]">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16L16 12L20 16M16 12V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-lg font-semibold text-[#1A1E29]">AIDD RNA Platform</span>
          </div>
        </div>

        {/* Global Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#53607A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search targets, sequences, compounds..."
              className="w-full pl-10 pr-4 py-2 bg-[#F2F5F9] rounded-lg border border-transparent focus:border-[#4F8CFF] focus:bg-white transition-all duration-150 outline-none"
            />
          </div>
        </form>

        {/* Profile */}
        <div className="flex items-center gap-4">
          <UserCircleIcon className="w-8 h-8 text-[#53607A]" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Side Dock */}
        <aside className="w-[260px] bg-white shadow-[4px_0_20px_rgba(209,217,230,0.2)] p-4">
          <h2 className="text-sm font-semibold text-[#53607A] uppercase tracking-wider mb-4">Module Palette</h2>
          <div className="space-y-2">
            {modules.map(module => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white shadow-[inset_-4px_-4px_20px_rgba(209,217,230,0.2),inset_4px_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[inset_-2px_-2px_10px_rgba(209,217,230,0.2),inset_2px_2px_10px_rgba(255,255,255,0.2)] transition-all duration-150"
                >
                  <Icon className="w-6 h-6 text-[#53607A]" />
                  <span className="flex-1 text-left text-sm font-medium text-[#1A1E29]">{module.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                    <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${module.enabled ? 'bg-[#4F8CFF]' : 'bg-[#D1D9E6]'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${module.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </button>
              );
            })}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-[#D1D9E6] text-[#53607A] hover:border-[#4F8CFF] hover:text-[#4F8CFF] transition-all duration-150">
              <PlusIcon className="w-6 h-6" />
              <span className="flex-1 text-left text-sm font-medium">Add Module</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero Banner */}
          <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-br from-[#4F8CFF]/10 via-[#4F8CFF]/5 to-transparent p-8">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-[#1A1E29] mb-2">One-click AI-driven RNA drug workflow</h1>
              <p className="text-[#53607A]">Design, optimize, and validate RNA therapeutics with integrated AI modules</p>
            </div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#4F8CFF]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#4F8CFF]/5 rounded-full blur-3xl" />
          </div>

          {/* Pipeline Canvas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#1A1E29] mb-4">Pipeline Workflow</h2>
            <div className="flex gap-4 items-center overflow-x-auto pb-4">
              {['Target', 'Sequence', 'Delivery', 'Validation'].map((stage, index) => {
                const card = pipelineCards.find(c => c.order === index);
                const module = card ? modules.find(m => m.id === card.moduleId) : null;

                return (
                  <React.Fragment key={stage}>
                    {index > 0 && (
                      <svg width="24" height="24" className="text-[#D1D9E6] flex-shrink-0">
                        <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    )}
                    <div className="flex-shrink-0 w-64">
                      {card && module ? (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, card)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, card)}
                          className="bg-white rounded-lg p-4 shadow-[inset_-4px_-4px_20px_rgba(209,217,230,0.2),inset_4px_4px_20px_rgba(255,255,255,0.2)] cursor-move hover:shadow-[inset_-2px_-2px_10px_rgba(209,217,230,0.2),inset_2px_2px_10px_rgba(255,255,255,0.2)] transition-all duration-150"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-[#1A1E29]">{module.name}</span>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                          </div>
                          <p className="text-xs text-[#53607A]">Active module in {stage.toLowerCase()} stage</p>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-[#D1D9E6] rounded-lg p-4 text-center">
                          <PlusIcon className="w-8 h-8 mx-auto mb-2 text-[#D1D9E6]" />
                          <p className="text-sm text-[#53607A]">Insert Module</p>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Realtime Metrics */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#1A1E29] mb-4">Realtime Metrics</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-[inset_-4px_-4px_20px_rgba(209,217,230,0.2),inset_4px_4px_20px_rgba(255,255,255,0.2)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#53607A]">Targets loaded</span>
                  <CubeTransparentIcon className="w-5 h-5 text-[#4F8CFF]" />
                </div>
                <p className="text-2xl font-bold text-[#1A1E29]">{metrics.targetsLoaded.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-[inset_-4px_-4px_20px_rgba(209,217,230,0.2),inset_4px_4px_20px_rgba(255,255,255,0.2)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#53607A]">Designed seq</span>
                  <BeakerIcon className="w-5 h-5 text-[#4F8CFF]" />
                </div>
                <p className="text-2xl font-bold text-[#1A1E29]">{metrics.designedSequences.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-[inset_-4px_-4px_20px_rgba(209,217,230,0.2),inset_4px_4px_20px_rgba(255,255,255,0.2)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#53607A]">LNPs screened</span>
                  <ChartBarIcon className="w-5 h-5 text-[#4F8CFF]" />
                </div>
                <p className="text-2xl font-bold text-[#1A1E29]">{metrics.lnpsScreened.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-[inset_-4px_-4px_20px_rgba(209,217,230,0.2),inset_4px_4px_20px_rgba(255,255,255,0.2)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#53607A]">GPU utilisation</span>
                  <Cog6ToothIcon className="w-5 h-5 text-[#4F8CFF]" />
                </div>
                <p className="text-2xl font-bold text-[#1A1E29]">{metrics.gpuUtilization.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </main>

        {/* Quick Actions */}
        <aside className="w-80 bg-white shadow-[-4px_0_20px_rgba(209,217,230,0.2)] p-4">
          <h2 className="text-sm font-semibold text-[#53607A] uppercase tracking-wider mb-4">Quick Actions</h2>
          
          {/* New Project */}
          <button
            onClick={() => setShowModal('newProject')}
            className="w-full flex items-center gap-3 px-4 py-3 mb-3 rounded-lg bg-[#4F8CFF] text-white hover:bg-[#4F8CFF]/90 transition-all duration-150"
          >
            <SparklesIcon className="w-5 h-5" />
            <span className="font-medium">New Project</span>
          </button>

          {/* Import Dataset */}
          <div
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#4F8CFF]'); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove('border-[#4F8CFF]'); }}
            onDrop={(e) => { 
              e.preventDefault(); 
              e.currentTarget.classList.remove('border-[#4F8CFF]');
              console.log('Files dropped:', e.dataTransfer.files);
              // TODO: Handle file import
            }}
            className="border-2 border-dashed border-[#D1D9E6] rounded-lg p-6 mb-4 text-center transition-all duration-150 cursor-pointer hover:border-[#4F8CFF]"
          >
            <DocumentArrowUpIcon className="w-8 h-8 mx-auto mb-2 text-[#53607A]" />
            <p className="text-sm text-[#53607A]">Import Dataset</p>
            <p className="text-xs text-[#53607A]/60 mt-1">Drag and drop or click to browse</p>
          </div>

          {/* Chatbot */}
          <div className="bg-white rounded-lg p-4 shadow-[inset_-4px_-4px_20px_rgba(209,217,230,0.2),inset_4px_4px_20px_rgba(255,255,255,0.2)]">
            <div className="flex items-center gap-2 mb-3">
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-[#4F8CFF]" />
              <span className="text-sm font-semibold text-[#1A1E29]">AIDD Assistant</span>
            </div>
            <input
              type="text"
              placeholder="Ask AIDD Assistant..."
              className="w-full px-3 py-2 bg-[#F2F5F9] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4F8CFF]/20"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  console.log('Chat query:', e.currentTarget.value);
                  // TODO: Implement chatbot API
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </aside>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#1A1E29] mb-4">
              {showModal === 'newProject' ? 'Create New Project' : 'Modal'}
            </h3>
            <p className="text-[#53607A] mb-4">This is a placeholder for the {showModal} modal.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(null)}
                className="px-4 py-2 text-[#53607A] hover:text-[#1A1E29] transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(null)}
                className="px-4 py-2 bg-[#4F8CFF] text-white rounded-lg hover:bg-[#4F8CFF]/90 transition-all duration-150"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

/* HTML PREVIEW */