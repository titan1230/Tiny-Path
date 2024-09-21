"use client";

import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUser, FaBuilding, FaComment } from "react-icons/fa";
import Link from 'next/link';

const ContactSalesPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-[#5fd9ca] from-[#000025] py-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-12 flex justify-between items-center">
        <Link href="/" className="text-white">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-white  ">Contact Sales</h1>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 md:w-2/3 lg:w-1/2 mx-auto border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Get in Touch with Our Sales Team
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Fill out the form below to request more information about our Business Plan. Our team will reach out to you soon.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control relative">
            <label className="label flex items-center mb-2">
              <FaUser className="mr-2 text-gray-500" />
              <span className="text-gray-700">Name</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-black"
              required
            />
          </div>

          <div className="form-control relative">
            <label className="label flex items-center mb-2">
              <FaEnvelope className="mr-2 text-gray-500" />
              <span className="text-gray-700">Email</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-black"
              required
            />
          </div>

          <div className="form-control relative">
            <label className="label flex items-center mb-2">
              <FaBuilding className="mr-2 text-gray-500" />
              <span className="text-gray-700">Company</span>
            </label>
            <input
              type="text"
              name="company"
              id="company"
              value={formData.company}
              onChange={handleInputChange}
              className="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-black"
            />
          </div>

          <div className="form-control relative">
            <label className="label flex items-center mb-2">
              <FaComment className="mr-2 text-gray-500" />
              <span className="text-gray-700">Message</span>
            </label>
            <textarea
              name="message"
              id="message"
              
              value={formData.message}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-black resize-none"
              rows={4}
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Contact Information Section */}
      <div className="mt-16 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Other Ways to Contact Us</h2>
        <div className="flex flex-wrap justify-around items-center gap-8">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-64 hover:shadow-xl transition duration-300 ease-in-out">
            <FaPhoneAlt className="text-3xl text-blue-600 mb-4" />
            <p className="text-lg font-medium text-gray-800">Phone</p>
            <p className="text-gray-600">+1 (800) 123-4567</p>
          </div>
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-64 hover:shadow-xl transition duration-300 ease-in-out">
            <FaEnvelope className="text-3xl text-blue-600 mb-4" />
            <p className="text-lg font-medium text-gray-800">Email</p>
            <p className="text-gray-600">sales@example.com</p>
          </div>
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-64 hover:shadow-xl transition duration-300 ease-in-out">
            <FaMapMarkerAlt className="text-3xl text-blue-600 mb-4" />
            <p className="text-lg font-medium text-gray-800">Visit Us</p>
            <p className="text-gray-600">123 Business St, Suite 100</p>
            <p className="text-gray-600">San Francisco, CA 94111</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSalesPage;
