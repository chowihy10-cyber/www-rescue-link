import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockUser, mockCases } from '@/data/mockData';
import { Search, MapPin, ChevronRight, Heart, PawPrint, Package, AlertTriangle } from 'lucide-react';
import CaseCard from '@/components/CaseCard';
import { useState } from 'react';

const channels = [
  { label: '领养', sub: '待领养动物', icon: Heart, path: '/channel/adoption', color: 'bg-primary/10 text-primary' },
  { label: '寻宠地图', sub: '线索 / 帮扩散', icon: PawPrint, path: '/lost-pet-map', color: 'bg-accent/20 text-accent-foreground' },
  { label: '小院补给', sub: '认领长期需求', icon: Package, path: '/channel/shelter', color: 'bg-secondary text-secondary-foreground' },
];

const Index = () => {
  const navigate = useNavigate();
  const [animalFilter, setAnimalFilter] = useState('全部');
  const [rangeFilter, setRangeFilter] = useState('全城');

  const filteredCases = mockCases.filter((c) => {
    if (animalFilter === '猫') return c.animalType === '猫';
    if (animalFilter === '狗') return c.animalType === '狗';
    return true;
  });

  const allCases = [...filteredCases].sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));
  const urgentCount = filteredCases.filter((c) => c.isUrgent).length;

  return (
    <MobileLayout>
      {/* Compact Header with integrated today help */}
      <div className="bg-header-bg px-4 pb-2 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-header-fg/70">我的公益积分</p>
            <p className="text-2xl font-bold text-header-fg">{mockUser.totalPoints}</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-header-fg/75">
            <div className="flex flex-col items-center">
              <span className="text-base font-semibold text-header-fg">{mockUser.helpsGiven}</span>
              <span>次助力</span>
            </div>
            <div className="h-6 w-px bg-header-fg/15" />
            <div className="flex flex-col items-center">
              <span className="text-base font-semibold text-header-fg">6</span>
              <span>个案例</span>
            </div>
            <div className="h-6 w-px bg-header-fg/15" />
            <div className="flex flex-col items-center">
              <span className="text-base font-semibold text-header-fg">3</span>
              <span>项认领</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/help-center')}
          className="mt-1.5 flex w-full items-center gap-1.5 rounded-lg bg-header-accent/60 px-3 py-1"
        >
          <span className="text-[11px] text-header-fg/80">🌟 今日可参与 3 项助力</span>
          <ChevronRight className="ml-auto h-3 w-3 text-header-fg/50" />
        </button>
      </div>

      <div className="px-4">
        {/* Search & Location */}
        <div className="mt-2 flex items-center gap-2">
          <button className="flex shrink-0 items-center gap-1 rounded-lg bg-card px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm">
            <MapPin className="h-3.5 w-3.5" />
            北京
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-sm">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">搜索救助案例、地点…</span>
          </div>
        </div>

        {/* Emergency Banner */}
        {urgentCount > 0 && (
          <button
            onClick={() => navigate('/channel/emergency')}
            className="mt-2 flex w-full items-center gap-2.5 rounded-xl bg-urgent/8 px-3 py-2.5 ring-1 ring-urgent/20 transition-colors active:bg-urgent/15"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-urgent/15">
              <AlertTriangle className="h-4.5 w-4.5 text-urgent" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[13px] font-semibold text-urgent">紧急求助</p>
              <p className="text-[11px] text-urgent/70">{urgentCount} 个案例需要快速接力</p>
            </div>
            <ChevronRight className="h-4 w-4 text-urgent/50" />
          </button>
        )}

        {/* Channels – horizontal compact entries */}
        <div className="mt-2 grid grid-cols-3 gap-2">
          {channels.map((ch) => (
            <button
              key={ch.label}
              onClick={() => navigate(ch.path)}
              className="flex items-center gap-2 rounded-xl bg-card px-2.5 py-2 shadow-sm transition-transform active:scale-[0.97]"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ch.color}`}>
                <ch.icon className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[12px] font-semibold leading-tight text-foreground">{ch.label}</p>
                <p className="truncate text-[9px] leading-tight text-muted-foreground">{ch.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
            {['全部', '猫', '狗'].map((f) => (
              <button
                key={f}
                onClick={() => setAnimalFilter(f)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  animalFilter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
            {['全城', '附近'].map((f) => (
              <button
                key={f}
                onClick={() => setRangeFilter(f)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  rangeFilter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Stream */}
        <div className="mt-2.5 pb-4">
          <h2 className="mb-1.5 text-xs font-semibold text-foreground">📋 推荐救助案例</h2>
          {allCases.map((c) => (
            <CaseCard key={c.id} caseItem={c} />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;
