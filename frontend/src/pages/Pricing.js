import React, { useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    per: 'forever',
    desc: 'Everything you need to get started and build a planning habit.',
    cta: 'Get started',
    highlight: false,
    features: [
      'Up to 20 active tasks',
      'Calendar & list views',
      'Basic task categories (work, personal, coding)',
      'Task creation, editing & deletion',
      '1 week task history',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$8',
    per: '/ month',
    annual: '$6 / month billed annually',
    desc: 'For people who want the AI edge and no limits.',
    cta: 'Start 14-day trial',
    highlight: true,
    features: [
      'Unlimited tasks',
      'AI-powered duration prediction',
      'AI-powered priority suggestion',
      'All categories including custom',
      'Drag-and-drop task reordering',
      'Full task history & archive',
      '30-minute smart alerts',
      'Priority email support',
    ],
  },
  {
    name: 'Team',
    price: '$18',
    per: '/ user / month',
    annual: '$14 / user / month billed annually',
    desc: 'For squads that need one shared source of truth.',
    cta: 'Coming soon',
    disabled: true,
    highlight: false,
    features: [
      'Everything in Pro',
      'Shared team workspace',
      'Task assignment to team members',
      'Admin dashboard & analytics',
      'Team calendar overlay',
      'Slack & Notion integration (roadmap)',
      'Dedicated account support',
      'SSO (roadmap)',
    ],
  },
];

const faq = [
  {
    q: 'Is the Free plan really free forever?',
    a: 'Yes. No trial period, no credit card, no surprise charge. The Free plan is yours to keep.',
  },
  {
    q: 'How does the AI prediction work?',
    a: 'Toki uses a trained multi-layer perceptron (MLP) that was built on task data across categories, times of day, and user context. When you tap "Plan", it predicts both how long the task will take and what priority level suits it best.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. There are no long-term commitments on monthly plans. Annual plans are non-refundable but can be cancelled at renewal.',
  },
  {
    q: "When is Team launching?",
    a: 'Team features are actively being built. Sign up for Pro and you\'ll be first to know when it drops.',
  },
];

const Pricing = () => {
  useEffect(() => { document.title = 'Pricing | Toki'; }, []);
  const { toggleSignup } = useAuth();

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="badge badge-green mb-5 text-xs tracking-wide uppercase">Pricing</span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          Start free. Upgrade when you need more power. No dark patterns.
        </p>
      </section>

      {/* Tiers */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map(({ name, price, per, annual, desc, cta, highlight, disabled, features }) => (
            <div
              key={name}
              className={`rounded-2xl p-8 border flex flex-col gap-6 ${
                highlight
                  ? 'border-toki-green bg-toki-teal text-white shadow-modal'
                  : 'border-gray-100 bg-white shadow-card'
              }`}
            >
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${highlight ? 'text-toki-green' : 'text-gray-400'}`}>
                  {name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  <span className={`text-sm ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{per}</span>
                </div>
                {annual && (
                  <p className={`text-xs mb-3 ${highlight ? 'text-white/50' : 'text-gray-400'}`}>{annual}</p>
                )}
                <p className={`text-sm leading-relaxed ${highlight ? 'text-white/70' : 'text-gray-500'}`}>{desc}</p>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={14} className="mt-0.5 flex-shrink-0 text-toki-green" />
                    <span className={`text-sm ${highlight ? 'text-white/80' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              {disabled ? (
                <span className="w-full py-2.5 rounded-lg text-sm font-medium text-center text-gray-400 border border-dashed border-gray-200 cursor-default">
                  {cta}
                </span>
              ) : (
                <button
                  onClick={toggleSignup}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    highlight
                      ? 'bg-toki-green text-white hover:bg-toki-green-dark'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cta} <ArrowRight size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          All paid plans include a 14-day free trial. No credit card required to start.
        </p>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Frequently asked questions</h2>
          <div className="flex flex-col gap-8">
            {faq.map(({ q, a }) => (
              <div key={q}>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
