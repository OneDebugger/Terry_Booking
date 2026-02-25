import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const SerengetiHero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen">
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-cream/90 backdrop-blur-md border-b border-terracotta/30 py-4' : 'bg-transparent py-6'}`}>
          <div className="container mx-auto px-6 flex items-center justify-between">
            <span className={`text-2xl font-serif font-bold tracking-tighter cursor-pointer ${isScrolled ? 'text-thatch-brown' : 'text-cream'}`}>
              KwaTerry
            </span>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Suites', 'Experience', 'Dining', 'Gallery'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className={`text-sm font-medium hover:text-primary transition-colors ${isScrolled ? 'text-thatch-brown' : 'text-cream/90'}`}>
                  {item}
                </a>
              ))}
              <Link href="/booking">
                <button className={`px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${isScrolled ? 'bg-primary text-thatch-brown hover:bg-primary/90 shadow-lg shadow-terracotta/20' : 'bg-primary text-thatch-brown hover:bg-primary/90 shadow-xl'}`}>
                  Book Your Stay
                </button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden text-cream" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/terry1.jpeg" className="w-full h-full object-cover scale-105" alt="KwaTerry Lodge Hero" />
            {/* Earthy overlay - warm terracotta/brown tone instead of black */}
            <div className="absolute inset-0 bg-thatch-brown/30"></div>
            <div className="absolute inset-0 bg-thatch-brown/20"></div>
            <div className="absolute inset-0 bg-thatch-brown/40"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 text-center text-cream">
            <div className="animate-fade-in max-w-4xl mx-auto">
              <span className="inline-block py-1.5 px-4 border border-primary/40 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md bg-thatch-brown/30">
                The Soul of Africa
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium leading-[1.1] mb-8 text-cream">
                KwaTerry <br/> Village
              </h1>
              <p className="text-lg md:text-xl text-cream/90 max-w-2xl mx-auto font-light mb-12 leading-relaxed">
                From the heartbeat of our working lands to your plate, every moment at KwaTerry is a celebration of the soil, turning your stay into a cherished memory of life at its most genuine
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <button className="bg-primary hover:bg-primary/90 text-thatch-brown rounded-full px-10 py-5 text-sm font-bold uppercase tracking-widest transition-all shadow-2xl shadow-terracotta/40">
                  Discover Suites
                </button>
                <button className="bg-cream/10 backdrop-blur-md border border-primary/30 text-cream hover:bg-cream/20 rounded-full px-10 py-5 text-sm font-bold uppercase tracking-widest transition-all">
                  View Experience
                </button>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-3 opacity-60">
            <span className="text-[10px] uppercase tracking-[0.3em]">Explore</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
          </div>
        </section>

        {/* Booking Strip */}

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </>
  );
};

export default SerengetiHero;