import "./index.css";
import "./App.css";
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
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
import ScrollToTop from "./Components/ScrollToTop.jsx";
import MedicineFinder from "./pages/MedicineFinder.jsx";
import DoctorProfile from "./Components/Doctorprofile.jsx";
import MedicineFinderOurData from "./pages/MedicineFinderOurData.jsx";
import PatientForm from "./pages/Patient.jsx";
import NearbyFacility from "./pages/NearbyFacility.jsx";
import DiseaseVault from "./Components/DiseaseVault.jsx";
import Diet from "./pages/Diet.jsx";
import PatientHub from "./Components/PatientHub.jsx";

function App() {


  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<MedicalLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/medical" element={<Medical />} />
          <Route path="/disease" element={<Disease />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/diseasedesc" element={<DiseaseDesc />} />
          <Route path="/precaution" element={<Precaution />} />
          <Route path="/doctors" element={<DoctorDirectory />} />
          <Route path="/doctormailtoadmin" element={<VolunteerRegistration />} />
          <Route path="/medicinefinder" element={<MedicineFinder />} />
          <Route path="/medicinefinderourdata" element={<MedicineFinderOurData />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="nearbyfacility" element={<NearbyFacility />} />
          <Route path="/diseasevault" element={<DiseaseVault />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/patienthub" element={<PatientHub/>}/>



          <Route element={<PrivateRoute />}>
            <Route path="/patient" element={<PatientForm />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path='/profile/adminpanel' element={<AdminDashboard />} />
            <Route path="/adminadddoctors" element={<AdminAddDoctor />} />
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;