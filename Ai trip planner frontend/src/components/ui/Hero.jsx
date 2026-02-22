import React from "react";
import { Link } from "react-router-dom";
import { Plane, Sparkles } from "lucide-react";

const stats = [
  { value: "50K+", label: "Trips Generated" },
  { value: "120+", label: "Destinations" },
  { value: "4.9★", label: "User Rating" },
];

const features = [
  { icon: "🤖", label: "AI-Powered" },
  { icon: "⚡", label: "Instant Plans" },
  { icon: "🎯", label: "Personalized" },
  { icon: "🆓", label: "Free to Use" },
];

function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0EA5E9 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-sky-500 animate-spin-slow" />
          AI-Powered Travel Planning for 2026
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-delay-1 font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.08] tracking-tight text-gray-900 mb-6">
          Your dream trip,{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">planned by AI</span>
          <br className="hidden sm:block" />
          in seconds.
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-up-delay-2 text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10">
          Tell us where you want to go and how you travel — Tripify AI builds
          a complete, personalized itinerary with hotels, places, and day-by-day plans.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/create-trip">
            <button className="group relative gradient-bg text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-xl hover:opacity-95 hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <Plane className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Planning — It's Free
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
            </button>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="animate-fade-up-delay-4 flex flex-wrap justify-center gap-3 mb-16">
          {features.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-full text-sm text-gray-600 font-medium hover:shadow-md transition-shadow duration-200"
            >
              <span>{f.icon}</span> {f.label}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="animate-fade-up-delay-5 grid grid-cols-3 gap-6 sm:gap-12 w-full max-w-lg">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold gradient-text">{s.value}</span>
              <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

export default Hero;
