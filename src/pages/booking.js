import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const Booking = () => {
   const [checkin, setCheckin] = useState("");
   const [checkout, setCheckout] = useState("");
   const [adults, setAdults] = useState("1");
   const [child, setChild] = useState("0");
   const [roomCount, setRoomCount] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [name, setName] = useState("");
   const [roomClasses, setRoomClasses] = useState([]);
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   
   useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_HOST}/api/public/getroomclasses`)
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          setRoomClasses(data.data || []);
        } else {
          toast.error("Failed to load room options.");
        }
      })
      .catch((error) => {
        console.error('❌ Error loading room classes:', error);
      });
   }, [])

   const handlechange = (e) => {
      const { name, value } = e.target;
      if (name === "checkin") setCheckin(value);
      else if (name === "checkout") setCheckout(value);
      else if (name === "adults") setAdults(value);
      else if (name === "child") setChild(value);
      else if (name === "email") setEmail(value);
      else if (name === "phone") setPhone(value);
      else if (name === "name") setName(value);
   }

   // --- RESTORED HANDLEBUTTON FUNCTION ---
   const handlebutton = async () => {
      // 1. Validation
      if (!checkin || !checkout || !roomCount) {
         toast.error("Please fill in all required fields (Check-in, Check-out, and Rooms).");
         return;
      }

      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      if (checkoutDate <= checkinDate) {
         toast.error("Check-out date must be after check-in date.");
         return;
      }

      setLoading(true);
      
      try {
         let bestAvailability = null;
         let bestRoomClass = null;
         
         // Loop through classes to find the first one with space
         for (const roomClass of roomClasses) {
           const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/public/checkroomavailability`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               checkin,
               checkout,
               roomClassId: roomClass._id,
               roomCount: parseInt(roomCount)
             })
           });

           const result = await response.json();
           
           if (response.ok && result.success && result.availableCount >= parseInt(roomCount)) {
             bestAvailability = result;
             bestRoomClass = roomClass;
             break; 
           }
         }

         // Check if any room classes have availability
         const hasAvailability = roomClasses.some(roomClass => {
           const availability = bestAvailability && bestRoomClass._id === roomClass._id;
           return availability;
         });

         if (hasAvailability) {
           toast.success("Checking room class availability...");
           router.push({
             pathname: '/roomclassselection',
             query: {
               checkin: checkin,
               checkout: checkout,
               adults: adults,
               child: child,
               email: email,
               phone: phone,
               name: name,
               roomCount: roomCount
             }
           });
         } else {
           toast.error("No rooms available for these dates.");
         }
      } catch (error) {
         console.error(error);
         toast.error("Network error. Please try again.");
      } finally {
         setLoading(false);
      }
   }; 

   return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Book Your Stay | KwaTerry Lodge</title>
      </Head>
      
      <ToastContainer position="top-left" autoClose={5000} theme="light" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-terracotta/30 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-thatch-brown">
            KwaTerry
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/rooms" className="text-sm font-medium text-thatch-brown hover:text-savannah-green transition-colors">Suites</Link>
            <Link href="/booking" className="bg-primary text-thatch-brown px-6 py-2.5 rounded text-sm font-bold tracking-wide hover:bg-primary/90 transition-all">
              Book Your Stay
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-32 bg-background min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-6">
            <div className="flex items-center justify-center gap-5">
              <div className="h-[1px] w-16 bg-terracotta"></div>
              <span className="text-terracotta font-black tracking-[0.3em] text-[10px] uppercase">Reservations</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-foreground">Book Your Stay</h1>
            <p className="text-foreground text-lg md:text-xl opacity-80 max-w-2xl mx-auto font-light">
              Experience the authentic warmth of KwaTerry, where traditional charm meets modern comfort. 
              Where every stay becomes a cherished memory.
            </p>
            <div className="h-1 w-40 bg-terracotta rounded mx-auto"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Booking Form */}
              <div className="bg-cream rounded-xl shadow-lg p-8 border border-terracotta/30">
                <h2 className="text-2xl font-serif mb-6 text-foreground">Your Stay Details</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Check-in *</label>
                    <input 
                      type="date" 
                      name="checkin" 
                      className="w-full bg-cream border border-terracotta/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" 
                      onChange={handlechange} 
                      value={checkin} 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Check-out *</label>
                    <input 
                      type="date" 
                      name="checkout" 
                      className="w-full bg-cream border border-terracotta/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" 
                      onChange={handlechange} 
                      value={checkout} 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Adults</label>
                    <select 
                      name="adults" 
                      className="w-full bg-cream border border-terracotta/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" 
                      onChange={handlechange} 
                      value={adults}
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} adult{n!==1&&'s'}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Children</label>
                    <select 
                      name="child" 
                      className="w-full bg-cream border border-terracotta/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" 
                      onChange={handlechange} 
                      value={child}
                    >
                      {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} child{n!==1&&'ren'}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Rooms *</label>
                    <select 
                      name="roomCount" 
                      className="w-full bg-cream border border-terracotta/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" 
                      onChange={(e) => setRoomCount(e.target.value)} 
                      value={roomCount}
                    >
                      <option value="">Select</option>
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} room{n!==1&&'s'}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your full name" 
                      className="w-full bg-cream border border-terracotta/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" 
                      onChange={handlechange} 
                      value={name} 
                      required 
                    />
                  </div>

                  <div className="space-y-3 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="your@email.com" 
                      className="w-full bg-cream border border-terracotta/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" 
                      onChange={handlechange} 
                      value={email} 
                    />
                  </div>

                  <div className="space-y-3 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="+123 456 7890" 
                      className="w-full bg-cream border border-terracotta/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" 
                      onChange={handlechange} 
                      value={phone} 
                    />
                  </div>
                </form>

                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handlebutton} 
                    disabled={loading}
                    className={`bg-primary hover:bg-primary/90 text-foreground font-bold uppercase tracking-widest py-4 px-10 rounded-lg transition-all shadow-lg shadow-terracotta/30 active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? "Checking Availability..." : "Check Availability"}
                  </button>
                </div>
              </div>

              {/* Booking Information */}
              <div className="space-y-8">
                <div className="bg-cream rounded-xl shadow-lg p-8 border border-terracotta/30">
                  <h3 className="text-xl font-serif mb-4 text-foreground">Why Choose Us</h3>
                  <div className="space-y-4 text-foreground/80">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span>Authentic thatched accommodation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span>Warm, personalized hospitality</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span>Traditional African charm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span>Peaceful, natural surroundings</span>
                    </div>
                  </div>
                </div>

                <div className="bg-cream rounded-xl shadow-lg p-8 border border-terracotta/30">
                  <h3 className="text-xl font-serif mb-4 text-foreground">Need Assistance?</h3>
                  <p className="text-foreground/80 mb-4">
                    Our friendly team is available to help you plan the perfect stay.
                  </p>
                  <div className="space-y-2 text-sm text-foreground/70">
                    <p><strong>Email:</strong> info@kwaterry.com</p>
                    <p><strong>Phone:</strong> +27 123 456 7890</p>
                    <p><strong>Hours:</strong> Daily 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;