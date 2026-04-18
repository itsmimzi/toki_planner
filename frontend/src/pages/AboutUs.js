import React, { useEffect } from 'react';
import { GitFork, ArrowRight, Cpu, Clock, SlidersHorizontal, Archive } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

const features = [
  {
    icon: <Cpu size={18} className="text-toki-green" />,
    title: 'Intuitive Prioritization',
    desc: "Toki's multi-output neural network (MLP) analyzes your task context — category, time of day, day of week — and pops out a priority suggestion. No more staring at a blank list wondering what matters most.",
  },
  {
    icon: <Clock size={18} className="text-toki-green" />,
    title: 'Smart Duration Estimation',
    desc: 'Stop padding your calendar with guesses. Toki predicts how long a task will realistically take, based on patterns learned from thousands of simulated planning sessions.',
  },
  {
    icon: <SlidersHorizontal size={18} className="text-toki-green" />,
    title: 'Frictionless Scheduling',
    desc: 'Set a start time. Pick a category. Everything else is optional. The calendar and list views adapt to how you think — not the other way around.',
  },
  {
    icon: <Archive size={18} className="text-toki-green" />,
    title: 'Track Progress with Ease',
    desc: 'Mark tasks complete as you go. Completed tasks move to your archive automatically, giving you a clean view of what\'s ahead and a satisfying record of what you\'ve done.',
  },
];

const AboutUs = () => {
  useEffect(() => { document.title = 'About | Toki'; }, []);
  const { toggleSignup } = useAuth();

  return (
    <div className="bg-white">

      {/* ── Origin Story ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          <span className="badge badge-green mb-5 text-xs tracking-wide uppercase">The story</span>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
            Built by someone who was<br />
            <span className="text-toki-green">drowning in their own to-do list.</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-5">
            Toki started as a frustration project. Balancing TA responsibilities alongside a full-time Bachelor's in Computer Science meant every hour counted — but too many of those hours were being eaten by the act of <em>planning itself</em>.
          </p>
          <p className="text-base text-gray-500 leading-relaxed mb-5">
            Toggling between student, teacher, and developer roles meant a relentless stream of tasks with no shared priority system. What to tackle first? How long would that assignment actually take? Is this meeting worth blocking out 90 minutes?
          </p>
          <p className="text-base text-gray-500 leading-relaxed">
            The answer was Toki — a task manager that doesn't just store tasks, but reasons about them. The goal was simple: <strong className="text-gray-900">stop wasting time planning, and start executing.</strong>
          </p>
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100" />

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What makes Toki different</h2>
          <p className="text-gray-500 max-w-lg">
            Most task managers assume you know what to do next and how long it'll take. Toki doesn't.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-2.5 mb-3">
                {icon}
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Under the hood ─────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Under the hood</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              The prediction engine is a <strong className="text-gray-700">multi-output MLP (multi-layer perceptron)</strong> trained on a synthetic dataset of task scenarios, modeling real-world distributions across categories, days, times, and task complexity indicators.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              The model outputs two independent probability distributions simultaneously — one for duration class (20, 60, 100, or 180 minutes) and one for priority (low, medium, high, ASAP) — using a shared feature extraction backbone with separate output heads.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              The backend is Django + Django REST Framework with PostgreSQL, deployed on Fly.io. The frontend is React, deployed on GitHub Pages.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Try it yourself.</h2>
          <p className="text-gray-500 text-sm">Free to start. No credit card. Takes 30 seconds.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleSignup} className="btn-primary py-3 px-6">
            Get started free <ArrowRight size={16} />
          </button>
          <a
            href="https://github.com/itsmimzi/toki_planner"
            target="_blank"
            rel="noreferrer"
            className="btn-outline py-3 px-5"
          >
            <GitFork size={15} /> View on GitHub
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
