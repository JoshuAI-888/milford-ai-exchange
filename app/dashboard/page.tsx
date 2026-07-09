// app/dashboard/page.tsx

import Link from 'next/link';
import { Shell } from '@/components/layout/shell';
import { createClient } from '@/lib/supabase/server';

type PromptSummary = {
  id: string;
  title: string;
  slug: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

type CollectionSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  created_at: string | null;
};

export default async function Dashboard() {
  const supabase = await createClient();

  const [
    { count: totalPromptCount },
    { count: approvedPromptCount },
    { count: pendingReviewCount },
    { count: archivedPromptCount },
    { count: rejectedPromptCount },
    { count: teamCount },
    { count: collectionCount },
  ] = await Promise.all([
    supabase.from('prompts').select('*', { count: 'exact', head: true }),
    supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
    supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('status', 'archived'),
    supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('collections').select('*', { count: 'exact', head: true }),
  ]);

  const { data: featuredPromptsData } = await supabase
    .from('prompts')
    .select('id,title,slug,status,created_at,updated_at')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false })
    .limit(4);

  const { data: featuredCollectionsData } = await supabase
    .from('collections')
    .select('id,slug,title,description,created_at')
    .order('created_at', { ascending: false })
    .limit(4);

  const { data: recentPromptsData } = await supabase
    .from('prompts')
    .select('id,title,slug,status,created_at,updated_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentCollectionsData } = await supabase
    .from('collections')
    .select('id,slug,title,description,created_at')
    .order('created_at', { ascending: false })
    .limit(4);

  const { data: ratingRows } = await supabase.from('ratings').select('prompt_id,rating');
  const { data: usageRows } = await supabase.from('prompt_usage_events').select('prompt_id');

  const featuredPrompts = (featuredPromptsData ?? []) as PromptSummary[];
  const featuredCollections = (featuredCollectionsData ?? []) as CollectionSummary[];
  const recentPrompts = (recentPromptsData ?? []) as PromptSummary[];
  const recentCollections = (recentCollectionsData ?? []) as CollectionSummary[];

  const ratingAverages = new Map<string, number>();
  const ratingCounts = new Map<string, number>();
  for (const row of ratingRows ?? []) {
    const promptId = String((row as { prompt_id?: string }).prompt_id ?? '');
    if (!promptId) continue;
    const rating = Number((row as { rating?: number }).rating ?? 0);
    const beforeCount = ratingCounts.get(promptId) ?? 0;
    const beforeTotal = ratingAverages.get(promptId) ?? 0;
    ratingCounts.set(promptId, beforeCount + 1);
    ratingAverages.set(promptId, beforeTotal + rating);
  }

  const usageCounts = new Map<string, number>();
  for (const row of usageRows ?? []) {
    const promptId = String((row as { prompt_id?: string }).prompt_id ?? '');
    if (!promptId) continue;
    usageCounts.set(promptId, (usageCounts.get(promptId) ?? 0) + 1);
  }

  const trendingPrompts = [...featuredPrompts]
    .map((prompt) => {
      const ratingCount = ratingCounts.get(prompt.id) ?? 0;
      const ratingAverage = ratingCount > 0 ? (ratingAverages.get(prompt.id) ?? 0) / ratingCount : 0;
      const usageCount = usageCounts.get(prompt.id) ?? 0;
      const trendScore = ratingCount > 0 ? ratingAverage : usageCount;
      return { ...prompt, trendScore };
    })
    .sort((a, b) => b.trendScore - a.trendScore || (b.updated_at ?? '').localeCompare(a.updated_at ?? ''));

  const recentActivity = [
    ...recentPrompts.map((prompt) => ({
      title: prompt.title,
      description: `Updated ${prompt.status}`,
      timestamp: prompt.updated_at ?? prompt.created_at,
      href: `/prompts/${prompt.slug ?? prompt.id}`,
    })),
    ...recentCollections.map((collection) => ({
      title: collection.title,
      description: 'New collection',
      timestamp: collection.created_at,
      href: `/collections/${collection.slug}`,
    })),
  ].sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? '')).slice(0, 6);

  return (
    <Shell>
      <div className="space-y-8">
        <div className="rounded-[32px] border border-stone-200/80 bg-milford-charcoal px-8 py-8 text-white shadow-soft lg:px-10 lg:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
            Milford AI Exchange
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Reusable AI capability for Milford teams
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Discover approved prompts, review submissions, and turn team AI usage into reusable Milford IP.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/prompts" className="btn-primary">
              Explore prompts
            </Link>
            <Link href="/submit" className="btn-secondary bg-white/10 text-white hover:bg-white/20">
              Submit a prompt
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total prompts" value={totalPromptCount ?? 0} href="/prompts" />
          <Metric label="Pending review" value={pendingReviewCount ?? 0} href="/admin" />
          <Metric label="Approved prompts" value={approvedPromptCount ?? 0} href="/prompts" />
          <Metric label="Archived prompts" value={archivedPromptCount ?? 0} href="/admin" />
          <Metric label="Rejected prompts" value={rejectedPromptCount ?? 0} href="/admin" />
          <Metric label="Teams" value={teamCount ?? 0} href="/teams" />
          <Metric label="Collections" value={collectionCount ?? 0} href="/collections" />
        </div>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-milford-charcoal">Featured prompts</h2>
              <p className="mt-1 text-sm text-slate-600">High-value prompts that teams are actively reusing.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.slug ?? prompt.id}`}
                className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-milford-charcoal">{prompt.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Updated {prompt.updated_at ? new Date(prompt.updated_at).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    {prompt.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-milford-charcoal">Featured collections</h2>
              <p className="mt-1 text-sm text-slate-600">Curated bundles that give teams a head start.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-milford-charcoal">{collection.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{collection.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-milford-charcoal">Recent activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <Link
                key={`${item.title}-${item.timestamp}`}
                href={item.href}
                className="flex items-center justify-between rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <h3 className="font-semibold text-milford-charcoal">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <span className="text-sm text-slate-400">
                  {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '—'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-milford-charcoal">Recent submissions</h2>
          <div className="space-y-3">
            {recentPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.slug ?? prompt.id}`}
                className="flex items-center justify-between rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <h3 className="font-semibold text-milford-charcoal">{prompt.title}</h3>
                  <p className="text-sm text-slate-600">
                    Submitted {prompt.created_at ? new Date(prompt.created_at).toLocaleDateString() : 'recently'}
                  </p>
                </div>
                <span className="text-sm text-slate-400">{prompt.status}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-milford-charcoal">Trending prompts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {trendingPrompts.slice(0, 4).map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.slug ?? prompt.id}`}
                className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-milford-charcoal">{prompt.title}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Score: {prompt.trendScore > 0 ? prompt.trendScore.toFixed(1) : 'Latest update'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Metric({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-extrabold text-milford-charcoal">{value}</p>
    </Link>
  );
}