'use client';

const locations = [
    'Downtown Dubai',
    'Palm Jumeirah',
    'Dubai Marina',
    'Business Bay',
    'Dubai Hills Estate',
    'Jumeirah Village Circle (JVC)',
    'Dubai Creek Harbour',
    'Emirates Hills',
    'Arabian Ranches',
    'DIFC'
];

export default function LocationMarquee() {
    return (
        <section className="bg-card border-y border-white/5 overflow-hidden py-3">
            <div className="relative flex whitespace-nowrap overflow-hidden">
                {/* The scrolling track */}
                <div className="flex animate-marquee min-w-max">
                    {/* We duplicate the content to create a seamless loop */}
                    {[...locations, ...locations, ...locations, ...locations].map((location, i) => (
                        <div key={i} className="flex items-center">
                            <span className="text-white/70 text-sm font-light tracking-[0.15em] uppercase px-4 sm:px-8">
                                {location}
                            </span>
                            <span className="text-gold opacity-50 text-xs">◆</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
