import React, { useEffect } from 'react';

const Experience = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const experiences = [
    { icon: 'binoculars', title: 'Game Drives', desc: 'Twice daily guided safaris in open 4x4 vehicles.' },
    { icon: 'utensils', title: 'Fine Dining', desc: 'Farm-to-table cuisine inspired by local flavors.' },
    { icon: 'droplets', title: 'Wellness Spa', desc: 'Rejuvenating treatments using organic botanicals.' },
    { icon: 'wifi', title: 'Connectivity', desc: 'High-speed Starlink wifi in all areas.' }
  ];

  return (
    <section className="py-32 bg-[#5a3a2a] text-white overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="scroll-reveal space-y-8">
          <h2 className="text-5xl md:text-6xl font-serif leading-tight">Curated Experiences</h2>
          <p className="text-white/70 text-xl font-light leading-relaxed max-w-lg">
            Every aspect of your stay is thoughtfully designed to provide comfort, adventure, and a deep connection to the wild.
          </p>
          <button className="border border-white/30 rounded-full px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-[#5a3a2a] transition-all">
            Explore Activities
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {experiences.map((item, i) => (
            <div 
              key={i} 
              className="scroll-reveal flex flex-col gap-5 p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300" 
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-serif mb-3">{item.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;