import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../Redux/user/actions';
import { showNotification } from '../../Redux/notification/actions';
import * as ShopApi from '../../Api/index';
// import ShopProfileEnhanced from './ShopProfileEnhanced';

const ShopDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.user || {});

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStockProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    pageVisits: 0,
    contactClicks: 0
  });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    prescriptionRequired: ''
  });

  // Shop profile state
  const [shopProfile, setShopProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);
  
  // Unified shop profile state (no redundancy, matches backend schema)
  const [profileFormData, setProfileFormData] = useState({
    // Basic Information
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
    images: [],
    services: [],
    openingTimes: [
      { day: 'Monday', time: '8:00 AM - 10:00 PM' },
      { day: 'Tuesday', time: '8:00 AM - 10:00 PM' },
      { day: 'Wednesday', time: '8:00 AM - 10:00 PM' },
      { day: 'Thursday', time: '8:00 AM - 10:00 PM' },
      { day: 'Friday', time: '8:00 AM - 10:00 PM' },
      { day: 'Saturday', time: '8:00 AM - 10:00 PM' },
      { day: 'Sunday', time: '9:00 AM - 9:00 PM' }
    ],
    selectedMedicalshop: {
      name: '',
      latitude: '',
      longitude: ''
    },
    // Add any additional fields from ShopProfileEnhanced here:
    gstNumber: '',
    registrationNumber: '',
    ownerPhone: '',
    ownerEmail: '',
    website: '',
    logo: '',
    isActive: true
  });

  // --- PATCH: Add Latitude and Longitude fields to profile modal ---
  // Add these fields to your shop profile modal/form JSX:
  // ...existing profile fields...

  // ...rest of your profile modal JSX...

  // Form data for inventory items
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    manufacturer: '',
    price: '',
    costPrice: '',
    stock: '',
    minStockLevel: '',
    maxStockLevel: '',
    sku: '',
    prescriptionRequired: false,
    expiryDate: '',
    batchNumber: '',
    image: '' // Add image field for service items
  });

  const categories = [
    'prescription_medicines', 'otc_medicines', 'medical_devices', 'surgical_instruments',
    'health_supplements', 'baby_care', 'elderly_care', 'first_aid',
    'diagnostic_kits', 'medical_consumables', 'ayurvedic', 'homeopathic'
  ];

  // Define stock status options for UI display and filtering
  // eslint-disable-next-line no-unused-vars
  const stockStatuses = [
    { value: 'in_stock', label: 'In Stock', color: 'text-green-600' },
    { value: 'low_stock', label: 'Low Stock', color: 'text-yellow-600' },
    { value: 'out_of_stock', label: 'Out of Stock', color: 'text-red-600' }
  ];
  // Helper functions
  const getStockStatus = useCallback((item) => {
    const currentStock = item.quantity?.current || item.stock || 0;
    const minStock = item.quantity?.minimum || item.minStockLevel || 0;

    if (currentStock === 0) return 'out_of_stock';
    if (currentStock <= minStock) return 'low_stock';
    return 'in_stock';
  }, []);

  const getStockColor = (status) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow;
  };

  // Calculate derived data
  const lowStockItems = inventory.filter(item => getStockStatus(item) === 'low_stock' || getStockStatus(item) === 'out_of_stock');
  const expiringItems = inventory.filter(item => isExpiringSoon(item.expiryDate));
  const totalValue = inventory.reduce((sum, item) => {
    const currentStock = item.quantity?.current || item.stock || 0;
    const price = item.pricing?.sellingPrice || item.price || 0;
    return sum + (price * currentStock);
  }, 0);

  // Data fetching functions
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      // Since we might not have a specific stats API, calculate from inventory
      const { data } = await ShopApi.getInventoryApi({ limit: 1000 });
      if (data.success) {
        const allItems = data.data.items || [];
        const inStock = allItems.filter(item => getStockStatus(item) === 'in_stock').length;
        const lowStock = allItems.filter(item => getStockStatus(item) === 'low_stock').length;
        const outOfStock = allItems.filter(item => getStockStatus(item) === 'out_of_stock').length;

        setStats({
          totalProducts: allItems.length,
          inStockProducts: inStock,
          lowStockProducts: lowStock,
          outOfStockProducts: outOfStock,
          pageVisits: Math.floor(Math.random() * 1000) + 500, // Simulated data
          contactClicks: Math.floor(Math.random() * 100) + 50 // Simulated data
        });
      } else {
        dispatch(showNotification({
          message: 'Failed to fetch statistics',
          messageType: 'error'
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      dispatch(showNotification({
        message: 'Unable to load shop statistics. Please try again.',
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  }, [dispatch, getStockStatus]);

  const fetchInventoryPreview = useCallback(async () => {
    try {
      const { data } = await ShopApi.getInventoryApi({ limit: 5 });
      if (data.success) {
        setInventory(data.data.items?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Error fetching inventory preview:', error);
    }
  }, []);

  // Service management functions
  const fetchShopServices = useCallback(async () => {
    try {
      const { data } = await ShopApi.getShopServicesApi();
      if (data.success) {
        setShopProfile(prev => ({
          ...prev,
          services: data.data.services || []
        }));
      }
    } catch (error) {
      console.error('Error fetching shop services:', error);
      dispatch(showNotification({
        message: 'Failed to load services',
        messageType: 'error'
      }));
    }
  }, [dispatch]);

  const addServiceCategory = async (category, items) => {
    try {
      const { data } = await ShopApi.addServiceCategoryApi({ category, items });
      if (data.success) {
        dispatch(showNotification({
          message: 'Service category added successfully',
          messageType: 'success'
        }));
        // Refresh services
        await fetchShopServices();
        return true;
      }
    } catch (error) {
      console.error('Error adding service category:', error);
      dispatch(showNotification({
        message: error.response?.data?.error || 'Failed to add service category',
        messageType: 'error'
      }));
      return false;
    }
  };

  const updateServiceCategory = async (categoryIndex, category, items) => {
    try {
      const { data } = await ShopApi.updateServiceCategoryApi(categoryIndex, { category, items });
      if (data.success) {
        dispatch(showNotification({
          message: 'Service category updated successfully',
          messageType: 'success'
        }));
        // Refresh services
        await fetchShopServices();
        return true;
      }
    } catch (error) {
      console.error('Error updating service category:', error);
      dispatch(showNotification({
        message: error.response?.data?.error || 'Failed to update service category',
        messageType: 'error'
      }));
      return false;
    }
  };

  const deleteServiceCategory = async (categoryIndex) => {
    try {
      const { data } = await ShopApi.deleteServiceCategoryApi(categoryIndex);
      if (data.success) {
        dispatch(showNotification({
          message: 'Service category deleted successfully',
          messageType: 'success'
        }));
        // Refresh services
        await fetchShopServices();
        return true;
      }
    } catch (error) {
      console.error('Error deleting service category:', error);
      dispatch(showNotification({
        message: error.response?.data?.error || 'Failed to delete service category',
        messageType: 'error'
      }));
      return false;
    }
  };



  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        category: filters.category,
        stockStatus: filters.stockStatus,
        prescriptionRequired: filters.prescriptionRequired,
        limit: 100
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const { data } = await ShopApi.getInventoryApi(params);
      if (data.success) {
        setInventory(data.data.items || []);
      } else {
        dispatch(showNotification({
          message: 'Failed to fetch inventory',
          messageType: 'error'
        }));
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      dispatch(showNotification({
        message: 'Unable to load inventory. Please try again.',
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, dispatch]);

  const fetchAnalytics = useCallback(async () => {
    // Analytics tab was removed, this function is kept for compatibility
    console.log('Analytics tab was removed');
  }, []);

  // Shop profile management functions
  const fetchShopProfile = useCallback(async () => {
    try {
      const { data } = await ShopApi.getShopProfileApi();
      if (data.success) {
        setShopProfile(data.data.shop);
        // Merge shop profile fields, using defaults for missing values
        const shop = data.data.shop || {};
        setProfileFormData({
          name: shop.name || '',
          closingTime: shop.closingTime || '',
          location: shop.location || '',
          phone: shop.phone || '',
          email: shop.email || '',
          address: shop.address || '',
          city: shop.city || '',
          state: shop.state || '',
          pincode: shop.pincode || '',
          directionsLink: shop.directionsLink || '',
          images: shop.images || [],
          services: shop.services || [],
          openingTimes: Array.isArray(shop.openingTimes) && shop.openingTimes.length === 7
            ? shop.openingTimes
            : [
              { day: 'Monday', time: '8:00 AM - 10:00 PM' },
              { day: 'Tuesday', time: '8:00 AM - 10:00 PM' },
              { day: 'Wednesday', time: '8:00 AM - 10:00 PM' },
              { day: 'Thursday', time: '8:00 AM - 10:00 PM' },
              { day: 'Friday', time: '8:00 AM - 10:00 PM' },
              { day: 'Saturday', time: '8:00 AM - 10:00 PM' },
              { day: 'Sunday', time: '9:00 AM - 9:00 PM' }
            ],
          selectedMedicalshop: shop.selectedMedicalshop || { name: '', latitude: '', longitude: '' },
          // Additional fields from ShopProfileEnhanced
          gstNumber: shop.gstNumber || '',
          registrationNumber: shop.registrationNumber || '',
          ownerName: shop.ownerName || '',
          ownerPhone: shop.ownerPhone || '',
          ownerEmail: shop.ownerEmail || '',
          website: shop.website || '',
          logo: shop.logo || '',
          isActive: typeof shop.isActive === 'boolean' ? shop.isActive : true
        });
      }
    } catch (error) {
      console.error('Error fetching shop profile:', error);
      dispatch(showNotification({
        message: 'Unable to load shop profile',
        messageType: 'error'
      }));
    }
  }, [dispatch]);

  const handleDeactivateShop = async () => {
    if (!window.confirm(`Are you sure you want to ${shopProfile?.isActive ? 'deactivate' : 'activate'} this shop?`)) {
      return;
    }

    setLoading(true);
    try {
      // Toggle the status: send the opposite of the current value
      const newStatus = !shopProfile?.isActive;
      const { data } = await ShopApi.updateShopStatusApi(newStatus);
      if (data.success) {
        setShopProfile(prev => ({ ...prev, isActive: data.data.shop.isActive }));
        dispatch(showNotification({
          message: `Shop ${data.data.shop.isActive ? 'activated' : 'deactivated'} successfully!`,
          messageType: 'success'
        }));
      } else {
        throw new Error(data.error || 'Failed to update shop status');
      }
    } catch (error) {
      // Enhanced error logging for debugging
      console.error('Error updating shop status:', error);
      if (error.response) {
        console.error('Backend response:', error.response);
        if (error.response.data) {
          console.error('Backend error data:', error.response.data);
        }
      }
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to update shop status';
      dispatch(showNotification({
        message: errorMsg,
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  // Image upload function following Hospital pattern
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      console.log('Uploading image:', file.name);
      const response = await ShopApi.uploadShopImageApi(formData);
      console.log('Upload response:', response);
      
      const { data } = response;
      if (data && data.success) {
        // Get the secure_url from Cloudinary
        const cloudinaryUrl = data.data.secure_url || data.data.url || data.data.imageUrl;
        
        if (!cloudinaryUrl) {
          console.error('No URL found in response:', data.data);
          dispatch(showNotification({
            message: 'Failed to get image URL from server. Please try again.',
            messageType: 'error'
          }));
          return;
        }
        
        // Ensure the URL has a proper protocol
        let finalUrl = cloudinaryUrl;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          // If it's a relative URL from our server, make it absolute
          const baseUrl = window.location.origin;
          finalUrl = baseUrl + (finalUrl.startsWith('/') ? '' : '/') + finalUrl;
        }
        
        console.log('Image uploaded with URL:', finalUrl);
        
        setProfileFormData(prev => ({
          ...prev,
          images: [...prev.images, finalUrl]
        }));
        
        dispatch(showNotification({
          message: 'Image uploaded successfully',
          messageType: 'success'
        }));
        
        // Log success with the URL for verification
        console.log('Image URL after processing:', finalUrl);
      } else {
        console.error('Upload response was not successful:', data);
        dispatch(showNotification({
          message: 'Server response indicates upload was not successful. Please try again.',
          messageType: 'error'
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', error.response?.data || 'No error details available');
      dispatch(showNotification({
        message: 'Failed to upload image. Please try again.',
        messageType: 'error'
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  // Service item image upload function
  const handleServiceImageUpload = async (file, itemIndex) => {
    const formData = new FormData();
    formData.append('image', file);

    setUploadingServiceImage(true);
    try {
      console.log('Uploading service image:', file.name);
      const response = await ShopApi.uploadShopImageApi(formData);
      console.log('Service image upload response:', response);
      
      const { data } = response;
      if (data && data.success) {
        // Get the secure_url from Cloudinary
        const cloudinaryUrl = data.data.secure_url || data.data.url || data.data.imageUrl;
        
        if (!cloudinaryUrl) {
          console.error('No URL found in response:', data.data);
          dispatch(showNotification({
            message: 'Failed to get image URL from server. Please try again.',
            messageType: 'error'
          }));
          return;
        }
        
        // Ensure the URL has a proper protocol
        let finalUrl = cloudinaryUrl;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          // If it's a relative URL from our server, make it absolute
          const baseUrl = window.location.origin;
          finalUrl = baseUrl + (finalUrl.startsWith('/') ? '' : '/') + finalUrl;
        }
        
        console.log('Service image uploaded with URL:', finalUrl);
        
        // Update the service item with the image URL
        const newItems = [...(profileFormData.newServiceItems || [])];
        if (newItems[itemIndex]) {
          newItems[itemIndex].image = finalUrl;
          setProfileFormData(prev => ({
            ...prev,
            newServiceItems: newItems
          }));
        }
        
        dispatch(showNotification({
          message: 'Service image uploaded successfully',
          messageType: 'success'
        }));
        
        console.log('Service image URL after processing:', finalUrl);
      } else {
        console.error('Upload response was not successful:', data);
        dispatch(showNotification({
          message: 'Server response indicates upload was not successful. Please try again.',
          messageType: 'error'
        }));
      }
    } catch (error) {
      console.error('Error uploading service image:', error);
      console.error('Error details:', error.response?.data || 'No error details available');
      dispatch(showNotification({
        message: 'Failed to upload service image. Please try again.',
        messageType: 'error'
      }));
    } finally {
      setUploadingServiceImage(false);
    }
  };

  // Remove an image from shop profile
  const removeImage = (index) => {
    setProfileFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // --- PATCH: Ensure location is always sent as GeoJSON object ---
    // Validate required fields
    if (!profileFormData.name || !profileFormData.phone || !profileFormData.email || !profileFormData.address || !profileFormData.city || !profileFormData.state || !profileFormData.pincode) {
      dispatch(showNotification({
        message: 'Please fill all required fields.',
        messageType: 'error'
      }));
      return;
    }

    // Validate and build GeoJSON location
    let location = profileFormData.location;
    let lat, lng;
    if (location && typeof location === 'object' && location.type === 'Point' && Array.isArray(location.coordinates)) {
      lat = location.coordinates[1];
      lng = location.coordinates[0];
    } else if (typeof location === 'string' && location.includes(',')) {
      const parts = location.split(',').map(s => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        if (Math.abs(parts[0]) <= 90 && Math.abs(parts[1]) <= 180) {
          lat = parts[0];
          lng = parts[1];
        } else {
          lng = parts[0];
          lat = parts[1];
        }
      }
    } else if (
      profileFormData.selectedMedicalshop &&
      profileFormData.selectedMedicalshop.latitude &&
      profileFormData.selectedMedicalshop.longitude
    ) {
      lat = parseFloat(profileFormData.selectedMedicalshop.latitude);
      lng = parseFloat(profileFormData.selectedMedicalshop.longitude);
    }

    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
      dispatch(showNotification({
        message: 'Please provide valid latitude and longitude for shop location.',
        messageType: 'error'
      }));
      return;
    }

    const geoLocation = {
      type: 'Point',
      coordinates: [lng, lat]
    };

    // Prepare payload
    const payload = {
      ...profileFormData,
      location: geoLocation,
      openingTimes: profileFormData.openingTimes
    };

    console.log('🚀 FRONTEND - Sending payload:', JSON.stringify(payload, null, 2));
    console.log('🚀 FRONTEND - Services in payload:', {
      servicesType: typeof payload.services,
      servicesIsArray: Array.isArray(payload.services),
      servicesLength: payload.services ? payload.services.length : 'N/A',
      servicesContent: payload.services
    });

    setLoading(true);
    try {
      const { data } = await ShopApi.updateShopProfileApi(payload);
      if (data.success) {
        setShopProfile(data.data.shop);
        setShowProfileModal(false);
        dispatch(showNotification({
          message: 'Shop profile updated successfully!',
          messageType: 'success'
        }));
      } else {
        dispatch(showNotification({
          message: data.error || 'Failed to update profile',
          messageType: 'error'
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch(showNotification({
        message: 'Failed to update profile',
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  // Unified input handler for all profile fields
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('openingTimes.')) {
      // openingTimes.0.time
      const [, idx, field] = name.split('.');
      setProfileFormData(prev => ({
        ...prev,
        openingTimes: prev.openingTimes.map((item, i) =>
          i === Number(idx) ? { ...item, [field]: value } : item
        )
      }));
    } else if (name.startsWith('selectedMedicalshop.')) {
      const sub = name.split('.')[1];
      setProfileFormData(prev => ({
        ...prev,
        selectedMedicalshop: {
          ...prev.selectedMedicalshop,
          [sub]: value
        }
      }));
    } else if (name === 'images' || name === 'services') {
      // Expecting array input (handled elsewhere)
      setProfileFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setProfileFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  // Form validation
  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push('Product name is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.manufacturer.trim()) errors.push('Manufacturer is required');
    if (!formData.sku.trim()) errors.push('SKU is required');
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.push('Valid price is required');
    }
    if (!formData.costPrice || isNaN(formData.costPrice) || parseFloat(formData.costPrice) <= 0) {
      errors.push('Valid cost price is required');
    }
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.push('Valid stock quantity is required');
    }
    if (!formData.minStockLevel || isNaN(formData.minStockLevel) || parseInt(formData.minStockLevel) < 0) {
      errors.push('Valid minimum stock level is required');
    }
    if (!formData.expiryDate) errors.push('Expiry date is required');

    return errors;
  };

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      dispatch(showNotification(validationErrors.join('. '), 'error'));
      return;
    }
    setLoading(true);
    try {
      // Map frontend category to backend enum
      const categoryMapping = {
        'PRESCRIPTION MEDICINES': 'prescription_drug',
        'OTC MEDICINES': 'otc_drug',
        'MEDICAL DEVICES': 'medical_device',
        'SURGICAL INSTRUMENTS': 'surgical_instrument',
        'HEALTH SUPPLEMENTS': 'health_supplement',
        'BABY CARE': 'baby_care',
        'ELDERLY CARE': 'elderly_care',
        'FIRST AID': 'first_aid',
        'DIAGNOSTIC KITS': 'diagnostic_kit',
        'MEDICAL CONSUMABLES': 'medical_consumables',
        'AYURVEDIC': 'ayurvedic',
        'HOMEOPATHIC': 'homeopathic'
      };

      const productData = {
        name: formData.name.trim(),
        category: categoryMapping[formData.category] || formData.category.toLowerCase().replace(/\s+/g, '_'),
        description: formData.description.trim(),
        manufacturer: formData.manufacturer.trim(),
        sku: formData.sku.trim(),
        batchNumber: formData.batchNumber.trim(),
        unit: 'piece', // Add default unit
        pricing: {
          costPrice: parseFloat(formData.costPrice),
          sellingPrice: parseFloat(formData.price),
          mrp: parseFloat(formData.price) * 1.1 // Default MRP as 110% of selling price
        }, quantity: {
          current: parseInt(formData.stock),
          minimum: parseInt(formData.minStockLevel),
          maximum: parseInt(formData.maxStockLevel) || parseInt(formData.minStockLevel) * 10
        },
        prescriptionRequired: formData.prescriptionRequired,
        expiryDate: formData.expiryDate
        // Backend will use req.user.shopId automatically
      };

      console.log('📦 Sending product data:', productData);
      console.log('👤 Current user info:', userInfo);

      let response;
      if (editingProduct) {
        response = await ShopApi.updateInventoryItemApi(editingProduct._id, productData);
        if (response.data.success) {
          setInventory(inventory.map(item =>
            item._id === editingProduct._id ? response.data.data.item : item
          ));
          dispatch(showNotification('Product updated successfully!', 'success'));
        }
      } else {
        response = await ShopApi.addInventoryItemApi(productData);
        if (response.data.success) {
          setInventory([response.data.data.item, ...inventory]);
          dispatch(showNotification('Product added successfully!', 'success'));
        }
      }

      if (!response.data.success) {
        dispatch(showNotification(response.data.error || 'Failed to save product', 'error'));
      } else {
        resetForm();
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error saving product:', error);
      dispatch(showNotification(error.response?.data?.error || error.message || 'Failed to save product', 'error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      manufacturer: product.manufacturer || '',
      sku: product.sku || '',
      price: (product.pricing?.sellingPrice || product.price || '').toString(),
      costPrice: (product.pricing?.costPrice || product.costPrice || '').toString(),
      stock: (product.quantity?.current || product.stock || '').toString(),
      minStockLevel: (product.quantity?.minimum || product.minStockLevel || '').toString(),
      maxStockLevel: (product.quantity?.maximum || product.maxStockLevel || '').toString(),
      prescriptionRequired: product.prescriptionRequired || false,
      expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
      batchNumber: product.batchNumber || ''
    });
    setShowAddForm(true);
  };
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      const { data } = await ShopApi.deleteInventoryItemApi(productId);
      if (data.success) {
        setInventory(inventory.filter(item => item._id !== productId));
        dispatch(showNotification('Product deleted successfully!', 'success'));
        fetchStats(); // Refresh stats
      } else {
        dispatch(showNotification('Failed to delete product', 'error'));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      dispatch(showNotification('Failed to delete product', 'error'));
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    setLoading(true);
    try {
      const product = inventory.find(item => item._id === productId);
      if (!product) {
        dispatch(showNotification('Product not found', 'error'));
        return;
      } const updatedData = {
        quantity: {
          current: newStock,
          minimum: product.quantity?.minimum || product.minStockLevel || 0,
          maximum: product.quantity?.maximum || product.maxStockLevel || newStock * 2
        }
      }
      const { data } = await ShopApi.updateInventoryItemApi(productId, updatedData);
      if (data.success) {
        setInventory(inventory.map(item =>
          item._id === productId ? data.data.item : item
        ));
        dispatch(showNotification('Stock updated successfully!', 'success'));
        fetchStats(); // Refresh stats
      } else {
        dispatch(showNotification('Failed to update stock', 'error'));
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      dispatch(showNotification('Failed to update stock', 'error'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      manufacturer: '',
      sku: '',
      price: '',
      costPrice: '',
      stock: '',
      minStockLevel: '',
      maxStockLevel: '',
      prescriptionRequired: false,
      expiryDate: '',
      batchNumber: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleLogout = async () => {
    console.log('Shop admin logout clicked');
    try {
      const result = await dispatch(logOut());
      if (result && result.success) {
        dispatch(showNotification({
          message: result.message || 'Logged out successfully',
          messageType: 'success'
        }));
      }
      navigate('/');
    } catch (error) {
      dispatch(showNotification({
        message: 'Logout failed',
        messageType: 'error'
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // useEffects for data fetching
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
      fetchInventoryPreview();
      fetchShopProfile();
    } else if (activeTab === 'inventory') {
      fetchShopServices();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab, fetchStats, fetchInventory, fetchAnalytics, fetchInventoryPreview, fetchShopProfile, fetchShopServices]);

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventory();
    }
  }, [filters, searchQuery, activeTab, fetchInventory]);

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = !searchQuery ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesStock = !filters.stockStatus || getStockStatus(item) === filters.stockStatus;
    const matchesPrescription = !filters.prescriptionRequired ||
      item.prescriptionRequired.toString() === filters.prescriptionRequired;

    return matchesSearch && matchesCategory && matchesStock && matchesPrescription;
  });

  // Inline editing state
  const [editingServiceIdx, setEditingServiceIdx] = useState(null);
  const [editingItemIdx, setEditingItemIdx] = useState(null);
  const [inlineEditServiceName, setInlineEditServiceName] = useState('');
  const [inlineEditItem, setInlineEditItem] = useState({ name: '', price: '', availability: 'Available', image: '' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {shopProfile?.name ? shopProfile.name : 'Shop Dashboard'}
              </h1>
              <p className="text-gray-600">
                Welcome, {shopProfile?.ownerName || userInfo?.name || 'Shop Admin'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Edit Shop
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: '📊' },
              { id: 'profile', name: 'Profile', icon: '🏪' },
              { id: 'inventory', name: 'Inventory', icon: '📦' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">�</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                    <p className="text-2xl font-bold text-gray-900">{expiringItems.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Page Visits</h3>
                <div className="text-3xl font-bold text-blue-600">{stats.pageVisits}</div>
                <p className="text-sm text-gray-600 mt-2">This month</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Clicks</h3>
                <div className="text-3xl font-bold text-green-600">{stats.contactClicks}</div>
                <p className="text-sm text-gray-600 mt-2">This month</p>
              </div>
            </div>

            {/* Alerts */}
            {(lowStockItems.length > 0 || expiringItems.length > 0) && (
              <div className="space-y-4">
                {lowStockItems.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{lowStockItems.length} items are running low on stock:</p>
                          <ul className="mt-1 list-disc list-inside">
                            {lowStockItems.slice(0, 3).map(item => (
                              <li key={item._id}>{item.name} ({item.stock} left)</li>
                            ))}
                            {lowStockItems.length > 3 && <li>...and {lowStockItems.length - 3} more</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {expiringItems.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Expiry Alert</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>{expiringItems.length} items are expiring within 30 days:</p>
                          <ul className="mt-1 list-disc list-inside">
                            {expiringItems.slice(0, 3).map(item => (
                              <li key={item._id}>
                                {item.name} (expires {new Date(item.expiryDate).toLocaleDateString()})
                              </li>
                            ))}
                            {expiringItems.length > 3 && <li>...and {expiringItems.length - 3} more</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Inventory */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Inventory</h2>
              </div>
              <div className="p-6">
                {inventory.length === 0 ? (
                  <p className="text-gray-500 text-center">No inventory items found. Add your first item!</p>
                ) : (
                  <div className="space-y-3">
                    {inventory.slice(0, 5).map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.manufacturer} • ₹{item.price}</div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockColor(getStockStatus(item))}`}>
                            {item.stock} units
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.category.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Shop Status Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Shop Status</h2>
                  <p className="text-gray-600">Manage your shop's availability to customers</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${shopProfile?.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {shopProfile?.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={handleDeactivateShop}
                    disabled={loading || !shopProfile}
                    className={`px-4 py-2 rounded-lg font-medium text-white ${shopProfile?.isActive
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                      } disabled:opacity-50`}
                  >
                    {shopProfile?.isActive ? 'Deactivate Shop' : 'Activate Shop'}
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  {shopProfile?.isActive
                    ? '✅ Your shop is currently visible to customers and accepting orders.'
                    : '❌ Your shop is currently hidden from customers. Activate to start receiving orders.'
                  }
                </p>
              </div>
            </div>

            {/* Shop Profile Information (moved opening hours to Enhanced Profile) */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Shop Profile</h2>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              {shopProfile ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Shop Name</h3>
                      <p className="text-lg font-semibold text-gray-900">{shopProfile.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                      <p className="text-lg text-gray-900">{shopProfile.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                      <p className="text-lg text-gray-900">{shopProfile.email}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                      <p className="text-lg text-gray-900">
                        {shopProfile.address}, {shopProfile.city}, {shopProfile.state} - {shopProfile.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading shop profile...</p>
                </div>
              )}
            </div>

            {/* ShopProfileEnhanced removed: unified profile logic is now in this component. */}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Service/Item List UI */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Services & Items</h2>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                  onClick={() => setShowAddForm(true)}
                >
                  Add Service
                </button>
              </div>
              {shopProfile?.services && shopProfile.services.length > 0 ? (
                shopProfile.services.map((service, sIdx) => (
                  <div key={sIdx} className="mb-6 border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      {editingServiceIdx === sIdx && editingItemIdx === null ? (
                        <input
                          type="text"
                          value={inlineEditServiceName}
                          onChange={e => setInlineEditServiceName(e.target.value)}
                          onBlur={async () => {
                            if (inlineEditServiceName.trim() && inlineEditServiceName !== service.category) {
                              const success = await updateServiceCategory(sIdx, inlineEditServiceName, service.items);
                              if (!success) {
                                // Revert on failure
                                setInlineEditServiceName(service.category);
                              }
                            }
                            setEditingServiceIdx(null);
                          }}
                          onKeyDown={async e => {
                            if (e.key === 'Enter') {
                              if (inlineEditServiceName.trim() && inlineEditServiceName !== service.category) {
                                const success = await updateServiceCategory(sIdx, inlineEditServiceName, service.items);
                                if (!success) {
                                  // Revert on failure
                                  setInlineEditServiceName(service.category);
                                }
                              }
                              setEditingServiceIdx(null);
                            }
                          }}
                          className="text-xl font-semibold text-gray-800 border-b border-gray-400 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="text-xl font-semibold text-gray-800 cursor-pointer"
                          onClick={() => {
                            setEditingServiceIdx(sIdx);
                            setEditingItemIdx(null);
                            setInlineEditServiceName(service.category);
                          }}
                        >
                          {service.category}
                        </div>
                      )}
                      <button
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={async () => {
                          const success = await deleteServiceCategory(sIdx);
                          if (!success) {
                            // Don't remove from UI if backend call failed
                            return;
                          }
                        }}
                      >Remove Service</button>
                    </div>
                    <div className="space-y-2">
                      {service.items && service.items.length > 0 ? (
                        service.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center justify-between bg-gray-50 rounded p-2">
                            {editingServiceIdx === sIdx && editingItemIdx === iIdx ? (
                              <div className="flex items-center gap-3 w-full">
                                <input
                                  type="text"
                                  value={inlineEditItem.name}
                                  onChange={e => setInlineEditItem(prev => ({ ...prev, name: e.target.value }))}
                                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Item Name"
                                />
                                <input
                                  type="number"
                                  value={inlineEditItem.price}
                                  onChange={e => setInlineEditItem(prev => ({ ...prev, price: e.target.value }))}
                                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Price"
                                />
                                <select
                                  value={inlineEditItem.availability}
                                  onChange={e => setInlineEditItem(prev => ({ ...prev, availability: e.target.value }))}
                                  className="w-32 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="Available">Available</option>
                                  <option value="Limited Stock">Limited Stock</option>
                                  <option value="Out of Stock">Out of Stock</option>
                                  <option value="24/7 Available">24/7 Available</option>
                                </select>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setInlineEditItem(prev => ({ ...prev, image: reader.result }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="w-32"
                                />
                                {inlineEditItem.image && (
                                  <img src={inlineEditItem.image} alt="preview" className="w-10 h-10 object-cover rounded" />
                                )}
                                <button
                                  className="text-green-600 hover:text-green-800 text-xs"
                                  onClick={async () => {
                                    const updatedItems = [...service.items];
                                    updatedItems[iIdx] = { ...inlineEditItem };
                                    const success = await updateServiceCategory(sIdx, service.category, updatedItems);
                                    if (!success) {
                                      // Revert on failure
                                      setInlineEditItem(service.items[iIdx]);
                                    }
                                    setEditingItemIdx(null);
                                  }}
                                >Save</button>
                                <button
                                  className="text-gray-600 hover:text-gray-800 text-xs"
                                  onClick={() => setEditingItemIdx(null)}
                                >Cancel</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 w-full">
                                {item.image && (
                                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-500">₹{item.price} • {item.availability}</div>
                                </div>
                                <button
                                  className="text-blue-600 hover:text-blue-800 text-xs"
                                  onClick={() => {
                                    setEditingServiceIdx(sIdx);
                                    setEditingItemIdx(iIdx);
                                    setInlineEditItem(item);
                                  }}
                                >Edit</button>
                                <button
                                  className="text-red-600 hover:text-red-800 text-xs"
                                  onClick={async () => {
                                    const updatedItems = service.items.filter((_, j) => j !== iIdx);
                                    const success = await updateServiceCategory(sIdx, service.category, updatedItems);
                                    if (!success) {
                                      // Don't remove from UI if backend call failed
                                      return;
                                    }
                                  }}
                                >Remove</button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm">No items in this service.</div>
                      )}
                    </div>
                    {/* Inline Add Item */}
                    {editingServiceIdx === sIdx && editingItemIdx === 'new' ? (
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="text"
                          placeholder="Item Name"
                          value={inlineEditItem.name}
                          onChange={e => setInlineEditItem(prev => ({ ...prev, name: e.target.value }))}
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={inlineEditItem.price}
                          onChange={e => setInlineEditItem(prev => ({ ...prev, price: e.target.value }))}
                          className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <select
                          value={inlineEditItem.availability}
                          onChange={e => setInlineEditItem(prev => ({ ...prev, availability: e.target.value }))}
                          className="w-32 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Available">Available</option>
                          <option value="Limited Stock">Limited Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                          <option value="24/7 Available">24/7 Available</option>
                        </select>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setInlineEditItem(prev => ({ ...prev, image: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-32"
                        />
                        {inlineEditItem.image && (
                          <img src={inlineEditItem.image} alt="preview" className="w-10 h-10 object-cover rounded" />
                        )}
                        <button
                          className="text-green-600 hover:text-green-800 text-xs"
                          onClick={async () => {
                            const updatedItems = [...service.items, { ...inlineEditItem }];
                            const success = await updateServiceCategory(sIdx, service.category, updatedItems);
                            if (!success) {
                              // Don't add to UI if backend call failed
                              return;
                            }
                            setEditingItemIdx(null);
                          }}
                        >Save</button>
                        <button
                          className="text-gray-600 hover:text-gray-800 text-xs"
                          onClick={() => setEditingItemIdx(null)}
                        >Cancel</button>
                      </div>
                    ) : (
                      <button
                        className="mt-2 text-green-600 hover:text-green-800 text-sm"
                        onClick={() => {
                          setEditingServiceIdx(sIdx);
                          setEditingItemIdx('new');
                          setInlineEditItem({ name: '', price: '', availability: 'Available', image: '' });
                        }}
                      >Add Item</button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center">No services found. Add your first service!</div>
              )}
            </div>

            {/* Add Service Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Add New Service</h3>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >✕</button>
                    </div>
                    <form
                      onSubmit={async e => {
                        e.preventDefault();
                        const success = await addServiceCategory(
                          formData.newServiceCategory,
                          formData.newServiceItems.filter(item => item.name.trim())
                        );
                        if (success) {
                          setShowAddForm(false);
                          setFormData(prev => ({
                            ...prev,
                            newServiceCategory: '',
                            newServiceItems: [{ name: '', price: '', availability: 'Available', image: '' }]
                          }));
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
                        <input
                          type="text"
                          value={formData.newServiceCategory || ''}
                          onChange={e => setFormData(prev => ({ ...prev, newServiceCategory: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                        <div className="space-y-2">
                          {(formData.newServiceItems || [{ name: '', price: '', availability: 'Available', image: '' }]).map((item, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-2 items-center border-b pb-2 mb-2">
                              <input
                                type="text"
                                placeholder="Item Name"
                                value={item.name}
                                onChange={e => {
                                  const newItems = [...(formData.newServiceItems || [])];
                                  newItems[idx].name = e.target.value;
                                  setFormData(prev => ({ ...prev, newServiceItems: newItems }));
                                }}
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                              <input
                                type="number"
                                placeholder="Price"
                                value={item.price}
                                onChange={e => {
                                  const newItems = [...(formData.newServiceItems || [])];
                                  newItems[idx].price = e.target.value;
                                  setFormData(prev => ({ ...prev, newServiceItems: newItems }));
                                }}
                                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                              <select
                                value={item.availability}
                                onChange={e => {
                                  const newItems = [...(formData.newServiceItems || [])];
                                  newItems[idx].availability = e.target.value;
                                  setFormData(prev => ({ ...prev, newServiceItems: newItems }));
                                }}
                                className="w-32 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Available">Available</option>
                                <option value="Limited Stock">Limited Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="24/7 Available">24/7 Available</option>
                              </select>
                              {/* Image upload UI only, no upload logic yet */}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const newItems = [...(formData.newServiceItems || [])];
                                      newItems[idx].image = reader.result;
                                      setFormData(prev => ({ ...prev, newServiceItems: newItems }));
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-32"
                              />
                              {item.image && (
                                <img src={item.image} alt="preview" className="w-10 h-10 object-cover rounded" />
                              )}
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-800 text-xs"
                                onClick={() => {
                                  const newItems = [...(formData.newServiceItems || [])];
                                  newItems.splice(idx, 1);
                                  setFormData(prev => ({ ...prev, newServiceItems: newItems.length ? newItems : [{ name: '', price: '', availability: 'Available', image: '' }] }));
                                }}
                              >Remove</button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                newServiceItems: [
                                  ...(prev.newServiceItems || []),
                                  { name: '', price: '', availability: 'Available', image: '' }
                                ]
                              }));
                            }}
                          >Add Item</button>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >Cancel</button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >Save Service</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Shop Profile</h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleProfileSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileFormData.name}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileFormData.phone}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={profileFormData.email}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={profileFormData.address}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={profileFormData.city}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={profileFormData.state}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profileFormData.pincode}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Owner Information */}
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 border-b pb-2">Owner Information</h4>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={profileFormData.ownerName}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter owner's name"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Phone</label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={profileFormData.ownerPhone}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter owner's phone"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={profileFormData.ownerEmail}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter owner's email"
                  />
                </div>


                {/* Images */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Images</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profileFormData.images && profileFormData.images.length > 0 ? (
                      profileFormData.images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
                          <img src={img} alt={`Shop ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                          >×</button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">No images uploaded</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={uploadingImage}
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {uploadingImage ? 'Uploading...' : 'Select Image'}
                    </button>
                  </div>
                </div>

                {/* Services */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                  {profileFormData.services && profileFormData.services.length > 0 ? (
                    <div className="space-y-2">
                      {profileFormData.services.map((service, sIdx) => (
                        <div key={sIdx} className="border rounded p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800">{service.category}</span>
                            <button
                              type="button"
                              onClick={() => setProfileFormData(prev => ({
                                ...prev,
                                services: prev.services.filter((_, i) => i !== sIdx)
                              }))}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >Remove</button>
                          </div>
                          <div className="space-y-1">
                            {service.items.map((item, iIdx) => (
                              <div key={iIdx} className="flex justify-between text-xs items-center py-1 border-b">
                                <div className="flex items-center gap-2">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                                  )}
                                  <span>{item.name}</span>
                                </div>
                                <span>₹{item.price} - {item.availability}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No services added</span>
                  )}

                  {/* Add new service UI */}
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Service</h4>
                    <div className="flex flex-col md:flex-row gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Service Category"
                        value={profileFormData.newServiceCategory || ''}
                        onChange={e => setProfileFormData(prev => ({ ...prev, newServiceCategory: e.target.value }))}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      {(profileFormData.newServiceItems || [{ name: '', price: '', availability: 'In Stock', image: '' }]).map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 mb-3 border-b pb-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Item Name"
                              value={item.name}
                              onChange={e => {
                                const newItems = [...(profileFormData.newServiceItems || [{ name: '', price: '', availability: 'In Stock', image: '' }])];
                                newItems[idx].name = e.target.value;
                                setProfileFormData(prev => ({ ...prev, newServiceItems: newItems }));
                              }}
                              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={item.price}
                              onChange={e => {
                                const newItems = [...(profileFormData.newServiceItems || [{ name: '', price: '', availability: 'In Stock', image: '' }])];
                                newItems[idx].price = e.target.value;
                                setProfileFormData(prev => ({ ...prev, newServiceItems: newItems }));
                              }}
                              className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <select
                              value={item.availability}
                              onChange={e => {
                                const newItems = [...(profileFormData.newServiceItems || [{ name: '', price: '', availability: 'In Stock', image: '' }])];
                                newItems[idx].availability = e.target.value;
                                setProfileFormData(prev => ({ ...prev, newServiceItems: newItems }));
                              }}
                              className="w-32 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="In Stock">In Stock</option>
                              <option value="Limited Stock">Limited Stock</option>
                              <option value="Out of Stock">Out of Stock</option>
                              <option value="Available">Available</option>
                              <option value="24/7 Available">24/7 Available</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...(profileFormData.newServiceItems || [{ name: '', price: '', availability: 'In Stock', image: '' }])];
                                newItems.splice(idx, 1);
                                setProfileFormData(prev => ({ ...prev, newServiceItems: newItems }));
                              }}
                              className="px-2 py-1 text-red-600 hover:text-red-800"
                            >Remove</button>
                          </div>
                          
                          {/* Service Item Image Upload */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Item Image</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleServiceImageUpload(e.target.files[0], idx);
                                    }
                                  }}
                                  className="flex-1 text-sm p-1 border border-gray-300 rounded-md"
                                  disabled={uploadingServiceImage}
                                />
                                {item.image && (
                                  <div className="relative w-12 h-12">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newItems = [...(profileFormData.newServiceItems || [])];
                                        newItems[idx].image = '';
                                        setProfileFormData(prev => ({
                                          ...prev,
                                          newServiceItems: newItems
                                        }));
                                      }}
                                      className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                    >×</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileFormData(prev => ({
                            ...prev,
                            newServiceItems: [
                              ...(prev.newServiceItems || [{ name: '', price: '', availability: 'In Stock', image: '' }]),
                              { name: '', price: '', availability: 'In Stock', image: '' }
                            ]
                          }));
                        }}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mb-2"
                      >Add Item</button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          profileFormData.newServiceCategory &&
                          (profileFormData.newServiceItems || []).some(item => item.name.trim())
                        ) {
                          setProfileFormData(prev => ({
                            ...prev,
                            services: [
                              ...prev.services,
                              {
                                category: prev.newServiceCategory,
                                items: (prev.newServiceItems || []).filter(item => item.name.trim())
                              }
                            ],
                            newServiceCategory: '',
                            newServiceItems: [{ name: '', price: '', availability: 'In Stock', image: '' }]
                          }));
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2"
                    >Add Service</button>
                  </div>
                </div>
                <label htmlFor="latitude">Latitude</label>
                <input
                  type="number"
                  id="latitude"
                  name="selectedMedicalshop.latitude"
                  value={profileFormData.selectedMedicalshop.latitude}
                  onChange={handleProfileInputChange}
                  step="any"
                  placeholder="Latitude"
                  style={{ marginBottom: '8px', width: '100%' }}
                />
                <label htmlFor="longitude">Longitude</label>
                <input
                  type="number"
                  id="longitude"
                  name="selectedMedicalshop.longitude"
                  value={profileFormData.selectedMedicalshop.longitude}
                  onChange={handleProfileInputChange}
                  step="any"
                  placeholder="Longitude"
                  style={{ marginBottom: '16px', width: '100%' }}
                />
                {/* Opening Times */}
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Operating Hours</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { day: 'monday', label: 'Monday', default: '8:00 AM - 10:00 PM' },
                      { day: 'tuesday', label: 'Tuesday', default: '8:00 AM - 10:00 PM' },
                      { day: 'wednesday', label: 'Wednesday', default: '8:00 AM - 10:00 PM' },
                      { day: 'thursday', label: 'Thursday', default: '8:00 AM - 10:00 PM' },
                      { day: 'friday', label: 'Friday', default: '8:00 AM - 10:00 PM' },
                      { day: 'saturday', label: 'Saturday', default: '8:00 AM - 10:00 PM' },
                      { day: 'sunday', label: 'Sunday', default: '9:00 AM - 9:00 PM' }
                    ].map(({ day, label, default: def }) => (
                      <div key={day}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                        <input
                          type="text"
                          name={`operatingHours.${day}`}
                          value={profileFormData.operatingHours && profileFormData.operatingHours[day] ? profileFormData.operatingHours[day] : def}
                          onChange={handleProfileInputChange}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder={def}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Update Profile'}
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

export default ShopDashboard;