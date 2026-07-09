import Link from 'next/link';
import { Copy, Star } from 'lucide-react';
import type { Prompt } from '@/lib/types';

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const riskValue = prompt.risk?.toLowerCase();

  const riskClass =
    riskValue === 'high'
      ? 'bg-red-50 text-red-700'
      : riskValue === 'medium'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-emerald-50 text-emerald-700';

  const tags = Array.isArray(prompt.tags) ? prompt.tags : [];

  const teamName =
    typeof prompt.team === 'string'
      ? prompt.team
      : prompt.team?.name ?? 'Unassigned';

  const categoryName =
    typeof prompt.category === 'string'
      ? prompt.category
      : prompt.category?.name ?? null;

  return (
    <div className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={`/prompts/${prompt.slug ?? prompt.id}`}
            className="text-lg font-bold text-milford-charcoal hover:text-milford-orange"
          >
            {prompt.title}
          </Link>

          <p className="mt-2 text-sm leading-6 text-slate-600">{prompt.description}</p>
        </div>

        <span className={`badge ${riskClass}`}>{prompt.risk ?? 'low'}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categoryName ? (
          <span className="badge bg-milford-cream text-milford-charcoal">{categoryName}</span>
        ) : null}

        {tags.map((tag) => (
          <span className="badge bg-milford-cream text-milford-charcoal" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <span className="text-sm text-slate-500">
          {teamName} · {prompt.model ?? 'Model not set'} · v{prompt.version ?? '1.0'}
        </span>

        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star size={16} className="fill-milford-orange text-milford-orange" />
            {prompt.rating ?? 0}
          </span>

          <span className="flex items-center gap-1">
            <Copy size={16} />
            {prompt.uses ?? 0}
          </span>
        </span>
      </div>
    </div>
  );
}