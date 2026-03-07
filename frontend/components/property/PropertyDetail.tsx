'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize2, Calendar, CreditCard, Phone, CheckCircle, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Property } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { getSiteSettings } from '@/lib/adminApi';
import { submitPropertyInquiry } from '@/lib/api';
import AgentReviewForm from '@/components/agent/AgentReviewForm';
import { trackEvent } from '@/lib/analytics';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface Props {
  property: Property;
}

const DEFAULT_PHONE = '+971547093295';
const DEFAULT_WHATSAPP = 'https://api.whatsapp.com/send/?phone=971547093295&text=I%27m+interrested+about+this+property&type=phone_number&app_absent=0';

export default function PropertyDetail({ property }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [companyBrochureUrl, setCompanyBrochureUrl] = useState('');

  useEffect(() => {
    getSiteSettings().then((s) => setCompanyBrochureUrl(s.companyBrochureUrl)).catch(() => {});
  }, []);

  useEffect(() => {
    trackEvent('view_item', { item_id: property.id, item_name: property.title, price: property.price, item_category: property.type, item_variant: property.status, item_list_name: property.emirate });
  }, [property.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const images = property.images ?? [];
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ContactForm>({
    defaultValues: { message: `I'm interested in ${property.title}. Please contact me.` },
  });

  const onSubmit = async (data: ContactForm) => {
    setServerError('');
    try {
      await submitPropertyInquiry(property.id, data);
      setSubmitted(true);
      trackEvent('generate_lead', { lead_type: 'property_inquiry', property_id: property.id, property_title: property.title });
    } catch {
      setServerError('Failed to send inquiry. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-28 lg:pb-16">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Image Carousel */}
          <div className="space-y-3">
            {/* Main image */}
            <div
              className="w-full aspect-video rounded-2xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-card) 100%)' }}
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
                    onClick={() => { const next = (activeImage - 1 + images.length) % images.length; setActiveImage(next); trackEvent('property_image_view', { property_id: property.id, image_index: next, total_images: images.length, navigation_type: 'prev' }); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
                    style={{ background: 'rgba(0,0,0,0.65)' }}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => { const next = (activeImage + 1) % images.length; setActiveImage(next); trackEvent('property_image_view', { property_id: property.id, image_index: next, total_images: images.length, navigation_type: 'next' }); }}
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
              <div className="flex gap-2 overflow-x-auto pb-1 w-full">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImage(i); trackEvent('property_image_view', { property_id: property.id, image_index: i, total_images: images.length, navigation_type: 'thumbnail' }); }}
                    className="shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all"
                    style={{
                      border: i === activeImage ? '2px solid var(--gold)' : '2px solid transparent',
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
              <h1 className="text-2xl sm:text-3xl font-bold t-heading">{property.title}</h1>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--gold)' }}>{property.priceLabel}</p>
            </div>
            <div className="flex items-center gap-1.5 t-secondary text-sm">
              <MapPin className="w-4 h-4" style={{ color: 'var(--gold)' }} />
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
                <div className="flex justify-center mb-1" style={{ color: 'var(--gold)' }}>
                  {stat.icon}
                </div>
                <p className="t-heading font-semibold text-sm">{stat.value}</p>
                <p className="t-dim text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Payment Plan */}
          {property.paymentPlan && (
            <div className="card-dark p-6">
              <h3 className="t-heading font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                Payment Plan
              </h3>
              <div className="flex gap-4">
                <div className="flex-1 rounded-lg p-4 text-center" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>
                    {typeof property.paymentPlan === 'object' ? property.paymentPlan.downPayment : property.paymentPlan}%
                  </p>
                  <p className="text-xs t-secondary mt-1">During Construction</p>
                </div>
                <div className="flex-1 rounded-lg p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.45)' }}>
                  <p className="text-2xl font-bold t-heading">
                    {typeof property.paymentPlan === 'object' ? property.paymentPlan.onCompletion : 100 - parseInt(property.paymentPlan as string)}%
                  </p>
                  <p className="text-xs t-secondary mt-1">On Completion</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="card-dark p-6">
            <h3 className="t-heading font-semibold mb-4">Description</h3>
            <p className="t-secondary text-sm leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="card-dark p-6">
              <h3 className="t-heading font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm t-link">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--gold)' }} />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map placeholder */}
          <div className="card-dark p-6">
            <h3 className="t-heading font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: 'var(--gold)' }} />
              Location
            </h3>
            <div
              className="w-full h-48 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border-gold)' }}
            >
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                <p className="t-secondary text-sm">{property.location}, {property.emirate}</p>
              </div>
            </div>
          </div>
        </div>

      {/* Mobile sticky contact bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex gap-3 p-4"
        style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}
      >
        <a
          href={`tel:${property.agent?.phone || DEFAULT_PHONE}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm"
          style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}
          onClick={() => trackEvent('call_click', { source: 'property_detail_mobile', property_id: property.id })}
        >
          <Phone className="w-4 h-4" /> Call
        </a>
        <a
          href={property.agent?.whatsapp || DEFAULT_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm"
          style={{ background: 'var(--skeleton-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-gold)' }}
          onClick={() => trackEvent('whatsapp_click', { source: 'property_detail_mobile', property_id: property.id })}
        >
          WhatsApp
        </a>
      </div>

        {/* Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          {/* Agent Card */}
          {property.agent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-dark p-6"
            >
              <h3 className="t-heading font-semibold text-sm mb-4">Listed By</h3>
              <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div
                  className="w-12 h-12 rounded-full overflow-hidden shrink-0 border"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'rgba(201,168,76,0.3)' }}
                >
                  {property.agent.photo ? (
                    <img src={property.agent.photo} alt={property.agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold" style={{ color: 'var(--gold)' }}>
                      {property.agent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="t-heading font-semibold text-sm">{property.agent.name}</p>
                  <p className="t-secondary text-xs mt-0.5">{property.agent.properties} properties</p>
                  <p className="t-dim text-xs">{property.agent.languages.join(' · ')}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${property.agent?.phone || DEFAULT_PHONE}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}
                    onClick={() => trackEvent('call_click', { source: 'property_detail', property_id: property.id })}
                    aria-label="Call agent"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={property.agent?.whatsapp || DEFAULT_WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ background: 'var(--skeleton-bg)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
                    onClick={() => trackEvent('whatsapp_click', { source: 'property_detail', property_id: property.id, agent_name: property.agent?.name })}
                    aria-label="WhatsApp agent"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Brochure (if available) */}
              {(property.brochureUrl || companyBrochureUrl) && (
                <div className="mb-5">
                  <a
                    href={property.brochureUrl || companyBrochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-colors"
                    style={{ background: 'var(--skeleton-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-gold)' }}
                    onClick={() => trackEvent('brochure_download', { property_id: property.id, property_title: property.title })}
                  >
                    <Download className="w-4 h-4" />
                    Download Brochure
                  </a>
                </div>
              )}

              {/* Inquiry Form */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
                <h4 className="t-heading text-sm font-semibold mb-3">Send Inquiry</h4>
                {submitted ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                    <p className="text-sm t-link">We&apos;ll be in touch soon!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <input {...register('name', { required: true })} placeholder="Your Name" className="input-dark text-sm" />
                    <input {...register('phone')} placeholder="Phone Number" className="input-dark text-sm" />
                    <input {...register('email', { required: true })} placeholder="Email" type="email" className="input-dark text-sm" />
                    <textarea {...register('message')} rows={3} className="input-dark text-sm resize-none" />
                    {serverError && <p className="text-red-400 text-xs">{serverError}</p>}
                    <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center text-sm py-2.5 disabled:opacity-60">
                      {isSubmitting ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Agent Review — rendered after sidebar so mobile order is: content → listed by → review */}
        {property.agent?.id && (
          <div className="lg:col-span-2">
            <AgentReviewForm agentId={property.agent.id} agentName={property.agent.name} />
          </div>
        )}
      </div>
    </div>
  );
}
