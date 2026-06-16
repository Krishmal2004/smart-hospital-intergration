import React, { useState } from 'react';
import { Users, FileText, Activity, CreditCard, CheckCircle, Search, PlusCircle, ArrowRight, Printer } from 'lucide-react';

const ReceptionDashboard = () => {
  const [activeTab, setActiveTab] = useState('registration');

  // Mock states for demonstration
  const [patients, setPatients] = useState([
    { id: 'P001', name: 'John Doe', phone: '555-0101', status: 'Verified', doctor: 'Dr. Smith', type: 'Online Booking' },
    { id: 'P002', name: 'Jane Roe', phone: '555-0102', status: 'Pending', doctor: '-', type: 'Walk-in' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  // Tab Content Renderers
  const renderRegistration = () => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Patient Registration & Verification</h4>
        
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white"><Search size={18} /></span>
              <input type="text" className="form-control border-start-0 ps-0" placeholder="Search by Patient ID or Name..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button className="btn btn-outline-secondary">Search</button>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <button className="btn btn-primary" style={{backgroundColor: 'var(--primary-color, #ff6b35)', borderColor: 'var(--primary-color, #ff6b35)'}}>
              <PlusCircle size={18} className="me-2" /> New Walk-in Patient
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td><span className="badge bg-light text-dark border">{p.id}</span></td>
                  <td className="fw-medium">{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.type}</td>
                  <td>
                    <span className={`badge ${p.status === 'Verified' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">Verify/Edit</button>
                    {p.status === 'Verified' && <button className="btn btn-sm btn-outline-success">Route</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQueueing = () => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Doctor Routing & Queueing</h4>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="border rounded p-3 bg-light">
              <h5 className="mb-3 d-flex align-items-center"><Activity size={20} className="me-2 text-primary" /> Assign to Doctor</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label text-muted small">Select Patient</label>
                  <select className="form-select">
                    <option>Select a verified patient...</option>
                    <option>John Doe (P001)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small">Select Department/Doctor</label>
                  <select className="form-select">
                    <option>Cardiology - Dr. Smith (Room 102)</option>
                    <option>General - Dr. Adams (Room 105)</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100" style={{backgroundColor: 'var(--primary-color, #ff6b35)', borderColor: 'var(--primary-color, #ff6b35)'}}>
                  Assign Queue Number
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3 h-100">
              <h5 className="mb-3">Current Queue Status</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <span className="fw-bold">Q-001</span> - John Doe
                    <div className="small text-muted">Cardiology (Dr. Smith)</div>
                  </div>
                  <span className="badge bg-primary rounded-pill">Waiting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Payment Handling & Billing</h4>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="mb-4">
              <label className="form-label">Search Patient to Bill</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Patient ID or Name..." />
                <button className="btn btn-outline-secondary"><Search size={18} /></button>
              </div>
            </div>
            
            <div className="border rounded p-3 mb-4 bg-light">
              <h5 className="mb-3">Bill Details: John Doe (P001)</h5>
              <table className="table table-sm table-borderless">
                <tbody>
                  <tr>
                    <td>Consultation Fee (Dr. Smith)</td>
                    <td className="text-end">$50.00</td>
                  </tr>
                  <tr>
                    <td>Lab Test (Blood Count)</td>
                    <td className="text-end">$35.00</td>
                  </tr>
                  <tr>
                    <td>Pharmacy (Prescription #882)</td>
                    <td className="text-end">$42.50</td>
                  </tr>
                  <tr className="border-top border-dark">
                    <td className="fw-bold pt-2">Total Amount</td>
                    <td className="text-end fw-bold pt-2 fs-5 text-primary">$127.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="border rounded p-4 h-100 d-flex flex-column">
              <h5 className="mb-4">Process Payment</h5>
              
              <div className="mb-3">
                <label className="form-label text-muted small">Payment Method</label>
                <select className="form-select mb-3">
                  <option>Credit/Debit Card</option>
                  <option>Cash</option>
                  <option>Online Gateway / UPI</option>
                </select>
              </div>

              <div className="mt-auto">
                <button className="btn btn-success w-100 py-2 mb-2 d-flex align-items-center justify-content-center">
                  <CheckCircle size={18} className="me-2" /> Complete Payment
                </button>
                <button className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center">
                  <Printer size={18} className="me-2" /> Send Digital Receipt
                </button>
                <div className="text-center mt-2 small text-muted">
                  Receipt will be sent via Email and SMS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">Reception & Billing</h2>
          <p className="text-muted mb-0">Manage patient workflow from entry to payment</p>
        </div>
        <div className="badge bg-primary px-3 py-2 fs-6">Front Desk Agent</div>
      </div>

      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm rounded-3 border-0">
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'registration' ? 'active' : ''}`}
              onClick={() => setActiveTab('registration')}
              style={activeTab === 'registration' ? {backgroundColor: 'var(--primary-color, #ff6b35)', color: '#fff'} : {}}
            >
              <Users size={20} className="me-3" /> 
              <span className="fw-medium">Registration</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'queueing' ? 'active' : ''}`}
              onClick={() => setActiveTab('queueing')}
              style={activeTab === 'queueing' ? {backgroundColor: 'var(--primary-color, #ff6b35)', color: '#fff'} : {}}
            >
              <Activity size={20} className="me-3" /> 
              <span className="fw-medium">Doctor Routing</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
              style={activeTab === 'billing' ? {backgroundColor: 'var(--primary-color, #ff6b35)', color: '#fff'} : {}}
            >
              <CreditCard size={20} className="me-3" /> 
              <span className="fw-medium">Billing & Payment</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9">
          {activeTab === 'registration' && renderRegistration()}
          {activeTab === 'queueing' && renderQueueing()}
          {activeTab === 'billing' && renderBilling()}
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
