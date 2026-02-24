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
    { icon: <Building2 className="w-4 h-4" />, text: '20+ partner banks & lenders' },
    { icon: <Percent className="w-4 h-4" />, text: 'Finance your down payment' },
    { icon: <Banknote className="w-4 h-4" />, text: 'Zero broker fees' },
  ];

  return (
    <section className="py-20 px-4" style={{ background: '#1a1f2e' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>
              MORTGAGE SERVICES
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              Get Mortgage in Dubai &amp;{' '}
              <span style={{ color: '#c9a84c' }}>The UAE</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Our dedicated mortgage advisors work with 20+ leading banks to secure the best rates for you. Whether you&apos;re a first-time buyer or seasoned investor, we make the financing process seamless and fast.
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
                    style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}
                  >
                    {f.icon}
                  </div>
                  <span className="text-gray-300 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-dark p-8"
          >
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: '#c9a84c' }} />
                <h3 className="text-white text-xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-400 text-sm">
                  Our mortgage advisor will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-white text-lg font-bold mb-1">
                  Find Out How Much You Can Borrow
                </h3>
                <p className="text-gray-400 text-xs mb-6">In Minutes — No obligation, free consultation</p>

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
                      style={{ background: '#1a1f2e', borderColor: '#3a4058', color: '#9ca3af' }}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
