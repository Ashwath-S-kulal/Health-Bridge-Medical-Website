import "./index.css";
import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Hospital from './pages/Hospital.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';
import Medical from './pages/medical.jsx';
import Disease from './pages/disease.jsx';
import Symptoms from './pages/Symptoms.jsx';
import DiseaseDesc from './pages/DiseaseDescription.jsx';
import Precaution from './pages/Precaution.jsx';
import MedicalLandingPage from './pages/LandingPage.jsx';
import Profile from './pages/Profile.jsx';
import AdminRoute from "./Components/AdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DoctorDirectory from "./pages/Doctors.jsx";
import AdminAddDoctor from "./pages/AdminAddDoctor.jsx";
import VolunteerRegistration from "./pages/DoctorMailToAdmin.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={<MedicalLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/medical" element={<Medical />} />
          <Route path="/disease" element={<Disease />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/diseasedesc" element={<DiseaseDesc />} />
          <Route path="/precaution" element={<Precaution />} />
          <Route path="/doctors" element={<DoctorDirectory />} />
          <Route path="/doctormailtoadmin" element={<VolunteerRegistration/>}/>


          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path='/profile/adminpanel' element={<AdminDashboard />} />
            <Route path="/adminadddoctors" element={<AdminAddDoctor />} />
          </Route>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;