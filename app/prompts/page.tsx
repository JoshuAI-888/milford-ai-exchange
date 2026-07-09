import { Shell } from '@/components/layout/shell';
import { PromptCard } from '@/components/prompt-card';
import { prompts } from '@/lib/data';

export default function PromptsPage() {
  return (
    <Shell>
      <div className="space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-milford-orange">
                Prompt Library
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-milford-charcoal">
                Approved Milford prompt catalogue
            </h1>
            <p className="mt-3 max-w-3xl text-lg text-stone-600">
                Search, reuse, favourite, and improve standardised AI prompts across Milford teams.
            </p>
            </div>

        <div className="grid gap-4 md:grid-cols-2">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>
    </Shell>
  );
}
