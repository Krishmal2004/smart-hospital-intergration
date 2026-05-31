import { useState } from 'react';
import { Clock, User, FileText, Activity, TrendingUp } from 'lucide-react';

const mockAppointments = [
  { id: 1, time: '09:00 AM', patient: 'Sarah Jenkins', type: 'Follow-up', status: 'completed' },
  { id: 2, time: '10:30 AM', patient: 'Michael Chen', type: 'Consultation', status: 'active' },
  { id: 3, time: '01:00 PM', patient: 'Emma Davis', type: 'Lab Review', status: 'upcoming' },
  { id: 4, time: '03:15 PM', patient: 'James Wilson', type: 'Routine Check', status: 'upcoming' },
];

const PatientModal = ({ isOpen, onClose, patientName }) => {
  return (
    <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} style={{ backgroundColor: isOpen ? 'rgba(15, 23, 42, 0.4)' : 'transparent', backdropFilter: 'blur(4px)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div className="modal-header border-0 pb-0 pt-4 px-4">
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 p-md-5 pt-0">
            <div className="d-flex align-items-center gap-4 mb-5">
              <div className="bg-blue-light text-blue-primary p-3 rounded-4">
                <User size={48} />
              </div>
              <div>
                <h2 className="fw-bold mb-1 text-dark">{patientName}</h2>
                <p className="text-muted mb-0 fw-medium">ID: #PT-84729</p>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="theme-card text-center shadow-none bg-light border-0">
                  <Activity className="mb-2 text-danger" size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Heart Rate</p>
                  <h3 className="fw-bold text-dark mb-0">72 <small className="fs-6 text-muted">bpm</small></h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="theme-card text-center shadow-none bg-light border-0">
                  <Activity className="mb-2 text-primary" size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Blood Pressure</p>
                  <h3 className="fw-bold text-dark mb-0">120/80</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="theme-card text-center shadow-none bg-light border-0">
                  <FileText className="mb-2 text-warning" size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Latest Labs</p>
                  <h3 className="fw-bold text-success mb-0">Normal</h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-4 bg-blue-light" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
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

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4">
        <div>
          <h1 className="display-6 fw-bold mb-2 text-dark">Dr. Emily Chen</h1>
          <p className="text-muted fs-6">Cardiology Dept &bull; <span className="fw-medium text-dark">Tuesday, Oct 24</span></p>
        </div>
        
        <div className="theme-card" style={{ width: '100%', maxWidth: '350px' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted fw-bold small text-uppercase d-flex align-items-center gap-2">
              <TrendingUp size={16} className="text-warning"/> Workload
            </span>
            <span className="fw-bold fs-5 text-dark">{workloadPercentage}%</span>
          </div>
          <div className="progress mb-2" style={{ height: '8px' }}>
            <div className="progress-bar bg-primary" style={{ width: `${workloadPercentage}%` }}></div>
          </div>
          <p className="text-muted small text-end mb-0">High patient volume at 1:00 PM</p>
        </div>
      </div>

      <div className="row g-5">
        <div className="col-lg-8">
          <div className="theme-card h-100">
            <h4 className="mb-4 fw-bold text-dark d-flex align-items-center gap-2">
              <Clock className="text-blue-primary" size={24} /> Daily Timeline
            </h4>
            
            <div className="timeline-container">
              <div className="timeline-line"></div>

              {mockAppointments.map((apt) => (
                <div key={apt.id} className="timeline-item" onClick={() => setSelectedPatient(apt.patient)}>
                  <div className={`timeline-dot ${apt.status === 'active' ? 'active' : ''}`}></div>
                  
                  <div className={`theme-card shadow-none ${apt.status === 'active' ? 'border-primary bg-blue-light' : 'bg-white'}`}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <small className={`fw-bold text-uppercase ${apt.status === 'active' ? 'text-primary' : 'text-muted'}`}>{apt.time}</small>
                        <h5 className="mb-0 mt-1 fw-bold text-dark">{apt.patient}</h5>
                      </div>
                      <span className={`badge rounded-pill ${apt.status === 'active' ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>
                        {apt.type}
                      </span>
                    </div>
                    <small className="text-muted">Click to view details</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="theme-card h-100 d-flex flex-column gap-3 bg-light border-0 shadow-none">
            <h5 className="fw-bold text-dark mb-2">Quick Actions</h5>
            <button className="btn-theme-outline w-100 py-3 text-start justify-content-start bg-white border-0 shadow-sm text-dark">
              <FileText size={20} className="text-blue-primary" /> Write Prescription
            </button>
            <button className="btn-theme-outline w-100 py-3 text-start justify-content-start bg-white border-0 shadow-sm text-dark">
              <Activity size={20} className="text-blue-primary" /> Order Labs
            </button>
            
            <div className="mt-auto pt-4 border-top">
              <div className="d-flex align-items-center gap-3 bg-white p-3 rounded-3 shadow-sm border border-light">
                <div className="bg-blue-light text-blue-primary p-2 rounded-2">
                  <span className="fw-bold">EC</span>
                </div>
                <div>
                  <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>System Status</small>
                  <span className="text-success fw-bold d-flex align-items-center gap-2 small">
                    <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '0.5rem', height: '0.5rem' }}></span> Active
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
