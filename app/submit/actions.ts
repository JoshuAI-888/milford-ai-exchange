'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function submitPromptAction(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get('title') ?? '');
  const description = String(formData.get('description') ?? '');
  const body = String(formData.get('body') ?? '');
  const expectedOutput = String(formData.get('expectedOutput') ?? '');
  const model = String(formData.get('model') ?? 'Claude');
  const risk = String(formData.get('risk') ?? 'low');
  const ownerName = String(formData.get('ownerName') ?? 'Demo User');

  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const slug = `${baseSlug}-${Date.now()}`;

  const { data: team } = await supabase
    .from('teams')
    .select('id')
    .limit(1)
    .maybeSingle();

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .limit(1)
    .maybeSingle();

  const insertPayload: Record<string, unknown> = {
    title,
    slug,
    description,
    body,
    expected_output: expectedOutput,
    model,
    risk,
    status: 'pending_review',
    version: '1.0',
    owner_name: ownerName,
  };

  if (team?.id) {
    insertPayload.team_id = team.id;
  }

  if (category?.id) {
    insertPayload.category_id = category.id;
  }

  const { error } = await supabase.from('prompts').insert(insertPayload);

  if (error) {
    throw new Error(error.message);
  }

  redirect('/admin');
}