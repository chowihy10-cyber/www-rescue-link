import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const CreateCase = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: '', animalType: '猫', location: '', situation: '', needs: '', urgency: '一般', contact: '' });

  if (submitted) {
    return (
      <MobileLayout hideTabBar>
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <CheckCircle2 className="h-16 w-16 text-primary" />
          <h2 className="mt-4 text-lg font-bold text-foreground">提交成功！</h2>
          <p className="mt-2 text-sm text-muted-foreground text-center">你的救助信息已提交，我们会尽快审核发布</p>
          <div className="mt-6 w-full rounded-xl bg-card p-4 shadow-sm text-sm">
            <p><span className="text-muted-foreground">标题：</span>{form.title}</p>
            <p className="mt-1"><span className="text-muted-foreground">动物类型：</span>{form.animalType}</p>
            <p className="mt-1"><span className="text-muted-foreground">地点：</span>{form.location}</p>
            <p className="mt-1"><span className="text-muted-foreground">情况：</span>{form.situation}</p>
            <p className="mt-1"><span className="text-muted-foreground">需求：</span>{form.needs}</p>
            <p className="mt-1"><span className="text-muted-foreground">紧急程度：</span>{form.urgency}</p>
          </div>
          <button onClick={() => navigate('/publish')} className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground">
            返回
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideTabBar>
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <span className="text-sm font-semibold">发起救助 Case</span>
      </div>
      <div className="px-4 pb-10">
        <div className="mt-4 space-y-4">
          <Field label="Case 标题" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="简要描述救助情况" />
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">动物类型</label>
            <div className="flex gap-2">
              {['猫', '狗', '其他'].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, animalType: t })}
                  className={`rounded-lg px-4 py-2 text-sm ${form.animalType === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >{t}</button>
              ))}
            </div>
          </div>
          <Field label="地点" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="城市 + 具体位置" />
          <Field label="发现情况 / 当前情况" value={form.situation} onChange={(v) => setForm({ ...form, situation: v })} placeholder="描述动物当前状态" multiline />
          <Field label="当前需求" value={form.needs} onChange={(v) => setForm({ ...form, needs: v })} placeholder="需要哪些物资或服务" multiline />
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">紧急程度</label>
            <div className="flex gap-2">
              {['一般', '较急', '紧急'].map((u) => (
                <button
                  key={u}
                  onClick={() => setForm({ ...form, urgency: u })}
                  className={`rounded-lg px-4 py-2 text-sm ${form.urgency === u ? (u === '紧急' ? 'bg-urgent text-urgent-foreground' : 'bg-primary text-primary-foreground') : 'bg-muted text-muted-foreground'}`}
                >{u}</button>
              ))}
            </div>
          </div>
          <Field label="联系方式" value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} placeholder="微信号或手机号" />
        </div>
        <button
          onClick={() => { if (form.title && form.location) setSubmitted(true); }}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors active:bg-primary/90"
        >
          提交救助信息
        </button>
      </div>
    </MobileLayout>
  );
};

const Field = ({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; multiline?: boolean }) => (
  <div>
    <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        rows={3}
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    )}
  </div>
);

export default CreateCase;
