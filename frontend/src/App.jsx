import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientPortal from './pages/PatientPortal';
import DoctorLogin from './pages/DoctorLogin';
import PatientLogin from './pages/PatientLogin';
import ReceptionDashboard from './prescription-counter(patient-registration && payment)/ReceptionDashboard';
import LabDashboard from './lab/LabDashboard';
import DispensaryDashboard from './dispensary/DispensaryDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login/doctor" element={<DoctorLogin />} />
          <Route path="login/patient" element={<PatientLogin />} />
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="patient" element={<PatientPortal />} />
          <Route path="reception" element={<ReceptionDashboard />} />
          <Route path="lab" element={<LabDashboard />} />
          <Route path="dispensary" element={<DispensaryDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
