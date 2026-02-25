import React, { useEffect, useRef } from 'react';

const Introduction = () => {
  const sectionRef = useRef(null);

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

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="scroll-reveal space-y-10">
          <div className="flex items-center gap-5">
            <div className="h-[1px] w-16 bg-[#5a3a2a]/60"></div>
            <span className="text-[#5a3a2a] font-bold tracking-[0.3em] text-[10px] uppercase">The Sanctuary</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif leading-tight ]">
            Where luxury meets <br/> <span className="text-[#5a3a2b]/80 italic">untamed nature.</span>
          </h2>
          <p className="text-gray-600 leading-relaxed text-xl font-light">
            Nestled deep within the Serengeti, our lodge offers an intimate connection with the wild without compromising on comfort. Wake up to the sound of lions calling, dine under a canopy of stars, and retreat to your private villa designed to blend seamlessly with the landscape.
          </p>
          <div className="grid grid-cols-2 gap-16 pt-6">
            <div className="space-y-2">
              <div className="text-4xl font-serif text-[#5a3a2a]">5-Star</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Luxury Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-serif text-[#5a3a2a]">15k+</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Acres of Reserve</div>
            </div>
          </div>
          <button className="group flex items-center gap-3 text-[#5a3a2a] font-bold uppercase tracking-widest text-xs hover:gap-5 transition-all">
            Read Our Story <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
        <div className="scroll-reveal relative delay-300">
          <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]">
            <img src="/hotelbook2.jpg" className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110" alt="Interior" />
          </div>
          <div className="absolute -bottom-12 -left-12 bg-white p-10 shadow-2xl max-w-[280px] border border-gray-100 hidden md:block">
            <p className="font-serif italic text-2xl text-[#5a3a2a] mb-4 leading-tight">{"\""}The most breathtaking sunrise I have ever witnessed.{"\""}</p>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 text-[#d4af37]">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Condé Nast</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;