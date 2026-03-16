'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { submitContactMessage } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const offices = [
  { name: 'Group Head Office', address: 'Office 2301, Vision Tower, Business Bay, PO Box 445372, Dubai, UAE', phone: '+971 43 231 503' },
  { name: 'Dubai Office', address: 'Office 1102, Tower B, Prime Business Centre, JVC, Dubai, UAE', phone: '+971 54 709 3295' },
  { name: 'Ajman Office', address: 'Ground Floor, Namaa Building, Rashideya, Behind Grand Mall, Ajman, UAE', phone: '+971 50 302 1541' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setServerError('');
    try {
      await submitContactMessage(data);
      setSubmitted(true);
      trackEvent('contact_form_submit', { subject: data.subject });
    } catch {
      setServerError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--bg-primary)' }}>
      <div className="px-4 py-14 text-center" style={{ background: 'var(--bg-secondary)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3 t-accent">GET IN TOUCH</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold t-heading mb-4">Contact Us</h1>
        <p className="t-secondary max-w-xl mx-auto text-sm">
          Our team of expert consultants is available 7 days a week to answer your questions and guide your property journey.
        </p>
        <div className="info-pills justify-center mt-6">
          <span className="info-pill">Response target within 2 business hours</span>
          <span className="info-pill">Phone, WhatsApp, and email support</span>
          <span className="info-pill">Advisory for buyers, investors, and agents</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Form */}
          <div className="card-dark p-5 sm:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 t-accent" />
                <h3 className="t-heading text-xl font-bold mb-2">Message Sent!</h3>
                <p className="t-secondary text-sm">We&apos;ll respond within 2 business hours.</p>
              </div>
            ) : (
              <>
                <h2 className="t-heading font-bold text-lg mb-6">Send Us a Message</h2>
                <p className="portal-subtle mb-6">
                  Choose the most relevant subject so the right advisor reaches out faster with useful next steps.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input {...register('name', { required: true })} placeholder="Full Name" className="input-dark text-sm" />
                      {errors.name && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                    <div>
                      <input {...register('email', { required: true })} placeholder="Email" type="email" className="input-dark text-sm" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                  </div>
                  <input {...register('phone')} placeholder="Phone Number" className="input-dark text-sm" />
                  <select {...register('subject')} className="select-dark text-sm">
                    <option value="">Select Subject</option>
                    <option>Buying a Property</option>
                    <option>Selling a Property</option>
                    <option>Renting a Property</option>
                    <option>Investment Advisory</option>
                    <option>Mortgage Query</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    {...register('message', { required: true })}
                    rows={5}
                    placeholder="Your message..."
                    className="input-dark text-sm resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs">Message is required</p>}
                  {serverError && <p className="text-red-400 text-xs">{serverError}</p>}
                  <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center disabled:opacity-60">
                    {isSubmitting ? 'Sending…' : 'Send Message →'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="card-dark p-6">
              <h3 className="t-heading font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a href="tel:+971547093295" className="flex items-center gap-3 text-sm t-link hover:opacity-80 transition-colors group">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(201,168,76,0.15)' }}>
                    <Phone className="w-4 h-4 t-accent" />
                  </div>
                  +971 54 709 3295
                </a>
                <a href="mailto:leasing@awtadrealestate.com" className="flex items-center gap-3 text-sm t-link hover:opacity-80 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(201,168,76,0.15)' }}>
                    <Mail className="w-4 h-4 t-accent" />
                  </div>
                  leasing@awtadrealestate.com
                </a>
              </div>
              <div className="surface-panel-soft mt-5 p-4">
                <p className="section-kicker mb-2">Best For</p>
                <p className="t-secondary text-sm">Buying guidance, off-plan launches, rental options, mortgage questions, and investor support.</p>
              </div>
            </div>

            {/* Offices */}
            <div className="card-dark p-6">
              <h3 className="t-heading font-semibold mb-4">Our Offices</h3>
              <div className="space-y-4">
                {offices.map((office) => (
                  <div key={office.name} className="flex gap-3">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 t-accent" />
                    <div>
                      <p className="t-heading text-sm font-medium">{office.name}</p>
                      <p className="t-secondary text-xs mt-0.5">{office.address}</p>
                      <a href={`tel:${office.phone}`} className="text-xs t-dim hover:opacity-80 transition-colors mt-0.5 block">{office.phone}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="card-dark p-6">
              <h3 className="t-heading font-semibold mb-4">Working Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="t-secondary">Mon – Fri</span><span className="t-heading">9:00 AM – 7:00 PM</span></div>
                <div className="flex justify-between"><span className="t-secondary">Saturday</span><span className="t-heading">10:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span className="t-secondary">Sunday</span><span className="t-heading">10:00 AM – 4:00 PM</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
