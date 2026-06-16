import React, { useState } from 'react';
import { Activity, FileText, CheckCircle, Send, Printer, Search, PlusCircle, AlertCircle, Clock } from 'lucide-react';

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');

  // Mock states for demonstration
  const [requests, setRequests] = useState([
    { id: 'LR-1001', patientName: 'John Doe', doctor: 'Dr. Smith', test: 'Complete Blood Count (CBC)', status: 'Pending', date: '2023-10-25' },
    { id: 'LR-1002', patientName: 'Jane Roe', doctor: 'Dr. Adams', test: 'Lipid Panel', status: 'Pending', date: '2023-10-25' }
  ]);

  const [processing, setProcessing] = useState([
    { id: 'LR-0998', patientName: 'Alice Green', test: 'Urinalysis', status: 'Processing', sampleCollected: true }
  ]);

  const [reports, setReports] = useState([
    { id: 'LR-0950', patientName: 'Bob White', test: 'Blood Glucose', status: 'Available', date: '2023-10-24' }
  ]);

  const handleCollectSample = (id) => {
    // Move from requests to processing
    const request = requests.find(r => r.id === id);
    if (request) {
      setRequests(requests.filter(r => r.id !== id));
      setProcessing([...processing, { ...request, status: 'Processing', sampleCollected: true }]);
    }
  };

  const handleFinalizeReport = (id) => {
    // Move from processing to reports
    const proc = processing.find(p => p.id === id);
    if (proc) {
      setProcessing(processing.filter(p => p.id !== id));
      setReports([...reports, { ...proc, status: 'Available' }]);
    }
  };

  const renderPending = () => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Pending Lab Requests</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Request ID</th>
                <th>Patient Name</th>
                <th>Requested Test</th>
                <th>Referred By</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No pending requests</td></tr>
              ) : (
                requests.map(r => (
                  <tr key={r.id}>
                    <td><span className="badge bg-light text-dark border">{r.id}</span></td>
                    <td className="fw-medium">{r.patientName}</td>
                    <td>{r.test}</td>
                    <td>{r.doctor}</td>
                    <td>{r.date}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleCollectSample(r.id)}
                      >
                        Mark Sample Collected
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Sample Processing & Results</h4>
        <div className="row g-4">
          <div className="col-md-5">
            <div className="list-group border-0 shadow-sm">
              {processing.length === 0 ? (
                <div className="text-center py-4 text-muted border rounded">No samples currently processing</div>
              ) : (
                processing.map(p => (
                  <button key={p.id} className="list-group-item list-group-item-action p-3 border mb-2 rounded">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold">{p.id}</span>
                      <span className="badge bg-warning text-dark"><Clock size={12} className="me-1"/>Processing</span>
                    </div>
                    <div className="fw-medium">{p.patientName}</div>
                    <div className="small text-muted">{p.test}</div>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="col-md-7">
            <div className="border rounded p-4 bg-light h-100">
              <h5 className="mb-4">Input Test Results</h5>
              {processing.length > 0 ? (
                <form onSubmit={(e) => { e.preventDefault(); handleFinalizeReport(processing[0].id); }}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Selected Request</label>
                    <input type="text" className="form-control bg-white" value={`${processing[0].id} - ${processing[0].patientName}`} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Test Type</label>
                    <input type="text" className="form-control bg-white" value={processing[0].test} disabled />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Result Notes / Values</label>
                    <textarea className="form-control" rows="4" placeholder="Enter findings, numeric values, or observations..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-success w-100 d-flex justify-content-center align-items-center">
                    <CheckCircle size={18} className="me-2" /> Finalize Report
                  </button>
                </form>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                  <Activity size={48} className="mb-3 opacity-25" />
                  <p>Select a sample from the list to input results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Report Delivery</h4>
        
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Report ID</th>
                <th>Patient Name</th>
                <th>Test Conducted</th>
                <th>Status</th>
                <th>Delivery Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No completed reports available</td></tr>
              ) : (
                reports.map(r => (
                  <tr key={r.id}>
                    <td><span className="badge bg-light text-dark border">{r.id}</span></td>
                    <td className="fw-medium">{r.patientName}</td>
                    <td>{r.test}</td>
                    <td><span className="badge bg-success">{r.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2 d-inline-flex align-items-center">
                        <Send size={14} className="me-1" /> Email PDF
                      </button>
                      <button className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center">
                        <Printer size={14} className="me-1" /> Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">Laboratory Dashboard</h2>
          <p className="text-muted mb-0">Manage test requests, process samples, and deliver reports</p>
        </div>
        <div className="badge px-3 py-2 fs-6" style={{backgroundColor: '#20c997', color: 'white'}}>Lab Technician</div>
      </div>

      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm rounded-3 border-0">
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
              style={activeTab === 'pending' ? {backgroundColor: '#20c997', color: '#fff'} : {}}
            >
              <AlertCircle size={20} className="me-3" /> 
              <span className="fw-medium">Pending Requests</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'processing' ? 'active' : ''}`}
              onClick={() => setActiveTab('processing')}
              style={activeTab === 'processing' ? {backgroundColor: '#20c997', color: '#fff'} : {}}
            >
              <Activity size={20} className="me-3" /> 
              <span className="fw-medium">Sample Processing</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'delivery' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivery')}
              style={activeTab === 'delivery' ? {backgroundColor: '#20c997', color: '#fff'} : {}}
            >
              <FileText size={20} className="me-3" /> 
              <span className="fw-medium">Report Delivery</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9">
          {activeTab === 'pending' && renderPending()}
          {activeTab === 'processing' && renderProcessing()}
          {activeTab === 'delivery' && renderDelivery()}
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
