import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-32 border-t border-white/5">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
        <div className="space-y-8">
          <h3 className="text-3xl font-serif font-bold text-white tracking-tighter">Hotel DCrescent</h3>
          <p className="text-white/40 text-base leading-relaxed font-light">
            A luxury lodge offering an unparalleled connection to the African wilderness. Established 1994.
          </p>
        </div>
        <div className="space-y-6">
          <h4 className="text-white font-serif text-xl">Quick Links</h4>
          <ul className="text-white/30 text-sm space-y-4 font-medium uppercase tracking-widest">
            <li><a href="#" className="hover:text-[#5a3a2a] transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-[#5a3a2a] transition-colors">Accommodations</a></li>
            <li><a href="#" className="hover:text-[#5a3a2a] transition-colors">Dining</a></li>
            <li><a href="#" className="hover:text-[#5a3a2a] transition-colors">Conservation</a></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-white font-serif text-xl">Contact</h4>
          <div className="space-y-4 text-white/40 text-sm font-light">
            <p className="leading-relaxed">123 Luxury Lane, Premium District, City</p>
            <p>reservations@hoteldcrescent.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="space-y-8">
          <h4 className="text-white font-serif text-xl">Newsletter</h4>
          <p className="text-white/30 text-sm font-light">Subscribe for exclusive offers and stories from the wild.</p>
          <div className="flex flex-col gap-3">
            <input 
              placeholder="Email Address" 
              className="bg-white/5 border border-white/10 rounded-lg px-5 py-4 text-sm w-full focus:outline-none focus:border-[#5a3a2a] transition-all text-white placeholder-white/50" 
            />
            <button className="bg-[#5a3a2a] text-white py-4 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#5a3a2a]/90 transition-all shadow-lg shadow-[#5a3a2a]/20">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
        <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">&copy; 2026 Hotel DCrescent. All rights reserved.</p>
        <div className="flex gap-10 text-[10px] uppercase tracking-widest text-white/20 font-bold">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;