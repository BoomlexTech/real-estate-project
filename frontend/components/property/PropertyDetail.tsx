'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize2, Calendar, CreditCard, Phone, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/lib/types';
import { useForm } from 'react-hook-form';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface Props {
  property: Property;
}

export default function PropertyDetail({ property }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const images = property.images ?? [];
  const { register, handleSubmit } = useForm<ContactForm>({
    defaultValues: { message: `I'm interested in ${property.title}. Please contact me.` },
  });

  const onSubmit = (_data: ContactForm) => setSubmitted(true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Carousel */}
          <div className="space-y-3">
            {/* Main image */}
            <div
              className="w-full aspect-video rounded-2xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #0f1829 0%, #1a2a4a 100%)' }}
            >
              {images.length > 0 ? (
                <img
                  src={images[activeImage]}
                  alt={`${property.title} — photo ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full opacity-50">
                  <rect x="100" y="80" width="120" height="370" fill="rgba(255,255,255,0.06)" />
                  <rect x="230" y="40" width="180" height="410" fill="rgba(255,255,255,0.08)" />
                  <rect x="420" y="100" width="140" height="350" fill="rgba(255,255,255,0.05)" />
                  <rect x="570" y="60" width="160" height="390" fill="rgba(255,255,255,0.07)" />
                  {Array.from({ length: 6 }).map((_, r) =>
                    Array.from({ length: 4 }).map((_, c) => (
                      <rect key={`${r}-${c}`} x={235 + c * 38} y={50 + r * 60} width="22" height="38" fill="rgba(201,168,76,0.3)" rx="2" />
                    ))
                  )}
                </svg>
              )}

              {/* Prev / Next */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
                    style={{ background: 'rgba(0,0,0,0.65)' }}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setActiveImage(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
                    style={{ background: 'rgba(0,0,0,0.65)' }}
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>

                  {/* Counter */}
                  <div
                    className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
                  >
                    {activeImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all"
                    style={{
                      border: i === activeImage ? '2px solid #c9a84c' : '2px solid transparent',
                      opacity: i === activeImage ? 1 : 0.55,
                    }}
                  >
                    <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{property.title}</h1>
              <p className="text-2xl font-bold" style={{ color: '#c9a84c' }}>{property.priceLabel}</p>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" style={{ color: '#c9a84c' }} />
              {property.location}, {property.emirate}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Bed />, label: 'Bedrooms', value: `${property.bedrooms} BR` },
              { icon: <Bath />, label: 'Bathrooms', value: `${property.bathrooms} BA` },
              { icon: <Maximize2 />, label: 'Area', value: `${property.area.toLocaleString()} sqft` },
              { icon: <Calendar />, label: 'Completion', value: property.completionDate || 'Ready' },
            ].map((stat) => (
              <div key={stat.label} className="card-dark p-4 text-center">
                <div className="flex justify-center mb-1" style={{ color: '#c9a84c' }}>
                  {stat.icon}
                </div>
                <p className="text-white font-semibold text-sm">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Payment Plan */}
          {property.paymentPlan && (
            <div className="card-dark p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" style={{ color: '#c9a84c' }} />
                Payment Plan
              </h3>
              <div className="flex gap-4">
                <div className="flex-1 rounded-lg p-4 text-center" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
                  <p className="text-2xl font-bold" style={{ color: '#c9a84c' }}>
                    {typeof property.paymentPlan === 'object' ? property.paymentPlan.downPayment : property.paymentPlan}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">During Construction</p>
                </div>
                <div className="flex-1 rounded-lg p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.45)' }}>
                  <p className="text-2xl font-bold text-white">
                    {typeof property.paymentPlan === 'object' ? property.paymentPlan.onCompletion : 100 - parseInt(property.paymentPlan as string)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">On Completion</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="card-dark p-6">
            <h3 className="text-white font-semibold mb-4">Description</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="card-dark p-6">
              <h3 className="text-white font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#c9a84c' }} />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map placeholder */}
          <div className="card-dark p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: '#c9a84c' }} />
              Location
            </h3>
            <div
              className="w-full h-48 rounded-xl flex items-center justify-center"
              style={{ background: '#1a1f2e', border: '1px dashed rgba(201,168,76,0.45)' }}
            >
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: '#c9a84c' }} />
                <p className="text-gray-400 text-sm">{property.location}, {property.emirate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Agent Card */}
          {property.agent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-dark p-6 sticky top-28"
            >
              <h3 className="text-white font-semibold text-sm mb-4">Listed By</h3>
              <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: '1px solid #3a4058' }}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: 'rgba(201,168,76,0.2)', color: '#c9a84c' }}
                >
                  {property.agent.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{property.agent.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{property.agent.properties} properties</p>
                  <p className="text-gray-500 text-xs">{property.agent.languages.join(' · ')}</p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-2.5">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-colors"
                  style={{ background: '#c9a84c', color: '#1a1f2e' }}
                >
                  <Phone className="w-4 h-4" />
                  Call Agent
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-colors"
                  style={{ background: '#2d3347', color: 'white', border: '1px solid rgba(201,168,76,0.45)' }}
                >
                  Email Agent
                </a>
              </div>

              {/* Inquiry Form */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid #3a4058' }}>
                <h4 className="text-white text-sm font-semibold mb-3">Send Inquiry</h4>
                {submitted ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#c9a84c' }} />
                    <p className="text-sm text-gray-300">We&apos;ll be in touch soon!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <input {...register('name', { required: true })} placeholder="Your Name" className="input-dark text-sm" />
                    <input {...register('phone')} placeholder="Phone Number" className="input-dark text-sm" />
                    <input {...register('email', { required: true })} placeholder="Email" type="email" className="input-dark text-sm" />
                    <textarea {...register('message')} rows={3} className="input-dark text-sm resize-none" />
                    <button type="submit" className="btn-gold w-full justify-center text-sm py-2.5">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
