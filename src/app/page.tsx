import React from "react";
import Image from 'next/image'

const LandingPage: React.FC = () => {
  return (
    <div className="bg-base-100 text-white">
      {/* Header */}
      <header className="bg-neutral text-white py-4 px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/TinyPath.png" alt="TinyPath Logo" height={40} width={40} priority />
          <nav className="ml-8">
            <a href="#home" className="text-white mx-4">Home</a>
            <a href="#features" className="text-white mx-4">Features</a>
            <a href="#pricing" className="text-white mx-4">Pricing</a>
            <a href="#about" className="text-white mx-4">About Us</a>
          </nav>
        </div>
        <button className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-[#1171ee] ease-in-out transition-all">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero bg-base-100 text-white py-20 flex flex-col items-center text-center min-h-screen justify-center">
        <h1 className="text-5xl font-bold mb-4">Shorten, Share, and Track Your Links with Ease</h1>
        <p className="text-lg mb-8">TinyPath makes URL shortening simple and effective for everyone.</p>
        <button className="bg-primary text-white py-3 px-6 rounded-full hover:bg-[#1171ee] ease-in-out transition-all">
          Shorten Your First Link Now
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="features bg-base-200 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose TinyPath?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-item">
              <i className="fas fa-link text-primary text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Easy URL Shortening</h3>
              <p>Shorten any URL in seconds with our user-friendly interface.</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-edit text-primary text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Customizable Links</h3>
              <p>Create branded and customizable short links to enhance your brand identity.</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-chart-line text-primary text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p>Track link performance with real-time analytics and insights.</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-lock text-primary text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Secure and Reliable</h3>
              <p>Enjoy secure and reliable service with top-notch privacy features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing bg-base-100 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="pricing-card bg-base-300 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Free Plan</h3>
              <p className="text-2xl font-bold mb-4">$0 / month</p>
              <p>Basic URL shortening features.</p>
              <button className="bg-primary text-white py-2 px-4 rounded-lg mt-6">Get Started</button>
            </div>
            <div className="pricing-card bg-base-300 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Pro Plan</h3>
              <p className="text-2xl font-bold mb-4">$9 / month</p>
              <p>Advanced features with custom branding.</p>
              <button className="bg-primary text-white py-2 px-4 rounded-lg mt-6">Get Started</button>
            </div>
            <div className="pricing-card bg-base-300 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Enterprise Plan</h3>
              <p className="text-2xl font-bold mb-4">$29 / month</p>
              <p>Premium features with dedicated support.</p>
              <button className="bg-primary text-white py-2 px-4 rounded-lg mt-6">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about bg-base-200 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">About TinyPath</h2>
          <p className="mb-6">TinyPath is committed to providing the best URL shortening service to help you streamline your online presence and enhance your marketing efforts.</p>
          <p className="mb-6">Our mission is to make sharing and tracking links easier, faster, and more efficient for everyone.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral text-white py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center">
          <div className="mb-4 md:mb-0">
            <p>© 2024 TinyPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
