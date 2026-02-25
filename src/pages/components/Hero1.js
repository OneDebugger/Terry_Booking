import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

const Hero1 = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </Head>

      <nav id="navbar" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-6 ${isScrolled ? 'bg-white/85 backdrop-blur-12 border-b border-black/10' : ''}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="#" className={`text-2xl font-serif font-bold tracking-tighter ${isScrolled ? 'text-gray-900' : 'text-white'} transition-colors`}>
            Hotel DCrescent
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#suites" className="text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors">Suites</Link>
            <Link href="#" className="text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors">Experience</Link>
            <Link href="#" className="text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors">Dining</Link>
            <Link href="/booking" className="bg-white text-[#5a3a2a] px-6 py-2.5 rounded text-sm font-bold tracking-wide hover:bg-gray-100 transition-all">
              Book Your Stay
            </Link>
          </div>
          
          <button className="md:hidden text-white" id="mobileMenu">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-black/35"></div>
          <Image src="/hotelbook.jpg" alt="Hotel DCrescent Hero" fill className="object-cover" priority />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center text-white animate-fadeInUp">
          <span className="inline-block py-1 px-4 border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
            The Soul of Hospitality
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-medium leading-[1.1] mb-8">
            Hotel DCrescent
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light mb-12">
            Experience the perfect blend of luxury and comfort. Where every stay becomes a cherished memory.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="bg-[#5a3a2a] hover:opacity-90 text-white rounded-full px-10 h-14 text-sm font-bold tracking-widest uppercase transition-all">
              Discover Suites
            </Link>
            <Link href="/rooms" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-full px-10 h-14 text-sm font-bold tracking-widest uppercase transition-all">
              View Experience
            </Link>
          </div>
        </div>
      </section>

      <div className="relative z-30 -mt-12 container mx-auto px-4 lg:px-12">
        <div className="bg-white rounded-lg shadow-2xl p-6 lg:p-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Check In</label>
              <input type="date" className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#5a3a2a]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Check Out</label>
              <input type="date" className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#5a3a2a]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Guests</label>
              <select className="w-full border-b border-gray-200 py-2 outline-none bg-transparent">
                <option>2 Adults, 0 Children</option>
                <option>1 Adult</option>
                <option>Family (2+2)</option>
              </select>
            </div>
            <button className="bg-[#5a3a2a] text-white h-12 rounded shadow-lg font-bold uppercase text-xs tracking-widest hover:opacity-95 transition-opacity">
              Check Availability
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bg-primary-custom { background-color: #5a3a2a; }
        .text-primary-custom { color: #5a3a2a; }
        .border-primary-custom { border-color: #5a3a2a; }
        
        .nav-scrolled {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }
      `}</style>
    </>
  );
};

export default Hero1;
