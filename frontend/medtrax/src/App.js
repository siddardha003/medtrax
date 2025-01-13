import './App.css';
import { Routes, Route } from 'react-router-dom';  // Remove Router import here
import 'leaflet/dist/leaflet.css';
import Home2 from './user/pages/Homepage';
import Layout from './user/components/Layout';

import Hospital from './user/pages/Hospital';
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


import Signin from './user/components/Signin';
import Signup from './user/components/Signup';

import MedReminder from './user/pages/Medreminder';





function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Layout />}>

      <Route index element={<Home2 />} />    
      <Route path="/Hospital" element={<Hospital />}/> 
      <Route path="/HospitalDetails" element={<HospitalDetails/>}/> 
      <Route path="/About" element={< AboutPage/>}/>
      <Route path="/Contact" element={< ContactPage/>}/>


      <Route path="/Appointments" element={<Appointments />}/> 
      <Route path="/AppForm" element={<AppForm />}/> 

      <Route path="/Medicines" element={<Medicines />}/> 
      <Route path="/MedicalshopDetails" element={<MedicalshopDetails/>}/> 

      <Route path="/MedicalCare" element={<MedicalCarePage />}/> 
      <Route path="/HealthTracker" element={<HealthTracker />}/> 
      <Route path="/Baby" element={<BabyDevelopmentTracker />}/> 
      <Route path="/BabyVaccine" element={<BabyVaccination />} />
      <Route path="/PeriodCalci" element={<PeriodCalculator />}/> 
      <Route path="/Medreminder" element={<MedReminder />}/> 

      
      <Route path="/EssentialTest" element={<EssentialTest />}/>

      <Route path="/login" element={<Signin />}/> 
      <Route path="/Signup" element={<Signup/>}/> 



      </Route>
      </Routes>
    </div>
  );
}

export default App;
