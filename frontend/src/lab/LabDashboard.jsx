import React, { useState, useEffect } from 'react';
import { Activity, FileText, AlertCircle } from 'lucide-react';
import PendingRequestsTab from './components/PendingRequestsTab';
import SampleProcessingTab from './components/SampleProcessingTab';
import ReportDeliveryTab from './components/ReportDeliveryTab';

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const [requests, setRequests] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [reports, setReports] = useState([]);

  // Fetch from Ballerina Backend
  const fetchLabOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/lab_orders');
      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedOrders = data.map(order => ({
          id: order.id,
          displayId: `LR-${String(order.id).padStart(4, '0')}`,
          patientName: order.patientName,
          doctor: 'Assigned Doctor', 
          test: order.tests,
          status: order.status || 'Pending',
          date: order.scheduleDate
        }));

        setRequests(formattedOrders.filter(o => o.status === 'Pending'));
        setProcessing(formattedOrders.filter(o => o.status === 'Processing'));
        setReports(formattedOrders.filter(o => o.status === 'Available'));
      } else {
        console.error("Backend Error:", data);
      }
    } catch (error) {
      console.error("Failed to fetch lab orders", error);
    }
  };

  // Load data when the page opens
  useEffect(() => {
    fetchLabOrders();
  }, []);

  const handleCollectSample = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/lab_orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Processing' })
      });
      if (res.ok) fetchLabOrders(); // Refresh lists
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFinalizeReport = async (id, resultsText) => {
    try {
      const res = await fetch(`http://localhost:8080/api/lab_orders/${id}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: resultsText })
      });
      if (res.ok) fetchLabOrders(); // Refresh lists
    } catch (error) {
      console.error("Error saving results:", error);
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