import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../Redux/user/actions';
import { showNotification } from '../../Redux/notification/actions';
import * as ShopApi from '../../Api/index';
import ShopProfileEnhanced from './ShopProfileEnhanced';

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
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    description: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    website: '',
    establishedYear: '',
    services: [],
    specialties: [],
    facilities: [],
    operatingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    }
  });

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
    batchNumber: ''
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
    return sum + (price * currentStock);  }, 0);

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
    setLoading(true);
    try {
      // For now, we'll simulate analytics data since the backend might not have detailed analytics
      const simulatedAnalytics = {
        weeklyVisits: [120, 150, 180, 210, 195, 160, 140],
        monthlyContactClicks: [45, 52, 38, 61, 49, 55, 43],
        popularCategories: [
          { name: 'Prescription Medicines', count: 25 },
          { name: 'OTC Medicines', count: 18 },
          { name: 'Medical Devices', count: 12 },
          { name: 'Health Supplements', count: 8 }
        ],
        weeklyRevenue: [15000, 18000, 22000, 19000, 21000, 17000, 16000]
      };
      
      setStats(prev => ({
        ...prev,
        analytics: simulatedAnalytics
      }));    } catch (error) {
      console.error('Error fetching analytics:', error);
      dispatch(showNotification({
        message: 'Unable to load analytics data',
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Shop profile management functions
  const fetchShopProfile = useCallback(async () => {
    try {
      const { data } = await ShopApi.getShopProfileApi();
      if (data.success) {
        setShopProfile(data.data.shop);
        setProfileFormData({
          name: data.data.shop.name || '',
          description: data.data.shop.description || '',
          ownerName: data.data.shop.ownerName || '',
          phone: data.data.shop.phone || '',
          email: data.data.shop.email || '',
          address: data.data.shop.address || '',
          city: data.data.shop.city || '',
          state: data.data.shop.state || '',
          pincode: data.data.shop.pincode || '',
          website: data.data.shop.website || '',
          establishedYear: data.data.shop.establishedYear || '',
          services: data.data.shop.services || [],
          specialties: data.data.shop.specialties || [],
          facilities: data.data.shop.facilities || [],
          operatingHours: data.data.shop.operatingHours || {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
          }
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

  const toggleShopStatus = async () => {
    if (!shopProfile) {
      dispatch(showNotification({
        message: 'Shop profile not loaded',
        messageType: 'error'
      }));
      return;
    }

    const newStatus = !shopProfile.isActive;
    const confirmMessage = `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} your shop?`;
    
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const { data } = await ShopApi.updateShopStatusApi({ isActive: newStatus });
      if (data.success) {
        setShopProfile(prev => ({ ...prev, isActive: newStatus }));
        dispatch(showNotification({
          message: `Shop ${newStatus ? 'activated' : 'deactivated'} successfully!`,
          messageType: 'success'
        }));
      } else {
        dispatch(showNotification({
          message: data.error || 'Failed to update shop status',
          messageType: 'error'
        }));
      }
    } catch (error) {
      console.error('Error updating shop status:', error);
      dispatch(showNotification({
        message: 'Failed to update shop status',
        messageType: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await ShopApi.updateShopProfileApi(profileFormData);
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

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('operatingHours.')) {
      const day = name.split('.')[1];
      setProfileFormData(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: value
        }
      }));
    } else if (name === 'services' || name === 'specialties' || name === 'facilities') {
      // Handle comma-separated arrays
      setProfileFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(item => item)
      }));
    } else {
      setProfileFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
        },        quantity: {
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
      dispatch(showNotification(error.response?.data?.error || error.message || 'Failed to save product', 'error'));    } finally {
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
      }      const updatedData = {
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
      fetchInventory();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab, fetchStats, fetchInventory, fetchAnalytics, fetchInventoryPreview, fetchShopProfile]);

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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userInfo?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Add Item
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
              { id: 'inventory', name: 'Inventory', icon: '📦' },
              { id: 'analytics', name: 'Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>        </div>
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
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    shopProfile?.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {shopProfile?.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={toggleShopStatus}
                    disabled={loading || !shopProfile}
                    className={`px-4 py-2 rounded-lg font-medium text-white ${
                      shopProfile?.isActive
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

            {/* Shop Profile Information */}
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
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Owner Name</h3>
                      <p className="text-lg text-gray-900">{shopProfile.ownerName || 'Not specified'}</p>
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
                    
                    {shopProfile.description && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                        <p className="text-lg text-gray-900">{shopProfile.description}</p>
                      </div>
                    )}
                    
                    {shopProfile.website && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Website</h3>
                        <a 
                          href={shopProfile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg text-blue-600 hover:text-blue-800"
                        >
                          {shopProfile.website}
                        </a>
                      </div>
                    )}
                    
                    {shopProfile.establishedYear && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Established Year</h3>
                        <p className="text-lg text-gray-900">{shopProfile.establishedYear}</p>
                      </div>
                    )}
                    
                    {shopProfile.services && shopProfile.services.length > 0 && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Services</h3>
                        <div className="flex flex-wrap gap-2">
                          {shopProfile.services.map((service, index) => (
                            <span 
                              key={index}
                              className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {shopProfile.specialties && shopProfile.specialties.length > 0 && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {shopProfile.specialties.map((specialty, index) => (
                            <span 
                              key={index}
                              className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {shopProfile.facilities && shopProfile.facilities.length > 0 && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Facilities</h3>
                        <div className="flex flex-wrap gap-2">
                          {shopProfile.facilities.map((facility, index) => (
                            <span 
                              key={index}
                              className="inline-flex px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading shop profile...</p>
                </div>
              )}
            </div>

            {/* Enhanced Profile Component */}
            <ShopProfileEnhanced 
              shopProfile={shopProfile}
              onProfileUpdate={(updatedProfile) => {
                setShopProfile(updatedProfile);
                fetchShopProfile(); // Refresh the profile data
              }}
            />
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                  <select
                    value={filters.stockStatus}
                    onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Stock</option>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Required</label>
                  <select
                    value={filters.prescriptionRequired}
                    onChange={(e) => handleFilterChange('prescriptionRequired', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Items</option>
                    <option value="true">Prescription Required</option>
                    <option value="false">No Prescription Required</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredInventory.length} of {inventory.length} items
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ category: '', stockStatus: '', prescriptionRequired: '' });
                  }}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Inventory Items</h2>
              </div>
              
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading inventory...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInventory.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            {inventory.length === 0 
                              ? "No inventory items found. Add your first item!" 
                              : "No items match your current filters."
                            }
                          </td>
                        </tr>
                      ) : (
                        filteredInventory.map((item) => (
                          <tr key={item._id}>
                            <td className="px-6 py-4">
                              <div>                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.manufacturer}</div>
                              <div className="text-xs text-gray-400">SKU: {item.sku}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 capitalize">
                              {item.category?.replace('_', ' ')}
                            </span>
                            {item.prescriptionRequired && (
                              <div className="text-xs text-red-600 font-medium">Rx Required</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{item.pricing?.sellingPrice || item.price}</div>
                            <div className="text-sm text-gray-500">Cost: ₹{item.pricing?.costPrice || item.costPrice}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockColor(getStockStatus(item))}`}>
                              {item.quantity?.current || item.stock || 0} units
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              Min: {item.quantity?.minimum || item.minStockLevel || 0} | Max: {item.quantity?.maximum || item.maxStockLevel || 0}
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${isExpiringSoon(item.expiryDate) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                              {new Date(item.expiryDate).toLocaleDateString()}
                            </div>
                            {isExpiringSoon(item.expiryDate) && (
                              <div className="text-xs text-red-500">Expires soon!</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                const newStock = prompt(`Update stock for ${item.name}:`, item.stock);
                                if (newStock && !isNaN(newStock)) {
                                  handleStockUpdate(item._id, parseInt(newStock));
                                }
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Update Stock
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Basic Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👀</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Page Visits</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pageVisits}</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Contact Clicks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.contactClicks}</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.pageVisits > 0 ? ((stats.contactClicks / stats.pageVisits) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-xs text-gray-500">Contact/Visit ratio</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Daily Visits</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(stats.pageVisits / 30)}
                    </p>
                    <p className="text-xs text-gray-500">Per day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Categories</h3>
                <div className="space-y-3">
                  {categories.slice(0, 5).map((category, index) => {
                    const count = inventory.filter(item => item.category === category).length;
                    const percentage = inventory.length > 0 ? (count / inventory.length) * 100 : 0;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {category.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Items</span>
                    <span className="text-sm font-medium text-gray-900">{inventory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value</span>
                    <span className="text-sm font-medium text-gray-900">₹{totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">In Stock</span>
                    <span className="text-sm font-medium text-green-600">
                      {inventory.filter(item => getStockStatus(item) === 'in_stock').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Low Stock</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {inventory.filter(item => getStockStatus(item) === 'low_stock').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Out of Stock</span>
                    <span className="text-sm font-medium text-red-600">
                      {inventory.filter(item => getStockStatus(item) === 'out_of_stock').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expiring Soon</span>
                    <span className="text-sm font-medium text-orange-600">{expiringItems.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple charts simulation */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Performance</h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const visits = [20, 35, 45, 32, 28, 15, 12][index]; // Simulated data
                  return (
                    <div key={day} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{day}</div>
                      <div 
                        className="bg-green-200 rounded-sm mx-auto"
                        style={{ height: `${visits * 2}px`, width: '16px' }}
                      ></div>
                      <div className="text-xs text-gray-700 mt-1">{visits}</div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 text-center">Page visits per day (this week)</p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                  <input
                    type="text"
                    name="manufacturer"
                    placeholder="Manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price *</label>
                  <input
                    type="number"
                    name="costPrice"
                    placeholder="Cost Price"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Initial Stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                    min="0"
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level *</label>
                  <input
                    type="number"
                    name="minStockLevel"
                    placeholder="Min Stock Level"
                    value={formData.minStockLevel}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                    min="0"
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock Level</label>
                  <input
                    type="number"
                    name="maxStockLevel"
                    placeholder="Max Stock Level"
                    value={formData.maxStockLevel}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    name="batchNumber"
                    placeholder="Batch Number"
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    rows="3"
                  />
                </div>
                
                <div className="col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    id="prescriptionRequired"
                    name="prescriptionRequired"
                    checked={formData.prescriptionRequired}
                    onChange={handleInputChange}
                    className="mr-2 focus:ring-green-500"
                  />
                  <label htmlFor="prescriptionRequired" className="text-sm text-gray-700">
                    Prescription Required
                  </label>
                </div>
                
                <div className="col-span-2 flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingProduct ? 'Update Item' : 'Add Item')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={profileFormData.ownerName}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profileFormData.website}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={profileFormData.establishedYear}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={profileFormData.description}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Describe your shop and services..."
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services (comma-separated)</label>
                  <input
                    type="text"
                    name="services"
                    value={profileFormData.services.join(', ')}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Prescription Medicines, OTC Medicines, Medical Devices, etc."
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                  <input
                    type="text"
                    name="specialties"
                    value={profileFormData.specialties.join(', ')}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Chronic Disease Management, Pediatric Care, Elderly Care, etc."
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facilities (comma-separated)</label>
                  <input
                    type="text"
                    name="facilities"
                    value={profileFormData.facilities.join(', ')}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Air Conditioned, Wheelchair Accessible, Parking Available, etc."
                  />
                </div>
                
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Operating Hours</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                      <div key={day}>
                        <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{day}</label>
                        <input
                          type="text"
                          name={`operatingHours.${day}`}
                          value={profileFormData.operatingHours[day]}
                          onChange={handleProfileInputChange}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="8:00 AM - 10:00 PM"
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