"use client";

import React from "react";
import { FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface Plan {
  name: string;
  price: string;
  features: Record<string, boolean>;
  buttonText: string;
  link: string;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0/month",
    link: "/onboarding",
    features: {
      "Shorten Unlimited Links": true,
      "Custom URLs": false,
      "QR Creator": false,
      "Link Expiration": false,
      "Priority Support": false,
      "Branded Links": false,
    },
    buttonText: "Sign Up for Free",
  },
  {
    name: "Pro",
    price: "$15/month",
    link: `/onboarding?to=${encodeURIComponent("/dashboard/upgrade")}`,
    features: {
      "Shorten Unlimited Links": true,
      "Custom URLs": true,
      "QR Creator": true,
      "Link Expiration": true,
      "Branded Links": false,
      "Priority Support": true,
    },
    buttonText: "Upgrade to Pro",
  },
  {
    name: "Enterprise",
    price: "",
    link: `/contact`,
    features: {
      "Shorten Unlimited Links": true,
      "Custom URLs": true,
      "QR Creator": true,
      "Link Expiration": true,
      "Branded Links": true,
      "Priority Support": true,
    },
    buttonText: "Get Business",
  },
];

const PlansPage: React.FC = () => {
  // Get unique features for the table rows
  const features = Array.from(
    new Set(plans.flatMap((plan) => Object.keys(plan.features)))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-12">
      {/* Back Button */}
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-blue-900 hover:text-blue-700">
        <FaArrowLeft className="text-lg" />
        <span className="font-semibold">Back to Home</span>
      </Link>

      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold text-gray-800">Choose Your Plan</h1>
        <p className="text-gray-700 mt-4">
          Select the best plan for your link shortening needs.
        </p>
      </div>

      <div className="container mx-auto px-4 overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="border border-gray-200 p-4 text-lg text-left bg-blue-50 text-blue-900"></th>
              {plans.map((plan) => (
                <th
                  key={plan.name}
                  className="border border-gray-200 p-4 text-lg font-bold text-center bg-blue-100 text-blue-900"
                >
                  {plan.name}
                  <div className="text-gray-500 text-sm">{plan.price}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature} className="hover:bg-blue-50">
                <td className="border border-gray-200 p-4 text-gray-800">
                  {feature}
                </td>
                {plans.map((plan) => (
                  <td
                    key={plan.name}
                    className="border border-gray-200 p-4 text-center"
                  >
                    {plan.features[feature] ? (
                      <FaCheck className="text-green-500 mx-auto" />
                    ) : (
                      <FaTimes className="text-red-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border border-gray-200 p-4"></td>
              {plans.map((plan) => (
                <td key={plan.name} className="border border-gray-200 p-4">
                  <Link href={plan.link}>
                  <button className="btn btn-primary w-full">
                    {plan.buttonText}
                  </button>
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PlansPage;
