'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, FolderKanban, Home, Menu, ShieldCheck, Sparkles, Users, X } from 'lucide-react';

const navItems = [
  ['Dashboard', '/dashboard', Home],
  ['Prompts', '/prompts', BookOpen],
  ['Collections', '/collections', FolderKanban],
  ['Teams', '/teams', Users],
  ['Submit Prompt', '/submit', Sparkles],
  ['Admin', '/admin', ShieldCheck],
] as const;

export function MobileNavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-milford-charcoal shadow-sm"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-20 bg-black/35" onClick={() => setOpen(false)}>
          <div
            id="mobile-navigation"
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-milford-charcoal p-5 text-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
                  Milford
                </p>
                <p className="mt-1 text-lg font-semibold">AI Exchange</p>
              </div>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map(([label, href, Icon]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
