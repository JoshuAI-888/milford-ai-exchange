import Link from 'next/link';
import { Shell } from '@/components/layout/shell';
import { createClient } from '@/lib/supabase/server';

export default async function CollectionsPage() {
  const supabase = await createClient();

  const { data: collections, error } = await supabase
    .from('collections')
    .select('id,slug,title,description')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-stone-200/80 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-milford-orange">
            Collections
          </p>
          <h1 className="mt-2 text-3xl font-bold text-milford-charcoal">
            Browse collections ({collections?.length ?? 0})
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Curated bundles of prompts that help teams move faster with consistent workflows.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(collections ?? []).map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-milford-charcoal">{collection.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{collection.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
