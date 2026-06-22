import { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { Clock, User, FileText, Activity, TrendingUp, Pill, Home, List, History as HistoryIcon, CalendarDays } from 'lucide-react';

import WritePrescription from './Prescription/WritePrescription';
import OrderLabs from './Prescription/OrderLabs';

// MODAL COMPONENT
const PatientModal = ({ isOpen, onClose, patient, onNavigateAction }) => {
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
                <p className="text-muted mb-0 fw-medium">ID: {patient.patientId} &bull; {patient.type}</p>
              </div>
            </div>

            <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: 'var(--orange-light, #fff3e0)', borderLeft: '4px solid var(--primary-orange, #f97316)' }}>
              <h6 className="fw-bold text-dark mb-2">Medical History Summary</h6>
              <p className="text-muted mb-0 small lh-lg">{patient.history}</p>
            </div>

            <div className="d-flex gap-3 pt-2">
              {/* FIX: Trigger navigation WITH the patient data */}
              <button 
                className="btn-outline-gray flex-fill py-3 justify-content-center shadow-sm bg-white border rounded-3" 
                style={{ fontWeight: 'bold' }}
                onClick={() => onNavigateAction('prescription', patient)}
              >
                <Pill size={18} style={{ color: 'var(--primary-orange, #f97316)' }} className="me-2" /> Write Prescription
              </button>
              <button 
                className="btn-outline-gray flex-fill py-3 justify-content-center shadow-sm bg-white border rounded-3" 
                style={{ fontWeight: 'bold' }}
                onClick={() => onNavigateAction('orderLabs', patient)}
              >
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
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [actionPatient, setActionPatient] = useState(null);
  
  const [headerDate, setHeaderDate] = useState('');
  const { state, getDecodedIDToken } = useAuthContext();
  const [doctorInfo, setDoctorInfo] = useState({ id: null, name: "Loading...", isAuthorized: false, isLoading: true });

  const [appointments, setAppointments] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  const loadAppointments = async (doctorId) => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        fetch(`http://localhost:8080/api/appointments/today/${doctorId}`),
        fetch(`http://localhost:8080/api/appointments/history/${doctorId}`)
      ]);
      if (todayRes.ok) setAppointments(await todayRes.json());
      if (historyRes.ok) setHistoryList(await historyRes.json());
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setHeaderDate(new Date().toLocaleDateString(undefined, options));

    if (state.isAuthenticated) {
      getDecodedIDToken().then((token) => {
        const userGroups = token.groups || [];
        const accountType = token.account_type || token.accountType || ""; 
        const isDoctor = userGroups.includes("Doctors") || accountType.toLowerCase() === "doctor";
        const doctorId = token.sub;

        setDoctorInfo({
          id: doctorId,
          name: token.given_name ? `Dr. ${token.given_name} ${token.family_name || ''}` : (token.username || "Doctor"),
          isAuthorized: isDoctor,
          isLoading: false
        });

        if (isDoctor && doctorId) {
          loadAppointments(doctorId);
        }
      }).catch((error) => {
        console.error("Failed to fetch user info", error);
        setDoctorInfo(prev => ({ ...prev, isLoading: false }));
      });
    }
  }, [state.isAuthenticated, getDecodedIDToken, currentView]);

  // FIX: Updated Navigation handler to accept patient data
  const handleNavigation = (view, tab = null, patientToActOn = null) => {
    setCurrentView(view);
    if (tab) setActiveTab(tab);
    setActionPatient(patientToActOn);
    setSelectedPatient(null); // Closes the modal automatically
  };

  if (state.isLoading || doctorInfo.isLoading) return <div className="text-center py-5 mt-5">Loading...</div>;
  if (!doctorInfo.isAuthorized) return <div className="text-center py-5 mt-5 text-danger">Access Denied</div>;

  const displayedPatients = activeTab === 'today' ? appointments : historyList;

  const SidebarItem = ({ id, icon: Icon, label, requiredTab = null }) => {
    const isActive = requiredTab ? (currentView === 'dashboard' && activeTab === requiredTab) : (currentView === id);
    return (
      <button
        onClick={() => handleNavigation(id === 'today' || id === 'history' ? 'dashboard' : id, requiredTab)}
        className="btn w-100 text-start d-flex align-items-center gap-3 py-3 px-4 border-0 mb-2 rounded-4"
        style={{ backgroundColor: isActive ? 'var(--orange-light, #fff3e0)' : 'transparent', color: isActive ? 'var(--primary-orange, #f97316)' : '#6b7280', fontWeight: isActive ? 'bold' : '500' }}
      >
        <Icon size={20} /> {label}
      </button>
    );
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
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
          {/* Note: Clicking from sidebar passes 'null' patient, so search bar appears as expected */}
          <SidebarItem id="prescription" icon={Pill} label="Write Prescription" />
          <SidebarItem id="orderLabs" icon={Activity} label="Order Labs" />
        </nav>
      </div>

      <div className="flex-grow-1 p-4 p-md-5 overflow-auto">
        {currentView === 'dashboard' && (
          <div className="fade-in">
            <div className="mb-5">
              <h1 className="display-6 fw-bold mb-2 text-dark">{doctorInfo.name}</h1>
              <p className="text-muted fs-6">Cardiology Dept &bull; <span className="fw-medium text-dark">{headerDate}</span></p>
            </div>

            <div className="row g-5">
              <div className="col-lg-8">
                <div className="theme-card h-100 p-4 border border-light bg-white shadow-sm rounded-4">
                  <h4 className="mb-4 fw-bold text-dark d-flex align-items-center gap-2">
                    <Clock style={{ color: 'var(--primary-orange, #f97316)' }} size={24} /> 
                    {activeTab === 'today' ? "Today's Patient Roster" : "Patient History"}
                  </h4>
                  <div className="timeline-container d-flex flex-column gap-3">
                    {displayedPatients.length === 0 ? (
                       <div className="text-center py-5 text-muted">No patients found.</div>
                    ) : (
                      displayedPatients.map((apt) => (
                        <div key={apt.id} className="theme-card p-4 shadow-sm rounded-4 border" style={{ cursor: 'pointer', borderColor: apt.status === 'active' ? 'var(--primary-orange, #f97316)' : '#f3f4f6' }} onClick={() => setSelectedPatient(apt)}>
                          <div className="d-flex justify-content-between">
                            <div>
                              <small className="fw-bold text-uppercase" style={{ color: apt.status === 'active' ? 'var(--primary-orange, #f97316)' : '#6c757d' }}>{apt.time}</small>
                              <h5 className="mb-0 mt-1 fw-bold text-dark">{apt.patient}</h5>
                            </div>
                          </div>
                          <small className="text-muted mt-2 d-block text-truncate">History: {apt.history}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="theme-card d-flex flex-column gap-3 bg-white shadow-sm border border-light rounded-4 p-4">
                  <h5 className="fw-bold text-dark mb-2">Quick Actions</h5>
                  <button className="btn w-100 py-3 text-start d-flex align-items-center gap-3 shadow-sm border rounded-3 bg-light" onClick={() => handleNavigation('prescription')}>
                    <Pill size={20} style={{ color: 'var(--primary-orange, #f97316)' }} /> <span className="fw-bold text-dark">Write Prescription</span>
                  </button>
                  <button className="btn w-100 py-3 text-start d-flex align-items-center gap-3 shadow-sm border rounded-3 bg-light" onClick={() => handleNavigation('orderLabs')}>
                    <Activity size={20} style={{ color: 'var(--primary-orange, #f97316)' }} /> <span className="fw-bold text-dark">Order Labs</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FIX: Passing the actionPatient into the forms */}
        {currentView === 'prescription' && (
          <div className="fade-in bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100">
            <WritePrescription onBack={() => handleNavigation('dashboard')} preselectedPatient={actionPatient} />
          </div>
        )}

        {currentView === 'orderLabs' && (
          <div className="fade-in bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100">
            <OrderLabs onBack={() => handleNavigation('dashboard')} preselectedPatient={actionPatient} />
          </div>
        )}
      </div>

      {/* FIX: Intercept modal actions to format patient data for the forms */}
      <PatientModal 
        isOpen={!!selectedPatient} 
        onClose={() => setSelectedPatient(null)} 
        patient={selectedPatient} 
        onNavigateAction={(view, pat) => {
           // Restructure DB data into the format the forms expect
           const formattedPatient = {
               id: pat.patientId, // The UUID from DB
               name: pat.patient, // Actual Name
               age: 'N/A', location: 'N/A', bloodGroup: 'N/A', allergies: 'N/A'
           };
           handleNavigation(view, null, formattedPatient);
        }}
      />
    </div>
  );
};

export default DoctorDashboard;