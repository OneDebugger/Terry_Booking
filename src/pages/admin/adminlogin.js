import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

const AdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const router = useRouter();

    // Check if user is already logged in
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const myAdmin = localStorage.getItem('myAdmin');
            if (myAdmin) {
                try {
                    const adminData = JSON.parse(myAdmin);
                    if (adminData && adminData.token) {
                        router.push('/admin');
                    }
                } catch (error) {
                    console.log('Invalid admin data in localStorage');
                }
            }
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!email || !password) {
            toast.error('Please fill in all fields', {
                position: 'top-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light'
            });
            return;
        }

        setLoading(true);

        try {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toast.error('Please enter a valid email address', {
                    position: 'top-left',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light'
                });
                setLoading(false);
                return;
            }

            const data = {
                email,
                password
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/adminlogin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            setLoading(false);

            if (response.ok && result.success) {
                toast.success('Logged in successfully', {
                    position: 'top-left',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light'
                });

                // Store admin data securely
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myAdmin', JSON.stringify({
                        token: result.token,
                        email: result.email
                    }));
                }

                // Redirect to admin dashboard
                setTimeout(() => {
                    router.push('/admin');
                }, 1000);

            } else {
                const errorMessage = result.error || result.message || 'Invalid credentials';
                toast.error(errorMessage, {
                    position: 'top-left',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light'
                });
            }

        } catch (error) {
            setLoading(false);
            console.error('Login error:', error);
            toast.error('Something went wrong! Please try again after some time.', {
                position: 'top-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light'
            });
        }
    };

    return (
        <div>
            <Head>
                <title>Login into admin panel | Manage Reservations and Culinary Services</title>
                <meta name="description" content="Effortlessly manage reservations and streamline culinary services with our Hotel Booking and Food Delivery Admin Panel. Take control of bookings, track orders, and ensure seamless operations for your hotel and food delivery services. Simplify your administrative tasks and optimize your hospitality and dining experiences with our comprehensive admin panel." />
                <meta name="keywords" content="hotel booking, food delivery, accommodation, online reservations, gourmet dining, seamless service, delightful stay, convenient hospitality, doorstep delivery, culinary experience, vacation getaway, top-rated hotel, comfortable accommodations, exquisite cuisine, memorable retreat" />
            </Head>

            {loading && (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
                </div>
            )}

            {!loading && (
                <div className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-white min-h-screen">
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

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="m-auto">
                            <Image 
                                alt="logo"
                                src="/cresentlogo.png"
                                width={180}
                                height={60}
                                className="m-auto"
                            />
                        </div>
                        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Admin Login
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form 
                            className="space-y-6" 
                            onSubmit={handleSubmit}
                            method="POST"
                        >
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={handleChange}
                                        value={email}
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 p-2"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <Link 
                                            href="/admin/adminforgot" 
                                            className="font-semibold text-amber-600 hover:text-amber-500"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        onChange={handleChange}
                                        value={password}
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 p-2"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 ${
                                        loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-500'
                                    }`}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogin;