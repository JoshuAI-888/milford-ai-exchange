'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, FolderKanban, Home, Menu, ShieldCheck, Sparkles, Users, X } from 'lucide-react';

const navItems = [
  ['Dashboard', '/dashboard', Home],
  ['Prompt Library', '/prompts', BookOpen],
  ['Collections', '/collections', FolderKanban],
  ['Teams', '/teams', Users],
  ['Submit Prompt', '/submit', Sparkles],
  ['Admin', '/admin', ShieldCheck],
] as const;

export function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.dataset.mobileNavOpen = open ? 'true' : 'false';

    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === 'Tab') {
        const drawer = drawerRef.current;
        if (!drawer) {
          return;
        }

        const focusable = drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (!focusable.length) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    drawerRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      delete document.body.dataset.mobileNavOpen;
      document.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  const handleNavigate = (href: string) => {
    if (href === pathname) {
      setOpen(false);
      return;
    }

    setOpen(false);
    window.setTimeout(() => router.push(href), 220);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX === null) {
      return;
    }

    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX;
    if (delta < -70) {
      setOpen(false);
    }
    setTouchStartX(null);
  };

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-milford-charcoal shadow-sm"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${open ? 'pointer-events-auto bg-[rgba(0,0,0,0.45)]' : 'pointer-events-none bg-transparent'}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      >
        <div
          id="mobile-navigation"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          tabIndex={-1}
          className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[300px] flex-col rounded-r-[24px] bg-milford-charcoal p-5 text-white shadow-xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(event) => event.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between bg-milford-charcoal">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
                Milford
              </p>
              <p className="mt-1 text-lg font-semibold">AI Exchange</p>
            </div>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-milford-charcoal text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="mt-8 flex-1 space-y-2" aria-label="Mobile navigation">
            {navItems.map(([label, href, Icon]) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavigate(href);
                  }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white transition ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}
                >
                  <Icon size={18} className="text-slate-300" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-white/10 bg-milford-charcoal pt-4 text-xs font-medium text-white/90">
            Milford AI Exchange
          </div>
        </div>
      </div>
    </div>
  );
}
