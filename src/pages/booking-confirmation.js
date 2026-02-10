import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

const BookingConfirmation = () => {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Get booking data from localStorage or router query
    const bookingData = localStorage.getItem('bookingData');
    if (bookingData) {
      try {
        const parsedData = JSON.parse(bookingData);
        setBookingDetails(parsedData);
        localStorage.removeItem('bookingData'); // Clear after use
      } catch (error) {
        console.error('Error parsing booking data:', error);
        router.push('/booking');
      }
    } else {
      // Fallback to router query if available
      if (router.query.bookingConfirmed) {
        setBookingDetails({
          checkin: router.query.checkin,
          checkout: router.query.checkout,
          roomsRequested: router.query.roomsRequested,
          totalPrice: router.query.totalPrice,
          name: router.query.name
        });
      } else {
        router.push('/booking');
      }
    }
  }, [router]);

  // Auto-redirect to home page after 3 seconds
  useEffect(() => {
    if (bookingDetails) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [bookingDetails, router]);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-white mt-4">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <Head>
        <title>Booking Confirmed | Hotel DCrescent</title>
        <meta name="description" content="Your booking has been confirmed at Hotel DCrescent. Thank you for choosing us for your stay." />
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
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for choosing Hotel DCrescent</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div className="text-left">
                <span className="font-semibold">Guest Name:</span>
                <p className="text-sm mt-1">{bookingDetails.name || 'N/A'}</p>
              </div>
              <div className="text-left">
                <span className="font-semibold">Check-in:</span>
                <p className="text-sm mt-1">{new Date(bookingDetails.checkin).toLocaleDateString()}</p>
              </div>
              <div className="text-left">
                <span className="font-semibold">Check-out:</span>
                <p className="text-sm mt-1">{new Date(bookingDetails.checkout).toLocaleDateString()}</p>
              </div>
              <div className="text-left">
                <span className="font-semibold">Rooms:</span>
                <p className="text-sm mt-1">{bookingDetails.roomsRequested}</p>
              </div>
              <div className="text-left col-span-2">
                <span className="font-semibold">Total Amount:</span>
                <p className="text-sm mt-1 text-green-600 font-semibold">₹{bookingDetails.totalPrice || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800 text-sm">
              📞 <strong>Important:</strong> Please note your booking reference and contact us if you need to make any changes.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              🌟 <strong>Redirecting:</strong> You will be automatically redirected to the home page in a moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
