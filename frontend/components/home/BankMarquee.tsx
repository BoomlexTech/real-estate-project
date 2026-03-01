'use client';

const banks = [
  'Emirates NBD',
  'Mashreq Bank',
  'First Abu Dhabi Bank',
  'ADCB',
  'HSBC',
  'Commercial Bank of Dubai',
  'Dubai Islamic Bank',
  'RAK Bank',
  'Standard Chartered',
  'Citibank',
  'ENBD',
  'Ajman Bank',
];

export default function BankMarquee() {
  return (
    <div
      className="relative overflow-hidden py-3"
      style={{
        background: '#0A0E1A',
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
        style={{ background: 'linear-gradient(to right, #0A0E1A, transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #0A0E1A, transparent)' }}
      />

      <div className="relative flex whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee min-w-max">
          {[...banks, ...banks, ...banks, ...banks].map((bank, i) => (
            <div key={i} className="flex items-center">
              <span
                className="text-xs font-light tracking-[0.2em] uppercase px-6 sm:px-10"
                style={{
                  color: '#C9A96E',
                  textShadow: '0 0 12px rgba(201,169,110,0.6), 0 0 24px rgba(201,169,110,0.3)',
                }}
              >
                {bank}
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
