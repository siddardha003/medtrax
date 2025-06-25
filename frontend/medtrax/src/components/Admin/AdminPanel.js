import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../Redux/user/actions';
import { showNotification } from '../../Redux/notification/actions';
import { 
  getAdminUsersApi, 
  getAdminHospitalsApi,
  getAdminShopsApi,
  createAdminUserApi,
  createAdminHospitalApi,
  createAdminShopApi,
  getSystemStatsApi,
  deleteAdminUserApi
} from '../../Api';

const AdminPanel = () => {
  const { userInfo } = useSelector(state => state.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('');
  const [error, setError] = useState('');  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Add password visibility state
  
  const handleLogout = async () => {
    console.log('Admin logout clicked');
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
  
  const [formData, setFormData] = useState({
    // User fields
    email: '',
    password: '',
    role: '',
    hospitalId: '',
    shopId: '',
    // Hospital/Shop fields
    name: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    phone: ''
  });
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'hospitals') {
      fetchHospitals();
    } else if (activeTab === 'shops') {
      fetchShops();
    }
  }, [activeTab]);

  // Clear error and success messages after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await getSystemStatsApi();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUsersApi();
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminHospitalsApi();
      if (data.success) {
        setHospitals(data.data.hospitals);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminShopsApi();
      if (data.success) {
        setShops(data.data.shops);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let response;
      if (createType === 'user') {
        if (!formData.email) throw new Error('Email is required');
        if (!formData.password) throw new Error('Password is required');
        if (!formData.role) throw new Error('Role is required');
        if (formData.role === 'hospital_admin' && !formData.hospitalId) throw new Error('Hospital selection is required');
        if (formData.role === 'shop_admin' && !formData.shopId) throw new Error('Shop selection is required');
        const userData = {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          hospitalId: formData.role === 'hospital_admin' ? formData.hospitalId : undefined,
          shopId: formData.role === 'shop_admin' ? formData.shopId : undefined,
        };
        response = await createAdminUserApi(userData);
        if (response.data.success) {
          setUsers(prevUsers => [response.data.data.user, ...prevUsers]);
          setSuccess('Admin created successfully. Credentials sent to email.');
        } else {
          throw new Error(response.data.error || 'Failed to create user');
        }
      } else if (createType === 'hospital') {
        const hospitalData = {
          name: formData.name,
          address: formData.address,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          email: formData.email,
        };
        response = await createAdminHospitalApi(hospitalData);
        if (response.data.success) {
          setHospitals([response.data.data.hospital, ...hospitals]);
          setSuccess('Hospital created successfully');
        } else {
          throw new Error(response.data.error || 'Failed to create hospital');
        }
      } else if (createType === 'shop') {
        const shopData = {
          name: formData.name,
          address: formData.address,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          email: formData.email,
        };
        response = await createAdminShopApi(shopData);
        if (response.data.success) {
          setShops([response.data.data.shop, ...shops]);
          setSuccess('Shop created successfully');
        } else {
          throw new Error(response.data.error || 'Failed to create shop');
        }
      }
      setFormData({
        email: '', password: '', role: '', hospitalId: '', shopId: '',
        name: '', address: '', pincode: '', city: '', state: '', phone: ''
      });
      setShowCreateModal(false);
      fetchStats();
    } catch (error) {
      // Enhanced error handling for backend validation errors
      let errorMessage = 'An error occurred';
      if (error.response && error.response.data) {
        if (error.response.data.details && Array.isArray(error.response.data.details)) {
          errorMessage = error.response.data.details.map(
            d => `${d.field}: ${d.message}`
          ).join(' | ');
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const openCreateModal = async (type) => {
    setCreateType(type);
    setShowCreateModal(true);
    
    // If we're opening the user creation modal, make sure we have hospitals and shops data
    if (type === 'user') {
      if (hospitals.length === 0) {
        await fetchHospitals();
      }
      if (shops.length === 0) {
        await fetchShops();
      }
    }
  };

  // Add delete handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await deleteAdminUserApi(userId);
      if (response.data.success) {
        setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
        setSuccess('User deleted successfully.');
        fetchStats();
      } else {
        throw new Error(response.data.error || 'Failed to delete user');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'hospitals', name: 'Hospitals', icon: '🏥' },
    { id: 'shops', name: 'Shops', icon: '🏪' }
  ];
  return (
    <div className="min-h-screen bg-gray-50">      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userInfo?.name} | Create and manage hospital & shop admin accounts</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>      {/* Removed duplicate local notification system - using global Redux notifications only */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hospitals</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHospitals || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Shops</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalShops || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.thisMonth || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => openCreateModal('user')}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="text-xl">👤</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-blue-800">Create Admin</p>
                      <p className="text-sm text-blue-600">Add new admin user</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => openCreateModal('hospital')}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="text-xl">🏥</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-green-800">Add Hospital</p>
                      <p className="text-sm text-green-600">Register new hospital</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => openCreateModal('shop')}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="text-xl">🏪</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-purple-800">Add Shop</p>
                      <p className="text-sm text-purple-600">Register new medical shop</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <span className="text-xl">🔒</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-red-800">Logout</p>
                      <p className="text-sm text-red-600">End admin session</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Admin Accounts Management</h2>
                <p className="text-sm text-gray-600">Create and manage Hospital Admin and Shop Admin accounts</p>
              </div>
              <button
                onClick={() => openCreateModal('user')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <span className="mr-2">➕</span>
                Create Admin Account
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 rounded border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                          disabled={loading}
                          title="Delete user"
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
        )}

        {/* Hospitals Tab */}
        {activeTab === 'hospitals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Hospitals Management</h2>
              <button
                onClick={() => openCreateModal('hospital')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Add Hospital
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hospitals.map((hospital) => (
                    <tr key={hospital._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{hospital.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{hospital.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hospital.city}, {hospital.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hospital.contactPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          hospital.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {hospital.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shops Tab */}
        {activeTab === 'shops' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Shops Management</h2>
              <button
                onClick={() => openCreateModal('shop')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Add Shop
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shops.map((shop) => (
                    <tr key={shop._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shop.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shop.city}, {shop.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shop.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          shop.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {shop.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {createType === 'user' 
                    ? 'Create New Admin Account' 
                    : createType === 'hospital' 
                    ? 'Register New Hospital' 
                    : 'Register New Medical Shop'}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Error message in modal */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              {/* Success message in modal */}
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-4">
                {createType === 'user' 
                  ? 'Create login credentials for Hospital Admins or Medical Shop Admins. They will use these credentials to manage their respective facilities.' 
                  : createType === 'hospital' 
                  ? 'Register a new hospital in the system. You can assign an admin to this hospital later.' 
                  : 'Register a new medical shop in the system. You can assign an admin to this shop later.'}
              </p>
              <form onSubmit={handleCreate} className="space-y-4">
                {createType === 'user' && (
                  <>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">Login credentials will be sent to this email</p>
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password (min 6 characters)"
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                          minLength="6"
                        />                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.828 1.828L12 12m0 0l2.122 2.122M8.05 8.05l2.12 2.12" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 6 characters and include an uppercase letter, a lowercase letter, and a number
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Admin Role *</label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Admin Role</option>
                        <option value="hospital_admin">Hospital Admin</option>
                        <option value="shop_admin">Shop Admin</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.role === 'hospital_admin' ? 
                          'Hospital admins can manage appointments, patients, and hospital operations.' : 
                          formData.role === 'shop_admin' ? 
                          'Shop admins can manage inventory, orders, and shop operations.' : 
                          'Select a role for this admin user'}
                      </p>
                    </div>
                    
                    {formData.role === 'hospital_admin' && (
                      <div>
                        <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 mb-1">Hospital *</label>
                        <select
                          id="hospitalId"
                          value={formData.hospitalId}
                          onChange={e => setFormData({ ...formData, hospitalId: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select Hospital</option>
                          {hospitals.map(hospital => (
                            <option key={hospital._id} value={hospital._id}>
                              {hospital.name} - {hospital.city}, {hospital.state}
                            </option>
                          ))}
                        </select>
                        {hospitals.length === 0 && (
                          <p className="mt-1 text-xs text-red-500">
                            No hospitals available. Please create a hospital first from the Hospitals tab.
                          </p>
                        )}
                      </div>
                    )}
                    
                    {formData.role === 'shop_admin' && (
                      <div>
                        <label htmlFor="shopId" className="block text-sm font-medium text-gray-700 mb-1">Medical Shop *</label>
                        <select
                          id="shopId"
                          value={formData.shopId}
                          onChange={e => setFormData({ ...formData, shopId: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select Medical Shop</option>
                          {shops.map(shop => (
                            <option key={shop._id} value={shop._id}>
                              {shop.name} - {shop.city}, {shop.state}
                            </option>
                          ))}
                        </select>
                        {shops.length === 0 && (
                          <p className="mt-1 text-xs text-red-500">
                            No medical shops available. Please create a shop first from the Shops tab.
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {createType === 'hospital' && (
                  <>
                    <input
                      type="text"
                      placeholder="Hospital Name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </>
                )}

                {createType === 'shop' && (
                  <>
                    <input
                      type="text"
                      placeholder="Shop Name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Create'}
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

export default AdminPanel;
