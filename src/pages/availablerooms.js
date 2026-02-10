import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import Link from 'next/link';

const AvailableRooms = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [roomClassData, setRoomClassData] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});

  useEffect(() => {
    // Get booking details from router query (passed from booking page)
    if (router.query.checkin && router.query.checkout && router.query.adults && router.query.roomCount) {
      const details = {
        checkin: router.query.checkin,
        checkout: router.query.checkout,
        adults: parseInt(router.query.adults) || 0,
        children: parseInt(router.query.child) || 0,
        roomsRequested: parseInt(router.query.roomCount) || 1,
        roomClassId: router.query.roomClassId,
        email: router.query.email || '',
        phone: router.query.phone || ''
      };
      
      setBookingDetails(details);
      
      // Use the room class data passed from booking page
      const roomClassData = router.query.roomClass ? JSON.parse(router.query.roomClass) : null;
      
      if (roomClassData) {
        // Store room class data in state for later use
        setRoomClassData(roomClassData);
      } else {
        // Fallback: redirect back to booking
        router.push('/booking');
      }
    } else {
      // Redirect back to booking page if no details
      router.push('/booking');
    }
  }, [router.query]);

  // New useEffect to fetch availability when bookingDetails is available
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!bookingDetails || !roomClassData) {
        return;
      }
      
      try {
        const availabilityResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/public/checkroomavailability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkin: bookingDetails.checkin,
            checkout: bookingDetails.checkout,
            roomClassId: roomClassData._id,
            roomCount: bookingDetails.roomsRequested
          })
        });
        
        const availabilityResult = await availabilityResponse.json();
        
        if (availabilityResponse.ok && availabilityResult.success) {
          // Prepare available rooms data with real instances
          const availableRoomsData = [{
            _id: roomClassData._id,
            title: roomClassData.name || roomClassData.title || 'Room Class',
            price: roomClassData.basePrice || roomClassData.mrp || 300,
            capacity: roomClassData.capacity?.adults || 2,
            maxOccupancy: roomClassData.capacity?.adults + roomClassData.capacity?.children || 4,
            amenities: roomClassData.amenities || ['WiFi', 'TV', 'AC'],
            images: roomClassData.images || ['/room-2.jpg'],
            totalAvailable: availabilityResult.availableCount || 0,
            availableInstances: availabilityResult.availableRooms || []
          }];
          
          setAvailableRooms(availableRoomsData);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error fetching availability data:', error);
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [bookingDetails, roomClassData]);

  // Ensure clean initial state when rooms load
  useEffect(() => {
    if (availableRooms.length > 0) {
      setSelectedRooms({}); // Clear any pre-selected rooms
    }
  }, [availableRooms]);

  const handleRoomSelection = (roomClassId, instanceId) => {
    if (!instanceId) return; // Guard against missing IDs

    setSelectedRooms(prev => {
      const newSelection = { ...prev };
      
      // 1. If already selected, deselect it (toggle)
      if (newSelection[instanceId]) {
        delete newSelection[instanceId];
        return newSelection;
      }

      // 2. If selecting a new room and we already have a selection, clear it first
      // This ensures only one room can be selected at a time
      const currentSelections = Object.keys(newSelection);
      if (currentSelections.length > 0) {
        // Clear all existing selections
        currentSelections.forEach(id => {
          delete newSelection[id];
        });
      }

      // 3. Add the new selection (Key: Instance ID, Value: true)
      return {
        ...newSelection,
        [instanceId]: true
      };
    });
  };

  const getTotalSelectedRooms = () => {
    return Object.values(selectedRooms).filter(id => id !== undefined).length;
  };

  const calculateTotalPrice = () => {
    if (!bookingDetails) return 0;
    const nights = Math.ceil((new Date(bookingDetails.checkout) - new Date(bookingDetails.checkin)) / (1000 * 60 * 60 * 24));
    
    // Iterate through the selected instance IDs
    return Object.entries(selectedRooms).reduce((total, [instanceId, isSelected]) => {
      if (isSelected) {
        // Find the room class and instance to get the price
        const roomClass = availableRooms.find(r => r._id === bookingDetails.roomClassId);
        const instance = roomClass?.availableInstances.find(i => i._id === instanceId);
        const price = instance?.customPrice || roomClass?.price || 0;
        return total + (price * nights);
      }
      return total;
    }, 0);
  };

  const handleBookNow = async () => {
    const totalSelected = getTotalSelectedRooms();
    
    if (totalSelected === 0) {
      toast.error('Please select at least one room');
      return;
    }

    if (totalSelected !== bookingDetails.roomsRequested) {
      toast.error(`Please select exactly ${bookingDetails.roomsRequested} room(s)`);
      return;
    }

      // Prepare booking data
      const bookingData = {
        roomClassId: bookingDetails.roomClassId,
        checkinDate: bookingDetails.checkin,
        checkoutDate: bookingDetails.checkout,
        guestName: bookingDetails.name || 'Guest',
        guestEmail: bookingDetails.email,
        guestPhone: bookingDetails.phone,
        adults: bookingDetails.adults,
        children: bookingDetails.children,
        paymentMethod: 'cash',
        deposit: 0,
        notes: '',
        specialRequests: '',
        roomIds: Object.keys(selectedRooms) // This sends the specific room instances
      };

    try {
      setLoading(true);
      
      // Create booking directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/createbooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Booking confirmed! Your reservation has been created.', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        // Redirect to booking confirmation or home page
        router.push('/booking-confirmation');
      } else {
        toast.error(result.error || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-white mt-4">Finding available rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <Head>
        <title>Available Rooms | Hotel DCrescent - Your Perfect Stay</title>
        <meta name="description" content="View available rooms at Hotel DCrescent. Check real-time availability, compare room types, and book your perfect accommodation with ease." />
        <meta name="keywords" content="available rooms, room availability, hotel booking, room selection, book rooms online, hotel DCrescent" />
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

        {/* Selected Rooms Summary */}
        {getTotalSelectedRooms() > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Selected Rooms: {getTotalSelectedRooms()} / {bookingDetails?.roomsRequested}</h3>
            <p className="text-gray-600">Total Price: ₹{calculateTotalPrice()}</p>
          </div>
        )}

        {/* Available Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {availableRooms.length > 0 ? (
            availableRooms.map((room) => (
              <div key={room._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={room.images[0] || '/room-2.jpg'} 
                    alt={room.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {room.totalAvailable} Available
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{room.title}</h3>
                      <p className="text-gray-600 mt-1">{room.capacity} guests • {room.maxOccupancy} max occupancy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-amber-500">₹{room.price}</p>
                      <p className="text-gray-500 text-sm">per night</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Amenities:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {room.amenities.slice(0, 4).map((amenity, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Room Instances:</h4>
                      <div className="space-y-2">
                        {room.availableInstances.map((instance) => {
                          // FIX: Check what ID field the instance actually has
                          const instanceId = instance._id || instance.id || instance.roomNumber;
                          const isSelected = instanceId && selectedRooms[instanceId] === true;
                          
                          return (
                            <button
                              key={instanceId || Math.random()} // Use the actual ID field
                              onClick={() => {
                                console.log('🏠 Room selected:', {
                                  roomClassId: room._id,
                                  instanceId: instanceId,
                                  roomNumber: instance.roomNumber,
                                  currentSelections: Object.keys(selectedRooms)
                                });
                                handleRoomSelection(room._id, instanceId);
                              }}
                              className={`w-full p-2 text-left rounded border-2 transition-colors ${
                                isSelected 
                                  ? 'border-amber-500 bg-amber-50 text-amber-700' 
                                  : 'border-gray-200 hover:border-amber-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <img 
                                    src={instance.image || '/room-2.jpg'} 
                                    alt={`Room ${instance.roomNumber}`}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                  <span className="font-medium">Room {instance.roomNumber}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold text-gray-700">
                                    ₹{instance.customPrice || room.price}
                                  </div>
                                  <span className={`text-xs ${isSelected ? 'text-amber-600' : 'text-gray-500'}`}>
                                    {isSelected ? 'Selected' : 'Available'}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {getTotalSelectedRooms()} of {bookingDetails?.roomsRequested} rooms selected
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Rooms Available</h3>
              <p className="text-gray-600 mb-6">
                We're sorry, but there are no rooms available for your selected dates.
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
        {availableRooms.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex space-x-4">
            <button
              onClick={() => router.push('/booking')}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
            >
              Back to Booking
            </button>
            <button
              onClick={handleBookNow}
              disabled={getTotalSelectedRooms() !== (bookingDetails?.roomsRequested || 0)}
              className={`px-8 py-3 font-semibold rounded-md transition duration-300 ${
                getTotalSelectedRooms() === (bookingDetails?.roomsRequested || 0)
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Book Now - ₹{calculateTotalPrice()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;