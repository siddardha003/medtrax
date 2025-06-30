import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../Redux/notification/actions';
import { getHospitalProfileApi, updateHospitalProfileApi, uploadHospitalImageApi } from '../../Api';
import './HospitalProfile.css';

const HospitalProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [hospital, setHospital] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data states
  const [basicInfo, setBasicInfo] = useState({
    closingTime: '',
    images: []
  });

  const [location, setLocation] = useState({
    latitude: '',
    longitude: ''
  });

  const [openingTimes, setOpeningTimes] = useState([
    { day: 'Monday', time: '9:00 AM - 5:00 PM' },
    { day: 'Tuesday', time: '9:00 AM - 5:00 PM' },
    { day: 'Wednesday', time: '9:00 AM - 5:00 PM' },
    { day: 'Thursday', time: '9:00 AM - 5:00 PM' },
    { day: 'Friday', time: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Closed' }
  ]);

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    category: '',
    description: '',
    image: 'https://via.placeholder.com/150',
    doctors: []
  });

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    degree: '',
    image: 'https://via.placeholder.com/150'
  });

  useEffect(() => {
    fetchHospitalProfile();
  }, []);

  const fetchHospitalProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getHospitalProfileApi();
      if (data.success) {
        setHospital(data.data.hospital);

        // Populate form data with existing values
        setBasicInfo({
          closingTime: data.data.hospital.closingTime || '',
          images: data.data.hospital.images || []
        });

        setLocation({
          latitude: data.data.hospital.location?.latitude || '',
          longitude: data.data.hospital.location?.longitude || ''
        });

        if (data.data.hospital.openingTimes?.length > 0) {
          setOpeningTimes(data.data.hospital.openingTimes);
        }

        if (data.data.hospital.services?.length > 0) {
          setServices(data.data.hospital.services);
        }
      } else {
        console.error('Error from API:', data.error);
        setError(data.error || 'Failed to load hospital profile');
        dispatch(showNotification({
          message: data.error || 'Failed to load hospital profile',
          messageType: 'error'
        }));
      }
    } catch (error) {
      console.error('Error fetching hospital profile:', error);
      
      // Create a more descriptive error message based on the response
      let errorMsg = 'Failed to load hospital profile. Please try again.';
      
      if (error.response?.status === 403 && error.response?.data?.error?.includes('hospital')) {
        errorMsg = 'Your hospital may be inactive. The system is attempting to activate it automatically. Please refresh the page in a few moments or contact the administrator if the problem persists.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Your session has expired. Please log in again.';
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      
      dispatch(showNotification({
        message: errorMsg,
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpeningTimeChange = (index, field, value) => {
    const updated = [...openingTimes];
    updated[index] = { ...updated[index], [field]: value };
    setOpeningTimes(updated);
  };

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewDoctorChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDoctor = (serviceIndex) => {
    if (!newDoctor.name || !newDoctor.degree) {
      setError('Doctor name and degree are required');
      return;
    }

    const updated = [...services];
    updated[serviceIndex].doctors.push({ ...newDoctor });
    setServices(updated);
    setNewDoctor({
      name: '',
      degree: '',
      image: 'https://via.placeholder.com/150'
    });
  };

  const addService = () => {
    if (!newService.category || !newService.description) {
      setError('Service category and description are required');
      return;
    }

    setServices(prev => [...prev, { ...newService, doctors: [] }]);
    setNewService({
      category: '',
      description: '',
      image: 'https://via.placeholder.com/150',
      doctors: []
    });
  };

  const removeService = (index) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const removeDoctor = (serviceIndex, doctorIndex) => {
    const updated = [...services];
    updated[serviceIndex].doctors = updated[serviceIndex].doctors.filter((_, i) => i !== doctorIndex);
    setServices(updated);
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    setError('');
    try {
      const { data } = await uploadHospitalImageApi(formData);
      if (data.success) {
        setBasicInfo(prev => ({
          ...prev,
          images: [...prev.images, data.data.imageUrl]
        }));
        setSuccess('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setBasicInfo(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const saveChanges = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedProfile = {
        closingTime: basicInfo.closingTime,
        images: basicInfo.images,
        openingTimes,
        services,
        location: {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude)
        }
      };

      const { data } = await updateHospitalProfileApi(updatedProfile);
      
      if (data.success) {
        setSuccess('Hospital profile updated successfully');
        dispatch(showNotification({
          message: 'Hospital profile updated successfully',
          messageType: 'success'
        }));
        setHospital(data.data.hospital);
      }
    } catch (error) {
      console.error('Error updating hospital profile:', error);
      setError('Failed to update hospital profile. Please try again.');
      dispatch(showNotification({
        message: 'Failed to update hospital profile',
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !hospital) {
    return <div className="p-4 text-center">Loading hospital profile...</div>;
  }

  if (error && !hospital) {
    return (
      <div className="hospital-profile p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold mb-2">Error Loading Hospital Profile</h3>
          <p>{error}</p>
        </div>
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Troubleshooting Steps:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Try refreshing the page</li>
            <li>Verify your hospital admin account is correctly set up</li>
            <li>Check if your hospital exists and is active in the system</li>
            <li>Contact the super admin if the problem persists</li>
          </ul>
          <button 
            onClick={fetchHospitalProfile}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hospital-profile p-4">
      <h2 className="text-2xl font-semibold mb-6">Hospital Profile</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="profile-completion mb-6">
        <h3 className="text-lg font-medium mb-2">Profile Completion Status</h3>
        <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full" 
            style={{ 
              width: `${hospital?.profileComplete ? '100%' : '50%'}`
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {hospital?.profileComplete ? 
            'Your profile is complete! Patients can now view your hospital details.' : 
            'Complete your profile to make it visible to patients.'
          }
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-4">
        <button 
          className={`px-4 py-2 ${activeSection === 'basic' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          Basic Information
        </button>
        <button 
          className={`px-4 py-2 ${activeSection === 'hours' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveSection('hours')}
        >
          Opening Hours
        </button>
        <button 
          className={`px-4 py-2 ${activeSection === 'services' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveSection('services')}
        >
          Departments & Doctors
        </button>
        <button 
          className={`px-4 py-2 ${activeSection === 'location' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveSection('location')}
        >
          Location
        </button>
      </div>

      {/* Basic Information Section */}
      {activeSection === 'basic' && (
        <div className="basic-info">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
            <input 
              type="text" 
              value={hospital?.name || ''} 
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">This was set by the super admin and cannot be changed.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              value={`${hospital?.address || ''}, ${hospital?.city || ''}, ${hospital?.state || ''} - ${hospital?.pincode || ''}`} 
              disabled
              className="w-full p-2 border rounded bg-gray-100 h-20"
            />
            <p className="text-xs text-gray-500 mt-1">Contact super admin to update address details.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
            <input 
              type="text" 
              name="closingTime"
              value={basicInfo.closingTime} 
              onChange={handleBasicInfoChange}
              placeholder="e.g., 10:00 PM"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Images</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {basicInfo.images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Hospital ${index}`} 
                    className="w-full h-32 object-cover rounded"
                  />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50">
                <span className="text-3xl text-gray-400">+</span>
                <span className="text-sm text-gray-500">Upload Image</span>
                <input 
                  type="file" 
                  onChange={uploadImage}
                  className="hidden" 
                  accept="image/*"
                  disabled={uploadingImage}
                />
              </label>
            </div>
            
            {uploadingImage && <p className="text-sm text-gray-600">Uploading image...</p>}
          </div>
        </div>
      )}

      {/* Opening Hours Section */}
      {activeSection === 'hours' && (
        <div className="opening-hours">
          <h3 className="text-lg font-medium mb-4">Opening Hours</h3>
          
          {openingTimes.map((time, index) => (
            <div key={index} className="flex mb-3 items-center">
              <div className="w-1/3">
                <span className="font-medium">{time.day}</span>
              </div>
              <div className="w-2/3">
                <input 
                  type="text" 
                  value={time.time} 
                  onChange={(e) => handleOpeningTimeChange(index, 'time', e.target.value)}
                  placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services and Doctors Section */}
      {activeSection === 'services' && (
        <div className="services-doctors">
          <h3 className="text-lg font-medium mb-4">Departments & Doctors</h3>
          
          {services.map((service, serviceIndex) => (
            <div key={serviceIndex} className="mb-6 p-4 border rounded">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{service.category}</h4>
                <button 
                  type="button"
                  onClick={() => removeService(serviceIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              <p className="text-gray-600 mb-3">{service.description}</p>
              
              <div className="mb-4">
                <h5 className="font-medium mb-2">Doctors</h5>
                {service.doctors.map((doctor, doctorIndex) => (
                  <div key={doctorIndex} className="flex items-center border-b py-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.degree}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeDoctor(serviceIndex, doctorIndex)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                {/* Add new doctor form */}
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <h6 className="font-medium mb-2">Add New Doctor</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input 
                      type="text"
                      placeholder="Doctor Name"
                      name="name"
                      value={newDoctor.name}
                      onChange={handleNewDoctorChange}
                      className="w-full p-2 border rounded"
                    />
                    <input 
                      type="text"
                      placeholder="Degree/Qualifications"
                      name="degree"
                      value={newDoctor.degree}
                      onChange={handleNewDoctorChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <input 
                    type="text"
                    placeholder="Image URL (optional)"
                    name="image"
                    value={newDoctor.image}
                    onChange={handleNewDoctorChange}
                    className="w-full p-2 border rounded mb-3"
                  />
                  <button 
                    type="button"
                    onClick={() => addDoctor(serviceIndex)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Doctor
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add new service form */}
          <div className="p-4 border rounded bg-gray-50">
            <h4 className="font-medium mb-3">Add New Department/Service</h4>
            <div className="mb-3">
              <input 
                type="text"
                placeholder="Department Name"
                name="category"
                value={newService.category}
                onChange={handleNewServiceChange}
                className="w-full p-2 border rounded mb-3"
              />
              <textarea 
                placeholder="Description"
                name="description"
                value={newService.description}
                onChange={handleNewServiceChange}
                className="w-full p-2 border rounded mb-3 h-20"
              />
              <input 
                type="text"
                placeholder="Image URL (optional)"
                name="image"
                value={newService.image}
                onChange={handleNewServiceChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button 
              type="button"
              onClick={addService}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Department
            </button>
          </div>
        </div>
      )}

      {/* Location Section */}
      {activeSection === 'location' && (
        <div className="location">
          <h3 className="text-lg font-medium mb-4">Hospital Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input 
                type="text" 
                name="latitude"
                value={location.latitude} 
                onChange={handleLocationChange}
                placeholder="e.g., 17.4065"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input 
                type="text" 
                name="longitude"
                value={location.longitude} 
                onChange={handleLocationChange}
                placeholder="e.g., 78.4772"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            You can find your hospital's coordinates using Google Maps. Right-click on your hospital location and select "What's here?" to get the latitude and longitude.
          </p>
        </div>
      )}

      <div className="mt-6">
        <button 
          type="button"
          onClick={saveChanges}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default HospitalProfile;
