import Link from 'next/link';
import { BookOpen, FolderKanban, Home, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { MobileNavMenu } from '@/components/layout/mobile-nav-menu';

const nav = [
  ['Dashboard', '/dashboard', Home],
  ['Prompts', '/prompts', BookOpen],
  ['Collections', '/collections', FolderKanban],
  ['Teams', '/teams', Users],
  ['Admin', '/admin', ShieldCheck],
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(228,113,38,0.12),_transparent_32%),linear-gradient(135deg,_#f8f2ea_0%,_#f7f4ef_100%)]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-milford-charcoal p-6 text-white lg:block">
        <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-milford-orange/20 p-2 text-milford-orange">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
                Milford
              </div>
              <div className="text-xl font-bold">AI Exchange</div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            A reusable AI capability workspace for prompt, collection, and team collaboration.
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {nav.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
          <p className="font-semibold text-white">Demo guardrail</p>
          <p className="mt-2 leading-6">
            Reusable IP first. No client data. No advice output.
          </p>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/85 px-6 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MobileNavMenu />
              <Link href="/dashboard" className="block">
                <div className="text-sm font-semibold text-milford-orange">
                  Invested in better AI habits
                </div>
                <h1 className="text-xl font-bold text-milford-charcoal">Milford AI Exchange</h1>
              </Link>
            </div>
            <Link href="/submit" className="btn-primary hidden sm:inline-flex">
              Submit prompt
            </Link>
          </div>
        </header>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
