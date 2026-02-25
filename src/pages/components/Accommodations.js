import React, { useEffect } from 'react';

const Accommodations = () => {
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

  const rooms = [
    { 
      title: 'Savanna Suite', 
      price: '$850', 
      img: '/hotelbook.jpg', 
      desc: 'Panoramic views with a private plunge pool.' 
    },
    { 
      title: 'River Villa', 
      price: '$1,200', 
      img: '/hotelbook1.jpg', 
      desc: 'Located on the riverbank, perfect for wildlife viewing.' 
    },
    { 
      title: 'Royal Residence', 
      price: '$2,500', 
      img: '/hotelbook3.jpg', 
      desc: 'Our most exclusive offering with dedicated staff.' 
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200" id="suites">
      <div className="container mx-auto px-6 text-center mb-20 space-y-4">
        <span className="text-[#5a3a2a] font-bold tracking-[0.3em] text-[10px] uppercase block">Accommodations</span>
        <h2 className="text-5xl md:text-6xl font-serif">Your Private Oasis</h2>
      </div>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {rooms.map((room, i) => (
          <div 
            key={i} 
            className="scroll-reveal group bg-white p-4 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500" 
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-lg mb-8 relative">
              <img 
                src={room.img} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                alt={room.title} 
              />
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur px-5 py-2 rounded-full text-xs font-bold shadow-lg">
                From {room.price}
              </div>
            </div>
            <h3 className="text-3xl font-serif mb-4 group-hover:text-[#5a3a2a] transition-colors">{room.title}</h3>
            <p className="text-gray-600 font-light mb-6 leading-relaxed">{room.desc}</p>
            <button className="text-[#5a3a2a] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center hover:translate-x-2 transition-transform">
              Explore Details <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accommodations;