import { Shell } from '@/components/layout/shell';
import { AdminPromptSection } from '@/components/admin-prompt-section';
import { createClient } from '@/lib/supabase/server';

type PromptRow = {
  id: string;
  title: string;
  status: string;
  risk: string;
  owner_name: string | null;
  created_at: string | null;
  updated_at: string | null;
  team: { name: string } | null;
};

export default async function Admin() {
  const supabase = await createClient();

  const selectFields =
    'id,title,status,risk,owner_name,created_at,updated_at,team:teams(name)';

  const { data: reviewData, error: reviewError } = await supabase
    .from('prompts')
    .select(selectFields)
    .in('status', ['draft', 'in_review', 'pending_review'])
    .order('updated_at', { ascending: false });

  const { data: approvedData, error: approvedError } = await supabase
    .from('prompts')
    .select(selectFields)
    .eq('status', 'approved')
    .order('updated_at', { ascending: false });

  const { data: rejectedData, error: rejectedError } = await supabase
    .from('prompts')
    .select(selectFields)
    .eq('status', 'rejected')
    .order('updated_at', { ascending: false });

  const { data: archivedData, error: archivedError } = await supabase
    .from('prompts')
    .select(selectFields)
    .eq('status', 'archived')
    .order('updated_at', { ascending: false });

  const normalizePrompts = (
    rows: Array<Record<string, unknown>> | null | undefined,
  ): PromptRow[] =>
    (rows ?? []).map((prompt) => ({
      id: String(prompt.id ?? ''),
      title: String(prompt.title ?? ''),
      status: String(prompt.status ?? ''),
      risk: String(prompt.risk ?? ''),
      owner_name: (prompt.owner_name as string | null | undefined) ?? null,
      created_at: (prompt.created_at as string | null | undefined) ?? null,
      updated_at: (prompt.updated_at as string | null | undefined) ?? null,
      team: Array.isArray((prompt as { team?: unknown }).team)
        ? ((prompt as { team?: Array<{ name: string }> }).team?.[0] ?? null)
        : ((prompt as { team?: { name: string } | null }).team ?? null),
    }));

  const reviewPrompts = normalizePrompts(reviewData as Array<Record<string, unknown>> | null | undefined);
  const approvedPrompts = normalizePrompts(approvedData as Array<Record<string, unknown>> | null | undefined);
  const rejectedPrompts = normalizePrompts(rejectedData as Array<Record<string, unknown>> | null | undefined);
  const archivedPrompts = normalizePrompts(archivedData as Array<Record<string, unknown>> | null | undefined);

  const error = reviewError || approvedError || rejectedError || archivedError;

  return (
    <Shell>
      <div className="space-y-10">
        <div>
          <h2 className="text-3xl font-extrabold text-milford-charcoal">
            Admin review queue
          </h2>

          <p className="mt-2 text-slate-600">
            Review submitted prompts, approve reusable IP, and monitor approved,
            rejected and archived prompts.
          </p>
          <p className="mt-3 text-sm font-semibold text-milford-charcoal">
            Total prompts: {reviewPrompts.length + approvedPrompts.length + rejectedPrompts.length + archivedPrompts.length}
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            Supabase error: {error.message}
          </div>
        )}

        <AdminPromptSection
          title="Pending review"
          description="Prompts awaiting an approval decision."
          countLabel="pending"
          prompts={reviewPrompts}
          badgeClassName="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800"
          emptyMessage="Review queue is empty."
        />

        <AdminPromptSection
          title="Approved prompts"
          description="Prompts available across the Milford AI Exchange."
          countLabel="approved"
          prompts={approvedPrompts}
          badgeClassName="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800"
          emptyMessage="No approved prompts."
        />

        <AdminPromptSection
          title="Rejected prompts"
          description="Prompts rejected during governance review."
          countLabel="rejected"
          prompts={rejectedPrompts}
          badgeClassName="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-800"
          emptyMessage="No rejected prompts."
        />

        <AdminPromptSection
          title="Archived prompts"
          description="Retained for audit and historical reference."
          countLabel="archived"
          prompts={archivedPrompts}
          badgeClassName="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
          emptyMessage="No archived prompts."
        />
      </div>
    </Shell>
  );
}