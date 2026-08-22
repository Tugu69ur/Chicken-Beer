import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">About Us</span>
          <h1 className="mt-3 text-4xl font-extrabold text-ink tracking-tight sm:text-5xl">
            Chicken2030 — Chicken, Speed, Taste
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-ink-secondary leading-relaxed">
            Chicken2030 combines exceptional ingredients and fast service to deliver the tastiest chicken experience in Mongolia. Our goal is to provide easy ordering, high-quality chicken, and excellent service for families, friends, and groups.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'Fresh Ingredients',
              detail: 'We use only the freshest produce, delivered daily.',
              icon: '🥬',
            },
            {
              title: 'Fast Delivery',
              detail: 'Your order delivered quickly and reliably.',
              icon: '⚡',
            },
            {
              title: 'Trusted Service',
              detail: 'Smooth, friendly service with no hassle.',
              icon: '🤝',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 text-2xl">
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm text-ink-secondary leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="card p-8 card-elevated">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Our Mission</span>
            <h2 className="mt-4 text-2xl font-bold text-ink">Making everything easier</h2>
            <p className="mt-4 text-ink-secondary leading-relaxed">
              We aim to provide an easy, fast, and trustworthy ordering experience. Our platform ensures transparency and reliability at every step of the ordering process.
            </p>
          </div>
          <div className="card p-8 card-elevated">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Why Choose Us?</span>
            <ul className="mt-6 space-y-4">
              {[
                'Taste our signature chicken with a unique, special flavor',
                'Clean, fresh ingredients used in our recipes',
                'Fast delivery with a service guarantee',
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-surface-dim bg-surface-muted p-4 text-sm text-ink-secondary"
                >
                  <span className="mt-0.5 text-brand-red">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
