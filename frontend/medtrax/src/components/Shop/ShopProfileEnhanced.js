import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../Redux/notification/actions';
import * as ShopApi from '../../Api/index';

const ShopProfileEnhanced = ({ shopProfile, onProfileUpdate }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    // Basic Information (matches MedicalshopDetails.jsx)
    name: '',
    closingTime: '',
    location: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    directionsLink: '',
    
    // Images (exact format expected by frontend)
    images: [],
    
    // Services (exact structure: array of {category, items: [{name, price, availability}]})
    services: [],
    
    // Opening Times (exact format: array of {day, time})
    openingTimes: [
      { day: 'Monday', time: '' },
      { day: 'Tuesday', time: '' },
      { day: 'Wednesday', time: '' },
      { day: 'Thursday', time: '' },
      { day: 'Friday', time: '' },
      { day: 'Saturday', time: '' },
      { day: 'Sunday', time: '' }
    ],
    
    // Map Information (exact format: {name, latitude, longitude})
    selectedMedicalshop: {
      name: '',
      latitude: '',
      longitude: ''
    }
  });

  // Temporary states for adding new items
  const [newImage, setNewImage] = useState('');
  const [newService, setNewService] = useState({
    category: '',
    items: [{ name: '', price: '', availability: 'In Stock' }]
  });

  useEffect(() => {
    if (shopProfile) {
      setFormData({
        name: shopProfile.name || '',
        closingTime: shopProfile.closingTime || '',
        location: shopProfile.location || '',
        phone: shopProfile.phone || '',
        email: shopProfile.email || '',
        address: shopProfile.address || '',
        city: shopProfile.city || '',
        state: shopProfile.state || '',
        pincode: shopProfile.pincode || '',
        directionsLink: shopProfile.directionsLink || '',
        images: shopProfile.images || [],
        services: shopProfile.services || [],
        openingTimes: shopProfile.openingTimes || [
          { day: 'Monday', time: '' },
          { day: 'Tuesday', time: '' },
          { day: 'Wednesday', time: '' },
          { day: 'Thursday', time: '' },
          { day: 'Friday', time: '' },
          { day: 'Saturday', time: '' },
          { day: 'Sunday', time: '' }
        ],
        selectedMedicalshop: shopProfile.selectedMedicalshop || {
          name: '',
          latitude: '',
          longitude: ''
        }
      });
    }
  }, [shopProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleOpeningTimeChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      openingTimes: prev.openingTimes.map((item, i) => 
        i === index ? { ...item, time: value } : item
      )
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addServiceItem = () => {
    setNewService(prev => ({
      ...prev,
      items: [...prev.items, { name: '', price: '', availability: 'In Stock' }]
    }));
  };

  const updateServiceItem = (index, field, value) => {
    setNewService(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeServiceItem = (index) => {
    setNewService(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (newService.category.trim() && newService.items.some(item => item.name.trim())) {
      const validItems = newService.items.filter(item => item.name.trim());
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, { ...newService, items: validItems }]
      }));
      setNewService({
        category: '',
        items: [{ name: '', price: '', availability: 'In Stock' }]
      });
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await ShopApi.updateShopProfileApi(formData);
      if (data.success) {
        dispatch(showNotification({
          message: 'Shop profile updated successfully!',
          messageType: 'success'
        }));
        setShowModal(false);
        if (onProfileUpdate) {
          onProfileUpdate(data.data.shop);
        }
      } else {
        dispatch(showNotification({
          message: data.error || 'Failed to update profile',
          messageType: 'error'
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch(showNotification({
        message: 'Failed to update profile. Please try again.',
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Enhanced Shop Profile</h2>
            <p className="text-sm text-gray-600">Manage your complete shop information</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Edit Enhanced Profile
          </button>
        </div>
      </div>

      {/* Profile Display */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Shop Name</label>
              <p className="text-gray-900">{formData.name || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Closing Time</label>
              <p className="text-gray-900">{formData.closingTime || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-gray-900">{formData.location || 'Not specified'}</p>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Services</h3>
            {formData.services.length > 0 ? (
              <div className="space-y-2">
                {formData.services.map((service, index) => (
                  <div key={index} className="border rounded p-3">
                    <h4 className="font-medium text-gray-800">{service.category}</h4>
                    <div className="mt-2 space-y-1">
                      {service.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm text-gray-600 flex justify-between">
                          <span>{item.name}</span>
                          <span>₹{item.price} - {item.availability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No services added yet</p>
            )}
          </div>
        </div>

        {/* Opening Times */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Opening Times</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.openingTimes.map((time, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-700">{time.day}</div>
                <div className="text-sm text-gray-600">{time.time || 'Closed'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        {formData.images.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Shop Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Shop ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/150/150';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Enhanced Shop Profile</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'basic', name: 'Basic Info', icon: '🏪' },
                    { id: 'services', name: 'Services', icon: '🛍️' },
                    { id: 'hours', name: 'Hours', icon: '🕐' },
                    { id: 'images', name: 'Images', icon: '📸' },
                    { id: 'location', name: 'Location', icon: '📍' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                      <input
                        type="time"
                        name="closingTime"
                        value={formData.closingTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Near Central Mall, Main Street"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Directions Link</label>
                      <input
                        type="url"
                        name="directionsLink"
                        value={formData.directionsLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="space-y-6">
                    {/* Existing Services */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Current Services</h4>
                      {formData.services.map((service, index) => (
                        <div key={index} className="border rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-800">{service.category}</h5>
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>                            <div className="space-y-2">
                              {service.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex justify-between items-center text-sm">
                                  <span>{item.name}</span>
                                  <span>₹{item.price} - {item.availability}</span>
                                </div>
                              ))}
                            </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Service */}
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Service</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
                          <select
                            value={newService.category}
                            onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select a category</option>
                            <option value="Prescription Medicines">Prescription Medicines</option>
                            <option value="OTC Medicines">OTC Medicines</option>
                            <option value="Health Supplements">Health Supplements</option>
                            <option value="Medical Devices">Medical Devices</option>
                            <option value="Baby Care">Baby Care</option>
                            <option value="Elderly Care">Elderly Care</option>
                            <option value="Ointments & Creams">Ointments & Creams</option>
                            <option value="Home Delivery">Home Delivery</option>
                            <option value="Online Consultation">Online Consultation</option>
                          </select>
                          <input
                            type="text"
                            value={newService.category}
                            onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Or enter custom category name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Service Items</label>
                          {newService.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Service name"
                                value={item.name}
                                onChange={(e) => updateServiceItem(index, 'name', e.target.value)}
                                className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                              <input
                                type="number"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => updateServiceItem(index, 'price', e.target.value)}
                                className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                              <select
                                value={item.availability}
                                onChange={(e) => updateServiceItem(index, 'availability', e.target.value)}
                                className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="In Stock">In Stock</option>
                                <option value="Limited Stock">Limited Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="Available">Available</option>
                                <option value="24/7 Available">24/7 Available</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => removeServiceItem(index)}
                                className="px-2 py-1 text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={addServiceItem}
                              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              Add Item
                            </button>
                            <button
                              type="button"
                              onClick={addService}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Add Service
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hours Tab */}
                {activeTab === 'hours' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Opening Hours</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.openingTimes.map((time, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <label className="w-20 text-sm font-medium text-gray-700">{time.day}</label>
                          <input
                            type="text"
                            value={time.time}
                            onChange={(e) => handleOpeningTimeChange(index, e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 9:00 AM - 9:00 PM"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Shop Images</h4>
                    
                    {/* Current Images */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Shop ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/150/150';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add New Image */}
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter image URL"
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Image
                      </button>
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Map Location</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                        <input
                          type="text"
                          name="selectedMedicalshop.name"
                          value={formData.selectedMedicalshop.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Display name for map"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input
                          type="number"
                          name="selectedMedicalshop.latitude"
                          value={formData.selectedMedicalshop.latitude}
                          onChange={handleInputChange}
                          step="any"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 28.6139"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input
                          type="number"
                          name="selectedMedicalshop.longitude"
                          value={formData.selectedMedicalshop.longitude}
                          onChange={handleInputChange}
                          step="any"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 77.2090"
                        />
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>💡 Tip: You can get coordinates from Google Maps by right-clicking on your location.</p>
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopProfileEnhanced;
