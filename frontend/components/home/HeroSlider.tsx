'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    badge: 'OFF-PLAN',
    title: 'Creek Waters Residence',
    subtitle: 'Waterfront Apartment At Dubai Creek Harbour',
    location: 'Dubai Creek Harbour',
    price: 'AED 1,800,000',
    priceLabel: 'Starting Price',
    paymentPlan: '20/40/40',
    completion: '2026',
    cta: 'View Property',
    href: '/property/creek-waters-residence',
    image: 'https://images.pexels.com/photos/30707660/pexels-photo-30707660.jpeg?w=1920&q=85&fit=crop',
  },
  {
    id: 2,
    badge: 'READY TO MOVE',
    title: 'Marina Heights Tower',
    subtitle: 'Premium Apartment At Dubai Marina',
    location: 'Dubai Marina',
    price: 'AED 3,500,000',
    priceLabel: 'Starting Price',
    paymentPlan: 'Flexible',
    completion: 'Ready',
    cta: 'View Property',
    href: '/property/marina-heights-tower',
    image: 'https://images.pexels.com/photos/31033420/pexels-photo-31033420.jpeg?w=1920&q=85&fit=crop',
  },
  {
    id: 3,
    badge: 'FOR SALE',
    title: 'Palm Jumeirah Signature Villa',
    subtitle: 'Exclusive Beachfront Villa With Private Beach',
    location: 'Palm Jumeirah',
    price: 'AED 25,000,000',
    priceLabel: 'Starting Price',
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

  const next = useCallback(() => {
    setDirection('right');
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = () => {
    setDirection('left');
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const variants = {
    enter: (dir: 'left' | 'right') => ({ x: dir === 'right' ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'left' | 'right') => ({ x: dir === 'right' ? -60 : 60, opacity: 0 }),
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background images — crossfade on slide change */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Dark overlay so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(10,14,26,0.85) 0%, rgba(10,14,26,0.6) 55%, rgba(10,14,26,0.25) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span
                className="px-3 py-1 text-xs font-bold rounded-full tracking-widest"
                style={{ background: '#c9a84c', color: '#1a1f2e' }}
              >
                {slide.badge}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl font-light mb-6"
              style={{ color: '#c9a84c' }}
            >
              {slide.subtitle}
            </motion.p>

            {/* Info Pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: '#c9a84c' }} />
                {slide.location}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <CreditCard className="w-3.5 h-3.5" style={{ color: '#c9a84c' }} />
                {slide.paymentPlan} Payment Plan
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Calendar className="w-3.5 h-3.5" style={{ color: '#c9a84c' }} />
                {slide.completion} Completion
              </div>
            </motion.div>

            {/* Price + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-6"
            >
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{slide.priceLabel}</p>
                <p className="text-3xl font-bold" style={{ color: '#c9a84c' }}>{slide.price}</p>
              </div>
              <Link href={slide.href} className="btn-gold text-sm">
                {slide.cta} →
              </Link>
              <Link href="/property" className="text-sm text-gray-300 hover:text-white transition-colors border-b border-gray-600 hover:border-white pb-0.5">
                Browse All Properties
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 'right' : 'left'); setCurrent(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                background: i === current ? '#c9a84c' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </section>
  );
}
