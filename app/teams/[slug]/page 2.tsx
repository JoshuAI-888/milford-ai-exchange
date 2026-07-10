import Link from 'next/link';
import { notFound } from 'next/navigation';

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

  // Load the team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single();

  if (teamError || !team) {
    return notFound();
  }

  // Load approved prompts for this team
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

  // Featured collections (later we'll filter by team)
  const { data: collections, error: collectionError } = await supabase
    .from('collections')
    .select(`
      id,
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
        <div className="rounded-[28px] bg-milford-charcoal px-10 py-10 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
            Team workspace
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            {team.name}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {team.description ??
              'A dedicated workspace for reusable prompts, collections and AI capability.'}
          </p>

          <div className="mt-8 flex gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              {prompts?.length ?? 0} approved prompts
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Team workspace
            </span>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-milford-charcoal">
            Approved prompts
          </h2>

          {prompts && prompts.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-500">
              This team has no approved prompts yet.
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-milford-charcoal">
            Featured collections
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(collections ?? []).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-milford-charcoal">
                  {collection.title}
                </h3>

                <p className="mt-3 text-sm text-stone-600">
                  {collection.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}