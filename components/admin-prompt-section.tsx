'use client';

import Link from 'next/link';
import { useState } from 'react';

type PromptRow = {
  id: string;
  title: string;
  status: string;
  risk: string;
  owner_name: string | null;
  created_at: string | null;
  updated_at: string | null;
  team: { name: string } | null;
};

type AdminPromptSectionProps = {
  title: string;
  description: string;
  countLabel: string;
  prompts: PromptRow[];
  badgeClassName: string;
  emptyMessage: string;
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export function AdminPromptSection({
  title,
  description,
  countLabel,
  prompts,
  badgeClassName,
  emptyMessage,
}: AdminPromptSectionProps) {
  const [view, setView] = useState<'table' | 'tiles'>('table');

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-milford-charcoal">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={badgeClassName}>
            {prompts.length} {countLabel}
          </span>

          <div className="rounded-xl border border-stone-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setView('table')}
              className={`rounded-lg px-3 py-2 text-sm font-bold ${
                view === 'table'
                  ? 'bg-milford-charcoal text-white'
                  : 'text-slate-500'
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setView('tiles')}
              className={`rounded-lg px-3 py-2 text-sm font-bold ${
                view === 'tiles'
                  ? 'bg-milford-charcoal text-white'
                  : 'text-slate-500'
              }`}
            >
              Tiles
            </button>
          </div>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 text-stone-600">
          {emptyMessage}
        </div>
      ) : view === 'table' ? (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-milford-charcoal text-white">
              <tr>
                <th className="p-4">Prompt</th>
                <th>Team</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Last updated</th>
              </tr>
            </thead>

            <tbody>
              {prompts.map((prompt) => (
                <tr className="border-t border-milford-mist" key={prompt.id}>
                  <td className="p-4 font-semibold">
                    <Link
                      href={`/admin/prompts/${prompt.id}`}
                      className="text-milford-charcoal hover:text-milford-orange"
                    >
                      {prompt.title}
                    </Link>
                  </td>
                  <td>{prompt.team?.name ?? 'Unassigned'}</td>
                  <td>{prompt.risk}</td>
                  <td>{prompt.status}</td>
                  <td>{prompt.owner_name ?? 'Unassigned'}</td>
                  <td className="text-slate-600">
                    {formatDate(prompt.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/admin/prompts/${prompt.id}`}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h4 className="text-lg font-bold text-milford-charcoal">
                {prompt.title}
              </h4>
              <p className="mt-2 text-sm text-slate-500">
                {prompt.team?.name ?? 'Unassigned'} · {prompt.risk} risk
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Last updated
              </p>
              <p className="mt-1 text-sm font-bold text-milford-charcoal">
                {formatDate(prompt.updated_at)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}