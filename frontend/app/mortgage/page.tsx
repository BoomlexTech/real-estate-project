'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Calculator } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface MortgageCalcState {
  propertyPrice: number;
  downPaymentPct: number;
  interestRate: number;
  loanTermYears: number;
}

interface InquiryForm {
  name: string;
  email: string;
  phone: string;
  loanAmount: number;
  employmentType: string;
}

function MortgageCalculator() {
  const [calc, setCalc] = useState<MortgageCalcState>({
    propertyPrice: 2000000,
    downPaymentPct: 25,
    interestRate: 4.5,
    loanTermYears: 25,
  });

  const loanAmount = calc.propertyPrice * (1 - calc.downPaymentPct / 100);
  const monthlyRate = calc.interestRate / 100 / 12;
  const numPayments = calc.loanTermYears * 12;
  const monthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments;
  const totalPayment = monthlyPayment * numPayments;

  const fmt = (n: number) => 'AED ' + Math.round(n).toLocaleString();

  return (
    <div className="card-dark p-5 sm:p-8">
      <h2 className="t-heading font-bold text-xl mb-6 flex items-center gap-2">
        <Calculator className="w-5 h-5 t-accent" />
        Mortgage Calculator
      </h2>

      <div className="space-y-6">
        {/* Property Price */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs t-secondary font-medium uppercase tracking-wider">Property Price</label>
            <span className="text-sm font-semibold t-accent">{fmt(calc.propertyPrice)}</span>
          </div>
          <input
            type="range" min={300000} max={20000000} step={100000}
            value={calc.propertyPrice}
            onChange={(e) => setCalc((c) => ({ ...c, propertyPrice: +e.target.value }))}
            onPointerUp={(e) => trackEvent('mortgage_calculator_interaction', { property_price: +(e.target as HTMLInputElement).value, down_payment_pct: calc.downPaymentPct, interest_rate: calc.interestRate, loan_term: calc.loanTermYears })}
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs t-dim mt-1">
            <span>AED 300K</span><span>AED 20M</span>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs t-secondary font-medium uppercase tracking-wider">Down Payment</label>
            <span className="text-sm font-semibold t-accent">{calc.downPaymentPct}% ({fmt(calc.propertyPrice * calc.downPaymentPct / 100)})</span>
          </div>
          <input
            type="range" min={20} max={80} step={5}
            value={calc.downPaymentPct}
            onChange={(e) => setCalc((c) => ({ ...c, downPaymentPct: +e.target.value }))}
            onPointerUp={(e) => trackEvent('mortgage_calculator_interaction', { property_price: calc.propertyPrice, down_payment_pct: +(e.target as HTMLInputElement).value, interest_rate: calc.interestRate, loan_term: calc.loanTermYears })}
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs t-dim mt-1">
            <span>20%</span><span>80%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs t-secondary font-medium uppercase tracking-wider">Interest Rate</label>
            <span className="text-sm font-semibold t-accent">{calc.interestRate}% per annum</span>
          </div>
          <input
            type="range" min={2.5} max={8} step={0.25}
            value={calc.interestRate}
            onChange={(e) => setCalc((c) => ({ ...c, interestRate: +e.target.value }))}
            onPointerUp={(e) => trackEvent('mortgage_calculator_interaction', { property_price: calc.propertyPrice, down_payment_pct: calc.downPaymentPct, interest_rate: +(e.target as HTMLInputElement).value, loan_term: calc.loanTermYears })}
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs t-dim mt-1">
            <span>2.5%</span><span>8%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs t-secondary font-medium uppercase tracking-wider">Loan Term</label>
            <span className="text-sm font-semibold t-accent">{calc.loanTermYears} years</span>
          </div>
          <input
            type="range" min={5} max={25} step={1}
            value={calc.loanTermYears}
            onChange={(e) => setCalc((c) => ({ ...c, loanTermYears: +e.target.value }))}
            onPointerUp={(e) => trackEvent('mortgage_calculator_interaction', { property_price: calc.propertyPrice, down_payment_pct: calc.downPaymentPct, interest_rate: calc.interestRate, loan_term: +(e.target as HTMLInputElement).value })}
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs t-dim mt-1">
            <span>5 yrs</span><span>25 yrs</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 rounded-xl p-5 space-y-4" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center">
          <span className="t-secondary text-sm">Loan Amount</span>
          <span className="t-heading font-semibold">{fmt(loanAmount)}</span>
        </div>
        <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <span className="t-secondary text-sm">Total Repayment</span>
          <span className="t-heading font-semibold">{fmt(totalPayment)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="t-link font-semibold">Monthly Payment</span>
          <span className="text-2xl font-bold t-accent">{fmt(monthlyPayment)}</span>
        </div>
      </div>
    </div>
  );
}

export default function MortgagePage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit } = useForm<InquiryForm>();
  const onSubmit = (data: InquiryForm) => {
    trackEvent('generate_lead', { lead_type: 'mortgage_preapproval', employment_type: data.employmentType, loan_amount: data.loanAmount });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div className="px-4 py-16 text-center" style={{ background: 'var(--bg-secondary)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3 t-accent">FINANCING</p>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light t-heading mb-4 leading-tight">Get a Mortgage in Dubai &amp; The UAE</h1>
        <p className="t-secondary max-w-2xl mx-auto text-sm leading-relaxed">
          Our dedicated mortgage advisors work with 20+ leading UAE banks to secure the most competitive rates. Free consultation, zero broker fees.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Calculator */}
          <MortgageCalculator />

          {/* Inquiry Form */}
          <div className="card-dark p-5 sm:p-8">
            <h2 className="t-heading font-bold text-xl mb-2">Get Pre-Approved Online</h2>
            <p className="t-secondary text-sm mb-6">Find out how much you can borrow in minutes. No credit check required.</p>

            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-14 h-14 mx-auto mb-4 t-accent" />
                <h3 className="t-heading text-lg font-bold mb-2">Application Received!</h3>
                <p className="t-secondary text-sm">A mortgage advisor will contact you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input {...register('name', { required: true })} placeholder="Full Name" className="input-dark text-sm" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input {...register('email', { required: true })} placeholder="Email" type="email" className="input-dark text-sm" />
                  <input {...register('phone', { required: true })} placeholder="Phone (+971...)" className="input-dark text-sm" />
                </div>
                <input {...register('loanAmount', { required: true })} placeholder="Required Loan Amount (AED)" type="number" className="input-dark text-sm" />
                <select {...register('employmentType')} className="select-dark text-sm">
                  <option value="">Employment Type</option>
                  <option>Employed (UAE)</option>
                  <option>Self-Employed</option>
                  <option>Employed (Overseas)</option>
                  <option>Retired / High Net Worth</option>
                </select>

                <div className="rounded-lg p-4 text-xs t-secondary space-y-1" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                  <p className="t-heading font-medium mb-2">What we offer:</p>
                  {['Rates from 3.49% per annum', 'Up to 25-year loan terms', 'Up to 80% LTV for UAE residents', 'Zero application fees'].map((item) => (
                    <p key={item} className="flex items-center gap-2"><span className="t-accent">✓</span> {item}</p>
                  ))}
                </div>

                <button type="submit" className="btn-gold w-full justify-center py-3">
                  Get Online Pre-Approval →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bank Partners */}
        <div className="mt-14 text-center">
          <h2 className="t-heading font-bold text-xl mb-6">Our Banking Partners</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Emirates NBD', 'ADCB', 'Dubai Islamic Bank', 'Mashreq', 'RAK Bank', 'FAB', 'HSBC UAE', 'Standard Chartered'].map((bank) => (
              <div
                key={bank}
                className="px-5 py-3 rounded-lg text-sm t-link"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
              >
                {bank}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
