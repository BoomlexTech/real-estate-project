'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

type PropertySlide = {
  id: number;
  type: 'property';
  badge: string;
  title: string;
  subtitle: string;
  location: string;
  price: string;
  priceLabel: string;
  paymentPlan: string;
  completion: string;
  cta: string;
  href: string;
  image: string;
};

type VideoSlide = {
  id: string;
  type: 'video';
  videoId: string;
};

type Slide = PropertySlide | VideoSlide;

const slides: Slide[] = [
  {
    id: 'video',
    type: 'video',
    videoId: 'a1OX0A19DM4',
  },
  {
    id: 1,
    type: 'property',
    badge: 'Off-Plan',
    title: 'Creek Waters Residence',
    subtitle: 'Waterfront Residences — Dubai Creek Harbour',
    location: 'Dubai Creek Harbour',
    price: 'AED 1,800,000',
    priceLabel: 'Starting From',
    paymentPlan: '20/40/40',
    completion: '2026',
    cta: 'View Property',
    href: '/property/creek-waters-residence',
    image: 'https://images.pexels.com/photos/30707660/pexels-photo-30707660.jpeg?w=1920&q=85&fit=crop',
  },
  {
    id: 2,
    type: 'property',
    badge: 'Ready to Move',
    title: 'Marina Heights Tower',
    subtitle: 'Premium Residences — Dubai Marina',
    location: 'Dubai Marina',
    price: 'AED 3,500,000',
    priceLabel: 'Starting From',
    paymentPlan: 'Flexible',
    completion: 'Ready',
    cta: 'View Property',
    href: '/property/marina-heights-tower',
    image: 'https://images.pexels.com/photos/31033420/pexels-photo-31033420.jpeg?w=1920&q=85&fit=crop',
  },
  {
    id: 3,
    type: 'property',
    badge: 'For Sale',
    title: 'Palm Jumeirah Signature Villa',
    subtitle: 'Exclusive Beachfront Estate — Palm Jumeirah',
    location: 'Palm Jumeirah',
    price: 'AED 25,000,000',
    priceLabel: 'Starting From',
    paymentPlan: 'Negotiable',
    completion: 'Ready',
    cta: 'View Property',
    href: '/property/palm-jumeirah-signature-villa',
    image: 'https://images.pexels.com/photos/4497544/pexels-photo-4497544.jpeg?w=1920&q=85&fit=crop',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [videoReady, setVideoReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const touchStartX = useRef<number>(0);

  const isVideoSlide = slides[current].type === 'video';

  const next = useCallback(() => {
    setDirection('right');
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = () => {
    setDirection('left');
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  // Init/destroy YT player when video slide becomes active/inactive
  useEffect(() => {
    if (!isVideoSlide) {
      playerRef.current?.destroy();
      playerRef.current = null;
      setVideoReady(false);
      return;
    }

    setVideoReady(false);

    const initPlayer = () => {
      if (!playerContainerRef.current) return;
      playerRef.current = new (window as any).YT.Player(playerContainerRef.current, {
        videoId: 'a1OX0A19DM4',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            setVideoReady(true);
            const iframe = event.target.getIframe() as HTMLIFrameElement;
            Object.assign(iframe.style, {
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
              transform: 'translate(-50%, -50%)',
              border: 'none',
              pointerEvents: 'none',
            });
          },
          onStateChange: (e: any) => {
            // 0 = ended → auto-advance to next slide
            if (e.data === 0) {
              const scrollY = window.scrollY;
              next();
              requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'instant' }));
            }
          },
        },
      });
    };

    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      setVideoReady(false);
    };
  }, [isVideoSlide, next]);

  // Auto-advance timer — paused while video is playing
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isVideoSlide) {
      timerRef.current = setInterval(next, 7000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVideoSlide, next]);

  const slide = slides[current];

  const variants = {
    enter: (dir: 'left' | 'right') => ({ x: dir === 'right' ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'left' | 'right') => ({ x: dir === 'right' ? -40 : 40, opacity: 0 }),
  };

  return (
    <section
      className="relative h-screen flex items-center overflow-hidden"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
      }}
    >

      {/* Background — image for property slides */}
      {slide.type === 'property' && (
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>
      )}

      {/* Background — YouTube IFrame API player for video slide */}
      {slide.type === 'video' && (
        <motion.div
          key="video-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-black"
        >
          <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
            <div ref={playerContainerRef} />
          </div>
          {/* Dark scrim over video — directional for text legibility */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 55%, transparent 85%)' }}
          />

          {/* Thumbnail — shown instantly, fades out once player is ready */}
          <img
            src="https://img.youtube.com/vi/a1OX0A19DM4/maxresdefault.jpg"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: videoReady ? 0 : 1,
              transition: 'opacity 0.8s ease',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      )}

      {/* Scrim — only for property slides */}
      {slide.type === 'property' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 55%, transparent 85%)' }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-32 w-full">

        {/* Property slide content */}
        {slide.type === 'property' && (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.65, ease: 'easeInOut' }}
              className="w-full"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
            >
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mb-8"
              >
                <span
                  className="px-3 py-1.5 text-xs tracking-[0.22em] uppercase"
                  style={{ border: '1px solid rgba(201,169,110,0.55)', color: '#C9A96E' }}
                >
                  {slide.badge}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-light text-white mb-5 leading-[1.04]"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs sm:text-sm font-light tracking-[0.18em] uppercase mb-10"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.24, duration: 0.55 }}
                style={{ width: '56px', height: '1px', background: '#C9A96E', transformOrigin: 'left', marginBottom: '1.5rem' }}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="flex flex-wrap items-center justify-between gap-6"
              >
                {/* Left side — details */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 shrink-0" style={{ color: '#C9A96E' }} />
                    <span className="text-xs tracking-[0.08em] text-gray-300">{slide.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-[0.18em] uppercase" style={{ color: '#C9A96E' }}>Plan</span>
                    <span className="text-xs tracking-[0.08em] text-gray-300">{slide.paymentPlan}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-[0.18em] uppercase" style={{ color: '#C9A96E' }}>Ready</span>
                    <span className="text-xs tracking-[0.08em] text-gray-300">{slide.completion}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-600 hidden sm:block" />
                  <div>
                    <span className="text-[10px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {slide.priceLabel}{' '}
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-light" style={{ color: '#C9A96E' }}>
                      {slide.price}
                    </span>
                  </div>
                </div>

                {/* Right side — CTA */}
                <div className="flex items-center gap-5">
                  <Link href={slide.href} className="btn-gold">
                    {slide.cta}
                  </Link>
                  <Link
                    href="/property"
                    className="text-[10px] tracking-[0.18em] uppercase transition-colors pb-0.5"
                    style={{ color: 'rgba(255,255,255,0.42)', borderBottom: '1px solid rgba(255,255,255,0.22)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.42)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.22)';
                    }}
                  >
                    All Properties
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Video slide content — branding overlay */}
        {slide.type === 'video' && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: videoReady ? 1 : 0, y: videoReady ? 0 : 18 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-3xl"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            <div className="mb-8">
              <span
                className="px-3 py-1.5 text-xs tracking-[0.22em] uppercase"
                style={{ border: '1px solid rgba(201,169,110,0.55)', color: '#C9A96E' }}
              >
                Premium Real Estate
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-light text-white mb-5 leading-[1.04]">
              Dubai&apos;s Finest<br />Properties
            </h1>

            <p
              className="text-xs sm:text-sm font-light tracking-[0.18em] uppercase mb-10"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Luxury Living — Waterfront · Villas · Penthouses
            </p>

            <div
              style={{ width: '56px', height: '1px', background: '#C9A96E', marginBottom: '2.5rem' }}
            />

            <div className="flex flex-wrap items-center gap-5">
              <Link href="/property" className="btn-gold">
                Explore Properties
              </Link>
              <Link
                href="/contact"
                className="text-[10px] tracking-[0.18em] uppercase transition-colors pb-0.5"
                style={{ color: 'rgba(255,255,255,0.42)', borderBottom: '1px solid rgba(255,255,255,0.22)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.42)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.22)';
                }}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}

        {/* Slide indicators — hidden on video slide */}
        {!isVideoSlide && (
          <div className="absolute bottom-14 left-6 sm:left-10 lg:left-16 flex gap-2 items-center">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setDirection(i > current ? 'right' : 'left'); setCurrent(i); }}
                className="transition-all duration-400"
                style={{
                  width: i === current ? '36px' : '14px',
                  height: '1px',
                  background: i === current ? '#C9A96E' : 'rgba(255,255,255,0.28)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Arrow buttons — side arrows hidden on mobile to prevent text overlap */}
      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 hidden sm:flex items-center justify-center text-white text-lg transition-all hover:opacity-90 opacity-50"
        style={{ border: '1px solid rgba(255,255,255,0.25)' }}
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 hidden sm:flex items-center justify-center text-white text-lg transition-all hover:opacity-90 opacity-50"
        style={{ border: '1px solid rgba(255,255,255,0.25)' }}
        aria-label="Next slide"
      >
        →
      </button>

      {/* Mobile-only bottom arrows — shown below slide indicators */}
      <div className="absolute bottom-12 right-6 flex gap-2 sm:hidden z-20">
        <button
          onClick={prev}
          className="w-8 h-8 flex items-center justify-center text-white text-sm transition-all opacity-60 hover:opacity-90"
          style={{ border: '1px solid rgba(255,255,255,0.25)' }}
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={next}
          className="w-8 h-8 flex items-center justify-center text-white text-sm transition-all opacity-60 hover:opacity-90"
          style={{ border: '1px solid rgba(255,255,255,0.25)' }}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    </section>
  );
}
