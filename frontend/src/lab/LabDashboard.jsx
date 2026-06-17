import React, { useState } from 'react';
import { Activity, FileText, AlertCircle } from 'lucide-react';
import PendingRequestsTab from './components/PendingRequestsTab';
import SampleProcessingTab from './components/SampleProcessingTab';
import ReportDeliveryTab from './components/ReportDeliveryTab';

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
          {activeTab === 'pending' && <PendingRequestsTab requests={requests} handleCollectSample={handleCollectSample} />}
          {activeTab === 'processing' && <SampleProcessingTab processing={processing} handleFinalizeReport={handleFinalizeReport} />}
          {activeTab === 'delivery' && <ReportDeliveryTab reports={reports} />}
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
