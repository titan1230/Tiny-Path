"use client";

import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaBuilding,
  FaComment,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";

const ContactSalesPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        {/* Header Section */}
        <div className="w-full max-w-6xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-white/80 hover:text-white transition-colors duration-300 group"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-300">
                ←
              </span>
              Back to Home
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Contact Sales
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {`Ready to transform your business? Let's discuss how our solutions`}
              can drive your success.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-white/70 text-lg">
                Fill out the form below and our sales team will reach out within
                24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/90 font-medium flex items-center">
                      <FaUser className="mr-2 text-cyan-400" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-cyan-400 focus:bg-white/20 transition-all duration-300"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/90 font-medium flex items-center">
                      <FaEnvelope className="mr-2 text-purple-400" />
                      Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/90 font-medium flex items-center">
                    <FaBuilding className="mr-2 text-pink-400" />
                    Company Name
                  </span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="input input-bordered bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-pink-400 focus:bg-white/20 transition-all duration-300"
                  placeholder="Your Company Inc."
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/90 font-medium flex items-center">
                    <FaComment className="mr-2 text-cyan-400" />
                    Message
                  </span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 resize-none h-32"
                  placeholder="Tell us about your project and requirements..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-none text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information & Features */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid gap-6">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaPhoneAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Phone Support
                    </h3>
                    <p className="text-white/70">+1 (800) 123-4567</p>
                    <p className="text-white/50 text-sm">
                      Mon-Fri, 9AM-6PM EST
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Email Sales
                    </h3>
                    <p className="text-white/70">sales@example.com</p>
                    <p className="text-white/50 text-sm">
                      Response within 2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">
                Why Choose Us?
              </h3>
              <div className="space-y-3">
                {[
                  "24/7 Premium Support",
                  "Custom Enterprise Solutions",
                  "99.9% Uptime Guarantee",
                  "Advanced Security Features",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FaCheckCircle className="text-green-400 flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-white relative max-w-md">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            onClick={closeModal}
          >
            <FaTimes />
          </button>

          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
            <h3 className="font-bold text-2xl text-gray-800 mb-2">
              Message Sent!
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us! Our sales team will get back to you
              within 24 hours.
            </p>
            <button
              className="btn bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-none text-white px-8"
              onClick={closeModal}
            >
              Got it!
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={closeModal}></div>
      </dialog>
    </div>
  );
};

export default ContactSalesPage;
