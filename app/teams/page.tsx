import Link from 'next/link';
import { Shell } from '@/components/layout/shell';
import { createClient } from '@/lib/supabase/server';

export default async function TeamsPage() {
  const supabase = await createClient();

  const { data: teams, error } = await supabase
    .from('teams')
    .select('id,slug,name,description')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-stone-200/80 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-milford-orange">
            Teams
          </p>
          <h1 className="mt-2 text-3xl font-bold text-milford-charcoal">
            Browse teams ({teams?.length ?? 0})
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Team spaces that organise approved prompts and reusable collections in one place.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(teams ?? []).map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.slug}`}
              className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-milford-charcoal">{team.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{team.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
