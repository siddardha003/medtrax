import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' })

API.interceptors.request.use(req => {
  const token = JSON.parse(localStorage.getItem('profile'))?.token;
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// Hospital Management APIs (Public for listing)
export const getHospitalsApi = (params) => API.get('/api/public/hospitals', { params })
export const getHospitalApi = (id) => API.get(`/api/public/hospitals/${id}`)
export const createHospitalApi = (formData) => API.post('/api/admin/hospitals', formData)
export const updateHospitalApi = (id, formData) => API.put(`/api/admin/hospitals/${id}`, formData)
export const deleteHospitalApi = (id) => API.delete(`/api/admin/hospitals/${id}`)

// Hospital Appointments APIs
export const getAppointmentsApi = (params) => API.get('/api/hospital/appointments', { params })
export const getAppointmentApi = (id) => API.get(`/api/hospital/appointments/${id}`)
export const createAppointmentApi = (formData) => API.post('/api/hospital/appointments', formData)
export const updateAppointmentApi = (id, formData) => API.put(`/api/hospital/appointments/${id}`, formData)
export const cancelAppointmentApi = (id, formData) => API.put(`/api/hospital/appointments/${id}/cancel`, formData)
export const getAppointmentStatsApi = () => API.get('/api/hospital/appointments/stats')
export const searchPatientsApi = (query) => API.get(`/api/hospital/patients/search?q=${query}`)

// Shop Management APIs (Public for listing)
export const getShopsApi = (params) => API.get('/api/public/shops', { params })
export const getShopApi = (id) => API.get(`/api/public/shops/${id}`)
export const createShopApi = (formData) => API.post('/api/admin/shops', formData)
export const updateShopApi = (id, formData) => API.put(`/api/admin/shops/${id}`, formData)
export const deleteShopApi = (id) => API.delete(`/api/admin/shops/${id}`)

// Shop Inventory APIs
export const getInventoryApi = (params) => API.get('/api/shop/inventory', { params })
export const getInventoryItemApi = (id) => API.get(`/api/shop/inventory/${id}`)
export const addInventoryItemApi = (formData) => API.post('/api/shop/inventory', formData)
export const updateInventoryItemApi = (id, formData) => API.put(`/api/shop/inventory/${id}`, formData)
export const deleteInventoryItemApi = (id) => API.delete(`/api/shop/inventory/${id}`)
export const updateStockApi = (id, formData) => API.put(`/api/shop/inventory/${id}/stock`, formData)
export const getLowStockItemsApi = () => API.get('/api/shop/inventory/low-stock')
export const getExpiringItemsApi = () => API.get('/api/shop/inventory/expiring')

// Shop Orders APIs
export const createOrderApi = (formData) => API.post('/api/shop/orders', formData)
export const getOrdersApi = (params) => API.get('/api/shop/orders', { params })
export const getOrderApi = (id) => API.get(`/api/shop/orders/${id}`)
export const updateOrderStatusApi = (id, formData) => API.put(`/api/shop/orders/${id}/status`, formData)
export const getShopStatsApi = () => API.get('/api/shop/stats')

// Admin User Management APIs
export const getAdminUsersApi = (params) => API.get('/api/admin/users', { params })
export const getAdminUserApi = (id) => API.get(`/api/admin/users/${id}`)
export const createAdminUserApi = (formData) => API.post('/api/admin/users', formData)
export const updateAdminUserApi = (id, formData) => API.put(`/api/admin/users/${id}`, formData)
export const deleteAdminUserApi = (id) => API.delete(`/api/admin/users/${id}`)
export const getUserStatsApi = () => API.get('/api/admin/users/stats')
export const getSystemStatsApi = () => API.get('/api/admin/stats')

// Admin Hospital Management APIs  
export const getAdminHospitalsApi = (params) => API.get('/api/admin/hospitals', { params })
export const getAdminHospitalApi = (id) => API.get(`/api/admin/hospitals/${id}`)
export const createAdminHospitalApi = (formData) => API.post('/api/admin/hospitals', formData)
export const updateAdminHospitalApi = (id, formData) => API.put(`/api/admin/hospitals/${id}`, formData)
export const deleteAdminHospitalApi = (id) => API.delete(`/api/admin/hospitals/${id}`)

// Admin Shop Management APIs
export const getAdminShopsApi = (params) => API.get('/api/admin/shops', { params })
export const getAdminShopApi = (id) => API.get(`/api/admin/shops/${id}`)
export const createAdminShopApi = (formData) => API.post('/api/admin/shops', formData)
export const updateAdminShopApi = (id, formData) => API.put(`/api/admin/shops/${id}`, formData)
export const deleteAdminShopApi = (id) => API.delete(`/api/admin/shops/${id}`)

// Public APIs (for frontend hospital/shop listing)
export const getPublicHospitalsApi = (params) => API.get('/api/public/hospitals', { params })
export const getPublicShopsApi = (params) => API.get('/api/public/shops', { params })
export const getPublicHospitalDetailsApi = (id) => API.get(`/api/public/hospitals/${id}`)
export const getPublicShopDetailsApi = (id) => API.get(`/api/public/shops/${id}`)
export const getPublicStatsApi = () => API.get('/api/public/stats')

// Auth APIs (updating existing)
export const signUpUserApi = formData => API.post(`/api/auth/register`, formData)
export const signInUserApi = formData => API.post(`/api/auth/login`, formData)
export const getMeApi = () => API.get('/api/auth/me')
export const updateProfileApi = (formData) => API.put('/api/auth/profile', formData)
export const changePasswordApi = (formData) => API.put('/api/auth/change-password', formData)
export const logoutApi = () => API.post('/api/auth/logout')

// Keep existing APIs for backward compatibility
export { signUpUserApi as createUserApi, signInUserApi as loginUserApi }

// Health Tracking APIs
// Weight Tracker APIs
export const saveWeightDataApi = (formData) => API.post('/api/health/weight', formData)
export const getWeightHistoryApi = (params) => API.get('/api/health/weight/history', { params })
export const getLatestWeightApi = () => API.get('/api/health/weight/latest')

// Hormone Tracker APIs
export const saveHormoneDataApi = (formData) => API.post('/api/health/hormone', formData)
export const getHormoneHistoryApi = (params) => API.get('/api/health/hormone/history', { params })

// Sleep Tracker APIs
export const saveSleepDataApi = (formData) => API.post('/api/health/sleep', formData)
export const getSleepHistoryApi = (params) => API.get('/api/health/sleep/history', { params })

// Headache Tracker APIs
export const saveHeadacheDataApi = (formData) => API.post('/api/health/headache', formData)
export const getHeadacheHistoryApi = (params) => API.get('/api/health/headache/history', { params })

// Stress Tracker APIs
export const saveStressDataApi = (formData) => API.post('/api/health/stress', formData)
export const getStressHistoryApi = (params) => API.get('/api/health/stress/history', { params })

// Stomach Tracker APIs
export const saveStomachDataApi = (formData) => API.post('/api/health/stomach', formData)
export const getStomachHistoryApi = (params) => API.get('/api/health/stomach/history', { params })

// Medicine Reminder APIs
export const saveMedicineReminderApi = (formData) => API.post('/api/health/reminder', formData)
export const getMedicineRemindersApi = (params) => API.get('/api/health/reminder', { params })
export const deleteMedicineReminderApi = (id) => API.delete(`/api/health/reminder/${id}`)

// Period Data APIs
export const savePeriodDataApi = (formData) => API.post('/api/health/period', formData)
export const getPeriodDataApi = () => API.get('/api/health/period')

