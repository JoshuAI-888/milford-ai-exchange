'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function updatePromptStatus(promptId: string, status: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('prompts')
    .update({ status })
    .eq('id', promptId)
    .select('id,title,status');

  console.log('Prompt ID:', promptId);
  console.log('Target status:', status);
  console.log('Updated rows:', data);
  console.log('Error:', error);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(`No prompt updated. Check prompt ID: ${promptId}`);
  }

  revalidatePath('/admin');
  revalidatePath('/prompts');
  redirect('/admin');
}

export async function approvePromptAction(formData: FormData) {
  await updatePromptStatus(String(formData.get('promptId')), 'approved');
}

export async function rejectPromptAction(formData: FormData) {
  await updatePromptStatus(String(formData.get('promptId')), 'rejected');
}

export async function archivePromptAction(formData: FormData) {
  await updatePromptStatus(String(formData.get('promptId')), 'archived');
}