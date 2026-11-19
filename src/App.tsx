import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Bell, BellRing, Check, ChevronRight, Copy, ExternalLink, Heart,
  Info, Menu, Minus, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Tag,
  Target, TrendingDown, X, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { coupons, getSavings, getTotal, products, sortedOffers } from './data'
import type { Page, Product, WatchItem } from './types'
import { useBuyWise } from './useBuyWise'

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

const pageFromHash = (): Page => {
  const value = window.location.hash.replace('#/', '') as Page
  return ['home', 'compare', 'watchlist', 'deals', 'pricing'].includes(value) ? value : 'home'
}

function MockDataBadge() {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-600"><Info size={12} /> Demo data</span>
}

function Header({ page, watchCount, onNavigate }: { page: Page; watchCount: number; onNavigate: (page: Page) => void }) {
  const [open, setOpen] = useState(false)
  const links: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' }, { id: 'compare', label: 'Compare' }, { id: 'watchlist', label: 'Watchlist' }, { id: 'deals', label: 'Coupons' }, { id: 'pricing', label: 'Premium' },
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-sand/90 backdrop-blur-xl">
      <div className="page-shell flex h-18 items-center justify-between py-3">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5" aria-label="BuyWise home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-navy-900 text-amber-400 shadow-card"><ShoppingBag size={20} /></span>
          <span className="text-left"><span className="display block text-lg font-extrabold leading-none text-navy-950">BuyWise</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.17em] text-amber-600">Compare smarter</span></span>
        </button>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => <button key={link.id} onClick={() => onNavigate(link.id)} className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${page === link.id ? 'bg-white text-navy-950 shadow-sm' : 'text-navy-700 hover:bg-white/70'}`}>{link.label}{link.id === 'watchlist' && watchCount > 0 && <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] text-white">{watchCount}</span>}</button>)}
        </nav>
        <div className="hidden md:block"><button onClick={() => onNavigate('pricing')} className="btn-primary py-2.5"><Sparkles size={15} /> Go Premium</button></div>
        <button className="grid h-10 w-10 place-items-center rounded-xl border border-navy-900/10 bg-white md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && <nav className="page-shell grid gap-1 border-t border-navy-900/10 py-3 md:hidden">{links.map((link) => <button key={link.id} onClick={() => { onNavigate(link.id); setOpen(false) }} className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold ${page === link.id ? 'bg-navy-900 text-white' : 'bg-white/60 text-navy-800'}`}><span>{link.label}</span>{link.id === 'watchlist' && watchCount > 0 && <span>{watchCount}</span>}</button>)}</nav>}
    </header>
  )
}

function DemoStrip() {
  return <div className="bg-navy-950 py-2.5 text-center text-xs font-medium text-white/85"><span className="font-bold text-amber-400">University demo:</span> all prices, discounts, ratings, and alerts are clearly labeled simulations — not live retailer data.</div>
}

function SearchBox({ initial = '', onSearch }: { initial?: string; onSearch: (value: string) => void }) {
  const [query, setQuery] = useState(initial)
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSearch(query.trim()) }} className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-navy-950 p-3 shadow-soft sm:flex-row">
      <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3.5">
        <Search className="shrink-0 text-navy-700" size={20} />
        <span className="sr-only">Search sample products</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search headphones, laptops, coffee..." className="w-full bg-transparent text-sm text-navy-950 outline-none placeholder:text-navy-700/55" />
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-navy-950 transition hover:bg-amber-400">Compare sample prices <ArrowRight size={17} /></button>
    </form>
  )
}

function ProductCard({ product, watched, onCompare, onToggleWatch }: { product: Product; watched: boolean; onCompare: () => void; onToggleWatch: () => void }) {
  const offers = sortedOffers(product)
  const best = offers[0]
  const savings = getSavings(product)
  return (
    <article className="surface group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        <button onClick={onToggleWatch} className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-card transition ${watched ? 'bg-amber-500 text-white' : 'bg-white/90 text-navy-900 hover:bg-white'}`} aria-label={watched ? `Remove ${product.name} from watchlist` : `Add ${product.name} to watchlist`}><Heart size={18} fill={watched ? 'currentColor' : 'none'} /></button>
        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-navy-950/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">{product.badge}</span>}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-navy-700">Illustrative image</span>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3"><span className="eyebrow text-[10px]">{product.category}</span><span className="flex items-center gap-1 text-xs font-semibold text-navy-700"><Star size={13} className="fill-amber-400 text-amber-400" /> {product.rating} <span className="font-normal text-navy-700/55">({product.reviews.toLocaleString()})</span></span></div>
        <h3 className="display min-h-12 text-lg font-bold leading-snug text-navy-950">{product.name}</h3>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-navy-900/10 pt-4">
          <div><p className="text-xs text-navy-700">Best sample total at {best.retailer}</p><p className="display mt-0.5 text-2xl font-extrabold text-navy-950">{money(getTotal(best.price, best.shipping))}</p></div>
          <div className="text-right"><p className="text-xs font-bold text-emerald-700">Save up to {money(savings)}</p><p className="text-[11px] text-navy-700/65">across {offers.length} stores</p></div>
        </div>
        <button onClick={onCompare} className="btn-secondary mt-4 w-full">Compare all offers <ChevronRight size={16} /></button>
      </div>
    </article>
  )
}

function ComparisonModal({ product, watched, onClose, onToggleWatch, notify }: { product: Product; watched: boolean; onClose: () => void; onToggleWatch: () => void; notify: (message: string) => void }) {
  const offers = sortedOffers(product)
  const bestTotal = getTotal(offers[0].price, offers[0].shipping)
  useEffect(() => {
    const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="comparison-title" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-[2rem] bg-sand shadow-2xl sm:rounded-[2rem]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-navy-900/10 bg-sand/95 px-5 py-4 backdrop-blur-xl sm:px-7"><div><MockDataBadge /><h2 id="comparison-title" className="display mt-2 text-xl font-extrabold text-navy-950">Compare sample offers</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy-950 shadow-sm" aria-label="Close comparison"><X size={20} /></button></div>
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <img src={product.image} alt={product.name} className="aspect-[4/3] w-full rounded-3xl object-cover" />
            <h3 className="display mt-4 text-2xl font-extrabold text-navy-950">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-navy-700">{product.description}</p>
            <button onClick={onToggleWatch} className={`mt-4 w-full ${watched ? 'btn-secondary' : 'btn-primary'}`}>{watched ? <><Minus size={17} /> Remove from watchlist</> : <><Heart size={17} /> Watch this product</>}</button>
          </div>
          <div>
            <div className="mb-4 rounded-2xl border border-amber-500/25 bg-amber-50 p-4 text-sm text-navy-800"><strong>How ranking works:</strong> sample item price + sample shipping, lowest total first. Taxes are not included.</div>
            <div className="space-y-3">
              {offers.map((item, index) => {
                const total = getTotal(item.price, item.shipping)
                return <div key={item.retailer} className={`rounded-2xl border p-4 ${index === 0 ? 'border-amber-500 bg-white shadow-card' : 'border-navy-900/10 bg-white/70'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-extrabold ${index === 0 ? 'bg-amber-500 text-navy-950' : 'bg-navy-900 text-white'}`}>{index + 1}</span><div><div className="flex items-center gap-2"><p className="font-bold text-navy-950">{item.retailer}</p>{index === 0 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">Lowest total</span>}</div><p className="text-xs text-navy-700">{item.stock} · {item.shipping === 0 ? 'Free sample shipping' : `${money(item.shipping)} sample shipping`}</p></div></div>
                    <div className="flex items-center gap-4"><div className="text-right"><p className="display text-xl font-extrabold text-navy-950">{money(total)}</p>{total > bestTotal && <p className="text-xs text-navy-700">{money(total - bestTotal)} more</p>}</div><a href={item.url} target="_blank" rel="noreferrer" onClick={() => notify(`Opening the real ${item.retailer} search for ${product.shortName}. The displayed BuyWise price is still simulated.`)} className="btn-secondary px-4 py-2.5">Search store <ExternalLink size={14} /></a></div>
                  </div>
                </div>
              })}
            </div>
            <p className="mt-4 text-xs leading-5 text-navy-700/75">Product names are real and each link opens a product-specific search on the retailer's official website. BuyWise has no retailer partnerships; verify the exact listing, live price, availability, shipping, seller, and terms there.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="max-w-2xl"><p className="eyebrow">{eyebrow}</p><h2 className="display mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">{title}</h2>{copy && <p className="mt-3 text-base leading-7 text-navy-700">{copy}</p>}</div>
}

function HomePage({ watchedIds, onNavigate, onSearch, onCompare, onToggleWatch }: { watchedIds: Set<string>; onNavigate: (page: Page) => void; onSearch: (value: string) => void; onCompare: (product: Product) => void; onToggleWatch: (product: Product) => void }) {
  return <>
    <section className="grain overflow-hidden border-b border-navy-900/10 bg-white py-16 sm:py-24">
      <div className="page-shell text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-600"><Sparkles size={14} /> Built for smarter student budgets</div>
        <h1 className="display mx-auto mt-7 max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] text-navy-950 sm:text-7xl">Compare smarter.<br /><span className="text-amber-500">Save better.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-navy-700 sm:text-lg">One search brings simulated prices from four major retailers into one clear view. Track what matters and practice buying at the right moment.</p>
        <div className="mx-auto mt-9 max-w-3xl"><SearchBox onSearch={onSearch} /><div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-navy-700"><span className="font-semibold">Popular:</span>{['headphones', 'laptop', 'coffee', 'backpack'].map((item) => <button key={item} onClick={() => onSearch(item)} className="pill hover:border-amber-500 hover:text-amber-600">{item}</button>)}</div></div>
        <div className="mt-12 grid gap-3 text-left sm:grid-cols-3"><div className="surface p-5"><TrendingDown className="text-amber-500" /><p className="mt-3 font-bold text-navy-950">Lowest total first</p><p className="mt-1 text-sm text-navy-700">Price plus shipping, ranked clearly.</p></div><div className="surface p-5"><BellRing className="text-amber-500" /><p className="mt-3 font-bold text-navy-950">Useful demo alerts</p><p className="mt-1 text-sm text-navy-700">Set a target and simulate a drop.</p></div><div className="surface p-5"><ShieldCheck className="text-amber-500" /><p className="mt-3 font-bold text-navy-950">No checkout here</p><p className="mt-1 text-sm text-navy-700">Purchases stay on retailer websites.</p></div></div>
      </div>
    </section>
    <section className="py-16 sm:py-20"><div className="page-shell"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow="Featured comparisons" title="Smart starting points" copy="Six real products ranked with transparent simulated pricing and links to official retailer searches." /><button onClick={() => onNavigate('compare')} className="btn-secondary shrink-0">Browse every product <ArrowRight size={16} /></button></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} watched={watchedIds.has(product.id)} onCompare={() => onCompare(product)} onToggleWatch={() => onToggleWatch(product)} />)}</div></div></section>
    <section className="bg-navy-950 py-16 text-white sm:py-20"><div className="page-shell"><SectionHeading eyebrow="How it works" title="From “I need it” to “I got it cheaper”" /><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['01', 'Search once', 'Find a realistic sample product.'], ['02', 'Compare totals', 'See price and shipping together.'], ['03', 'Set a target', 'Track the price you want to pay.'], ['04', 'Buy at the source', 'Verify everything on the retailer site.']].map(([number, title, copy]) => <div key={number} className="rounded-3xl border border-white/10 bg-white/5 p-6"><span className="display text-3xl font-extrabold text-amber-400">{number}</span><h3 className="mt-8 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{copy}</p></div>)}</div></div></section>
    <section className="py-16 sm:py-20"><div className="page-shell grid items-center gap-8 rounded-[2rem] bg-amber-100 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr]"><div><p className="eyebrow">BuyWise Premium</p><h2 className="display mt-3 text-3xl font-extrabold text-navy-950 sm:text-4xl">More tracking. Fewer distractions.</h2><p className="mt-3 max-w-xl text-navy-700">Explore a simulated premium plan with unlimited watch items, longer history, and no demo ads. No payment is collected.</p></div><div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><button onClick={() => onNavigate('pricing')} className="btn-primary">Compare plans <ArrowRight size={16} /></button><button onClick={() => onNavigate('watchlist')} className="btn-secondary">Open watchlist</button></div></div></section>
  </>
}

function ComparePage({ initialQuery, watchedIds, onCompare, onToggleWatch }: { initialQuery: string; watchedIds: Set<string>; onCompare: (product: Product) => void; onToggleWatch: (product: Product) => void }) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(products.map((product) => product.category))]
  const filtered = products.filter((product) => (category === 'All' || product.category === category) && `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.toLowerCase()))
  return <main className="min-h-[70vh] py-12 sm:py-16"><div className="page-shell"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><SectionHeading eyebrow="Price comparison" title="Find the better sample total" copy="Search the demonstration catalog and compare sample price plus shipping across four retailers." /><MockDataBadge /></div><div className="mt-8"><SearchBox initial={query} onSearch={setQuery} /></div><div className="mt-5 flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`pill ${category === item ? 'border-navy-900 bg-navy-900 text-white' : 'hover:border-amber-500'}`}>{item}</button>)}</div><div className="mt-8 flex items-center justify-between"><p className="text-sm font-semibold text-navy-700">{filtered.length} sample {filtered.length === 1 ? 'product' : 'products'}</p><p className="hidden text-xs text-navy-700/65 sm:block">Totals include sample shipping · Taxes excluded</p></div>{filtered.length > 0 ? <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} watched={watchedIds.has(product.id)} onCompare={() => onCompare(product)} onToggleWatch={() => onToggleWatch(product)} />)}</div> : <div className="surface mt-6 grid min-h-72 place-items-center p-8 text-center"><div><Search className="mx-auto text-navy-700/40" size={42} /><h3 className="display mt-4 text-xl font-bold text-navy-950">No sample matches found</h3><p className="mt-2 text-sm text-navy-700">Try “headphones,” “laptop,” “coffee,” or clear the category filter.</p><button onClick={() => { setQuery(''); setCategory('All') }} className="btn-secondary mt-5">Clear filters</button></div></div>}</div></main>
}

function PriceChart({ product, target }: { product: Product; target?: number }) {
  return <div className="h-56 w-full" aria-label={`Simulated price history for ${product.name}`}><ResponsiveContainer width="100%" height="100%"><AreaChart data={product.history} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id={`fill-${product.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ed8b2c" stopOpacity={0.35} /><stop offset="100%" stopColor="#ed8b2c" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="#102a43" strokeOpacity={0.08} vertical={false} /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#587087' }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#587087' }} domain={['dataMin - 5', 'dataMax + 5']} /><Tooltip formatter={(value: number) => [money(value), 'Sample price']} contentStyle={{ borderRadius: 16, border: '1px solid rgba(16,42,67,.1)', boxShadow: '0 8px 24px rgba(16,42,67,.12)' }} /><Area type="monotone" dataKey="price" stroke="#ed8b2c" strokeWidth={3} fill={`url(#fill-${product.id})`} />{target && <Area type="monotone" dataKey={() => target} stroke="#24557a" strokeWidth={1.5} strokeDasharray="5 5" fill="transparent" />}</AreaChart></ResponsiveContainer></div>
}

function WatchlistPage({ items, onRemove, onUpdateTarget, onToggleNotifications, onCompare, notify }: { items: WatchItem[]; onRemove: (id: string) => void; onUpdateTarget: (id: string, price: number) => void; onToggleNotifications: (id: string) => void; onCompare: (product: Product) => void; notify: (message: string) => void }) {
  if (items.length === 0) return <main className="min-h-[70vh] py-14"><div className="page-shell"><div className="surface grid min-h-[480px] place-items-center p-8 text-center"><div><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-100 text-amber-600"><Heart size={34} /></span><h1 className="display mt-6 text-3xl font-extrabold text-navy-950">Your watchlist is ready when you are</h1><p className="mx-auto mt-3 max-w-md text-navy-700">Add a product from Compare, then set your ideal price and simulate a helpful price-drop alert.</p><a href="#/compare" className="btn-primary mt-6">Browse sample products <ArrowRight size={17} /></a></div></div></div></main>
  return <main className="min-h-[70vh] py-12 sm:py-16"><div className="page-shell"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow="My watchlist" title="Wait for the right price" copy="Targets and alert preferences are saved only in this browser using local storage." /><MockDataBadge /></div><div className="mt-8 space-y-6">{items.map((item) => { const product = products.find((value) => value.id === item.productId)!; const best = sortedOffers(product)[0]; const bestTotal = getTotal(best.price, best.shipping); const gap = bestTotal - item.targetPrice; return <article key={product.id} className="surface overflow-hidden"><div className="grid lg:grid-cols-[0.72fr_1.28fr]"><div className="p-5 sm:p-6"><div className="flex gap-4"><img src={product.image} alt="" className="h-24 w-24 rounded-2xl object-cover sm:h-32 sm:w-32" /><div className="min-w-0"><p className="eyebrow text-[10px]">{product.category}</p><h2 className="display mt-2 text-xl font-extrabold text-navy-950">{product.shortName}</h2><p className="mt-2 text-sm text-navy-700">Best sample total: <strong>{money(bestTotal)}</strong> at {best.retailer}</p></div></div><div className="mt-6"><PriceChart product={product} target={item.targetPrice} /></div><p className="mt-1 text-center text-[11px] text-navy-700/65">6-month simulated price history · Dashed line is your target</p></div><div className="border-t border-navy-900/10 bg-navy-950 p-5 text-white sm:p-7 lg:border-l lg:border-t-0"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400">Target price</p><p className="mt-1 text-sm text-white/65">Choose what you would be happy to pay.</p></div><Target className="text-amber-400" /></div><label className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3"><span className="text-lg font-bold">$</span><input type="number" min="1" step="1" value={item.targetPrice} onChange={(event) => onUpdateTarget(product.id, Math.max(1, Number(event.target.value)))} className="min-w-0 flex-1 bg-transparent text-2xl font-extrabold text-white outline-none" aria-label={`Target price for ${product.name}`} /><span className="text-xs text-white/55">USD</span></label><div className={`mt-4 rounded-2xl p-4 text-sm ${gap <= 0 ? 'bg-emerald-400/15 text-emerald-100' : 'bg-white/10 text-white/80'}`}>{gap <= 0 ? `Your sample target is met by ${best.retailer}.` : `${money(gap)} away from your target.`}</div><button onClick={() => onToggleNotifications(product.id)} className={`mt-4 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold ${item.notifications ? 'border-amber-400/50 bg-amber-400/10 text-amber-200' : 'border-white/15 bg-white/5 text-white/70'}`}><span className="flex items-center gap-2">{item.notifications ? <BellRing size={17} /> : <Bell size={17} />} Demo notifications</span><span>{item.notifications ? 'On' : 'Off'}</span></button><button onClick={() => notify(`Demo alert: ${product.shortName} dropped to ${money(Math.max(1, item.targetPrice - 3))}. This is a simulation — no live price was checked.`)} className="mt-3 w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-bold text-navy-950 hover:bg-amber-400">Simulate price drop</button><div className="mt-4 flex gap-3"><button onClick={() => onCompare(product)} className="flex-1 rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-navy-950">Compare</button><button onClick={() => onRemove(product.id)} className="rounded-xl border border-white/15 px-3 py-2.5 text-sm font-semibold text-white/75 hover:text-white">Remove</button></div></div></div></article> })}</div></div></main>
}

function DealsPage({ notify }: { notify: (message: string) => void }) {
  const copyCode = async (code: string) => { try { await navigator.clipboard.writeText(code); notify(`${code} copied — this is a simulated demo code.`) } catch { notify(`Demo code: ${code}`) } }
  return <main className="min-h-[70vh] py-12 sm:py-16"><div className="page-shell"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow="Coupons & discounts" title="Sample student offers" copy="Example promotions for the university demonstration. These are not real retailer coupons and will not work at checkout." /><MockDataBadge /></div><div className="mt-9 grid gap-5 sm:grid-cols-2">{coupons.map((coupon) => <article key={coupon.code} className="surface overflow-hidden"><div className="h-2" style={{ backgroundColor: coupon.color }} /><div className="p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-700">{coupon.retailer}</p><h2 className="display mt-2 text-2xl font-extrabold text-navy-950">{coupon.title}</h2></div><span className="display rounded-2xl bg-sand px-4 py-3 text-xl font-extrabold text-navy-950">{coupon.value}</span></div><div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-navy-900/20 bg-sand p-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-navy-700/60">Demo code</p><p className="font-mono text-base font-bold tracking-wider text-navy-950">{coupon.code}</p></div><button onClick={() => copyCode(coupon.code)} className="grid h-10 w-10 place-items-center rounded-xl bg-white text-navy-900 shadow-sm" aria-label={`Copy demo code ${coupon.code}`}><Copy size={17} /></button></div><div className="mt-4 flex items-center justify-between text-xs text-navy-700"><span>Simulated expiry: {coupon.expires}</span><span className="flex items-center gap-1 font-semibold text-amber-600"><Tag size={13} /> Not live</span></div></div></article>)}</div><div className="mt-8 rounded-3xl border border-navy-900/10 bg-navy-950 p-6 text-white sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="display text-xl font-extrabold">A useful demo, an honest promise</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">BuyWise does not validate coupon codes, receive affiliate commissions, or claim retailer partnerships. Always verify a promotion on the retailer’s official website.</p></div><ShieldCheck className="shrink-0 text-amber-400" size={42} /></div></div></div></main>
}

function PricingPage({ notify }: { notify: (message: string) => void }) {
  const [annual, setAnnual] = useState(false)
  const features = [
    ['Tracked products', 'Up to 3', 'Unlimited'], ['Price history', '6 months', '24 months'], ['Demo price alerts', 'Weekly', 'Instant'], ['Coupon collection', 'Included', 'Included'], ['Demo advertisements', 'Limited', 'Removed'], ['Priority support', '—', 'Included'],
  ]
  return <main className="min-h-[70vh] py-12 sm:py-16"><div className="page-shell"><div className="mx-auto max-w-3xl text-center"><MockDataBadge /><h1 className="display mt-5 text-4xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">A plan for every kind of saver</h1><p className="mt-4 text-lg text-navy-700">Explore pricing for the prototype. No real payment or subscription will be created.</p><div className="mx-auto mt-7 inline-flex rounded-full border border-navy-900/10 bg-white p-1 shadow-sm"><button onClick={() => setAnnual(false)} className={`rounded-full px-5 py-2 text-sm font-bold ${!annual ? 'bg-navy-900 text-white' : 'text-navy-700'}`}>Monthly</button><button onClick={() => setAnnual(true)} className={`rounded-full px-5 py-2 text-sm font-bold ${annual ? 'bg-navy-900 text-white' : 'text-navy-700'}`}>Annual <span className="text-amber-500">Save 20%</span></button></div></div><div className="mx-auto mt-10 grid max-w-4xl gap-5 lg:grid-cols-2"><div className="surface p-7 sm:p-8"><p className="eyebrow">Free</p><p className="display mt-4 text-5xl font-extrabold text-navy-950">$0</p><p className="mt-3 text-sm text-navy-700">For students learning to compare before buying.</p><button onClick={() => notify('You are already using the free BuyWise demo.')} className="btn-secondary mt-7 w-full">Current demo plan</button><ul className="mt-7 space-y-3">{['Track up to 3 products', '6-month sample price history', 'Weekly demo alerts', 'Coupon examples'].map((item) => <li key={item} className="flex items-center gap-3 text-sm text-navy-800"><Check className="text-emerald-600" size={17} /> {item}</li>)}</ul></div><div className="relative overflow-hidden rounded-[1.75rem] bg-navy-950 p-7 text-white shadow-soft sm:p-8"><span className="absolute right-5 top-5 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-950">Most flexible</span><p className="eyebrow text-amber-400">Premium</p><div className="mt-4 flex items-end gap-2"><p className="display text-5xl font-extrabold">{annual ? '$2.39' : '$2.99'}</p><p className="pb-1 text-sm text-white/55">/ month</p></div><p className="mt-3 text-sm text-white/65">Unlimited tracking and deeper history for committed planners.</p><button onClick={() => notify('Premium checkout is intentionally disabled in this university prototype. No payment was processed.')} className="mt-7 w-full rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-navy-950 transition hover:bg-amber-400">Try the Premium demo</button><ul className="mt-7 space-y-3">{['Unlimited tracked products', '24-month sample price history', 'Instant demo alerts', 'No demo advertisements'].map((item) => <li key={item} className="flex items-center gap-3 text-sm text-white/85"><Check className="text-amber-400" size={17} /> {item}</li>)}</ul></div></div><div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-navy-900/10 bg-white"><div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] bg-navy-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white sm:px-6"><span>Feature</span><span>Free</span><span>Premium</span></div>{features.map((row) => <div key={row[0]} className="grid grid-cols-[1.4fr_0.8fr_0.8fr] border-t border-navy-900/10 px-4 py-4 text-sm sm:px-6"><span className="font-semibold text-navy-950">{row[0]}</span><span className="text-navy-700">{row[1]}</span><span className="font-semibold text-amber-600">{row[2]}</span></div>)}</div></div></main>
}

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return <footer className="border-t border-navy-900/10 bg-white"><div className="page-shell grid gap-8 py-10 md:grid-cols-[1.4fr_0.6fr_0.6fr]"><div><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-900 text-amber-400"><ShoppingBag size={18} /></span><span className="display text-lg font-extrabold text-navy-950">BuyWise</span></div><p className="mt-4 max-w-md text-sm leading-6 text-navy-700">A university entrepreneurship prototype for learning how to compare, track, and plan purchases more thoughtfully.</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-navy-950">Shop smart</p><div className="mt-3 grid gap-2 text-sm text-navy-700"><button onClick={() => onNavigate('compare')} className="text-left hover:text-amber-600">Search & compare</button><button onClick={() => onNavigate('watchlist')} className="text-left hover:text-amber-600">My watchlist</button><button onClick={() => onNavigate('deals')} className="text-left hover:text-amber-600">Sample coupons</button></div></div><div><p className="text-xs font-bold uppercase tracking-wider text-navy-950">BuyWise</p><div className="mt-3 grid gap-2 text-sm text-navy-700"><button onClick={() => onNavigate('pricing')} className="text-left hover:text-amber-600">Premium plans</button><a href="mailto:hello@buywise.example" className="hover:text-amber-600">Demo contact</a></div></div></div><div className="border-t border-navy-900/10"><div className="page-shell flex flex-col gap-3 py-5 text-xs leading-5 text-navy-700/70 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 BuyWise — student project prototype.</p><p className="max-w-3xl sm:text-right">All products, prices, histories, ratings, coupons, savings, and alerts are simulated. No sales, payments, partnerships, or affiliate relationships.</p></div></div></footer>
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const timer = window.setTimeout(onClose, 4200); return () => window.clearTimeout(timer) }, [message, onClose])
  return <div className="fixed bottom-5 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-2xl bg-navy-950 p-4 text-sm text-white shadow-2xl rise" role="status"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-500 text-navy-950"><Zap size={14} /></span><p className="flex-1 leading-6">{message}</p><button onClick={onClose} aria-label="Dismiss notification" className="text-white/55 hover:text-white"><X size={17} /></button></div>
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash)
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)
  const [toast, setToast] = useState('')
  const { watchlist, addToWatchlist, removeFromWatchlist, updateTarget, toggleNotifications } = useBuyWise()
  const watchedIds = useMemo(() => new Set(watchlist.map((item) => item.productId)), [watchlist])

  useEffect(() => {
    const handler = () => { setPage(pageFromHash()); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const navigate = (destination: Page) => {
    window.location.hash = `/${destination}`
    if (page === destination) window.scrollTo({ top: 0, behavior: 'smooth' })
    setPage(destination)
  }

  const search = (value: string) => { setSearchQuery(value); navigate('compare') }
  const toggleWatch = (product: Product) => {
    if (watchedIds.has(product.id)) { removeFromWatchlist(product.id); setToast(`${product.shortName} removed from your watchlist.`) }
    else { addToWatchlist(product.id); setToast(`${product.shortName} added. Your watchlist is stored in this browser.`) }
  }

  return <div className="min-h-screen bg-sand text-navy-900"><DemoStrip /><Header page={page} watchCount={watchlist.length} onNavigate={navigate} />
    {page === 'home' && <HomePage watchedIds={watchedIds} onNavigate={navigate} onSearch={search} onCompare={setSelected} onToggleWatch={toggleWatch} />}
    {page === 'compare' && <ComparePage initialQuery={searchQuery} watchedIds={watchedIds} onCompare={setSelected} onToggleWatch={toggleWatch} />}
    {page === 'watchlist' && <WatchlistPage items={watchlist} onRemove={removeFromWatchlist} onUpdateTarget={updateTarget} onToggleNotifications={toggleNotifications} onCompare={setSelected} notify={setToast} />}
    {page === 'deals' && <DealsPage notify={setToast} />}
    {page === 'pricing' && <PricingPage notify={setToast} />}
    <Footer onNavigate={navigate} />
    {selected && <ComparisonModal product={selected} watched={watchedIds.has(selected.id)} onClose={() => setSelected(null)} onToggleWatch={() => toggleWatch(selected)} notify={setToast} />}
    {toast && <Toast message={toast} onClose={() => setToast('')} />}
  </div>
}
