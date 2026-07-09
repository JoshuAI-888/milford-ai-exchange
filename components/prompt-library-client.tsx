'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Prompt = {
  id: string;
  title: string;
  slug: string | null;
  description: string;
  model: string;
  risk: string;
  status: string;
  owner_name: string | null;
  updated_at: string | null;
  team: { name: string } | null;
  category: { name: string } | null;
};

export function PromptLibraryClient({ prompts }: { prompts: Prompt[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [risk, setRisk] = useState('all');

  const categories = Array.from(
    new Set(prompts.map((p) => p.category?.name).filter(Boolean)),
  );

  const filtered = useMemo(() => {
    return prompts.filter((prompt) => {
      const text = `${prompt.title} ${prompt.description} ${prompt.team?.name ?? ''} ${prompt.category?.name ?? ''}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (category === 'all' || prompt.category?.name === category) &&
        (risk === 'all' || prompt.risk === risk)
      );
    });
  }, [prompts, search, category, risk]);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-stone-200/80 bg-milford-charcoal px-8 py-8 text-white shadow-soft lg:px-10 lg:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
          Prompt library
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Approved Milford prompt catalogue
        </h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
          Search, reuse, and improve approved prompts across Milford teams.
        </p>
      </div>

      <div className="rounded-[28px] border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="rounded-2xl border border-stone-300 bg-white p-3 text-sm outline-none focus:border-milford-orange focus:ring-2 focus:ring-orange-100"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-stone-300 bg-white p-3 text-sm outline-none focus:border-milford-orange focus:ring-2 focus:ring-orange-100"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c ?? ''}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="rounded-2xl border border-stone-300 bg-white p-3 text-sm outline-none focus:border-milford-orange focus:ring-2 focus:ring-orange-100"
          >
            <option value="all">All risk levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            Showing {filtered.length} of {prompts.length} approved prompts
          </p>
          <p className="rounded-full bg-milford-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-milford-charcoal">
            Search and refine quickly
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500 shadow-sm">
          No prompts match the current filters. Try broadening the search or switching categories.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.slug ?? prompt.id}`}
              className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-milford-charcoal">{prompt.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{prompt.description}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {prompt.team?.name ?? 'Unassigned'} · {prompt.category?.name ?? 'Uncategorised'} · {prompt.model}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
                  Approved
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}