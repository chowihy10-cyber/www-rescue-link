import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { FileText, Upload, Search } from 'lucide-react';

const entries = [
  {
    icon: '🐾',
    title: '发起救助 Case',
    desc: '发现需要帮助的流浪动物？发布救助信息',
    path: '/create-case',
    color: 'bg-primary/10',
  },
  {
    icon: '📋',
    title: '更新记录 / 上传凭证',
    desc: '为已有案例补充进展或上传关键凭证',
    path: '/upload-evidence',
    color: 'bg-accent/15',
  },
  {
    icon: '🔍',
    title: '发布寻宠信息',
    desc: '丢失的宠物？发布寻宠启示',
    path: '/publish-lost-pet',
    color: 'bg-secondary',
  },
];

const Publish = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="px-4 pt-10">
        <h1 className="text-lg font-bold text-foreground">发布</h1>
        <p className="mt-1 text-sm text-muted-foreground">选择你想要发布的内容</p>
      </div>

      <div className="mt-6 px-4 pb-6">
        <div className="space-y-3">
          {entries.map((e) => (
            <button
              key={e.path}
              onClick={() => navigate(e.path)}
              className={`flex w-full items-center gap-4 rounded-xl ${e.color} p-5 text-left transition-transform active:scale-[0.98]`}
            >
              <span className="text-3xl">{e.icon}</span>
              <div>
                <p className="text-base font-semibold text-foreground">{e.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Publish;
