import { useState, useEffect } from 'react';
import { 
  Pill, Clock, CheckCircle2, AlertTriangle, Search, User, FileText,
  Home, List, PackageOpen, BadgeCheck, X
} from 'lucide-react';

const mockPendingPrescriptions = [
  { id: 'RX-1042', patientId: 'PT-84729', patientName: 'Sarah Jenkins', doctorName: 'Dr. Michael Smith', time: '10:45 AM', status: 'pending', items: [
    { name: 'Amoxicillin 500mg', instructions: '1 capsule three times a day for 7 days', qty: 21, stock: 150 },
    { name: 'Ibuprofen 400mg', instructions: '1 tablet every 6 hours as needed for pain', qty: 30, stock: 500 }
  ]},
  { id: 'RX-1043', patientId: 'PT-92130', patientName: 'James Wilson', doctorName: 'Dr. Emily Chen', time: '11:15 AM', status: 'pending', items: [
    { name: 'Metformin 500mg', instructions: '1 tablet twice a day with meals', qty: 60, stock: 200 }
  ]},
  { id: 'RX-1044', patientId: 'PT-56321', patientName: 'Emma Davis', doctorName: 'Dr. Michael Smith', time: '12:30 PM', status: 'pending', items: [
    { name: 'Atorvastatin 20mg', instructions: '1 tablet daily at bedtime', qty: 30, stock: 10 } // low stock example
  ]},
];

const mockFulfilledPrescriptions = [
  { id: 'RX-1039', patientId: 'PT-11234', patientName: 'Alicia Keys', doctorName: 'Dr. Emily Chen', time: '09:15 AM', status: 'fulfilled', dispensedBy: 'Pharmacist Jane' },
  { id: 'RX-1040', patientId: 'PT-44512', patientName: 'Robert Pattinson', doctorName: 'Dr. John Doe', time: '09:45 AM', status: 'fulfilled', dispensedBy: 'Pharmacist Jane' },
];

const DispensaryModal = ({ isOpen, onClose, prescription, onFulfill }) => {
  const [step, setStep] = useState(1); // 1: Preparation, 2: Patient Auth
  const [packedItems, setPackedItems] = useState({});
  const [patientIdInput, setPatientIdInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Reset state when a new prescription is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPackedItems({});
      setPatientIdInput('');
      setAuthError('');
    }
  }, [isOpen, prescription]);

  if (!isOpen || !prescription) return null;

  const handleTogglePack = (index) => {
    setPackedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const allPacked = prescription.items.every((_, index) => packedItems[index]);

  const handleAuthenticate = () => {
    if (patientIdInput.trim().toUpperCase() === prescription.patientId.toUpperCase()) {
      setAuthError('');
      onFulfill(prescription.id);
      onClose();
    } else {
      setAuthError('Patient ID does not match. Please verify the identity again.');
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          
          <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              {step === 1 ? <PackageOpen className="text-orange" /> : <BadgeCheck className="text-orange" />}
              {step === 1 ? 'Step 1: Preparation & Verification' : 'Step 2: Patient Authentication'}
            </h5>
            <button type="button" className="btn text-muted border-0 bg-transparent p-0" onClick={onClose}><X size={24} /></button>
          </div>

          <div className="modal-body p-4 p-md-5 pt-4">
            {/* Header Info */}
            <div className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-4 bg-light border">
              <div>
                <h4 className="fw-bold mb-1 text-dark">{prescription.patientName}</h4>
                <p className="text-muted mb-0 small">Prescribed by {prescription.doctorName}</p>
              </div>
              <div className="text-end">
                <span className="badge-orange px-3 py-2 rounded-pill d-inline-block mb-1">{prescription.id}</span>
                <p className="text-muted mb-0 small fw-bold">ID: {prescription.patientId}</p>
              </div>
            </div>

            {step === 1 ? (
              // Step 1: Verification & Preparation
              <div className="fade-in">
                <h6 className="fw-bold text-dark mb-3 text-uppercase small">Medication Details</h6>
                <div className="d-flex flex-column gap-3 mb-4">
                  {prescription.items.map((item, index) => (
                    <div key={index} className="theme-card p-3 d-flex align-items-center gap-3 border transition-all" style={{ borderColor: packedItems[index] ? 'var(--primary-orange, #f97316)' : '#e5e7eb', backgroundColor: packedItems[index] ? 'var(--orange-light, #fffaf0)' : '#fff' }}>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id={`pack-${index}`}
                          checked={packedItems[index] || false}
                          onChange={() => handleTogglePack(index)}
                          style={{ width: '1.5em', height: '1.5em', cursor: 'pointer' }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="fw-bold text-dark mb-1">{item.name} <span className="badge bg-secondary ms-2">Qty: {item.qty}</span></h6>
                          {item.stock < item.qty ? (
                            <span className="text-danger small fw-bold d-flex align-items-center gap-1"><AlertTriangle size={14}/> Out of Stock</span>
                          ) : item.stock < 50 ? (
                            <span className="text-warning small fw-bold">Low Stock ({item.stock})</span>
                          ) : (
                            <span className="text-success small fw-bold">In Stock ({item.stock})</span>
                          )}
                        </div>
                        <p className="text-muted mb-0 small">{item.instructions}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-end pt-2 border-top">
                  <button 
                    className="btn btn-primary-orange" 
                    disabled={!allPacked}
                    onClick={() => setStep(2)}
                  >
                    Proceed to Dispensation <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Patient Authentication & Dispensation
              <div className="fade-in">
                <div className="text-center mb-4">
                  <div className="orange-icon-bg d-inline-flex p-4 rounded-circle mb-3" style={{ backgroundColor: 'var(--orange-light, #fff3e0)' }}>
                    <User size={48} className="text-orange" />
                  </div>
                  <h5 className="fw-bold text-dark mb-2">Verify Patient Identity</h5>
                  <p className="text-muted">Please ask the patient for their ID or Date of Birth to ensure correct dispensation.</p>
                </div>

                <div className="mb-4 max-w-md mx-auto" style={{ maxWidth: '400px' }}>
                  <label className="fw-bold text-dark small text-uppercase mb-2">Enter Patient ID</label>
                  <input 
                    type="text" 
                    className={`input-clean w-100 ${authError ? 'border-danger' : ''}`}
                    placeholder="e.g. PT-84729"
                    value={patientIdInput}
                    onChange={(e) => {
                      setPatientIdInput(e.target.value);
                      setAuthError('');
                    }}
                  />
                  {authError && <p className="text-danger small mt-2 fw-medium">{authError}</p>}
                </div>

                <div className="d-flex justify-content-between pt-3 border-top">
                  <button className="btn btn-outline-gray" onClick={() => setStep(1)}>Back to Prep</button>
                  <button className="btn btn-primary-orange" onClick={handleAuthenticate} disabled={!patientIdInput.trim()}>
                    Confirm & Close Prescription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DispensaryDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'fulfilled'
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [pendingQueue, setPendingQueue] = useState(mockPendingPrescriptions);
  const [fulfilledQueue, setFulfilledQueue] = useState(mockFulfilledPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [headerDate, setHeaderDate] = useState('');

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setHeaderDate(new Date().toLocaleDateString(undefined, options));
  }, []);

  const handleNavigation = (view, tab = null) => {
    setCurrentView(view);
    if (tab) setActiveTab(tab);
  };

  const handleFulfillPrescription = (id) => {
    const rxToMove = pendingQueue.find(rx => rx.id === id);
    if (rxToMove) {
      setPendingQueue(prev => prev.filter(rx => rx.id !== id));
      setFulfilledQueue(prev => [{
        ...rxToMove,
        status: 'fulfilled',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        dispensedBy: 'Pharmacist (You)'
      }, ...prev]);
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, requiredTab = null }) => {
    const isActive = requiredTab 
      ? (currentView === 'dashboard' && activeTab === requiredTab)
      : (currentView === id);

    return (
      <button
        onClick={() => handleNavigation('dashboard', requiredTab || 'pending')}
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

  const displayedQueue = activeTab === 'pending' ? pendingQueue : fulfilledQueue;
  const filteredQueue = displayedQueue.filter(rx => 
    rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    rx.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      
      {/* 1. Sidebar Navigation */}
      <div className="bg-white border-end shadow-sm flex-shrink-0 p-4" style={{ width: '280px' }}>
        <div className="mb-5 px-2">
          <h4 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--primary-orange, #f97316)' }}>
            <Pill size={28} /> RxDispensary
          </h4>
        </div>

        <nav className="d-flex flex-column gap-1">
          <p className="text-muted small fw-bold text-uppercase px-4 mb-2 mt-2">Main Menu</p>
          <SidebarItem id="dashboard" icon={Home} label="Dashboard Overview" requiredTab="pending" />
          
          <p className="text-muted small fw-bold text-uppercase px-4 mb-2 mt-4">Queue Management</p>
          <SidebarItem id="pending" icon={Clock} label="Pending queue" requiredTab="pending" />
          <SidebarItem id="fulfilled" icon={CheckCircle2} label="Fulfilled" requiredTab="fulfilled" />
        </nav>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-grow-1 p-4 p-md-5 overflow-auto">
        <div className="fade-in">
          
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4">
            <div>
              <h1 className="display-6 fw-bold mb-2 text-dark">Dispensary Dashboard</h1>
              <p className="text-muted fs-6">Manage prescriptions and dispensations &bull; <span className="fw-medium text-dark">{headerDate}</span></p>
            </div>
            
            <div className="d-flex gap-3">
              <div className="theme-card p-3 px-4 border border-light bg-white shadow-sm rounded-4 text-center">
                <h3 className="fw-bold text-orange mb-0">{pendingQueue.length}</h3>
                <span className="text-muted fw-bold small text-uppercase">Pending</span>
              </div>
              <div className="theme-card p-3 px-4 border border-light bg-white shadow-sm rounded-4 text-center">
                <h3 className="fw-bold text-success mb-0">{fulfilledQueue.length}</h3>
                <span className="text-muted fw-bold small text-uppercase">Fulfilled</span>
              </div>
            </div>
          </div>

          {/* Queue Section */}
          <div className="theme-card h-100 p-4 border border-light bg-white shadow-sm rounded-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
              <h4 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                {activeTab === 'pending' ? <Clock className="text-orange" size={24} /> : <CheckCircle2 className="text-success" size={24} />} 
                {activeTab === 'pending' ? "Prescription Queue" : "Fulfilled Prescriptions"}
              </h4>

              <div className="position-relative" style={{ width: '100%', maxWidth: '300px' }}>
                <Search size={18} className="text-muted position-absolute" style={{ top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="input-clean w-100 ps-5" 
                  placeholder="Search Patient or RX ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredQueue.length === 0 ? (
              <div className="text-center py-5">
                <FileText size={48} className="text-muted mb-3 opacity-50" />
                <h5 className="text-muted fw-bold">No prescriptions found.</h5>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light text-muted small text-uppercase fw-bold">
                    <tr>
                      <th className="py-3 px-4 border-0 rounded-start">RX ID</th>
                      <th className="py-3 px-4 border-0">Time</th>
                      <th className="py-3 px-4 border-0">Patient</th>
                      <th className="py-3 px-4 border-0">Doctor</th>
                      <th className="py-3 px-4 border-0 text-end rounded-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueue.map((rx) => (
                      <tr key={rx.id} style={{ cursor: rx.status === 'pending' ? 'pointer' : 'default' }} onClick={() => rx.status === 'pending' && setSelectedPrescription(rx)}>
                        <td className="py-3 px-4">
                          <span className="badge-orange px-2 py-1 rounded-pill">{rx.id}</span>
                        </td>
                        <td className="py-3 px-4 text-muted fw-medium">{rx.time}</td>
                        <td className="py-3 px-4 fw-bold text-dark">{rx.patientName}</td>
                        <td className="py-3 px-4 text-muted">{rx.doctorName}</td>
                        <td className="py-3 px-4 text-end">
                          {rx.status === 'pending' ? (
                            <button className="btn btn-sm btn-primary-orange py-2 px-3">Process</button>
                          ) : (
                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-2 px-3 rounded-pill fw-bold">
                              Closed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Dispensary Modal */}
      <DispensaryModal 
        isOpen={!!selectedPrescription} 
        onClose={() => setSelectedPrescription(null)} 
        prescription={selectedPrescription} 
        onFulfill={handleFulfillPrescription}
      />
    </div>
  );
};

export default DispensaryDashboard;
