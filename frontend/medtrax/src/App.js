import './App.css';
import { Routes, Route } from 'react-router-dom';  // Remove Router import here

import Home2 from './user/pages/Homepage';
import Layout from './user/components/Layout';
import Hospital from './user/pages/Hospital';
import Appointments from './user/pages/Appointments';
import Medicines from './user/pages/Medicines';
import MedicalCarePage from './user/pages/MedicalCare';
import HealthTracker from './user/pages/HealthTracker';
import BabyDevelopmentTracker from './user/pages/BabyDevelopmentTracker';



import HomeStyle3 from './user/hospitals/hospages/HomeStyle3';
import Layout1 from './user/hospitals/hoscomponents/Layout1';


function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Layout />}>

      <Route index element={<Home2 />} />    
      <Route path="/Hospital" element={<Hospital />}/> 
      <Route path="/Appointments" element={<Appointments />}/> 
      <Route path="/Medicines" element={<Medicines />}/> 
      <Route path="/MedicalCare" element={<MedicalCarePage />}/> 
      <Route path="/HealthTracker" element={<HealthTracker />}/> 
      <Route path="/Baby" element={<BabyDevelopmentTracker />}/> 

      </Route>


      <Route path="hosui" element={<Layout1/>}>
        <Route index element={<HomeStyle3 />} />
      </Route>
      </Routes>
    </div>
  );
}

export default App;
