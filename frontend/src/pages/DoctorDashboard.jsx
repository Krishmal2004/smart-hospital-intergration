import { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { Clock, User, FileText, Activity, TrendingUp } from 'lucide-react';

const mockAppointments = [
  { id: 1, time: '09:00 AM', patient: 'Sarah Jenkins', type: 'Follow-up', status: 'completed' },
  { id: 2, time: '10:30 AM', patient: 'Michael Chen', type: 'Consultation', status: 'active' },
  { id: 3, time: '01:00 PM', patient: 'Emma Davis', type: 'Lab Review', status: 'upcoming' },
  { id: 4, time: '03:15 PM', patient: 'James Wilson', type: 'Routine Check', status: 'upcoming' },
];

const PatientModal = ({ isOpen, onClose, patientName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div className="modal-header border-0 pb-0 pt-4 px-4">
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 p-md-5 pt-0">
            <div className="d-flex align-items-center gap-4 mb-5">
              <div className="orange-icon-bg p-3 rounded-4" style={{ width: '80px', height: '80px' }}>
                <User size={48} />
              </div>
              <div>
                <h2 className="fw-bold mb-1 text-dark">{patientName}</h2>
                <p className="text-muted mb-0 fw-medium">ID: #PT-84729</p>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="theme-card text-center shadow-none bg-light border-0 py-4">
                  <Activity className="mb-2 text-danger" size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Heart Rate</p>
                  <h3 className="fw-bold text-dark mb-0">72 <small className="fs-6 text-muted">bpm</small></h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="theme-card text-center shadow-none bg-light border-0 py-4">
                  <Activity className="mb-2 text-orange" size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Blood Pressure</p>
                  <h3 className="fw-bold text-dark mb-0">120/80</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="theme-card text-center shadow-none bg-light border-0 py-4">
                  <FileText className="mb-2 text-warning" size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Latest Labs</p>
                  <h3 className="fw-bold text-success mb-0">Normal</h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-4" style={{ backgroundColor: 'var(--orange-light)', borderLeft: '4px solid var(--primary-orange)' }}>
              <h6 className="fw-bold text-dark mb-2">Medical History Summary</h6>
              <p className="text-muted mb-0 small lh-lg">
                Patient has a history of mild hypertension, currently managed with lifestyle changes. No known allergies. Last comprehensive metabolic panel was 3 months ago with normal results. Complains of occasional migraines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const workloadPercentage = 75;

  // Asgardeo Authentication Hook using Decoded Token for custom attributes
  const { state, getDecodedIDToken } = useAuthContext();
  const [doctorInfo, setDoctorInfo] = useState({ name: "Loading...", isAuthorized: false, isLoading: true });

  // Fetch User Data and Verify Group or Registration Attribute
  useEffect(() => {
    if (state.isAuthenticated) {
      getDecodedIDToken().then((token) => {
        // Check for traditional Asgardeo Groups
        const userGroups = token.groups || [];
        
        // Check for the custom Self-Registration Attribute
        const accountType = token.account_type || token.accountType || ""; 
        
        // Authorize if they meet either condition
        const isDoctor = userGroups.includes("Doctors") || accountType.toLowerCase() === "doctor";

        setDoctorInfo({
          // Token claims use underscores (given_name) instead of camelCase (givenName)
          name: token.given_name ? `Dr. ${token.given_name} ${token.family_name || ''}` : (token.username || "Doctor"),
          isAuthorized: isDoctor,
          isLoading: false
        });
      }).catch((error) => {
        console.error("Failed to fetch user info", error);
        setDoctorInfo(prev => ({ ...prev, isLoading: false }));
      });
    }
  }, [state.isAuthenticated, getDecodedIDToken]);

  // Loading State
  if (state.isLoading || doctorInfo.isLoading) {
    return (
      <div className="container text-center py-5 mt-5">
        <div className="spinner-border text-orange" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Security Gate: Block access if not authorized
  if (!doctorInfo.isAuthorized) {
    return (
      <div className="container text-center py-5 mt-5">
        <div className="theme-card p-5 d-inline-block border-0 border-top border-danger border-4">
          <h2 className="text-danger fw-bold mb-3">Access Denied</h2>
          <p className="text-muted mb-0">You do not have medical staff permissions to view this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4">
        <div>
          {/* Dynamic Name injected here */}
          <h1 className="display-6 fw-bold mb-2 text-dark">{doctorInfo.name}</h1>
          <p className="text-muted fs-6">Cardiology Dept &bull; <span className="fw-medium text-dark">Today's Schedule</span></p>
        </div>
        
        <div className="theme-card p-3 border-0 bg-section" style={{ width: '100%', maxWidth: '350px' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted fw-bold small text-uppercase d-flex align-items-center gap-2">
              <TrendingUp size={16} className="text-orange"/> Workload
            </span>
            <span className="fw-bold fs-5 text-dark">{workloadPercentage}%</span>
          </div>
          <div className="progress mb-2" style={{ height: '8px' }}>
            <div className="progress-bar bg-primary-orange" style={{ width: `${workloadPercentage}%`, backgroundColor: 'var(--primary-orange)' }}></div>
          </div>
          <p className="text-muted small text-end mb-0">High patient volume at 1:00 PM</p>
        </div>
      </div>

      <div className="row g-5">
        <div className="col-lg-8">
          <div className="theme-card h-100 p-4 border-0">
            <h4 className="mb-4 fw-bold text-dark d-flex align-items-center gap-2">
              <Clock className="text-orange" size={24} /> Daily Timeline
            </h4>
            
            <div className="timeline-container d-flex flex-column gap-3">
              {mockAppointments.map((apt) => (
                <div key={apt.id} className="timeline-item position-relative" onClick={() => setSelectedPatient(apt.patient)} style={{ cursor: 'pointer' }}>
                  
                  <div className={`theme-card p-3 shadow-sm transition-all ${apt.status === 'active' ? 'border-orange' : 'border-0 bg-section'}`} style={{ border: apt.status === 'active' ? '1px solid var(--primary-orange)' : '' }}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <small className={`fw-bold text-uppercase ${apt.status === 'active' ? 'text-orange' : 'text-muted'}`}>{apt.time}</small>
                        <h5 className="mb-0 mt-1 fw-bold text-dark">{apt.patient}</h5>
                      </div>
                      <span className={`badge rounded-pill ${apt.status === 'active' ? 'badge-orange text-orange' : 'bg-white text-muted border'}`}>
                        {apt.type}
                      </span>
                    </div>
                    <small className="text-muted mt-2 d-block">Click to view details</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="theme-card h-100 d-flex flex-column gap-3 bg-section border-0 p-4">
            <h5 className="fw-bold text-dark mb-2">Quick Actions</h5>
            <button className="btn-outline-gray w-100 py-3 text-start justify-content-start shadow-sm bg-white border-0">
              <FileText size={20} className="text-orange" /> Write Prescription
            </button>
            <button className="btn-outline-gray w-100 py-3 text-start justify-content-start shadow-sm bg-white border-0">
              <Activity size={20} className="text-orange" /> Order Labs
            </button>
            
            <div className="mt-auto pt-4 border-top">
              <div className="d-flex align-items-center gap-3 bg-white p-3 rounded-3 shadow-sm border-0">
                <div className="orange-icon-bg p-2 rounded-2">
                  <span className="fw-bold fs-6">SYS</span>
                </div>
                <div>
                  <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>Platform Status</small>
                  <span className="text-success fw-bold d-flex align-items-center gap-2 small">
                    <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '0.5rem', height: '0.5rem' }}></span> Secured by Asgardeo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PatientModal 
        isOpen={!!selectedPatient} 
        onClose={() => setSelectedPatient(null)} 
        patientName={selectedPatient} 
      />
    </div>
  );
};

export default DoctorDashboard;