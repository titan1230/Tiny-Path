'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FiCheck, FiStar } from 'react-icons/fi';

interface PricingPlan {
  name: string;
  price: {
    monthly: number | string;
    annually: number | string;
  };
  isFree?: boolean;
  isEnterprise?: boolean;
  description: string;
  features: string[];
  link: string;
  cta: string;
  popular?: boolean;
}

type BillingCycle = 'monthly' | 'annually';

function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const pricingPlans: PricingPlan[] = [
    {
      name: 'Free',
      price: { monthly: 0, annually: 0 },
      isFree: true,
      description: 'Perfect for individuals and small projects.',
      features: [
        'Up to 50 short links',
        'Basic analytics',
        'Standard support',
        'Single user',
        'Basic link customization',
      ],
      link: '/signup',
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: { monthly: 9, annually: 89 },
      description: 'Ideal for professionals and growing businesses.',
      features: [
        'Unlimited short links',
        'Advanced analytics',
        'Priority support',
        'Up to 5 team members',
        'Custom branded domains',
        'QR code generation',
        'Password protected links',
      ],
      link: '/plans/pro',
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: 'Custom', annually: 'Custom' },
      isEnterprise: true,
      description: 'Tailored solutions for large organizations.',
      features: [
        'Unlimited everything',
        'Dedicated account manager',
        'SLA guarantees',
        'Unlimited team members',
        'Multiple branded domains',
        'API access with higher rate limits',
        'SSO & advanced security',
        'Custom integration support',
      ],
      link: '/contact',
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black scroll-mt-[4rem]"
      id="pricing"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div
        className="max-w-7xl mx-auto text-center mb-16"
        variants={fadeInUp}
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Choose the perfect plan for your needs. No hidden fees. Cancel anytime.
        </p>

        <div className="mt-8 inline-flex items-center p-1 bg-gray-800/80 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annually')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
              billingCycle === 'annually'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Annually
            <span className="ml-1 bg-emerald-500 text-xs px-1.5 py-0.5 rounded-full text-white font-semibold">
              Save 20%
            </span>
          </button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={fadeInUp}
            className={`relative rounded-2xl overflow-hidden flex flex-col h-full ${
              plan.popular
                ? 'border-2 border-blue-400 md:scale-105 z-10'
                : 'border border-gray-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 inset-x-0 bg-blue-500 text-white text-xs font-semibold py-1.5 text-center">
                MOST POPULAR
              </div>
            )}

            <div
              className={`p-8 ${
                plan.popular ? 'pt-12' : 'pt-8'
              } bg-gradient-to-br from-gray-900 to-gray-950`}
            >
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-gray-300 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {typeof plan.price[billingCycle] === 'number'
                    ? `$${plan.price[billingCycle]}`
                    : plan.price[billingCycle]}
                </span>
                {typeof plan.price[billingCycle] === 'number' && !plan.isFree && (
                  <span className="text-gray-300 ml-2">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                )}
              </div>

              <Link href={plan.link}>
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-blue-500 hover:bg-blue-400 text-white'
                      : plan.isFree
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>

            <div className="p-8 bg-gray-900 border-t border-gray-800 flex-grow">
              <h4 className="font-medium text-white mb-4">{`What's included:`}</h4>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 mt-1 text-cyan-400">
                      <FiCheck />
                    </span>
                    <span className="text-gray-200 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 max-w-3xl mx-auto bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-2xl p-8 border border-blue-700/50"
        variants={fadeInUp}
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-8">
            <div className="bg-blue-500/20 p-3 rounded-full inline-block">
              <FiStar className="text-cyan-300 text-2xl" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Need a custom solution?
            </h3>
            <p className="text-gray-200 mb-4">
              {`Our team can build a tailored plan that perfectly fits your organization's needs.`}
            </p>
            <Link href="/contact">
              <button className="px-5 py-2 bg-transparent border border-cyan-400 text-cyan-300 rounded-lg hover:bg-cyan-900/20 transition-all">
                Contact our sales team
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PricingSection;