import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, BarChart2, Layers, ArrowRight, Check } from 'lucide-react';
import logoLanding from '../logo/logoFeaturesHeader.png';
import iconLeft from '../logo/icons/_left.svg';
import iconCenter from '../logo/icons/_center.svg';
import iconRight from '../logo/icons/_right.svg';
import { useAuth } from '../components/AuthContext';

const Home = () => {
  useEffect(() => { document.title = 'Toki'; }, []);
  const { toggleSignup } = useAuth();

  return (
    <div className="bg-white">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 flex flex-col-reverse md:flex-row items-center gap-16">
        <div className="flex-1 max-w-xl animate-slide-up">
          <span className="badge badge-green mb-5 text-xs tracking-wide uppercase">AI-powered planning</span>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Stop wasting time<br />
            <span className="text-toki-green">planning.</span><br />
            Start executing.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8">
            Toki learns your rhythm and predicts how long tasks take — and what to tackle first.
            Less decision fatigue. More done.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={toggleSignup} className="btn-primary text-base py-3 px-6">
              Get started free <ArrowRight size={16} />
            </button>
            <Link to="/about-us" className="btn-ghost text-base py-3 px-5 text-gray-600">
              See how it works
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">No credit card required.</p>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={logoLanding}
            alt="Toki planning illustration"
            className="w-full max-w-sm drop-shadow-lg"
          />
        </div>
      </section>

      {/* ── Social proof strip ─────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-5">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm text-gray-400 font-medium">
          <span>Built for deep work</span>
          <span className="hidden md:block text-gray-200">·</span>
          <span>AI duration prediction</span>
          <span className="hidden md:block text-gray-200">·</span>
          <span>AI priority suggestion</span>
          <span className="hidden md:block text-gray-200">·</span>
          <span>Calendar & list views</span>
          <span className="hidden md:block text-gray-200">·</span>
          <span>30-min smart alerts</span>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need. Nothing you don't.</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Toki is built around one idea: planning should take seconds, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: iconLeft,
              lucide: <Zap size={18} className="text-toki-green" />,
              title: 'Automate',
              desc: 'Hit "Plan" on any task. Our neural network predicts the duration and priority so you stop guessing and start doing.',
            },
            {
              icon: iconCenter,
              lucide: <BarChart2 size={18} className="text-toki-green" />,
              title: 'Track',
              desc: "Know exactly what's coming. Smart 30-minute alerts surface tasks before they sneak up on you.",
            },
            {
              icon: iconRight,
              lucide: <Layers size={18} className="text-toki-green" />,
              title: 'Organize',
              desc: 'Filter by category or priority. Drag to reorder. Calendar or list — your workflow, your way.',
            },
          ].map(({ icon, lucide, title, desc }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <img src={icon} alt={title} className="h-12 w-12 object-contain" />
                <div className="flex items-center gap-1.5">
                  {lucide}
                  <span className="text-sm font-semibold text-toki-teal uppercase tracking-wide">{title}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">From zero to planned in 30 seconds</h2>
            <p className="text-gray-500">Three steps. That's it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Add a task',
                desc: 'Give it a title, a category, and a start time. Everything else is optional.',
              },
              {
                step: '02',
                title: 'Let Toki predict',
                desc: "Tap \"Plan\" and our AI suggests how long it'll take and how urgent it is. Accept or override — you're in control.",
              },
              {
                step: '03',
                title: 'Execute',
                desc: 'Your day is structured. Get alerts before tasks start. Mark complete as you go. Archive is built-in.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5">
                <span className="text-3xl font-bold text-toki-green opacity-30 leading-none mt-0.5 select-none">{step}</span>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, honest pricing</h2>
          <p className="text-gray-500">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {[
            {
              name: 'Free',
              price: '$0',
              per: 'forever',
              desc: 'For individuals getting started.',
              cta: 'Get started',
              ctaAction: toggleSignup,
              highlight: false,
              features: ['Up to 20 active tasks', 'Calendar & list views', 'Basic categories', 'Task creation & tracking'],
            },
            {
              name: 'Pro',
              price: '$8',
              per: 'per month',
              desc: 'For power users who want the AI edge.',
              cta: 'Start free trial',
              ctaAction: toggleSignup,
              highlight: true,
              features: ['Unlimited tasks', 'AI duration prediction', 'AI priority suggestion', 'All categories', 'Drag-and-drop reordering', 'Full archive history', 'Priority support'],
            },
            {
              name: 'Team',
              price: '$18',
              per: 'per user / month',
              desc: 'For teams that plan together.',
              cta: 'Coming soon',
              ctaAction: null,
              highlight: false,
              features: ['Everything in Pro', 'Shared team workspace', 'Task assignment', 'Admin dashboard', 'Slack & Notion integration (roadmap)', 'Dedicated support'],
            },
          ].map(({ name, price, per, desc, cta, ctaAction, highlight, features }) => (
            <div
              key={name}
              className={`rounded-2xl p-8 border flex flex-col gap-6 ${
                highlight
                  ? 'border-toki-green bg-toki-teal text-white shadow-modal'
                  : 'border-gray-100 bg-white shadow-card'
              }`}
            >
              <div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  <span className={`text-sm ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{per}</span>
                </div>
                <p className={`text-base font-semibold mb-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{name}</p>
                <p className={`text-sm ${highlight ? 'text-white/70' : 'text-gray-500'}`}>{desc}</p>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={14} className={`mt-0.5 flex-shrink-0 ${highlight ? 'text-toki-green' : 'text-toki-green'}`} />
                    <span className={`text-sm ${highlight ? 'text-white/80' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              {ctaAction ? (
                <button
                  onClick={ctaAction}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    highlight
                      ? 'bg-toki-green text-white hover:bg-toki-green-dark'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cta}
                </button>
              ) : (
                <span className="w-full py-2.5 rounded-lg text-sm font-medium text-center text-gray-400 border border-dashed border-gray-200">
                  {cta}
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          All plans include a 14-day free trial of Pro features. No credit card required.
        </p>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="bg-toki-teal">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to reclaim your time?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Join people who stopped over-planning and started over-delivering.
          </p>
          <button onClick={toggleSignup} className="inline-flex items-center gap-2 bg-toki-green text-white font-medium py-3 px-8 rounded-lg hover:bg-toki-green-dark transition-colors text-base">
            Get started free — no credit card <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
