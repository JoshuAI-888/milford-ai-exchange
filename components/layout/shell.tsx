import Link from 'next/link';
import { BookOpen, FolderKanban, Home, ShieldCheck, Users } from 'lucide-react';

const nav = [
  ['Dashboard','/dashboard',Home], ['Prompts','/prompts',BookOpen], ['Collections','/collections/investment-committee-pack',FolderKanban], ['Teams','/teams/investment-research',Users], ['Admin','/admin',ShieldCheck]
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-milford-cream">
    <aside className="fixed inset-y-0 left-0 hidden w-72 bg-milford-charcoal p-6 text-white lg:block">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-orange-200">Milford</div>
        <div className="mt-2 text-2xl font-bold">AI Exchange</div>
        <p className="mt-3 text-sm text-slate-300">Prompt, collection and team workspace MVP.</p>
      </div>
      <nav className="space-y-2">
        {nav.map(([label, href, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"><Icon size={18}/>{label}</Link>)}
      </nav>
      <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
        <b className="text-white">MVP guardrail:</b><br/>No client data. No advice output. Reusable IP first.
      </div>
    </aside>
    <main className="lg:pl-72">
      <header className="sticky top-0 z-10 border-b border-milford-mist bg-white/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-semibold text-milford-orange">Invested in better AI habits</div><h1 className="text-xl font-bold text-milford-charcoal">Milford AI Exchange</h1></div>
          <Link href="/submit" className="btn-primary">Submit prompt</Link>
        </div>
      </header>
      <div className="p-6">{children}</div>
    </main>
  </div>
}
