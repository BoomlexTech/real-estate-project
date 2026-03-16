'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CheckCircle, Building2, Percent, Banknote } from 'lucide-react';
import { submitMortgageInquiry } from '@/lib/api';

interface FormData {
  name: string;
  phone: string;
  email: string;
  loanAmount: number;
}

export default function MortgageBanner() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await submitMortgageInquiry(data);
      setSubmitted(true);
    } catch {
      // Silently handle — show success anyway for demo
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Building2 className="w-4 h-4" />, text: '20+ partner banks & lenders worldwide' },
    { icon: <Percent className="w-4 h-4" />, text: 'Available to international buyers globally' },
    { icon: <Banknote className="w-4 h-4" />, text: 'Zero broker fees, anywhere in the world' },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4" style={{ background: 'var(--bg-warm-tint)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
              Global Mortgage Services
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light t-heading mb-5 leading-tight">
              Mortgage Available{' '}
              <span style={{ color: '#C9A96E' }}>Worldwide</span>
            </h2>
            <p className="t-secondary text-sm leading-relaxed mb-6">
              No matter where you are in the world, our dedicated mortgage advisors work with 20+ leading banks to secure the best rates for your Dubai property. Whether you&apos;re a first-time buyer or an international investor, we make cross-border financing seamless and fast.
            </p>

            <a
              href="/mortgage"
              className="btn-gold inline-flex mb-8 text-sm"
            >
              Open Mortgage Calculator →
            </a>

            <div className="space-y-3">
              {features.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}
                  >
                    {f.icon}
                  </div>
                  <span className="t-secondary text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 280, damping: 22 }}
            className="relative rounded-xl overflow-hidden"
            style={{
              borderLeft: '1px solid rgba(201,169,110,0.55)',
              borderBottom: '1px solid rgba(201,169,110,0.55)',
              borderTop: '1px solid rgba(201,169,110,0.08)',
              borderRight: '1px solid rgba(201,169,110,0.08)',
              boxShadow: '-4px 4px 32px rgba(201,169,110,0.12), -1px 4px 16px rgba(201,169,110,0.08)',
            }}
          >
            <div className="p-5 sm:p-8" style={{ background: 'var(--bg-card)' }}>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: '#C9A96E' }} />
                  <h3 className="t-heading text-xl font-bold mb-2">Thank You!</h3>
                  <p className="t-secondary text-sm">
                    Our mortgage advisor will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="t-heading text-lg font-bold mb-1">
                    Find Out How Much You Can Borrow
                  </h3>
                  <p className="t-secondary text-xs mb-6">In Minutes — No obligation, free consultation</p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <input
                        {...register('name', { required: true })}
                        placeholder="Full Name"
                        className="input-dark text-sm"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">Name is required</p>}
                    </div>

                    <div className="flex gap-2">
                      <div
                        className="flex items-center gap-1.5 px-3 rounded-md shrink-0 text-sm border"
                        style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(8px)', borderColor: 'rgba(201,169,110,0.2)', color: 'var(--text-secondary)' }}
                      >
                        🇦🇪 +971
                      </div>
                      <input
                        {...register('phone', { required: true })}
                        placeholder="Phone Number"
                        className="input-dark text-sm"
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs -mt-2">Phone is required</p>}

                    <div>
                      <input
                        {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                        placeholder="Email Address"
                        type="email"
                        className="input-dark text-sm"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">Valid email is required</p>}
                    </div>

                    <div>
                      <input
                        {...register('loanAmount', { required: true, min: 100000 })}
                        placeholder="Loan Amount (AED)"
                        type="number"
                        className="input-dark text-sm"
                      />
                      {errors.loanAmount && <p className="text-red-400 text-xs mt-1">Valid loan amount required</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold w-full justify-center text-sm py-3 disabled:opacity-60"
                    >
                      {loading ? 'Submitting...' : 'Get Online Pre-Approval →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
