import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import Link from 'next/link';

const RoomClassSelection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roomClasses, setRoomClasses] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [availabilityData, setAvailabilityData] = useState({});

  useEffect(() => {
    console.log('🔄 Room Class Selection page loaded - checking for booking data...');
    console.log('📥 Router query received:', router.query);
    
    // Get booking details from router query (passed from booking page)
    if (router.query.checkin && router.query.checkout && router.query.adults && router.query.roomCount) {
      console.log('✅ Booking data found in query parameters');
      
      const details = {
        checkin: router.query.checkin,
        checkout: router.query.checkout,
        adults: parseInt(router.query.adults) || 0,
        children: parseInt(router.query.child) || 0,
        roomsRequested: parseInt(router.query.roomCount) || 1,
        email: router.query.email || '',
        phone: router.query.phone || '',
        name: router.query.name || ''
      };
      
      console.log('📋 Booking Details Received:', details);
      
      setBookingDetails(details);
      
      // Fetch all room classes
      fetchRoomClasses(details);
    } else {
      console.log('❌ Missing required booking parameters, redirecting back to booking...');
      // Redirect back to booking page if no details
      router.push('/booking');
    }
  }, [router.query]);

  const fetchRoomClasses = async (details) => {
    try {
      // Fetch all room classes
      const roomClassesResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/public/getroomclasses`);
      const roomClassesResult = await roomClassesResponse.json();
      
      if (roomClassesResponse.ok && roomClassesResult.success) {
        console.log('🏨 Room classes fetched:', roomClassesResult.data.length);
        setRoomClasses(roomClassesResult.data || []);
        
        // Check availability for each room class
        await checkAllAvailability(details, roomClassesResult.data || []);
      } else {
        console.log('❌ Failed to fetch room classes');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error fetching room classes:', error);
      setLoading(false);
    }
  };

  const checkAllAvailability = async (details, roomClasses) => {
    const availabilityPromises = roomClasses.map(async (roomClass) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/public/checkroomavailability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkin: details.checkin,
            checkout: details.checkout,
            roomClassId: roomClass._id,
            roomCount: details.roomsRequested
          })
        });
        
        const result = await response.json();
        
        return {
          roomClassId: roomClass._id,
          availableCount: result.success ? result.availableCount : 0,
          totalPrice: result.success ? result.totalPrice : 0,
          nights: result.success ? result.nights : 0,
          availableRooms: result.success ? result.availableRooms : []
        };
      } catch (error) {
        console.error('❌ Error checking availability for room class:', roomClass._id, error);
        return {
          roomClassId: roomClass._id,
          availableCount: 0,
          totalPrice: 0,
          nights: 0,
          availableRooms: []
        };
      }
    });

    const availabilityResults = await Promise.all(availabilityPromises);
    
    // Convert to object for easy lookup
    const availabilityMap = {};
    availabilityResults.forEach(result => {
      availabilityMap[result.roomClassId] = result;
    });
    
    console.log('📊 Availability data for all room classes:', availabilityMap);
    setAvailabilityData(availabilityMap);
    setLoading(false);
  };

  const handleRoomClassSelect = (roomClass) => {
    const availability = availabilityData[roomClass._id];
    
    if (availability && availability.availableCount >= bookingDetails.roomsRequested) {
      console.log('✅ Proceeding with room class:', roomClass.title);
      
      // Redirect to available rooms for this specific room class
      router.push({
        pathname: '/availablerooms',
        query: {
          checkin: bookingDetails.checkin,
          checkout: bookingDetails.checkout,
          adults: bookingDetails.adults,
          child: bookingDetails.children,
          email: bookingDetails.email,
          phone: bookingDetails.phone,
          name: bookingDetails.name,
          roomCount: bookingDetails.roomsRequested,
          roomClassId: roomClass._id,
          roomClass: JSON.stringify(roomClass),
          nights: availability.nights,
          totalPrice: availability.totalPrice
        }
      });
    } else {
      toast.error(`Not enough rooms available. Only ${availability?.availableCount || 0} room(s) available.`);
    }
  };

  const getAvailabilityStatus = (roomClassId) => {
    const availability = availabilityData[roomClassId];
    if (!availability) return { status: 'checking', count: 0 };
    
    if (availability.availableCount >= (bookingDetails?.roomsRequested || 1)) {
      return { status: 'available', count: availability.availableCount };
    } else {
      return { status: 'unavailable', count: availability.availableCount };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-white mt-4">Finding available room classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <Head>
        <title>Select Room Class | Hotel DCrescent - Choose Your Perfect Stay</title>
        <meta name="description" content="Choose from our available room classes at Hotel DCrescent. Compare amenities, pricing, and availability to find your perfect accommodation." />
        <meta name="keywords" content="room classes, room selection, hotel room types, choose room, hotel DCrescent" />
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
        {/* Booking Details Header */}
        {bookingDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-gray-600">
              <div>
                <span className="font-semibold">Check-in:</span>
                <p className="text-sm">{new Date(bookingDetails.checkin).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-semibold">Check-out:</span>
                <p className="text-sm">{new Date(bookingDetails.checkout).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-semibold">Adults:</span>
                <p className="text-sm">{bookingDetails.adults}</p>
              </div>
              <div>
                <span className="font-semibold">Children:</span>
                <p className="text-sm">{bookingDetails.children}</p>
              </div>
              <div>
                <span className="font-semibold">Rooms:</span>
                <p className="text-sm">{bookingDetails.roomsRequested}</p>
              </div>
            </div>
          </div>
        )}

        {/* Room Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {roomClasses.length > 0 ? (
            roomClasses.map((roomClass) => {
              const availability = getAvailabilityStatus(roomClass._id);
              const isAvailable = availability.status === 'available';
              
              return (
                <div key={roomClass._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={roomClass.images[0] || '/room-2.jpg'} 
                      alt={roomClass.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      isAvailable 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {isAvailable 
                        ? `${availability.count} Available` 
                        : `${availability.count} Available`
                      }
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{roomClass.name || roomClass.title}</h3>
                        <p className="text-gray-600 mt-1">{roomClass.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-amber-500">₹{roomClass.basePrice || 0}</p>
                        <p className="text-gray-500 text-sm">per night</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Amenities:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {roomClass.amenities?.slice(0, 4).map((amenity, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Room Details:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                            Capacity: {roomClass.capacity?.adults || 2} adults
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                            Max occupancy: {roomClass.capacity?.adults + roomClass.capacity?.children || 4}
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                            Size: {roomClass.size || 'Standard'}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {isAvailable 
                          ? `Perfect! ${availability.count} room(s) available for your dates`
                          : `Sorry, only ${availability.count} room(s) available. You need ${bookingDetails.roomsRequested}.`
                        }
                      </div>
                      <button
                        onClick={() => handleRoomClassSelect(roomClass)}
                        disabled={!isAvailable}
                        className={`px-6 py-3 font-semibold rounded-md transition duration-300 ${
                          isAvailable
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? 'Select This Class' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Room Classes Available</h3>
              <p className="text-gray-600 mb-6">
                We're sorry, but there are no room classes available for your selected dates.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/booking')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
                >
                  Try Different Dates
                </button>
                <Link href="/contactus">
                  <button className="border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-50 transition duration-300">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {roomClasses.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex space-x-4">
            <button
              onClick={() => router.push('/booking')}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
            >
              Back to Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomClassSelection;