import { Shell } from '@/components/layout/shell';
import { submitPromptAction } from './actions';

export default function SubmitPromptPage() {
  return (
    <Shell>
      <form action={submitPromptAction} className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-milford-charcoal">
            Submit prompt
          </h1>
          <p className="mt-2 text-slate-600">
            Submit a reusable Milford prompt for review.
          </p>
        </div>

        <input name="title" required className="w-full rounded-xl border p-3" placeholder="Prompt title" />
        <input name="description" required className="w-full rounded-xl border p-3" placeholder="Description" />
        <textarea name="body" required className="min-h-48 w-full rounded-xl border p-3" placeholder="Prompt body" />
        <textarea name="expectedOutput" className="min-h-24 w-full rounded-xl border p-3" placeholder="Expected output" />

        <select name="model" className="w-full rounded-xl border p-3" defaultValue="Claude">
          <option>Claude</option>
          <option>ChatGPT</option>
          <option>Copilot</option>
          <option>Gemini</option>
        </select>

        <select name="risk" className="w-full rounded-xl border p-3" defaultValue="low">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input name="ownerName" className="w-full rounded-xl border p-3" placeholder="Owner name" defaultValue="Demo User" />

        <button type="submit" className="btn-primary">
          Submit for review
        </button>
      </form>
    </Shell>
  );
}