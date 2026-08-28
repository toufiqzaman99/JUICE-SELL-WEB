const ITEMS = [
  'FRESH LEMONADE',
  'STRAWBERRY MILKSHAKE',
  'CHOCOLATE MILKSHAKE',
  'CLASSIC COLD COFFEE',
  'STRAWBERRY COLD COFFEE',
  'CHOCOLATE COLD COFFEE',
]

/** Infinite product ticker between acts. Pure CSS loop (GPU cheap). */
export function Marquee({ className = '' }: { className?: string }) {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className={`relative overflow-hidden border-y border-line/60 py-5 ${className}`} aria-hidden>
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-10">
                <span className="font-display text-2xl tracking-[0.06em] text-cream/85">{item}</span>
                <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
