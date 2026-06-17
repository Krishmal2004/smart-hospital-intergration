import React, { useState, useEffect } from 'react';
import { 
  Pill, Clock, CheckCircle2, Search, FileText,
  Home
} from 'lucide-react';
import DispensaryModal from './components/DispensaryModal';
import { mockPendingPrescriptions, mockFulfilledPrescriptions } from './components/mockData';

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
