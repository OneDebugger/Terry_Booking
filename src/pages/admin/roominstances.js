git add .
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../trc/theme/theme";
import FullLayout from "../../../trc/layouts/FullLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useRouter } from "next/router";

const RoomInstances = () => {
  const router = useRouter();
  const [roomInstances, setRoomInstances] = useState([]);
  const [roomClasses, setRoomClasses] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoomInstance, setCurrentRoomInstance] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomName: '',
    roomClass: '',
    floor: 1,
    building: 'Main Building',
    wing: '',
    status: 'available',
    statusNotes: '',
    specialFeatures: [],
    customPrice: '' // Optional - empty string for optional input
  });

  useEffect(() => {
    const checkAuth = async () => {
      const myAdmin = localStorage.getItem('myAdmin');
      if (!myAdmin) {
        router.push('/admin/adminlogin');
      }
    };
    
    const fetchData = async () => {
      try {
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

        // Fetch room classes
        const classesResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getroomclasses`, {
          headers: getAuthHeaders()
        });
        const classesData = await classesResponse.json();
        setRoomClasses(classesData.data || []);

        // Fetch room instances
        const instancesResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getroominstances`, {
          headers: getAuthHeaders()
        });
        const instancesData = await instancesResponse.json();
        setRoomInstances(instancesData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    checkAuth();
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate custom price doesn't exceed room class max price
    if (name === 'customPrice' && value && formData.roomClass) {
      const selectedRoomClass = roomClasses.find(rc => rc._id === formData.roomClass);
      if (selectedRoomClass && selectedRoomClass.mrp > 0) {
        const customPrice = parseFloat(value);
        if (customPrice > selectedRoomClass.mrp) {
          toast.error(`Custom price cannot exceed room class maximum price of ₹${selectedRoomClass.mrp}`, {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return; // Don't update the form if validation fails
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const openModal = (roomInstance = null) => {
    if (roomInstance) {
      setIsEditing(true);
      setCurrentRoomInstance(roomInstance);
      setFormData({
        roomNumber: roomInstance.roomNumber,
        roomName: roomInstance.roomName || '',
        roomClass: roomInstance.roomClass._id,
        floor: roomInstance.floor || 1,
        building: roomInstance.building || 'Main Building',
        wing: roomInstance.wing || '',
        status: roomInstance.status,
        statusNotes: roomInstance.statusNotes || '',
        specialFeatures: roomInstance.specialFeatures || [],
        customPrice: roomInstance.customPrice || 0
      });
    } else {
      setIsEditing(false);
      setCurrentRoomInstance(null);
      setFormData({
        roomNumber: '',
        roomName: '',
        roomClass: '',
        floor: 1,
        building: 'Main Building',
        wing: '',
        status: 'available',
        statusNotes: '',
        specialFeatures: [],
        customPrice: 0
      });
    }
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setCurrentRoomInstance(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_HOST}/api/updateroominstance?id=${currentRoomInstance._id}`
        : `${process.env.NEXT_PUBLIC_HOST}/api/createroominstance`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(isEditing ? 'Room instance updated successfully' : 'Room instance created successfully', {
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
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getroominstances`, {
          headers: getAuthHeaders()
        });
        const data = await refreshResponse.json();
        setRoomInstances(data.data || []);
      } else {
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

  const updateStatus = async (roomId, newStatus, notes = '') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateroomstatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          newStatus,
          notes
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Room status updated to ${newStatus}`, {
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
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getroominstances`);
        const data = await refreshResponse.json();
        setRoomInstances(data.data || []);
      } else {
        toast.error(result.error || 'Failed to update room status', {
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

  const deleteRoomInstance = async (id) => {
    if (!confirm('Are you sure you want to delete this room instance?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deleteroominstance?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Room instance deleted successfully', {
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
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getroominstances`);
        const data = await refreshResponse.json();
        setRoomInstances(data.data || []);
      } else {
        toast.error(result.error || 'Failed to delete room instance', {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'clean': return 'bg-blue-100 text-blue-800';
      case 'dirty': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'out_of_order': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head>
        <title>Room Instances Management | Hotel DCrescent Admin</title>
        <meta name="description" content="Manage individual room instances and their status" />
      </Head>
      
      <ThemeProvider theme={theme}>
        <FullLayout>
          <style jsx global>{`
            footer { display: none; }
            .Navbar { display: none; }
          `}</style>

          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Room Instances</h1>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Add Room Instance
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Room Number</th>
                    <th className="px-6 py-3">Room Name</th>
                    <th className="px-6 py-3">Room Class</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roomInstances.map((roomInstance) => (
                    <tr key={roomInstance._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-lg">
                            {roomInstance.roomNumber}
                          </div>
                          {roomInstance.roomName && (
                            <div className="ml-3">
                              <div className="text-sm font-medium">{roomInstance.roomName}</div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {roomInstance.roomName || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          {roomInstance.roomClass?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div>Floor: {roomInstance.floor}</div>
                          <div>Building: {roomInstance.building}</div>
                          {roomInstance.wing && <div>Wing: {roomInstance.wing}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(roomInstance.status)}`}>
                            {roomInstance.status}
                          </span>
                          {roomInstance.statusNotes && (
                            <span className="text-xs text-gray-500 italic">
                              {roomInstance.statusNotes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-2">
                        {/* Status Management Buttons */}
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => updateStatus(roomInstance._id, 'available')}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                          >
                            Available
                          </button>
                          <button
                            onClick={() => updateStatus(roomInstance._id, 'clean')}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            Clean
                          </button>
                          <button
                            onClick={() => updateStatus(roomInstance._id, 'dirty')}
                            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                          >
                            Dirty
                          </button>
                          <button
                            onClick={() => updateStatus(roomInstance._id, 'maintenance')}
                            className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200"
                          >
                            Maintenance
                          </button>
                          <button
                            onClick={() => updateStatus(roomInstance._id, 'out_of_order')}
                            className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200"
                          >
                            Out of Order
                          </button>
                        </div>
                        
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => openModal(roomInstance)}
                            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRoomInstance(roomInstance._id)}
                            className="text-red-600 hover:text-red-900 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
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
                    {isEditing ? 'Edit Room Instance' : 'Add Room Instance'}
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
                      <label className="block text-sm font-medium text-gray-700">Room Number</label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 101, A101, Suite-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Name</label>
                      <input
                        type="text"
                        name="roomName"
                        value={formData.roomName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Presidential Suite, Ocean View Room"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Class</label>
                      <select
                        name="roomClass"
                        value={formData.roomClass}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Room Class</option>
                        {roomClasses.map((roomClass) => (
                          <option key={roomClass._id} value={roomClass._id}>
                            {roomClass.name} ({roomClass.subcategory})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Floor</label>
                      <input
                        type="number"
                        name="floor"
                        value={formData.floor}
                        onChange={handleInputChange}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Building</label>
                      <input
                        type="text"
                        name="building"
                        value={formData.building}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Main Building, East Wing"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Wing</label>
                      <input
                        type="text"
                        name="wing"
                        value={formData.wing}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., North, South, A, B"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="clean">Clean</option>
                        <option value="dirty">Dirty</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="out_of_order">Out of Order</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Custom Price (₹)</label>
                      <input
                        type="number"
                        name="customPrice"
                        value={formData.customPrice}
                        onChange={handleInputChange}
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Leave 0 for default price"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status Notes</label>
                    <textarea
                      name="statusNotes"
                      value={formData.statusNotes}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Deep cleaning required, Minor repair needed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Special Features (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.specialFeatures.join(', ')}
                      onChange={(e) => handleArrayChange('specialFeatures', e.target.value)}
                      placeholder="e.g., Balcony, Ocean view, King size bed"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
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
                      {isEditing ? 'Update' : 'Create'} Room Instance
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

export default RoomInstances;