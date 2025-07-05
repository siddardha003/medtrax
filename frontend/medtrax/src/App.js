import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import Home2 from './user/pages/Homepage';
import Layout from './user/components/Layout';
import ScrollToTop from './user/components/ScrollToTop';

import HospitalFinder from './user/pages/Hospital';
import HospitalDetails from './user/pages/HospitalDetails';
import AboutPage from './user/pages/AboutPage';
import ContactPage from './user/pages/ContactPage';

import Appointments from './user/pages/Appointments';
import AppForm from './user/pages/AppForm';

import Medicines from './user/pages/Medicines';
import MedicalshopDetails from './user/pages/MedicalshopDetails';

import MedicalCarePage from './user/pages/MedicalCare';
import HealthTracker from './user/pages/HealthTracker';
import BabyDevelopmentTracker from './user/pages/BabyDevelopmentTracker';
import PeriodCalculator from './user/pages/PeriodCalci';
import EssentialTest from './user/pages/EssentialTests';
import BabyVaccination from './user/pages/BabyVaccination';

// Authentication Components
import UserLogin from './components/Auth/UserLogin';
import AdminLogin from './components/Auth/AdminLogin';
import AuthInitializer from './components/Auth/AuthInitializer';
import Notification from './components/Notification/Notification';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { HospitalDashboard } from './components/Hospital';
import ShopDashboard from './components/Shop/ShopDashboard';
import AdminPanel from './components/Admin/AdminPanel';
import AdminPortal from './components/Admin/AdminPortal';
import Signup from './user/components/Signup.jsx';

import MedReminder from './user/pages/Medreminder';
import SymptomChecker from './user/pages/SymptomChecker';
import HealthBlog from './user/pages/HealthBlog';
import Faq from './user/pages/FrequentQuestions.jsx';
import PrivacyPolicy from './user/pages/PrivacyPolicy.jsx'
// The push setup is now handled within MedReminder.jsx to ensure user is authenticated.
// We can remove the imports and the useEffect hook from here to prevent duplicate/unauthorized calls.
// import { registerServiceWorker, getVapidPublicKey, subscribeUserToPush } from './notifications';

function App() {
  /*
  useEffect(() => {
    async function setupPush() {
      try {
        const swReg = await registerServiceWorker();
        const publicKey = await getVapidPublicKey();
        await subscribeUserToPush(swReg, publicKey);
      } catch (err) {
        
      }
    }
    setupPush();
  }, []);
  */
  return (
    <AuthInitializer>
      <div className="App">
        <ScrollToTop />
        <Notification />
        <Routes>
          {/* Public and user-facing routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home2 />} />
            <Route path="/Hospital" element={<HospitalFinder />} />
            <Route path="/HospitalDetails" element={<HospitalDetails />} />
            <Route path="/About" element={<AboutPage />} />
            <Route path="/Contact" element={<ContactPage />} />
            <Route path="/Appointments" element={<Appointments />} />
            <Route path="/AppForm" element={<AppForm />} />
            <Route path="/Medicines" element={<Medicines />} />
            <Route path="/MedicalshopDetails" element={<MedicalshopDetails />} />
            <Route path="/MedicalCare" element={<MedicalCarePage />} />
            <Route path="/HealthTracker" element={<HealthTracker />} />
            <Route path="/Baby" element={<BabyDevelopmentTracker />} />
            <Route path="/BabyVaccine" element={<BabyVaccination />} />
            <Route path="/PeriodCalci" element={<PeriodCalculator />} />
            <Route path="/Medreminder" element={<MedReminder />} />
            <Route path="/SymptomChecker" element={<SymptomChecker />} />
            <Route path="/EssentialTest" element={<EssentialTest />} />
            <Route path="/HealthBlog" element={<HealthBlog />} />
            <Route path="/Faq" element={<Faq />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />


            
            {/* Authentication Routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          
          {/* User Dashboard Route - redirects to homepage with user layout */}
          <Route path="/user-home" element={
            <ProtectedRoute>
              <Layout>
                <Home2 />
              </Layout>
            </ProtectedRoute>
          } />
        
          {/* Admin routes without Layout to prevent header/footer display */}
          <Route path="/hospital-dashboard" element={
            <ProtectedRoute requiredRole="hospital_admin">
              <HospitalDashboard />
            </ProtectedRoute>
          } />

          <Route path="/shop-dashboard" element={
            <ProtectedRoute requiredRole="shop_admin">
              <ShopDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin-panel" element={
            <ProtectedRoute requiredRole="super_admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
      </Routes>
      </div>
    </AuthInitializer>
  );
}

export default App;
