import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router';
import Head from 'next/head';

const Booking = () => {
   const [checkin, setCheckin] = useState("");
   const [checkout, setCheckout] = useState("");
   const [adults, setAdults] = useState("");
   const [child, setChild] = useState("");
   const [room, setRoom] = useState("");
   const [product, setProduct] = useState("");
   const router = useRouter();
   
   useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getproduct`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setProduct(data);
      });
   }, [])

   const handlechange = (e) => {
      if(e.target.name == "checkin"){
         setCheckin(e.target.value)
      }
      else if(e.target.name == "checkout"){
         setCheckout(e.target.value)
      }
      else if(e.target.name == "adults"){
         setAdults(e.target.value)
      }
      else if(e.target.name == "child"){
         setChild(e.target.value)
      }
      else if(e.target.name == "room"){
         setRoom(e.target.value)
      }
   }
   
   let qty = 0;
   const handlebutton = () => {
      if(room != "" && child != "" && checkin != ""){
         product.map((item) => {
            qty = qty + item.availableQty;
         })
         if(qty > 0){
            toast.success("Congratulations! Rooms are available. You are being redirected to the booking page for further details.", {
               position: "top-left",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
            });
            router.push("/rooms")
         }
         else{
            toast.error("Some rooms are out of stock. Please check the booking page for further details!", {
               position: "top-left",
               autoClose: 1000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
            });
         }
      }
      else{
         toast.error("Please fill up the required details for booking", {
            position: "top-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
         });
      }
   }
      
  return (
    <div className='bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 min-h-screen'>
      <Head>
        <title>Room Booking | Hotel DCrescent - Reserve Your Stay</title>
        <meta name="description" content="Book your perfect room at Hotel DCrescent. Check availability, select your dates, and reserve your stay with our easy online booking system. Enjoy comfortable accommodations and exceptional service."/>
        <meta name="keywords" content="hotel booking, room reservation, check availability, book rooms, hotel DCrescent, accommodation booking, online booking, room availability" />
      </Head>
      
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-2">Book Your Stay</h1>
          <p className="text-white text-lg">Find the perfect room for your needs</p>
          <div className="h-1 w-40 bg-amber-500 rounded mx-auto mt-2"></div>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Check-in Date *</label>
              <input 
                type="date" 
                name="checkin" 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                onChange={handlechange} 
                value={checkin}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Check-out Date *</label>
              <input 
                type="date" 
                name="checkout" 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                onChange={handlechange} 
                value={checkout} 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Adults *</label>
              <select 
                name="adults" 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                onChange={handlechange} 
                value={adults}
              >
                <option value="1">No adults</option>
                <option value="1">1 adult</option>
                <option value="2">2 adults</option>
                <option value="3">3 adults</option>
                <option value="4">4 adults</option>
                <option value="5">5 adults</option>
                <option value="6">6 adults</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Children *</label>
              <select 
                name="child" 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                onChange={handlechange} 
                value={child}
              >
                <option value="1">No children</option>
                <option value="2">1 child</option>
                <option value="3">2 children</option>
                <option value="4">3 children</option>
                <option value="5">4 children</option>
                <option value="6">5 children</option>
                <option value="7">6 children</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Rooms *</label>
              <select 
                name="room" 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                onChange={handlechange} 
                value={room}
              >
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4">4 rooms</option>
                <option value="5">5 rooms</option>
                <option value="6">6 rooms</option>
              </select>
            </div>
          </form>

          <div className="mt-6 flex justify-center">
            <button 
              onClick={handlebutton} 
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              Check Availability
            </button>
          </div>

          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">* Required fields</p>
            <p className="text-sm mt-2">Once you check availability, you'll be redirected to our rooms page to complete your booking.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking