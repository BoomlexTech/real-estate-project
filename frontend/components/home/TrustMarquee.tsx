'use client';

const stats = [
  'Trusted by 1,000+ Clients',
  'AED 2B+ in Sales',
  '50+ Nationalities Served',
  'RERA Registered',
  'Rated 5★ on Google',
  '20+ Bank Partners',
  '10+ Years of Excellence',
  '98% Client Satisfaction',
  '500+ Properties Listed',
];

export default function TrustMarquee() {
  return (
    <div
      className="relative overflow-hidden py-3"
      style={{
        background: 'var(--bg-warm-tint)',
        borderTop: '1px solid rgba(201,169,110,0.35)',
        borderBottom: '1px solid rgba(201,169,110,0.35)',
        boxShadow: '0 0 24px rgba(201,169,110,0.12), inset 0 1px 0 rgba(201,169,110,0.08), inset 0 -1px 0 rgba(201,169,110,0.08)',
      }}
    >
      {/* Ambient glow layer behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Edge fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, var(--bg-warm-tint), transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, var(--bg-warm-tint), transparent)' }}
      />

      <div className="relative flex whitespace-nowrap overflow-hidden">
        <div
          className="flex min-w-max"
          style={{ animation: 'marquee 40s linear infinite', animationDirection: 'reverse', display: 'flex' }}
        >
          {[...stats, ...stats, ...stats, ...stats].map((stat, i) => (
            <div key={i} className="flex items-center">
              <span
                className="text-xs font-light tracking-[0.2em] uppercase px-6 sm:px-10"
                style={{
                  color: '#C9A96E',
                  textShadow: '0 0 12px rgba(201,169,110,0.6), 0 0 24px rgba(201,169,110,0.3)',
                }}
              >
                {stat}
              </span>
              <span
                style={{
                  color: '#C9A96E',
                  fontSize: '8px',
                  textShadow: '0 0 8px rgba(201,169,110,0.8)',
                }}
              >
                ◆
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
