import { Shell } from '@/components/layout/shell';
import { PromptLibraryClient } from '@/components/prompt-library-client';
import { createClient } from '@/lib/supabase/server';

export default async function PromptLibraryPage() {
  const supabase = await createClient();

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select(`
      id,title,slug,description,model,risk,status,owner_name,updated_at,
      team:teams(name),
      category:categories(name)
    `)
    .eq('status', 'approved')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const normalizedPrompts = (prompts ?? []).map((prompt) => {
    const rawPrompt = prompt as unknown as {
      id: string;
      title: string;
      slug: string | null;
      description: string;
      model: string;
      risk: string;
      status: string;
      owner_name: string | null;
      updated_at: string | null;
      team?: Array<{ name: string }> | { name: string } | null;
      category?: Array<{ name: string }> | { name: string } | null;
    };

    const team = Array.isArray(rawPrompt.team)
      ? rawPrompt.team[0] ?? null
      : rawPrompt.team ?? null;

    const category = Array.isArray(rawPrompt.category)
      ? rawPrompt.category[0] ?? null
      : rawPrompt.category ?? null;

    return {
      ...rawPrompt,
      team,
      category,
    };
  });

  return (
    <Shell>
      <div className="space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-milford-orange">
            Prompt library
          </p>
          <h1 className="mt-2 text-3xl font-bold text-milford-charcoal">
            Approved prompts ({normalizedPrompts.length})
          </h1>
        </div>
        <PromptLibraryClient prompts={normalizedPrompts} />
      </div>
    </Shell>
  );
}