import { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { 
  Clock, User, FileText, Activity, TrendingUp, Pill, 
  Home, List, History as HistoryIcon, CalendarDays 
} from 'lucide-react';

import WritePrescription from './Prescription/WritePrescription';
import OrderLabs from './Prescription/OrderLabs';

const mockAppointments = [
  { id: 1, time: '09:00 AM', patient: 'Sarah Jenkins', type: 'Follow-up', status: 'completed', history: 'Patient has a history of mild hypertension, managed with lifestyle changes. Last comprehensive metabolic panel was 3 months ago with normal results.' },
  { id: 2, time: '10:30 AM', patient: 'Michael Chen', type: 'Consultation', status: 'active', history: 'No known allergies. First-time visit complaining of acute joint pain.' },
  { id: 3, time: '01:00 PM', patient: 'Emma Davis', type: 'Lab Review', status: 'upcoming', history: 'Awaiting Lipid panel results from previous visit. Currently on Atorvastatin 20mg.' },
  { id: 4, time: '03:15 PM', patient: 'James Wilson', type: 'Routine Check', status: 'upcoming', history: 'Diabetic (Type 2). Managed with Metformin 500mg. Regular checkup.' },
];

const mockPreviousPatients = [
  { id: 5, time: 'Yesterday', patient: 'Alicia Keys', type: 'Consultation', status: 'completed', history: 'Complained of chronic migraines. Ordered MRI and prescribed acute pain relief.' },
  { id: 6, time: 'Nov 02', patient: 'Robert Pattinson', type: 'Lab Review', status: 'completed', history: 'Reviewed blood work. Vitamin D deficiency noted. Prescribed supplements.' },
];

const PatientModal = ({ isOpen, onClose, patient, onWritePrescription }) => {
  if (!isOpen || !patient) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div className="modal-header border-0 pb-0 pt-4 px-4">
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 p-md-5 pt-0">
            <div className="d-flex align-items-center gap-4 mb-5">
              <div className="orange-icon-bg p-3 rounded-4" style={{ width: '80px', height: '80px', backgroundColor: 'var(--orange-light, #fff3e0)' }}>
                <User size={48} className="text-orange" style={{ color: 'var(--primary-orange, #f97316)' }}/>
              </div>
              <div>
                <h2 className="fw-bold mb-1 text-dark">{patient.patient}</h2>
                <p className="text-muted mb-0 fw-medium">ID: #PT-84729 &bull; {patient.type}</p>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="theme-card text-center shadow-sm bg-light border-0 py-4 rounded-4">
                  <Activity className="mb-2 text-danger" size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Heart Rate</p>
                  <h3 className="fw-bold text-dark mb-0">72 <small className="fs-6 text-muted">bpm</small></h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="theme-card text-center shadow-sm bg-light border-0 py-4 rounded-4">
                  <Activity className="mb-2" style={{ color: 'var(--primary-orange, #f97316)' }} size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Blood Pressure</p>
                  <h3 className="fw-bold text-dark mb-0">120/80</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="theme-card text-center shadow-sm bg-light border-0 py-4 rounded-4">
                  <FileText className="mb-2 text-warning" size={24} />
                  <p className="text-muted mb-1 small fw-bold text-uppercase">Latest Labs</p>
                  <h3 className="fw-bold text-success mb-0">Normal</h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: 'var(--orange-light, #fff3e0)', borderLeft: '4px solid var(--primary-orange, #f97316)' }}>
              <h6 className="fw-bold text-dark mb-2">Medical History Summary</h6>
              <p className="text-muted mb-0 small lh-lg">
                {patient.history}
              </p>
            </div>

            <div className="d-flex gap-3 pt-2">
              <button 
                className="btn-outline-gray flex-fill py-3 justify-content-center shadow-sm bg-white border rounded-3" 
                style={{ fontWeight: 'bold' }}
                onClick={() => {
                  onClose();
                  onWritePrescription();
                }}
              >
                <Pill size={18} style={{ color: 'var(--primary-orange, #f97316)' }} className="me-2" /> Write Prescription
              </button>
              <button className="btn-outline-gray flex-fill py-3 justify-content-center shadow-sm bg-white border rounded-3" style={{ fontWeight: 'bold' }}>
                <Activity size={18} style={{ color: 'var(--primary-orange, #f97316)' }} className="me-2" /> Order Labs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  
  // Navigation State
  const [currentView, setCurrentView] = useState('dashboard');
  
  const workloadPercentage = 75;

  // Schedule & Date State
  const todayFormatted = new Date().toISOString().split('T')[0];
  const [scheduleDate, setScheduleDate] = useState(todayFormatted);
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '17:00' });
  const [freeTime, setFreeTime] = useState({ start: '12:00', end: '13:00' });
  const [headerDate, setHeaderDate] = useState('');

  const { state, getDecodedIDToken } = useAuthContext();
  const [doctorInfo, setDoctorInfo] = useState({ name: "Loading...", isAuthorized: false, isLoading: true });

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setHeaderDate(new Date().toLocaleDateString(undefined, options));

    if (state.isAuthenticated) {
      getDecodedIDToken().then((token) => {
        const userGroups = token.groups || [];
        const accountType = token.account_type || token.accountType || ""; 
        const isDoctor = userGroups.includes("Doctors") || accountType.toLowerCase() === "doctor";

        setDoctorInfo({
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

  // Handle Navigation
  const handleNavigation = (view, tab = null) => {
    setCurrentView(view);
    if (tab) setActiveTab(tab);
  };

  if (state.isLoading || doctorInfo.isLoading) {
    return (
      <div className="container text-center py-5 mt-5">
        <div className="spinner-border text-orange" style={{ color: 'var(--primary-orange, #f97316)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!doctorInfo.isAuthorized) {
    return (
      <div className="container text-center py-5 mt-5">
        <div className="theme-card p-5 d-inline-block border-0 border-top border-danger border-4 shadow-sm bg-white rounded-4">
          <h2 className="text-danger fw-bold mb-3">Access Denied</h2>
          <p className="text-muted mb-0">You do not have medical staff permissions to view this portal.</p>
        </div>
      </div>
    );
  }

  const displayedPatients = activeTab === 'today' ? mockAppointments : mockPreviousPatients;

  // Render Sidebar Item Helper
  const SidebarItem = ({ id, icon: Icon, label, requiredTab = null }) => {
    const isActive = requiredTab 
      ? (currentView === 'dashboard' && activeTab === requiredTab)
      : (currentView === id);

    return (
      <button
        onClick={() => handleNavigation(id === 'today' || id === 'history' ? 'dashboard' : id, requiredTab)}
        className="btn w-100 text-start d-flex align-items-center gap-3 py-3 px-4 border-0 mb-2 rounded-4 transition-all"
        style={{
          backgroundColor: isActive ? 'var(--orange-light, #fff3e0)' : 'transparent',
          color: isActive ? 'var(--primary-orange, #f97316)' : '#6b7280',
          fontWeight: isActive ? 'bold' : '500'
        }}
      >
        <Icon size={20} /> {label}
      </button>
    );
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      
      {/* 1. Sidebar Navigation */}
      <div className="bg-white border-end shadow-sm flex-shrink-0 p-4" style={{ width: '280px' }}>
        <div className="mb-5 px-2">
          <h4 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--primary-orange, #f97316)' }}>
            <Activity size={28} /> DocPortal
          </h4>
        </div>

        <nav className="d-flex flex-column gap-1">
          <p className="text-muted small fw-bold text-uppercase px-4 mb-2 mt-2">Main Menu</p>
          <SidebarItem id="dashboard" icon={Home} label="Dashboard Overview" />
          
          <p className="text-muted small fw-bold text-uppercase px-4 mb-2 mt-4">Patients</p>
          <SidebarItem id="today" icon={List} label="Today's Appointments" requiredTab="today" />
          <SidebarItem id="history" icon={HistoryIcon} label="Patient History" requiredTab="previous" />
          
          <p className="text-muted small fw-bold text-uppercase px-4 mb-2 mt-4">Clinical Actions</p>
          <SidebarItem id="prescription" icon={Pill} label="Write Prescription" />
          <SidebarItem id="orderLabs" icon={Activity} label="Order Labs" />
          
          <p className="text-muted small fw-bold text-uppercase px-4 mb-2 mt-4">Management</p>
          <SidebarItem id="scheduling" icon={CalendarDays} label="Scheduling" />
        </nav>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-grow-1 p-4 p-md-5 overflow-auto">
        
        {/* Render Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="fade-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4">
              <div>
                <h1 className="display-6 fw-bold mb-2 text-dark">{doctorInfo.name}</h1>
                <p className="text-muted fs-6">Cardiology Dept &bull; <span className="fw-medium text-dark">{headerDate}</span></p>
              </div>
              
              <div className="theme-card p-4 border border-light bg-white shadow-sm rounded-4" style={{ width: '100%', maxWidth: '350px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted fw-bold small text-uppercase d-flex align-items-center gap-2">
                    <TrendingUp size={16} style={{ color: 'var(--primary-orange, #f97316)' }}/> Workload
                  </span>
                  <span className="fw-bold fs-5 text-dark">{workloadPercentage}%</span>
                </div>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div className="progress-bar rounded-pill" style={{ width: `${workloadPercentage}%`, backgroundColor: 'var(--primary-orange, #f97316)' }}></div>
                </div>
                <p className="text-muted small text-end mb-0">High patient volume at 1:00 PM</p>
              </div>
            </div>

            <div className="row g-5">
              <div className="col-lg-8">
                <div className="theme-card h-100 p-4 border border-light bg-white shadow-sm rounded-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                      <Clock style={{ color: 'var(--primary-orange, #f97316)' }} size={24} /> 
                      {activeTab === 'today' ? "Today's Patient Roster" : "Patient History"}
                    </h4>
                  </div>
                  
                  <div className="timeline-container d-flex flex-column gap-3">
                    {displayedPatients.map((apt) => (
                      <div key={apt.id} className="timeline-item position-relative" onClick={() => setSelectedPatient(apt)} style={{ cursor: 'pointer' }}>
                        <div className="theme-card p-4 shadow-sm rounded-4 transition-all border" style={{ borderColor: apt.status === 'active' ? 'var(--primary-orange, #f97316)' : '#f3f4f6', backgroundColor: apt.status === 'active' ? 'var(--orange-light, #fffaf0)' : '#fff' }}>
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div>
                              <small className="fw-bold text-uppercase" style={{ color: apt.status === 'active' ? 'var(--primary-orange, #f97316)' : '#6c757d' }}>{apt.time}</small>
                              <h5 className="mb-0 mt-1 fw-bold text-dark">{apt.patient}</h5>
                            </div>
                            <span className="badge rounded-pill border py-2 px-3" style={{ backgroundColor: apt.status === 'active' ? 'var(--primary-orange, #f97316)' : '#fff', color: apt.status === 'active' ? '#fff' : '#6c757d' }}>
                              {apt.type}
                            </span>
                          </div>
                          <small className="text-muted mt-2 d-block text-truncate">History: {apt.history}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="d-flex flex-column gap-4 h-100">
                  <div className="theme-card d-flex flex-column gap-3 bg-white shadow-sm border border-light rounded-4 p-4">
                    <h5 className="fw-bold text-dark mb-2">Quick Actions</h5>
                    <button 
                      className="btn w-100 py-3 text-start d-flex align-items-center gap-3 shadow-sm border rounded-3 bg-light"
                      onClick={() => handleNavigation('prescription')}
                    >
                      <Pill size={20} style={{ color: 'var(--primary-orange, #f97316)' }} /> 
                      <span className="fw-bold text-dark">Write Prescription</span>
                    </button>
                    <button 
                      className="btn w-100 py-3 text-start d-flex align-items-center gap-3 shadow-sm border rounded-3 bg-light"
                      onClick={() => handleNavigation('orderLabs')}
                    >
                      <Activity size={20} style={{ color: 'var(--primary-orange, #f97316)' }} /> 
                      <span className="fw-bold text-dark">Order Labs</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Prescription View */}
        {currentView === 'prescription' && (
          <div className="fade-in bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100">
            <WritePrescription onBack={() => handleNavigation('dashboard')} />
          </div>
        )}

        {/* Render Order Labs View */}
        {currentView === 'orderLabs' && (
          <div className="fade-in bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100">
            <OrderLabs onBack={() => handleNavigation('dashboard')} />
          </div>
        )}

        {/* Render Scheduling View */}
        {currentView === 'scheduling' && (
          <div className="fade-in h-100 d-flex flex-column">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div>
                <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                  <CalendarDays style={{ color: 'var(--primary-orange, #f97316)' }} size={28} /> Appointment Scheduling
                </h2>
                <p className="text-muted mb-0">Manage your daily clinic availability and block free time.</p>
              </div>
            </div>

            <div className="theme-card bg-white shadow-sm border border-light rounded-4 p-5 max-w-md" style={{ maxWidth: '600px' }}>
              <div className="mb-4">
                <label className="text-muted small fw-bold text-uppercase mb-2">Select Date</label>
                <input 
                  type="date" 
                  className="form-control bg-light border-0 shadow-sm p-3" 
                  value={scheduleDate} 
                  min={todayFormatted}
                  onChange={(e) => setScheduleDate(e.target.value)} 
                />
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-bold text-uppercase mb-2">Appointment Hours</label>
                <div className="d-flex align-items-center gap-3">
                  <input type="time" className="form-control bg-light border-0 shadow-sm p-3" value={workingHours.start} onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})} />
                  <span className="text-muted fw-bold">to</span>
                  <input type="time" className="form-control bg-light border-0 shadow-sm p-3" value={workingHours.end} onChange={(e) => setWorkingHours({...workingHours, end: e.target.value})} />
                </div>
              </div>

              <div className="mb-5">
                <label className="text-muted small fw-bold text-uppercase mb-2">Block Free Time / Break</label>
                <div className="d-flex align-items-center gap-3">
                  <input type="time" className="form-control bg-light border-0 shadow-sm p-3" value={freeTime.start} onChange={(e) => setFreeTime({...freeTime, start: e.target.value})} />
                  <span className="text-muted fw-bold">to</span>
                  <input type="time" className="form-control bg-light border-0 shadow-sm p-3" value={freeTime.end} onChange={(e) => setFreeTime({...freeTime, end: e.target.value})} />
                </div>
              </div>
              
              <button className="btn w-100 py-3 shadow-sm" style={{ backgroundColor: 'var(--primary-orange, #f97316)', color: '#fff', fontWeight: 'bold', borderRadius: '0.5rem' }}>
                Save Daily Schedule
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Patient Detail Modal */}
      <PatientModal 
        isOpen={!!selectedPatient} 
        onClose={() => setSelectedPatient(null)} 
        patient={selectedPatient} 
        onWritePrescription={() => handleNavigation('prescription')}
      />
    </div>
  );
};

export default DoctorDashboard;