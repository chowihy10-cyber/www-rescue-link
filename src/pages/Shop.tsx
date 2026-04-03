import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockShopItems } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Shop = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout hideTabBar>
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <span className="text-sm font-semibold">🛍️ 公益商城</span>
      </div>
      <div className="px-4 pb-6">
        <p className="mt-3 text-xs text-muted-foreground">每一次购买，都是对流浪动物的支持</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {mockShopItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toast.success('购买功能即将上线')}
              className="rounded-xl bg-card p-3 text-left shadow-sm transition-transform active:scale-[0.98]"
            >
              <div className="flex h-28 items-center justify-center rounded-lg bg-muted text-3xl">
                {item.category === '文创' ? '🎨' : '🐾'}
              </div>
              <p className="mt-2 text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">{item.price}</span>
                <span className="rounded-full bg-points/15 px-2 py-0.5 text-[10px] font-medium text-points">+{item.points}积分</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Shop;
