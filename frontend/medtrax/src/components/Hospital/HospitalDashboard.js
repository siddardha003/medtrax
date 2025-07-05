import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../Redux/user/actions';
import { showNotification } from '../../Redux/notification/actions';
import * as HospitalApi from '../../Api';
import HospitalProfile from './HospitalProfile';
import './HospitalDashboard.css';

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
  const [hospitalProfile, setHospitalProfile] = useState(null);
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
    name: '',
      email: '',
    phone: '',
    department: '',
    doctorIndex: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });
  // Error and success message states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add at the top of HospitalDashboard component state:
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctorList, setDoctorList] = useState([]);

  // Add state for slot error message
  const [slotError, setSlotError] = useState('');

  // Add state for booked slots
  const [bookedSlots, setBookedSlots] = useState([]);

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

  // Fetch hospital profile
  const fetchHospitalProfile = async () => {
    try {
      const { data } = await HospitalApi.getHospitalProfileApi();
      if (data.success) {
        setHospitalProfile(data.data.hospital);
      }
    } catch (error) {
      console.error('Error fetching hospital profile:', error);
    }
  };

  useEffect(() => {
    fetchHospitalProfile();
  }, []);

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
    } else if (activeTab === 'profile') {
      fetchHospitalProfile();
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
      // Only include non-empty filters
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.department) params.department = filters.department;
      if (filters.date) params.date = filters.date;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      
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
    
    if (!formData.name.trim()) errors.push('Patient name is required');
    if (!formData.email.trim()) errors.push('Patient email is required');
    if (!formData.phone.trim()) errors.push('Patient phone is required');
    if (!formData.department) errors.push('Department is required');
    if (formData.doctorIndex === '') errors.push('Doctor is required');
    if (!formData.appointmentDate) errors.push('Appointment date is required');
    if (!formData.appointmentTime) errors.push('Appointment time is required');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Validate appointment date is in future
    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      errors.push('Appointment must be scheduled for a future date and time');
    }
    
    return errors;
  };

  // Helper to get department and doctor indices
  const getDeptAndDoctorIndices = () => {
    const deptIndex = hospitalProfile?.services?.findIndex(
      s => s.category === formData.department
    );
    const docIndex = deptIndex > -1 ? hospitalProfile.services[deptIndex].doctors.findIndex(
      d => d.name === doctorList[selectedDoctorIndex]?.name
    ) : -1;
    return { deptIndex, docIndex };
  };

  // Fetch doctors when department changes
  useEffect(() => {
    if (formData.department && hospitalProfile) {
      const dept = hospitalProfile.services.find(s => s.category === formData.department);
      setDoctorList(dept ? dept.doctors : []);
      setFormData(f => ({ ...f, doctorIndex: '', appointmentTime: '' }));
      setAvailableSlots([]);
    }
  }, [formData.department, hospitalProfile]);

  // Fetch slots when doctor and date are selected
  useEffect(() => {
    if (
      formData.department &&
      formData.doctorIndex !== '' &&
      formData.appointmentDate &&
      hospitalProfile
    ) {
      const deptIndex = hospitalProfile.services.findIndex(s => s.category === formData.department);
      const docIndex = formData.doctorIndex;
      if (deptIndex > -1 && docIndex !== '') {
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
        const token = profile.token;
        fetch(`/api/hospital/department/${deptIndex}/doctor/${docIndex}/available-slots?date=${formData.appointmentDate}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setAvailableSlots(data.slots || []);
              setBookedSlots(data.bookedSlots || []);
              setSlotError('');
              console.log('Fetched availableSlots:', data.slots);
              console.log('Fetched bookedSlots:', data.bookedSlots);
            } else {
              setAvailableSlots([]);
              setBookedSlots([]);
              setSlotError('Failed to fetch available slots');
            }
          })
          .catch(err => {
            console.error('Error fetching slots:', err);
            setAvailableSlots([]);
            setBookedSlots([]);
            setSlotError('Failed to fetch available slots');
          });
      }
    } else {
      setAvailableSlots([]);
      setBookedSlots([]);
      setSlotError('');
    }
  }, [formData.department, formData.doctorIndex, formData.appointmentDate, hospitalProfile]);

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setSuccess('');
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    // Validate slot availability
    if (!availableSlots.includes(formData.appointmentTime)) {
      setSlotError('Selected time slot is not available. Please choose a different time.');
      return;
    }

    setLoading(true);
    
    try {
      const doctor = doctorList[formData.doctorIndex];
      const appointmentData = {
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        department: formData.department,
        doctorId: doctor?._id || doctor?.id,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        notes: formData.notes,
        hospitalId: hospitalProfile?._id
      };
      const { data } = await HospitalApi.createAppointmentApi(appointmentData);
      if (data.success) {
        setAppointments([data.data.appointment, ...appointments]);
        setFormData({
          name: '',
            email: '',
          phone: '',
          department: '',
          doctorIndex: '',
          appointmentDate: '',
          appointmentTime: '',
          notes: ''
        });
        setShowCreateForm(false);
        setSuccess('Appointment created successfully!');
        fetchStats();
        // Refresh available slots
        if (formData.department && formData.doctorIndex !== '' && formData.appointmentDate) {
          const deptIndex = hospitalProfile.services.findIndex(s => s.category === formData.department);
          const docIndex = formData.doctorIndex;
          if (deptIndex > -1 && docIndex !== '') {
            const profile = JSON.parse(localStorage.getItem('profile') || '{}');
            const token = profile.token;
            fetch(`/api/hospital/department/${deptIndex}/doctor/${docIndex}/available-slots?date=${formData.appointmentDate}`, {
              headers: { 'Authorization': `Bearer ${token}` },
              credentials: 'include'
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  setAvailableSlots(data.slots || []);
                }
              });
          }
        }
      } else {
        setError(data.error || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error.response?.status === 409) {
        setError('This time slot is already booked. Please select a different time.');
        // Refresh available slots to show current availability
        if (formData.department && formData.doctorIndex !== '' && formData.appointmentDate) {
          const deptIndex = hospitalProfile.services.findIndex(s => s.category === formData.department);
          const docIndex = formData.doctorIndex;
          if (deptIndex > -1 && docIndex !== '') {
            const profile = JSON.parse(localStorage.getItem('profile') || '{}');
            const token = profile.token;
            fetch(`/api/hospital/department/${deptIndex}/doctor/${docIndex}/available-slots?date=${formData.appointmentDate}`, {
              headers: { 'Authorization': `Bearer ${token}` },
              credentials: 'include'
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  setAvailableSlots(data.slots || []);
                }
              });
          }
        }
      } else {
        setError(error.response?.data?.error || error.message || 'Failed to create appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    setLoading(true);
    try {
      const { data } = await HospitalApi.cancelAppointmentApi(appointmentId, {});
      if (data.success) {
        setAppointments(appointments.filter(apt => apt._id !== appointmentId));
        alert('Appointment deleted successfully!');
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Error deleting appointment: ' + (error.response?.data?.error || error.message));
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
  };  const handleLogout = async () => {
    
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

  // Add this before rendering the dashboard cards
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = stats.todayAppointments || 0;
  const completedAppointments = stats.completedAppointments || 0;
  const pendingAppointments = stats.pendingAppointments || 0;

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

      {/* Profile completion alert */}
      {hospitalProfile && !hospitalProfile.profileComplete && (
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                ⚠️ Your Hospital Profile is Incomplete
              </p>
              <p className="text-sm text-gray-600">
                Please complete your hospital profile to make it visible to patients.
                Add departments, doctors, images, and operating hours to attract more patients.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Complete Profile Now
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
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
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
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
                  <h3 className="text-2xl font-bold text-gray-900">{todaysAppointments || 0}</h3>
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
              <h3 className="text-2xl font-semibold text-gray-900">{pendingAppointments || 0}</h3>
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
              <h3 className="text-2xl font-semibold text-gray-900">{completedAppointments || 0}</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008b95] focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-[#008b95] text-white rounded-md hover:bg-[#008b95]focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008b95] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008b95] focus:border-transparent"
            >
              <option value="">All Departments</option>
              {hospitalProfile?.services?.map(dept => (
                <option key={dept.category} value={dept.category}>{dept.category.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008b95] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 ml-4 bg-[#008b95] text-white rounded-md hover:bg-[#008b95] focus:ring-2 focus:[#008b95] focus:ring-offset-2"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => {
                // Find doctor name from hospitalProfile.services using doctorId
                let doctorName = '';
                if (hospitalProfile && Array.isArray(hospitalProfile.services) && appointment.doctorId) {
                  for (const service of hospitalProfile.services) {
                    const doc = (service.doctors || []).find(d => String(d._id) === String(appointment.doctorId) || String(d.id) === String(appointment.doctorId));
                    if (doc) {
                      doctorName = doc.name;
                      break;
                    }
                  }
                }
                return (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctorName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.department?.replace('_', ' ').toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(appointment.appointmentDate)}<br />{formatTime(appointment.appointmentTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={appointment.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          if (newStatus !== appointment.status) {
                            setLoading(true);
                            try {
                              const { data } = await HospitalApi.updateAppointmentApi(appointment._id, { status: newStatus });
                              if (data.success) {
                                setAppointments(appointments.map(a => a._id === appointment._id ? { ...a, status: newStatus } : a));
                              }
                            } catch (error) {
                              alert('Failed to update status: ' + (error.response?.data?.error || error.message));
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className={
                          appointment.status === 'completed' ? 'px-2 py-1 border rounded bg-green-100 text-green-800 font-semibold' :
                          appointment.status === 'confirmed' ? 'px-2 py-1 border rounded bg-blue-100 text-blue-800 font-semibold' :
                          'px-2 py-1 border rounded bg-yellow-100 text-yellow-800 font-semibold'
                        }
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleDeleteAppointment(appointment._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
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
            <input
              type="text"
            placeholder="Patient Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Patient Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="tel"
              placeholder="Patient Phone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <select
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Department</option>
            {hospitalProfile?.services?.map((dept, idx) => (
              <option key={dept.category} value={dept.category}>{dept.category.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
          {doctorList.length > 0 && (
            <select
              value={formData.doctorIndex}
              onChange={e => setFormData({ ...formData, doctorIndex: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Doctor</option>
              {doctorList.map((doc, idx) => (
                <option key={doc.name + idx} value={idx}>{doc.name} ({doc.degree})</option>
              ))}
            </select>
          )}
            <input
              type="date"
              value={formData.appointmentDate}
            onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          {formData.appointmentDate && formData.doctorIndex !== '' && availableSlots.length === 0 && (
            <div className="text-red-600 text-sm mb-2">This doctor doesn't have slot on that day, try for another doctor.</div>
          )}
          {availableSlots.length > 0 && (
            (() => {
              // Compute all slots to render (union of available and booked, no duplicates)
              const allSlots = availableSlots.concat(bookedSlots.filter(slot => !availableSlots.includes(slot)));
              console.log('Rendering slot dropdown. availableSlots:', availableSlots);
              console.log('Rendering slot dropdown. bookedSlots:', bookedSlots);
              console.log('Rendering slot dropdown. allSlots:', allSlots);
              return (
                <select
                  value={formData.appointmentTime}
                  onChange={e => {
                    const selectedSlot = e.target.value;
                    setFormData({ ...formData, appointmentTime: selectedSlot });
                    // Clear any previous slot error when selecting a valid slot
                    if (availableSlots.includes(selectedSlot)) {
                      setSlotError('');
                    } else if (bookedSlots.includes(selectedSlot)) {
                      setSlotError('This slot is already booked. Please select a different time.');
                    } else {
                      setSlotError('This slot is not available. Please select a different time.');
                    }
                    console.log('Selected slot:', selectedSlot);
                    console.log('Current slotError:', slotError);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Time Slot</option>
                  {allSlots.map((slot, idx, arr) => {
                    // Remove duplicates by only rendering the first occurrence
                    if (arr.indexOf(slot) !== idx) return null;
                    const isBooked = bookedSlots.includes(slot);
                    console.log(`Slot: ${slot}, isBooked: ${isBooked}`);
                    return (
                      <option key={slot + idx} value={slot} disabled={isBooked} style={isBooked ? { color: 'gray' } : {}}>
                        {slot} {isBooked ? '(already booked)' : ''}
                      </option>
                    );
                  })}
                </select>
              );
            })()
          )}
          {slotError && <div className="text-red-600 text-sm mb-2">{slotError}</div>}
          <textarea
            placeholder="Additional Notes"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
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

  // Render Profile Tab
  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Hospital Profile</h3>
      <HospitalProfile />
    </div>
  );

  // Add search handler
  const handleSearch = () => {
    fetchAppointments();
  };

  // Add search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
      </header>      {/* Removed duplicate local notification system - using global Redux notifications only */}

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
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hospital Profile
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
          {!loading && activeTab === 'profile' && renderProfile()}
        </div>
      </main>

      {/* Modals */}
      {showCreateForm && renderCreateForm()}
    </div>
  );
};

export default HospitalDashboard;
