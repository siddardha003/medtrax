import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../Redux/user/actions';
import { 
  getAdminUsersApi, 
  getAdminHospitalsApi,
  getAdminShopsApi,
  createAdminUserApi,
  createAdminHospitalApi,
  createAdminShopApi,
  getSystemStatsApi 
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/admin-login');
    // Log the action
    console.log('Admin logged out');
  };
  const [formData, setFormData] = useState({
    // User fields
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: '',
    hospitalId: '',
    shopId: '',
    // Hospital fields
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPhone: '',
    contactEmail: '',
    type: '',
    // Shop fields
    licenseNumber: '',
    ownerName: ''
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
      console.log('Creating new entity of type:', createType);
        // Basic validation
      if (createType === 'user') {
        // Validate required fields for user creation
        if (!formData.email) throw new Error('Email is required');
        if (!formData.password) throw new Error('Password is required');
        if (!formData.firstName) throw new Error('First name is required');
        if (!formData.role) throw new Error('Role is required');
        
        // Email validation
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) throw new Error('Please enter a valid email');
        
        // Password validation - must be at least 6 characters and contain uppercase, lowercase, and number
        if (formData.password.length < 6) throw new Error('Password must be at least 6 characters');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(formData.password)) {
          throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        }
        
        // Last name validation
        if (formData.lastName && formData.lastName.length < 2) {
          throw new Error('Last name must be at least 2 characters');
        }
        
        // Role-specific validations
        if (formData.role === 'hospital_admin' && !formData.hospitalId) {
          throw new Error('Hospital ID is required for hospital admin');
        }
        
        if (formData.role === 'shop_admin' && !formData.shopId) {
          throw new Error('Shop ID is required for shop admin');
        }
      }
      
      console.log('Form data:', formData);
      
      let response;      if (createType === 'user') {
        // Prepare user data with required fields
        const userData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName || '',
          phone: formData.phone || '',
          role: formData.role,
        };
        
        // Add role-specific fields
        if (formData.role === 'hospital_admin' && formData.hospitalId) {
          userData.hospitalId = formData.hospitalId;
        } else if (formData.role === 'shop_admin' && formData.shopId) {
          userData.shopId = formData.shopId;
        }
        
        console.log('Sending user create request with data:', userData);
        
        try {
          response = await createAdminUserApi(userData);
          
          if (response.data.success) {
            console.log('User created successfully:', response.data);
            
            // Add new user to the list with proper data structure
            const newUser = response.data.data.user || response.data.data;
            setUsers(prevUsers => [newUser, ...prevUsers]);
            
            setSuccess(`Admin user ${userData.firstName} ${userData.lastName} created successfully. Credentials have been sent to ${userData.email}.`);
          } else {
            throw new Error(response.data.error || 'Failed to create user');
          }
        } catch (error) {
          console.error('API error details:', error.response?.data);
          throw error;
        }
      } else if (createType === 'hospital') {
        response = await createAdminHospitalApi(formData);
        if (response.data.success) {
          setHospitals([response.data.data, ...hospitals]);
          setSuccess(`Hospital ${formData.name} created successfully`);
        } else {
          throw new Error(response.data.error || 'Failed to create hospital');
        }
      } else if (createType === 'shop') {
        response = await createAdminShopApi(formData);
        if (response.data.success) {
          setShops([response.data.data, ...shops]);
          setSuccess(`Shop ${formData.name} created successfully`);
        } else {
          throw new Error(response.data.error || 'Failed to create shop');
        }
      }
        // Reset form data
      setFormData({
        email: '', password: '', firstName: '', lastName: '', phone: '', role: '',
        hospitalId: '', shopId: '',
        name: '', address: '', city: '', state: '', pincode: '', contactPhone: '',
        contactEmail: '', type: '', licenseNumber: '', ownerName: ''
      });
      
      // Close modal and refresh stats
      setShowCreateModal(false);
      fetchStats();
    } catch (error) {
      console.error('Error creating:', error);
        // Extract error message from different possible formats
      let errorMessage = 'An unexpected error occurred';
      
      if (error.response) {
        // Server responded with an error
        console.log('Error response data:', error.response.data);
        
        if (error.response.data && error.response.data.details) {
          // Format validation errors
          const validationErrors = error.response.data.details
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          errorMessage = `Validation failed: ${validationErrors}`;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.statusText) {
          errorMessage = `Server error: ${error.response.statusText}`;
        }
      } else if (error.message) {
        // Local validation error or network error
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
      </div>

      {/* Notification Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => setError('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
            <button 
              onClick={() => setSuccess('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
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
                        <div className="text-sm text-gray-900">{shop.ownerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shop.licenseNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shop.city}, {shop.state}</div>
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
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Admin Account Information</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Create login credentials for a Hospital or Shop administrator. They will use these credentials to access their dashboard.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          id="firstName"
                          type="text"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          id="lastName"
                          type="text"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">Login credentials will be sent to this email</p>
                    </div>
                      <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <input
                        id="password"
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                        minLength="6"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 6 characters and include an uppercase letter, a lowercase letter, and a number
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Admin Role *</label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, hospitalId: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, shopId: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="government">Government</option>
                      <option value="private">Private</option>
                      <option value="trust">Trust</option>
                    </select>
                    <textarea
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="tel"
                        placeholder="Contact Phone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Contact Email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </>
                )}

                {createType === 'shop' && (
                  <>
                    <input
                      type="text"
                      placeholder="Shop Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Owner Name"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="text"
                        placeholder="License Number"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="tel"
                        placeholder="Contact Phone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Contact Email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded-md flex items-center ${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading 
                      ? 'Creating...' 
                      : `Create ${createType === 'user' 
                          ? 'Admin Account' 
                          : createType === 'hospital' 
                          ? 'Hospital' 
                          : 'Shop'}`
                    }
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
