import { Shell } from '@/components/layout/shell';
import { PromptCard } from '@/components/prompt-card';
import { collections, prompts, teams } from '@/lib/data';
import Link from 'next/link';

export default function Dashboard(){
 const trending = [...prompts].sort((a,b)=>b.uses-a.uses).slice(0,3);
 return <Shell><div className="space-y-6">
  <section className="rounded-3xl bg-milford-charcoal p-8 text-white shadow-soft">
   <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-200">MVP Demo</p><h2 className="mt-3 text-4xl font-extrabold">Reusable prompt IP for investment, risk, client and data teams.</h2><p className="mt-4 text-slate-200">Find an approved prompt, discuss improvements, group it into a collection, and make better AI work reusable across Milford.</p></div>
  </section>
  <div className="grid gap-4 md:grid-cols-4">
   {[['Approved prompts',prompts.length],['Teams',teams.length],['Collections',collections.length],['Pending reviews',7]].map(([l,v])=><div className="card p-5" key={l}><div className="text-3xl font-extrabold text-milford-charcoal">{v}</div><div className="mt-1 text-sm text-slate-500">{l}</div></div>)}
  </div>
  <section><div className="mb-3 flex items-center justify-between"><h3 className="text-2xl font-bold text-milford-charcoal">Trending prompts</h3><Link className="text-sm font-semibold text-milford-orange" href="/prompts">View all</Link></div><div className="grid gap-4 lg:grid-cols-3">{trending.map(p=><PromptCard key={p.id} prompt={p}/>)}</div></section>
  <section><h3 className="mb-3 text-2xl font-bold text-milford-charcoal">Featured collections</h3><div className="grid gap-4 lg:grid-cols-4">{collections.map(c=><Link href={`/collections/${c.id}`} key={c.id} className="card block p-5 hover:border-milford-orange"><div className="font-bold text-milford-charcoal">{c.title}</div><p className="mt-2 text-sm text-slate-600">{c.description}</p><div className="mt-4 text-xs font-semibold text-milford-orange">{c.prompts.length} prompts · {c.team}</div></Link>)}</div></section>
 </div></Shell>
}
