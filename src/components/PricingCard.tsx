'use client';
import Link from 'next/link';
import React, { useState } from 'react';

function PricingSection() {

  const pricingPlans = [
    {
      name: 'Free Plan',
      price: 0,
      isFree: true,
      description: 'Perfect for individuals and small projects. Get started with essential features and shorten links effortlessly.',
      features: [
        'Create up to 100 short links per month',
        'Basic Customization',
        'Access to community support',
      ],
      link: '/plans',
    },
    {
      name: 'Business Plan',
      price: 5,
      description: 'Ideal for startups and small businesses. Unlock more features to boost engagement and track your links efficiently.',
      features: [
        'Unlimited short links.',
        'Customizable URLs',
        'Priority support with live chat',
      ],
      link: '/plans',
    },
    {
      name: 'Enterprise Plan',
      price: "Contact Sales",
      isEnterprise: true,
      description: 'Tailored solutions for large organizations with high-volume link needs and detailed tracking.',
      features: [
        'Custom API integration with support',
        'Custom domains',
        'SLA and security compliance options',
      ],
      link: '/contact',
    },
  ];

  return (
    <div className='my-10 scroll-m-24' id='pricing'>
      <div className="flex flex-col justify-center items-center gap-4 sm:gap-5 mt-5">
        <div className="text-4xl sm:text-6xl">Our Pricing Plans</div>
        <span className="text-center text-gray-300 text-sm sm:text-base">
          Select from our range of affordable plans <br /> tailored to suit every budget.
        </span>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-10 px-2 pb-3 mt-6">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className="pricing-card border-2 border-gray-700 w-80 rounded-2xl h-auto pb-10 shadow-lg bg-gradient-to-r from-black to-gray-900 z-5">
            <div className="p-5 rounded-2xl">
              <span className="text-white">{plan.name}</span>
              <div className="mt-3 mb-2">
                <span className="text-white text-3xl">
                  {plan.isEnterprise ? plan.price : `$${plan.price}`}
                  {plan.isFree || plan.isEnterprise ? "" : <span className="text-xs">{'One Time'}</span>}
                </span>
              </div>
              <div className='min-h-28'>
                <span className="text-slate-300 text-sm">{plan.description}</span>
              </div>
              <div className="mt-5">
                <Link href={plan.link} target='_blank'>
                  <button
                    className="bg-sky-500 buttonPress hover:bg-sky-400 text-white w-full h-10 rounded-full"
                    aria-label={`Get started with the ${plan.name}`}
                  >
                    {plan.isEnterprise ? 'Contact Sales' : 'Get Started'}
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-black rounded-2xl pl-5 pt-3 bg-gradient-to-r from-black to-gray-900">
              <span className="text-white">Features</span>
              {plan.features.map((feature, index) => (
                <span key={index} className="text-slate-300 text-sm flex items-center gap-1 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hover effect styles */}
      <style jsx>{`
        .pricing-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        @media (min-width: 768px) {
          .pricing-card:hover {
            transform: scale(1.05) rotateX(5deg) rotateY(-5deg);
            box-shadow: 0 20px 30px rgba(0, 0, 0, 0.4);
          }
        }
      `}</style>
    </div>
  );
}

export default PricingSection;
