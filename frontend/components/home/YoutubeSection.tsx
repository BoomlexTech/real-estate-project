'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

const videos = [
  {
    id: 'sMb108EdQ34',
    title: 'Creek Waters Residence — Dubai Creek Harbour Tour',
    location: 'Dubai Creek Harbour',
  },
  {
    id: 'i7XVJMeUsAI',
    title: 'Palm Jumeirah Luxury Villa Walkthrough',
    location: 'Palm Jumeirah',
  },
  {
    id: '2E8RgkLfz6Y',
    title: 'Downtown Dubai Penthouse — Full Tour',
    location: 'Downtown Dubai',
  },
  {
    id: 'bBeoZLlWgoc',
    title: 'Dubai Marina Waterfront Living',
    location: 'Dubai Marina',
  },
  {
    id: 'LjE-E01b5RI',
    title: 'Business Bay Premium Apartments',
    location: 'Business Bay',
  },
  {
    id: 'B1zRYUqGnRE',
    title: 'Jumeirah Golf Estates — Villa Tour',
    location: 'Jumeirah Golf Estates',
  },
];

const VISIBLE = 3;

function VideoCard({ video }: { video: (typeof videos)[0] }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full"
    >
      <div className="relative w-full shrink-0" style={{ paddingTop: '56.25%' }}>
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumb}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.65) 0%, rgba(10,14,26,0.15) 60%)' }}
            />
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label={`Play ${video.title}`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-lg"
                style={{ background: '#C9A96E' }}
              >
                <Play className="w-6 h-6 fill-current" style={{ color: '#1a1f2e', marginLeft: '2px' }} />
              </div>
            </button>
          </>
        )}
      </div>

      <div className="px-4 py-3 flex flex-col flex-1">
        <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{video.title}</p>
        <p className="text-xs mt-1.5" style={{ color: '#C9A96E' }}>{video.location}</p>
      </div>
    </div>
  );
}

export default function YoutubeSection() {
  const [startIdx, setStartIdx] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const canPrev = startIdx > 0;
  const canNext = startIdx + VISIBLE < videos.length;

  function prev() {
    setDirection('left');
    setStartIdx((i) => Math.max(0, i - 1));
  }

  function next() {
    setDirection('right');
    setStartIdx((i) => Math.min(videos.length - VISIBLE, i + 1));
  }

  const visible = videos.slice(startIdx, startIdx + VISIBLE);

  const variants = {
    enter: (dir: string) => ({ x: dir === 'right' ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: string) => ({ x: dir === 'right' ? -40 : 40, opacity: 0 }),
  };

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-warm-tint)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col items-center text-center mb-6 sm:mb-10 gap-4"
        >
          <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: '#C9A96E' }}>
            Property Tours
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight">
            Explore Dubai Real Estate
          </h2>
          <p className="text-gray-400 text-sm max-w-xl">
            Watch exclusive video tours of Dubai&apos;s most sought-after properties — from waterfront apartments to luxury villas.
          </p>

          {/* Arrow controls — floated top-right */}
          <div className="absolute top-0 right-0 flex gap-2">
            <button
              onClick={prev}
              disabled={!canPrev}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition disabled:opacity-30"
              style={{ border: '1px solid rgba(201,168,76,0.45)' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={!canNext}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition disabled:opacity-30"
              style={{ border: '1px solid rgba(201,168,76,0.45)' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={startIdx}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
            >
              {visible.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: videos.length - VISIBLE + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > startIdx ? 'right' : 'left'); setStartIdx(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === startIdx ? '24px' : '8px',
                height: '8px',
                background: i === startIdx ? 'var(--gold)' : 'var(--border-color)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
