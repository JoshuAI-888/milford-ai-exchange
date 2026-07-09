import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Shell } from '@/components/layout/shell';
import { createClient } from '@/lib/supabase/server';
import {
  approvePromptAction,
  rejectPromptAction,
  archivePromptAction,
} from '../../actions';

export default async function AdminPromptReview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prompt, error } = await supabase
    .from('prompts')
    .select(`
      *,
      team:teams(name),
      category:categories(name)
    `)
    .eq('id', id)
    .single();

  if (error || !prompt) return notFound();

  return (
    <Shell>
      <div className="space-y-8">
        <Link href="/admin" className="text-sm font-bold text-milford-orange">
          ← Back to admin queue
        </Link>

        <div className="rounded-[28px] bg-milford-charcoal px-10 py-10 text-white shadow-lg">
          <div className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
            Admin Review
          </div>

          <h1 className="mt-4 max-w-5xl text-4xl font-bold tracking-tight lg:text-5xl">
            {prompt.title}
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            {prompt.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6">
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-milford-charcoal">
                  Prompt body
                </h2>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                  Review content
                </span>
              </div>

              <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-stone-950 p-6 font-mono text-sm leading-7 text-stone-100">
                {prompt.body}
              </pre>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-milford-charcoal">
                Expected output
              </h2>
              <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-milford-cream p-5 leading-7 text-stone-700">
                {prompt.expected_output || 'No expected output provided.'}
              </p>
            </section>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-amber-900">
                Review checklist
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-amber-900">
                <li>• Does the prompt avoid client-specific financial advice?</li>
                <li>• Is the expected output clear enough for reuse?</li>
                <li>• Is the risk level appropriate?</li>
                <li>• Would this be useful to more than one person?</li>
                <li>• Is the wording specific enough to reduce hallucination risk?</li>
              </ul>
            </section>
          </main>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-milford-charcoal">
                Review metadata
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-stone-400">Owner</dt>
                  <dd className="font-bold text-milford-charcoal">
                    {prompt.owner_name || 'Unassigned'}
                  </dd>
                </div>

                <div>
                  <dt className="text-stone-400">Model</dt>
                  <dd className="font-bold text-milford-charcoal">
                    {prompt.model}
                  </dd>
                </div>

                <div>
                  <dt className="text-stone-400">Risk</dt>
                  <dd className="font-bold text-milford-charcoal">
                    {prompt.risk}
                  </dd>
                </div>

                <div>
                  <dt className="text-stone-400">Status</dt>
                  <dd className="font-bold text-milford-charcoal">
                    {prompt.status}
                  </dd>
                </div>

                <div>
                  <dt className="text-stone-400">Version</dt>
                  <dd className="font-bold text-milford-charcoal">
                    v{prompt.version}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-milford-charcoal">
                Decision
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Actions update Supabase and return to the admin queue.
              </p>

              <div className="mt-5 space-y-3">
                <form action={approvePromptAction}>
                  <input type="hidden" name="promptId" value={prompt.id} />
                  <button type="submit" className="btn-primary w-full">
                    Approve prompt
                  </button>
                </form>

                <form action={rejectPromptAction}>
                  <input type="hidden" name="promptId" value={prompt.id} />
                  <button type="submit" className="btn-secondary w-full">
                    Reject prompt
                  </button>
                </form>

                <form action={archivePromptAction}>
                  <input type="hidden" name="promptId" value={prompt.id} />
                  <button type="submit" className="btn-secondary w-full">
                    Archive prompt
                  </button>
                </form>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </Shell>
  );
}