import React from 'react'
import RoomClass from '../../models/RoomClass';
import mongoose from 'mongoose';
import Link from 'next/link';
import Head from 'next/head';

const Rooms = ({roomClasses}) => {
  return (
    <div className='bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900'>
      <Head>
        <title>Luxurious Rooms for Unforgettable Stays | Hotel DCrescent</title>
        <meta name="description" content='Discover our exquisite selection of luxurious rooms designed for unparalleled comfort and relaxation. Book your dream accommodation and experience exceptional hospitality.'/>
        <meta name="keywords" content="hotel booking, accommodation, online reservations, seamless service, delightful stay, convenient hospitality, vacation getaway, top-rated hotel, comfortable accommodations, memorable retreat" />
      </Head>
      
      <div className='text-white h-16 flex items-center navfont'>
        <h1 className='sm:text-2xl text-xl font-bold mx-8 navfont'>Our Room Classes</h1>
      </div>
      <div className='h-1 w-60 bg-blue-500 rounded mb-8'></div>
      
      <div className='flex justify-center items-center flex-wrap'>
        {roomClasses && roomClasses.map((roomClass) => (
          <Link key={roomClass._id} href={`/roomclassselection?class=${roomClass.slug}`}>
            <div className="relative m-4 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-blue-800 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900 shadow-md">
              <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                <img className="object-cover w-full h-full" src={roomClass.image || "/room-2.jpg"} alt={roomClass.name} />
                <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
                  {roomClass.discount ? `${roomClass.discount}% OFF` : 'Special Offer'}
                </span>
              </div>
              <div className="mt-4 px-5 pb-5">
                <h5 className="text-xl tracking-tight text-slate-200">{roomClass.name}</h5>
                <p className="text-sm text-slate-300 mt-2">{roomClass.description}</p>

                <div className="mt-4 mb-5 flex items-center justify-between">
                  <p>
                    <span className="text-2xl font-bold text-slate-200">₹{roomClass.price}</span>
                    {roomClass.mrp && (
                      <span className="text-sm text-slate-400 line-through ml-2">₹{roomClass.mrp}</span>
                    )}
                  </p>
                  <div className="flex items-center">
                    <span className="mr-2 rounded bg-yellow-200 px-2 py-0.5 text-xs font-semibold">4.8</span>
                  </div>
                </div>
                
                <div className="text-xs text-slate-300">
                  <p>Capacity: {roomClass.capacity} guests</p>
                  <p>Features: {roomClass.features?.join(', ') || 'Comfortable amenities'}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(!roomClasses || roomClasses.length === 0) && (
        <div className="text-center py-12">
          <p className="text-white text-lg">No rooms available at the moment. Please check back later or contact us for assistance.</p>
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  
  try {
    const roomClasses = await RoomClass.find({});
    return {
      props: { 
        roomClasses: JSON.parse(JSON.stringify(roomClasses)) 
      },
    };
  } catch (error) {
    console.error('Error fetching room classes:', error);
    return {
      props: { 
        roomClasses: [] 
      },
    };
  }
}

export default Rooms