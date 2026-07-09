export type Prompt = {
  id: string;
  title: string;
  slug?: string | null;
  description: string;
  model?: string;
  risk?: string;
  status?: string;
  owner_name?: string | null;
  updated_at?: string | null;
  version?: string | null;
  rating?: number | null;
  uses?: number | null;
  tags?: string[] | null;
  team?: {
    name: string;
  } | null;
  category?: {
    name: string;
  } | null;
};