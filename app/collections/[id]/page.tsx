import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Shell } from '@/components/layout/shell';
import { collections, prompts } from '@/lib/data';

export default async function Collection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = collections.find((x) => x.id === id);

  if (!collection) return notFound();

  const collectionPrompts = collection.prompts
    .map((promptId) => prompts.find((p) => p.id === promptId))
    .filter(Boolean);

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
              {collectionPrompts.length} prompts
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

          <div className="mt-4 space-y-3">
            {collectionPrompts.map((prompt, index) =>
              prompt ? (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.id}`}
                  className="block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-milford-orange font-bold text-white">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-milford-charcoal">
                        {prompt.title}
                      </h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {prompt.description}
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                        {prompt.team} · {prompt.model}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}