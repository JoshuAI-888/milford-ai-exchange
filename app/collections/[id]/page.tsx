import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { Shell } from '@/components/layout/shell';
import { createClient } from '@/lib/supabase/server';

export default async function Collection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: collectionBySlug, error: slugError } = await supabase
    .from('collections')
    .select('id,slug,title,description')
    .eq('slug', id)
    .maybeSingle();

  let collection = collectionBySlug;
  let collectionError = slugError;

  if (!collection) {
    const { data: collectionById, error: idError } = await supabase
      .from('collections')
      .select('id,slug,title,description')
      .eq('id', id)
      .maybeSingle();

    collection = collectionById;
    collectionError = idError;
  }

  if (collectionError || !collection) {
    return notFound();
  }

  if (collection.slug !== id) {
    redirect(`/collections/${collection.slug}`);
  }

  const { data: collectionPrompts, error: promptError } = await supabase
    .from('collection_prompts')
    .select(`
      sort_order,
      prompt:prompts (
        id,
        slug,
        title,
        description,
        model,
        status,
        team:teams(name)
      )
    `)
    .eq('collection_id', collection.id)
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
        <div className="rounded-[32px] border border-stone-200/80 bg-milford-charcoal px-8 py-8 text-white shadow-soft lg:px-10 lg:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
            Prompt collection
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
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
          <h2 className="text-2xl font-bold text-milford-charcoal">Collection prompts</h2>

          {prompts.length === 0 ? (
            <div className="mt-4 rounded-[24px] border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500 shadow-sm">
              No prompts have been added to this collection yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {prompts.map((prompt: any, index: number) => (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.slug ?? prompt.id}`}
                  className="block rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-milford-orange font-bold text-white">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-milford-charcoal">{prompt.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">{prompt.description}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold">
                          {prompt.team?.name ?? 'Unassigned'}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold">
                          {prompt.model ?? 'Model not set'}
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