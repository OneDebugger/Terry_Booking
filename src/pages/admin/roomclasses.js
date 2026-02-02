import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../trc/theme/theme";
import FullLayout from "../../../trc/layouts/FullLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useRouter } from "next/router";

const RoomClasses = () => {
  const router = useRouter();
  const [roomClasses, setRoomClasses] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoomClass, setCurrentRoomClass] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'room',
    subcategory: 'deluxe',
    capacity: {
      adults: 2,
      children: 0
    },
    basePrice: 0,
    mrp: 0,
    discountPercent: 0,
    amenities: [],
    features: [],
    bedType: 'king',
    roomSize: '',
    view: '',
    images: [],
    totalInventory: 1,
    minStay: 1,
    maxStay: 30,
    checkInTime: '14:00',
    checkOutTime: '11:00'
  });

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const headers = {};
    const myAdmin = localStorage.getItem('myAdmin');
    let token = null;
    if (myAdmin) {
      try {
        const adminData = JSON.parse(myAdmin);
        token = adminData.token;
      } catch (error) {
        console.error('Failed to parse admin data:', error);
      }
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const myAdmin = localStorage.getItem('myAdmin');
      if (!myAdmin) {
        router.push('/admin/adminlogin');
      }
    };
    
    const fetchRoomClasses = async () => {
      try {
        const headers = getAuthHeaders();
        console.log('📡 Fetching room classes with headers:', headers);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getroomclasses`, {
          headers: headers
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response status text:', response.statusText);
        
        const responseJson = await response.json();
        console.log('📥 Response data:', responseJson);
        
        setRoomClasses(responseJson.data || []);
      } catch (error) {
        console.error('💥 Error fetching room classes:', error);
        setRoomClasses([]);
      }
    };

    checkAuth();
    fetchRoomClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCapacityChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [field]: parseInt(value)
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: file.name,
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const openModal = (roomClass = null) => {
    if (roomClass) {
      setIsEditing(true);
      setCurrentRoomClass(roomClass);
      setFormData({
        name: roomClass.name,
        slug: roomClass.slug,
        description: roomClass.description,
        category: roomClass.category,
        subcategory: roomClass.subcategory,
        capacity: roomClass.capacity,
        basePrice: roomClass.basePrice,
        mrp: roomClass.mrp,
        discountPercent: roomClass.discountPercent,
        amenities: roomClass.amenities,
        features: roomClass.features,
        bedType: roomClass.bedType,
        roomSize: roomClass.roomSize,
        view: roomClass.view,
        images: roomClass.images || [],
        totalInventory: roomClass.totalInventory,
        minStay: roomClass.minStay,
        maxStay: roomClass.maxStay,
        checkInTime: roomClass.checkInTime,
        checkOutTime: roomClass.checkOutTime
      });
    } else {
      setIsEditing(false);
      setCurrentRoomClass(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        category: 'room',
        subcategory: 'deluxe',
        capacity: { adults: 2, children: 0 },
        basePrice: 0,
        mrp: 0,
        discountPercent: 0,
        amenities: [],
        features: [],
        bedType: 'king',
        roomSize: '',
        view: '',
        images: [],
        totalInventory: 1,
        minStay: 1,
        maxStay: 30,
        checkInTime: '14:00',
        checkOutTime: '11:00'
      });
    }
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setCurrentRoomClass(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📝 Form data:', formData);
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_HOST}/api/updateroomclass?id=${currentRoomClass._id}`
        : `${process.env.NEXT_PUBLIC_HOST}/api/createroomclass`;

      console.log('📡 API URL:', url);
      console.log('📡 HTTP Method:', method);

      // Prepare data for API
      const dataToSend = {
        ...formData,
        capacity: formData.capacity,
        amenities: formData.amenities,
        features: formData.features
      };

      console.log('📤 Data to send:', dataToSend);

      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      };

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(dataToSend)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response status text:', response.statusText);

      const result = await response.json();
      console.log('📥 Response data:', result);

      if (result.success) {
        console.log('✅ SUCCESS: Room class created/updated successfully');
        toast.success(isEditing ? 'Room class updated successfully' : 'Room class created successfully', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        closeModal();
        // Refresh the list
        const headers = getAuthHeaders();
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getroomclasses`, {
          headers: headers
        });
        const responseJson = await refreshResponse.json();
        setRoomClasses(responseJson.data || []);
      } else {
        console.log('❌ FAILED: Room class creation/update failed');
        console.log('❌ Error:', result.error);
        toast.error(result.error || 'Something went wrong', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error('💥 ERROR in form submission:', error);
      console.error('💥 Error details:', error.message);
      toast.error('An error occurred. Please try again.', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const deleteRoomClass = async (id) => {
    if (!confirm('Are you sure you want to delete this room class? This will also delete all associated room instances.')) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deleteroomclass?id=${id}`, {
        method: 'DELETE',
        headers: headers
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Room class deleted successfully', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        // Refresh the list
        const headers = getAuthHeaders();
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getroomclasses`, {
          headers: headers
        });
        const responseJson = await refreshResponse.json();
        setRoomClasses(responseJson.data || []);
      } else {
        toast.error(result.error || 'Failed to delete room class', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Room Classes Management | Hotel DCrescent Admin</title>
        <meta name="description" content="Manage room classes and templates for your hotel booking system" />
      </Head>
      
      <ThemeProvider theme={theme}>
        <FullLayout>
          <style jsx global>{`
            footer { display: none; }
            .Navbar { display: none; }
          `}</style>

          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Room Classes</h1>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Add Room Class
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Capacity</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Inventory</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roomClasses.map((roomClass) => (
                    <tr key={roomClass._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center">
                          {roomClass.images && roomClass.images.length > 0 && (
                            <img 
                              src={roomClass.images[0].url} 
                              alt={roomClass.name}
                              className="w-10 h-10 rounded mr-3 object-cover"
                            />
                          )}
                          <div>
                            <div className="font-semibold">{roomClass.name}</div>
                            <div className="text-sm text-gray-500">{roomClass.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {roomClass.subcategory}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {roomClass.capacity.adults} adults, {roomClass.capacity.children} children
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-green-600 font-semibold">
                          ₹{roomClass.basePrice}
                        </div>
                        {roomClass.discountPercent > 0 && (
                          <div className="text-red-500 line-through text-sm">
                            ₹{roomClass.mrp}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          {roomClass.totalInventory} rooms
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          roomClass.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {roomClass.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => openModal(roomClass)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRoomClass(roomClass._id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {isEditing ? 'Edit Room Class' : 'Add Room Class'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="deluxe">Deluxe</option>
                        <option value="executive">Executive</option>
                        <option value="family">Family</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bed Type</label>
                      <select
                        name="bedType"
                        value={formData.bedType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="king">King</option>
                        <option value="queen">Queen</option>
                        <option value="twin">Twin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">View</label>
                      <input
                        type="text"
                        name="view"
                        value={formData.view}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Adults Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity.adults}
                        onChange={(e) => handleCapacityChange('adults', e.target.value)}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Children Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity.children}
                        onChange={(e) => handleCapacityChange('children', e.target.value)}
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Inventory</label>
                      <input
                        type="number"
                        name="totalInventory"
                        value={formData.totalInventory}
                        onChange={handleInputChange}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Base Price (₹)</label>
                      <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleInputChange}
                        min="0"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">MRP (₹)</label>
                      <input
                        type="number"
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleInputChange}
                        min="0"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                      <input
                        type="number"
                        name="discountPercent"
                        value={formData.discountPercent}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Size (sqm)</label>
                      <input
                        type="number"
                        name="roomSize"
                        value={formData.roomSize}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-in Time</label>
                      <input
                        type="time"
                        name="checkInTime"
                        value={formData.checkInTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-out Time</label>
                      <input
                        type="time"
                        name="checkOutTime"
                        value={formData.checkOutTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.amenities.join(', ')}
                      onChange={(e) => handleArrayChange('amenities', e.target.value)}
                      placeholder="Wi-Fi, AC, TV, etc."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.features.join(', ')}
                      onChange={(e) => handleArrayChange('features', e.target.value)}
                      placeholder="Balcony, Ocean view, etc."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image.url} alt={image.alt} className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {isEditing ? 'Update' : 'Create'} Room Class
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </FullLayout>
      </ThemeProvider>

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
    </>
  );
};

export default RoomClasses;