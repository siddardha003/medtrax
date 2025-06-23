import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../Redux/user/actions';
import * as HospitalApi from '../../Api';

const HospitalDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.user || {});
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [analytics, setAnalytics] = useState({
    departmentStats: [],
    monthlyStats: [],
    recentActivity: []
  });
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    date: ''
  });

  // Form data for appointments
  const [formData, setFormData] = useState({
    patient: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    department: '',
    appointmentDate: '',
    appointmentTime: '',
    reasonForVisit: '',
    notes: ''
  });
  // Error and success message states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const departments = [
    'cardiology', 'neurology', 'orthopedics', 'pediatrics', 
    'gynecology', 'dermatology', 'psychiatry', 'radiology',
    'pathology', 'emergency', 'icu', 'general_medicine',
    'general_surgery', 'dentistry', 'ophthalmology', 'ent'
  ];

  // Clear messages after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
      fetchTodayAppointments();
    } else if (activeTab === 'appointments') {
      fetchAppointments();
    } else if (activeTab === 'patients') {
      fetchPatients();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab, filters]);
  // Data fetching functions  
  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await HospitalApi.getAppointmentStatsApi();
      if (data.success) {
        setStats(data.data.summary || {
          totalAppointments: 0,
          todayAppointments: 0,
          pendingAppointments: 0,
          completedAppointments: 0
        });
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Unable to load dashboard statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await HospitalApi.getAppointmentsApi({ date: today, limit: 5 });
      if (data.success) {
        setAppointments(data.data.appointments?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      setError('Unable to load today\'s appointments');
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (searchQuery) params.search = searchQuery;
      
      const { data } = await HospitalApi.getAppointmentsApi(params);
      if (data.success) {
        setAppointments(data.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Get unique patients from appointments
      const { data } = await HospitalApi.getAppointmentsApi({ limit: 1000 });
      if (data.success) {
        const uniquePatients = [];
        const patientEmails = new Set();
        
        data.data.appointments.forEach(appointment => {
          if (!patientEmails.has(appointment.patient?.email)) {
            patientEmails.add(appointment.patient?.email);
            uniquePatients.push({
              ...appointment.patient,
              lastVisit: appointment.appointmentDate,
              totalAppointments: data.data.appointments.filter(apt => 
                apt.patient?.email === appointment.patient?.email
              ).length
            });
          }
        });
        
        setPatients(uniquePatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await HospitalApi.getAppointmentStatsApi();
      if (data.success) {
        setAnalytics({
          departmentStats: data.data.departmentStats || [],
          monthlyStats: data.data.monthlyStats || [],
          recentActivity: data.data.recentActivity || []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    try {
      const { data } = await HospitalApi.searchPatientsApi(searchQuery);
      if (data.success) {
        setPatients(data.data.patients || []);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };
  // Form validation
  const validateForm = () => {
    const errors = [];
    
    if (!formData.patient.firstName.trim()) errors.push('Patient first name is required');
    if (!formData.patient.lastName.trim()) errors.push('Patient last name is required');
    if (!formData.patient.email.trim()) errors.push('Patient email is required');
    if (!formData.patient.phone.trim()) errors.push('Patient phone is required');
    if (!formData.department) errors.push('Department is required');
    if (!formData.appointmentDate) errors.push('Appointment date is required');
    if (!formData.appointmentTime) errors.push('Appointment time is required');
    if (!formData.reasonForVisit.trim()) errors.push('Reason for visit is required');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.patient.email && !emailRegex.test(formData.patient.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Validate appointment date is in future
    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      errors.push('Appointment must be scheduled for a future date and time');
    }
    
    return errors;
  };

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }
    
    setLoading(true);
    
    try {
      // Add missing fields for backend validation
      const appointmentData = {
        ...formData,
        patient: {
          ...formData.patient,
          dateOfBirth: '1990-01-01', // Default for now
          gender: 'other' // Default for now
        },
        hospitalId: userInfo?.hospitalId || '68550a000ed19e0791906641' // Default hospital ID
      };
      
      const { data } = await HospitalApi.createAppointmentApi(appointmentData);
      if (data.success) {
        setAppointments([data.data.appointment, ...appointments]);
        setFormData({
          patient: {
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
          },
          department: '',
          appointmentDate: '',
          appointmentTime: '',
          reasonForVisit: '',
          notes: ''
        });
        setShowCreateForm(false);
        setSuccess('Appointment created successfully!');
        fetchStats();
      } else {
        setError(data.error || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError(error.response?.data?.error || error.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointment = async (appointmentId, updateData) => {
    setLoading(true);
    try {
      const { data } = await HospitalApi.updateAppointmentApi(appointmentId, updateData);
      if (data.success) {
        setAppointments(appointments.map(apt => 
          apt._id === appointmentId ? data.data : apt
        ));
        alert('Appointment updated successfully!');
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId, reason = '') => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setLoading(true);
    try {
      const { data } = await HospitalApi.cancelAppointmentApi(appointmentId, { reason });
      if (data.success) {
        setAppointments(appointments.map(apt => 
          apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        ));
        alert('Appointment cancelled successfully!');
        fetchStats();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    dispatch(logOut());
    setTimeout(() => {
      navigate('/admin-login');
    }, 300); // Delay navigation to avoid double notification
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Render Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Hospital Dashboard
        </h2>
        <p className="text-gray-600">
          Manage your hospital appointments, view statistics, and streamline your operations.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalAppointments || 0}</h3>
                  <p className="text-sm text-gray-600">Total Appointments</p>
                </>
              )}
            </div>
          </div>
        </div>        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.todayAppointments || 0}</h3>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.pendingAppointments || 0}</h3>
              <p className="text-sm text-gray-600">Pending Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.completedAppointments || 0}</h3>
              <p className="text-sm text-gray-600">Completed Appointments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Today's Appointments</h3>
        </div>
        <div className="p-6">
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No appointments for today</p>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {appointment.department?.replace('_', ' ').toUpperCase()} • {formatTime(appointment.appointmentTime)}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.reasonForVisit}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-700">New Appointment</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('appointments')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-700">View All Appointments</span>
              </div>
            </button>
            
            <button
              onClick={() => window.print()}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-700">Print Reports</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Appointments Tab
  const renderAppointments = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Appointment
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.patient?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.department?.replace('_', ' ').toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(appointment.appointmentDate)}<br />
                    {formatTime(appointment.appointmentTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => handleUpdateAppointment(appointment._id, { status: 'confirmed' })}
                        className="text-green-600 hover:text-green-900"
                      >
                        Confirm
                      </button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateAppointment(appointment._id, { status: 'in_progress' })}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Start
                      </button>
                    )}
                    {appointment.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateAppointment(appointment._id, { status: 'completed' })}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Complete
                      </button>
                    )}
                    {!['completed', 'cancelled'].includes(appointment.status) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Patients Tab
  const renderPatients = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <span className="text-sm text-gray-600">{patients.length} patients found</span>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Patients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Appointments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient, index) => (
                <tr key={patient.email || index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {patient.id || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.lastVisit ? formatDate(patient.lastVisit) : 'No visits'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.totalAppointments || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          patient: {
                            firstName: patient.firstName || '',
                            lastName: patient.lastName || '',
                            email: patient.email || '',
                            phone: patient.phone || ''
                          }
                        });
                        setShowCreateForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Book Appointment
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Analytics Tab
  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Department Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.departmentStats.map((dept, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">{dept.department?.replace('_', ' ').toUpperCase()}</h4>
              <p className="text-2xl font-bold text-blue-600">{dept.appointments || 0}</p>
              <p className="text-sm text-gray-600">appointments</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Appointment Trends</h3>
        <div className="space-y-4">
          {analytics.monthlyStats.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">{month.month}</span>
              <span className="text-blue-600 font-bold">{month.appointments || 0} appointments</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Create Appointment Form
  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Create New Appointment</h3>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient First Name"
              value={formData.patient.firstName}
              onChange={(e) => setFormData({
                ...formData,
                patient: { ...formData.patient, firstName: e.target.value }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Patient Last Name"
              value={formData.patient.lastName}
              onChange={(e) => setFormData({
                ...formData,
                patient: { ...formData.patient, lastName: e.target.value }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Patient Email"
              value={formData.patient.email}
              onChange={(e) => setFormData({
                ...formData,
                patient: { ...formData.patient, email: e.target.value }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="tel"
              placeholder="Patient Phone"
              value={formData.patient.phone}
              onChange={(e) => setFormData({
                ...formData,
                patient: { ...formData.patient, phone: e.target.value }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <textarea
            placeholder="Reason for Visit"
            value={formData.reasonForVisit}
            onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            required
          />

          <textarea
            placeholder="Additional Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Hospital Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {userInfo?.name || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mx-4 mt-4 relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError('')}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mx-4 mt-4 relative">
          <span className="block sm:inline">{success}</span>
          <button
            onClick={() => setSuccess('')}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'patients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Patients
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          )}
            {!loading && activeTab === 'dashboard' && renderDashboard()}
          {!loading && activeTab === 'appointments' && renderAppointments()}
          {!loading && activeTab === 'patients' && renderPatients()}
          {!loading && activeTab === 'analytics' && renderAnalytics()}
          {!loading && activeTab === 'patients' && renderPatients()}
          {!loading && activeTab === 'analytics' && renderAnalytics()}
        </div>
      </main>

      {/* Modals */}
      {showCreateForm && renderCreateForm()}
    </div>
  );
};

export default HospitalDashboard;
