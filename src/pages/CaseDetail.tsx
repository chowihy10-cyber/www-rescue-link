import { useParams, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockCases } from '@/data/mockData';
import { getPublisherForCase } from '@/data/publishers';
import PublisherBadge from '@/components/PublisherBadge';
import { ArrowLeft, Share2, MapPin, Shield, CheckCircle2, Clock, Link2, AlertTriangle, Flame, ChevronRight, Star, Copy, Image, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import cat1 from '@/assets/cat1.jpg';
import dog1 from '@/assets/dog1.jpg';
import cat2 from '@/assets/cat2.jpg';
import dog2 from '@/assets/dog2.jpg';
import dog3 from '@/assets/dog3.jpg';

const caseImages: Record<string, string> = { '1': cat1, '2': dog1, '3': cat2, '4': dog2, '5': dog3 };
const caseNumbers: Record<string, number> = { '1': 241, '2': 242, '3': 243, '4': 244, '5': 245 };

const PawClapAnimation = ({ onDone }: { onDone: () => void }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
      <div className="animate-paw-clap flex flex-col items-center" onAnimationEnd={onDone}>
        <div className="flex items-center gap-1">
          <span className="text-4xl animate-paw-left">🐾</span>
          <span className="text-4xl animate-paw-right">🐾</span>
        </div>
        <span className="mt-2 text-[16px] font-bold text-primary animate-fade-in">热力 +1</span>
      </div>
    </div>
  );
};

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseItem = mockCases.find((c) => c.id === id);
  const [saved, setSaved] = useState(false);
  const [showPawClap, setShowPawClap] = useState(false);
  const [localHeat, setLocalHeat] = useState(0);
  const [todayBoosts, setTodayBoosts] = useState(0);
  const [contactRevealed, setContactRevealed] = useState(false);

  if (!caseItem) {
    return (
      <MobileLayout hideTabBar>
        <div className="flex h-screen items-center justify-center text-muted-foreground">个案未找到</div>
      </MobileLayout>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (localHeat === 0 && caseItem.heatValue > 0) {
    // Can't use useEffect easily here due to early return, so just init
  }
  const heatDisplay = localHeat || caseItem.heatValue;

  const publisher = getPublisherForCase(caseItem.id);
  const imgSrc = caseImages[caseItem.id || '1'] || cat1;
  const caseNo = caseNumbers[caseItem.id] || parseInt(caseItem.id);
  const formattedNo = String(caseNo).padStart(5, '0');

  const helpNeeds = caseItem.needs.filter((n) => n.category === 'help');

  // Merge timeline + evidences into unified record
  const records = [
    ...caseItem.timeline.map((t, i) => ({
      id: `t-${i}`,
      title: t.content,
      desc: '',
      time: t.date,
      tag: t.type === 'milestone' ? '基础记录' : '进展更新',
      isEvidence: false,
      chainStatus: undefined as string | undefined,
    })),
    ...caseItem.evidences.map((ev) => ({
      id: ev.id,
      title: ev.type.startsWith('已') ? ev.type : `已上传${ev.type}`,
      desc: ev.chainStatus === 'stored' ? '链上记录已生成' : '',
      time: ev.uploadedAt,
      tag: '关键凭证',
      isEvidence: true,
      chainStatus: ev.chainStatus,
    })),
  ].sort((a, b) => b.time.localeCompare(a.time));

  const handleBoost = () => {
    if (todayBoosts >= 5) {
      toast('明天再来帮它顶一顶吧～', { duration: 2000 });
      return;
    }
    setTodayBoosts(prev => prev + 1);
    setLocalHeat(prev => (prev || caseItem.heatValue) + 1);
    setShowPawClap(true);
  };

  const handleCopyText = () => {
    const text = `【${caseItem.title}】\n${caseItem.description.slice(0, 80)}...\n当前状态：${caseItem.status}\n需要帮助：${helpNeeds.filter(n => !n.fulfilled).map(n => n.name).join('、')}\n📍 ${caseItem.city}\n#它援RescueLink #案号${formattedNo}`;
    navigator.clipboard.writeText(text).then(() => toast.success('已复制扩散文案'));
  };

  return (
    <MobileLayout hideTabBar>
      {showPawClap && <PawClapAnimation onDone={() => setShowPawClap(false)} />}

      {/* A. Cover image */}
      <div className="relative">
        <img src={imgSrc} alt={caseItem.title} className="h-56 w-full object-cover" />
        <div className="absolute left-3 top-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-black/30 p-2 backdrop-blur">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <button onClick={() => { setSaved(!saved); toast.success(saved ? '已取消收藏' : '已收藏'); }} className="rounded-full bg-black/30 p-2 backdrop-blur">
            <Star className={`h-5 w-5 ${saved ? 'fill-white text-white' : 'text-white'}`} />
          </button>
          <button onClick={() => toast.success('已生成分享内容')} className="rounded-full bg-black/30 p-2 backdrop-blur">
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>
        {caseItem.isUrgent && (
          <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-lg bg-urgent px-2.5 py-1 shadow-md">
            <AlertTriangle className="h-3.5 w-3.5 text-urgent-foreground" />
            <span className="text-[13px] font-bold text-urgent-foreground">{caseItem.urgencyLevel}</span>
          </div>
        )}
        {/* Heat badge */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-lg bg-black/30 px-2.5 py-1 backdrop-blur">
          <Flame className="h-3.5 w-3.5 text-[hsl(24,90%,60%)]" />
          <span className="text-[13px] font-bold text-white">{heatDisplay}</span>
        </div>
      </div>

      <div className="pb-24">
        <div className="px-4">
          {/* B. Case header */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] font-medium text-muted-foreground">#{formattedNo}</span>
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[12px] font-medium text-primary">{caseItem.status}</span>
            <span className="rounded-lg bg-muted px-2 py-0.5 text-[12px] text-muted-foreground">{caseItem.animalType}</span>
            {caseItem.urgencyLevel !== '一般' && (
              <span className={`rounded-lg px-2 py-0.5 text-[12px] font-medium ${
                caseItem.urgencyLevel === '紧急' ? 'bg-urgent/10 text-urgent' : 'bg-[hsl(35,80%,90%)] text-[hsl(30,70%,35%)]'
              }`}>{caseItem.urgencyLevel}</span>
            )}
          </div>

          <h1 className="mt-2 text-[20px] font-bold leading-snug text-foreground">{caseItem.title}</h1>

          <div className="mt-1.5 flex items-center gap-1 text-[13px] text-muted-foreground">
            {publisher && <span>{publisher.name}发起</span>}
            <span>·</span>
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{caseItem.city}</span>
            <span>· {caseItem.updatedAt}</span>
          </div>

          {/* Heat value explanation */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Flame className="h-3 w-3 text-[hsl(24,80%,55%)]" />
            <span>热力值 {heatDisplay}，越高说明越多人在关注这个个案</span>
          </div>

          {/* A. 当前情况 */}
          <div className="mt-4 rounded-xl bg-card p-4 shadow-sm">
            <h2 className="text-[15px] font-semibold text-foreground">当前情况</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground">{caseItem.description}</p>
          </div>

          {/* B. 发起人已处理 */}
          {caseItem.initiatorDone.length > 0 && (
            <div className="mt-3 rounded-xl bg-card p-4 shadow-sm">
              <h2 className="text-[15px] font-semibold text-foreground">发起人已处理</h2>
              <div className="mt-2 space-y-2">
                {caseItem.initiatorDone.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                    <span className="text-[13px] text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* C. 当前还需要什么帮助 */}
          {helpNeeds.length > 0 && (
            <div className="mt-3 rounded-xl bg-card p-4 shadow-sm">
              <h2 className="text-[15px] font-semibold text-foreground">当前还需要</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">以下是发起人目前还需要的帮助</p>
              <div className="mt-3 space-y-2.5">
                {helpNeeds.map((n) => (
                  <div key={n.id}>
                    <div className="flex items-center gap-1.5">
                      {n.fulfilled ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                      ) : (
                        <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={`text-[13px] font-medium ${n.fulfilled ? 'text-primary/70 line-through' : 'text-foreground'}`}>
                        {n.name}
                      </span>
                      <span className={`ml-auto shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        n.fulfilled ? 'bg-primary/10 text-primary' : 'bg-urgent/8 text-urgent'
                      }`}>
                        {n.fulfilled ? '已有人帮忙' : '需要帮助'}
                      </span>
                    </div>
                    {n.desc && <p className="ml-5 mt-0.5 text-[11px] text-muted-foreground">{n.desc}</p>}
                  </div>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground leading-relaxed">
                平台不直接接受募捐。如愿意提供资金支持，请直接联系发起人确认方式。
              </p>
            </div>
          )}

          {/* D. 如何支持这个 case */}
          <div className="mt-3 rounded-xl bg-card p-4 shadow-sm">
            <h2 className="text-[15px] font-semibold text-foreground">如何支持</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">你可以通过以下方式帮助这个个案</p>

            <div className="mt-3 space-y-2">
              {/* 顶一顶 */}
              <button
                onClick={handleBoost}
                className="flex w-full items-center gap-3 rounded-xl bg-[hsl(24,60%,94%)] p-3 text-left transition-transform active:scale-[0.98]"
              >
                <span className="text-xl">🐾</span>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[hsl(24,55%,30%)]">顶一顶</p>
                  <p className="text-[11px] text-[hsl(24,30%,50%)]">增加热力值，让更多人看到</p>
                </div>
                <span className="text-[12px] font-bold text-[hsl(24,65%,42%)]">热力 +1</span>
              </button>

              {/* 生成海报 */}
              <button
                onClick={() => toast.success('海报生成中…')}
                className="flex w-full items-center gap-3 rounded-xl bg-muted/60 p-3 text-left transition-transform active:scale-[0.98]"
              >
                <Image className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-foreground">生成海报</p>
                  <p className="text-[11px] text-muted-foreground">适合发到朋友圈、宠物群、小红书</p>
                </div>
              </button>

              {/* 复制文案 */}
              <button
                onClick={handleCopyText}
                className="flex w-full items-center gap-3 rounded-xl bg-muted/60 p-3 text-left transition-transform active:scale-[0.98]"
              >
                <Copy className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-foreground">复制文案</p>
                  <p className="text-[11px] text-muted-foreground">适合转发到群聊和社交媒体</p>
                </div>
              </button>

              {/* 转发小程序 */}
              <button
                onClick={() => toast.success('已生成小程序卡片')}
                className="flex w-full items-center gap-3 rounded-xl bg-muted/60 p-3 text-left transition-transform active:scale-[0.98]"
              >
                <MessageSquare className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-foreground">转发小程序</p>
                  <p className="text-[11px] text-muted-foreground">微信生态内快速传播</p>
                </div>
              </button>

              {/* 联系发起人 */}
              <button
                onClick={() => setContactRevealed(true)}
                className="flex w-full items-center gap-3 rounded-xl bg-muted/60 p-3 text-left transition-transform active:scale-[0.98]"
              >
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-foreground">联系发起人</p>
                  <p className="text-[11px] text-muted-foreground">直接确认如何帮助</p>
                </div>
              </button>
            </div>

            {contactRevealed && (
              <div className="mt-3 rounded-lg bg-[hsl(38,55%,95%)] p-3">
                <p className="text-[13px] font-medium text-foreground">{caseItem.contact}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(caseItem.contact); toast.success('已复制联系方式'); }}
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-primary"
                >
                  <Copy className="h-3 w-3" /> 复制联系方式
                </button>
                <p className="mt-1.5 text-[10px] text-muted-foreground leading-relaxed">
                  如可提供安置、转运、领养接手或资金支持，请直接联系发起人确认细节。
                </p>
              </div>
            )}

            <p className="mt-3 text-[10px] text-muted-foreground leading-relaxed">
              分享、持续更新和上传凭证，也会帮助个案获得更多关注。分享可获得积分。
            </p>
          </div>

          {/* E. Timeline records */}
          <div className="mt-3 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-[15px] font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                个案记录
              </h2>
              <span className="text-[11px] text-muted-foreground">按时间倒序</span>
            </div>
            <div className="mt-3 space-y-0">
              {records.map((r, i) => (
                <div key={r.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${r.isEvidence ? 'bg-accent' : 'bg-muted-foreground/30'}`} />
                    {i < records.length - 1 && <div className="h-10 w-px bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-[13px] font-medium text-foreground">{r.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">{r.time}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        r.tag === '关键凭证' ? 'bg-accent/15 text-accent-foreground' : 'bg-muted text-muted-foreground'
                      }`}>{r.tag}</span>
                      {r.chainStatus === 'stored' && (
                        <span className="flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                          <Link2 className="h-3 w-3" /> 已存证
                        </span>
                      )}
                      {r.chainStatus === 'pending' && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> 存证处理中
                        </span>
                      )}
                    </div>
                    {r.desc && <p className="mt-0.5 text-[11px] text-primary">{r.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publisher info */}
          {publisher && (
            <button
              onClick={() => navigate(`/publisher/${publisher.id}`)}
              className="mt-3 flex w-full items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5"
            >
              <PublisherBadge publisher={publisher} size="md" showStats />
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
            </button>
          )}
        </div>
      </div>

      {/* G. Fixed bottom bar */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card px-4 py-3 safe-bottom">
        <div className="flex gap-3">
          <button
            onClick={handleBoost}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[hsl(24,60%,94%)] px-4 py-3 text-[14px] font-semibold text-[hsl(24,55%,30%)] transition-colors active:bg-[hsl(24,60%,88%)]"
          >
            🐾 顶一顶
          </button>
          <button
            onClick={() => setContactRevealed(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors active:bg-primary/90"
          >
            <Phone className="h-4 w-4" />
            联系发起人
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CaseDetail;
