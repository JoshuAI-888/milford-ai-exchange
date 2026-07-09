import { notFound, redirect } from 'next/navigation';
import { Shell } from '@/components/layout/shell';
import { createClient } from '@/lib/supabase/server';

export default async function PromptDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: promptBySlug, error: slugError } = await supabase
    .from('prompts')
    .select(`
      id,title,slug,description,body,expected_output,model,risk,status,version,owner_name,updated_at,
      team:teams(name),
      category:categories(name)
    `)
    .eq('slug', id)
    .maybeSingle();

  let prompt = promptBySlug;
  let error = slugError;

  if (!prompt) {
    const { data: promptById, error: idError } = await supabase
      .from('prompts')
      .select(`
        id,title,slug,description,body,expected_output,model,risk,status,version,owner_name,updated_at,
        team:teams(name),
        category:categories(name)
      `)
      .eq('id', id)
      .maybeSingle();

    prompt = promptById;
    error = idError;
  }

  if (error || !prompt) return notFound();

  if (prompt.slug && prompt.slug !== id) {
    redirect(`/prompts/${prompt.slug}`);
  }

  const team = Array.isArray((prompt as unknown as { team?: unknown }).team)
    ? (((prompt as unknown as { team?: Array<{ name: string }> }).team?.[0] ?? null))
    : (((prompt as unknown as { team?: { name: string } | null }).team ?? null));

  const category = Array.isArray((prompt as unknown as { category?: unknown }).category)
    ? (((prompt as unknown as { category?: Array<{ name: string }> }).category?.[0] ?? null))
    : (((prompt as unknown as { category?: { name: string } | null }).category ?? null));

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <main className="space-y-6">
          <div className="rounded-[32px] border border-stone-200/80 bg-milford-charcoal px-8 py-8 text-white shadow-soft lg:px-10 lg:py-10">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
              Approved prompt
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{prompt.title}</h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">{prompt.description}</p>
          </div>

          <section className="card p-6">
            <h2 className="text-2xl font-bold text-milford-charcoal">Prompt body</h2>
            <pre className="mt-4 whitespace-pre-wrap rounded-[24px] bg-stone-950 p-6 font-mono text-sm leading-7 text-stone-100">
              {prompt.body ?? 'No prompt body has been added yet.'}
            </pre>
          </section>

          <section className="card p-6">
            <h2 className="text-2xl font-bold text-milford-charcoal">Expected output</h2>
            <p className="mt-4 whitespace-pre-wrap text-slate-700">
              {prompt.expected_output || 'No expected output provided.'}
            </p>
          </section>
        </main>

        <aside className="space-y-4">
          <section className="card p-6">
            <h2 className="text-lg font-bold text-milford-charcoal">Metadata</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-400">Team</dt>
                <dd className="mt-1 font-medium text-milford-charcoal">{team?.name ?? 'Unassigned'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Category</dt>
                <dd className="mt-1 font-medium text-milford-charcoal">{category?.name ?? 'Uncategorised'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Model</dt>
                <dd className="mt-1 font-medium text-milford-charcoal">{prompt.model}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Risk</dt>
                <dd className="mt-1 font-medium text-milford-charcoal">{prompt.risk}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Owner</dt>
                <dd className="mt-1 font-medium text-milford-charcoal">{prompt.owner_name ?? 'Unassigned'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Version</dt>
                <dd className="mt-1 font-medium text-milford-charcoal">v{prompt.version}</dd>
              </div>
            </dl>
          </section>

          <button className="btn-primary w-full">Copy prompt</button>
        </aside>
      </div>
    </Shell>
  );
}
