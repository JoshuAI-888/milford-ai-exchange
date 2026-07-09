import { Shell } from '@/components/layout/shell';
import { PromptCard } from '@/components/prompt-card';
import { prompts, teams, collections } from '@/lib/data';

function title(slug: string) {
  return slug
    .split('-')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ')
    .replace('And', '&');
}

export default async function Team({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = title(slug);

  const teamPrompts = prompts.filter(
    (p) => p.team.toLowerCase().replaceAll(' ', '-') === slug,
  );

  const team = teams.find(
    (t) => t.toLowerCase().replaceAll(' ', '-') === slug,
  );

  return (
    <Shell>
      <div className="space-y-6">
        <div className="rounded-3xl bg-milford-charcoal p-8 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-milford-orange">
            Team workspace
          </p>

          <h1 className="mt-3 text-4xl font-semibold">{team ?? name}</h1>

          <p className="mt-3 max-w-3xl text-white/75">
            A dedicated workspace for reusable team prompts, collections, and
            discussions.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-milford-charcoal">
            Team prompts
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {teamPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-milford-charcoal">
            Suggested collections
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {collections.slice(0, 3).map((collection) => (
              <a
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-milford-orange">
                  {collection.prompts.length} prompts
                </p>

                <h3 className="mt-2 text-lg font-semibold text-milford-charcoal">
                  {collection.title}
                </h3>

                <p className="mt-2 text-sm text-stone-600">
                  {collection.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}