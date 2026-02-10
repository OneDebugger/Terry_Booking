import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router';
import Head from 'next/head';

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
    <div className='bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 min-h-screen'>
      <Head>
        <title>Room Booking | Hotel DCrescent</title>
      </Head>
      
      <ToastContainer position="top-left" autoClose={5000} theme="light" />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-2">Book Your Stay</h1>
          <p className="text-white text-lg">Find the perfect room for your needs</p>
          <div className="h-1 w-40 bg-amber-500 rounded mx-auto mt-2"></div>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Check-in *</label>
              <input type="date" name="checkin" className="w-full p-3 border rounded-md" onChange={handlechange} value={checkin} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Check-out *</label>
              <input type="date" name="checkout" className="w-full p-3 border rounded-md" onChange={handlechange} value={checkout} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Adults</label>
              <select name="adults" className="w-full p-3 border rounded-md" onChange={handlechange} value={adults}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} adult{n!==1&&'s'}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Children</label>
              <select name="child" className="w-full p-3 border rounded-md" onChange={handlechange} value={child}>
                {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} child{n!==1&&'ren'}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Rooms *</label>
              <select name="roomCount" className="w-full p-3 border rounded-md" onChange={(e) => setRoomCount(e.target.value)} value={roomCount}>
                <option value="">Select</option>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} room{n!==1&&'s'}</option>)}
              </select>
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
              <input type="text" name="name" placeholder="Your full name" className="w-full p-3 border rounded-md" onChange={handlechange} value={name} required />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input type="email" name="email" placeholder="your@email.com" className="w-full p-3 border rounded-md" onChange={handlechange} value={email} />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
              <input type="tel" name="phone" placeholder="+123 456 7890" className="w-full p-3 border rounded-md" onChange={handlechange} value={phone} />
            </div>
          </form>

          <div className="mt-6 flex justify-center">
            <button 
              onClick={handlebutton} 
              disabled={loading}
              className={`bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-md transition transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Checking Availability..." : "Check Availability"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;