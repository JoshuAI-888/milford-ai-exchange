import Link from 'next/link';
import { Star, Copy } from 'lucide-react';
import type { Prompt } from '@/lib/data';

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const risk = prompt.risk === 'High' ? 'bg-red-50 text-red-700' : prompt.risk === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700';
  return <div className="card p-5">
    <div className="flex items-start justify-between gap-4">
      <div><Link href={`/prompts/${prompt.id}`} className="text-lg font-bold text-milford-charcoal hover:text-milford-orange">{prompt.title}</Link><p className="mt-2 text-sm text-slate-600">{prompt.description}</p></div>
      <span className={`badge ${risk}`}>{prompt.risk}</span>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">{prompt.tags.map(t => <span className="badge bg-milford-cream text-milford-charcoal" key={t}>{t}</span>)}</div>
    <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
      <span>{prompt.team} · {prompt.model} · v{prompt.version}</span>
      <span className="flex items-center gap-3"><span className="flex items-center gap-1"><Star size={16} className="fill-milford-orange text-milford-orange"/> {prompt.rating}</span><span className="flex items-center gap-1"><Copy size={16}/> {prompt.uses}</span></span>
    </div>
  </div>
}
