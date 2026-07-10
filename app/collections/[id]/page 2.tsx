import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Shell } from '@/components/layout/shell';
import { createClient } from '@/lib/supabase/server';

export default async function Collection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  // Load the collection
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .maybeSingle();

  if (collectionError || !collection) {
    return notFound();
  }

  // Load prompts belonging to the collection
  const { data: collectionPrompts, error: promptError } = await supabase
    .from('collection_prompts')
    .select(`
      sort_order,
      prompt:prompts (
        id,
        title,
        description,
        model,
        status,
        team:teams(name)
      )
    `)
    .eq('collection_id', id)
    .order('sort_order');

  if (promptError) {
    throw new Error(promptError.message);
  }

  const prompts =
    collectionPrompts
      ?.map((row: any) => row.prompt)
      .filter(Boolean) ?? [];

  return (
    <Shell>
      <div className="space-y-8">
        <div className="rounded-[28px] bg-milford-charcoal px-10 py-10 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
            Prompt Collection
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight">
            {collection.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {collection.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              {prompts.length} prompts
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Approved collection
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Reusable workflow
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-milford-charcoal">
            Collection prompts
          </h2>

          {prompts.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
              No prompts have been added to this collection yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {prompts.map((prompt: any, index: number) => (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.id}`}
                  className="block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-milford-orange font-bold text-white">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-milford-charcoal">
                        {prompt.title}
                      </h3>

                      <p className="mt-2 text-sm text-stone-600">
                        {prompt.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold">
                          {prompt.team?.name ?? 'Unassigned'}
                        </span>

                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold">
                          {prompt.model}
                        </span>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {prompt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}