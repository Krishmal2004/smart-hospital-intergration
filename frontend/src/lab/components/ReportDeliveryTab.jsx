import React from 'react';
import { Send, Printer } from 'lucide-react';

const ReportDeliveryTab = ({ reports }) => {

  const handleEmail = (report) => {
    const subject = encodeURIComponent(`Lab Results Available: ${report.test} - ${report.patientName}`);
    const body = encodeURIComponent(
      `Dear ${report.patientName},\n\n` +
      `Your laboratory results for the following test are now available:\n` +
      `- Test: ${report.test}\n` +
      `- Report ID: LR-${String(report.id).padStart(4, '0')}\n\n` +
      `Please contact your referring doctor to review your results.\n\n` +
      `Regards,\nSmart Hospital Laboratory`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePrint = (report) => {
    window.print();
  };

  return (
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
                    <td><span className="badge bg-light text-dark border">LR-{String(r.id).padStart(4, '0')}</span></td>
                    <td className="fw-medium">{r.patientName}</td>
                    <td>{r.test}</td>
                    <td><span className="badge bg-success">{r.status}</span></td>
                    <td>
                      {/* FIX: Added onClick to trigger the Email function */}
                      <button 
                        className="btn btn-sm btn-primary me-2 d-inline-flex align-items-center"
                        onClick={() => handleEmail(r)}
                      >
                        <Send size={14} className="me-1" /> Email PDF
                      </button>
                      
                      {/* FIX: Added onClick to trigger the Print function */}
                      <button 
                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
                        onClick={() => handlePrint(r)}
                      >
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
};

export default ReportDeliveryTab;