import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BackButton } from '@/components/layout/back-button';
import { Shell } from '@/components/layout/shell';
import { PromptCard } from '@/components/prompt-card';
import { createClient } from '@/lib/supabase/server';

export default async function Team({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single();

  if (teamError || !team) {
    return notFound();
  }

  const { data: prompts, error: promptError } = await supabase
    .from('prompts')
    .select(`
      *,
      team:teams(name),
      category:categories(name)
    `)
    .eq('team_id', team.id)
    .eq('status', 'approved')
    .order('updated_at', { ascending: false });

  if (promptError) {
    throw new Error(promptError.message);
  }

  const { data: collections, error: collectionError } = await supabase
    .from('collections')
    .select(`
      id,
      slug,
      title,
      description
    `)
    .limit(3);

  if (collectionError) {
    throw new Error(collectionError.message);
  }

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-3">
          <BackButton />
        </div>
        <div className="rounded-[32px] border border-stone-200/80 bg-milford-charcoal px-8 py-8 text-white shadow-soft lg:px-10 lg:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
            Team workspace
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{team.name}</h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {team.description ?? 'A dedicated workspace for reusable prompts, collections, and AI capability.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              {prompts?.length ?? 0} approved prompts
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Team workspace
            </span>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-milford-charcoal">Approved prompts</h2>

          {prompts && prompts.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] border border-dashed border-stone-300 bg-white p-8 text-center text-stone-500 shadow-sm">
              This team has no approved prompts yet.
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-milford-charcoal">Featured collections</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(collections ?? []).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-milford-charcoal">{collection.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{collection.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}