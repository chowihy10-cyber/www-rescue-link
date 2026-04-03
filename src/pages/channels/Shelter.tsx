import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockShelterNeeds } from '@/data/mockData';
import { ArrowLeft, MapPin } from 'lucide-react';

const Shelter = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout hideTabBar>
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <span className="text-sm font-semibold">📦 小院补给</span>
      </div>
      <div className="px-4 pb-6">
        {mockShelterNeeds.map((s) => (
          <div key={s.id} className="mb-3 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{s.shelter}</span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                s.urgency === '紧缺' ? 'bg-urgent/10 text-urgent' : 'bg-muted text-muted-foreground'
              }`}>{s.urgency}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />{s.location}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {s.needs.map((n, i) => (
                <span key={i} className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">{n}</span>
              ))}
            </div>
            <p className="mt-2 text-xs text-points font-medium">需要 {s.points} 积分支持</p>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default Shelter;
