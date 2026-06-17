import React from 'react';

const PendingRequestsTab = ({ requests, handleCollectSample }) => {
  return (
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
};

export default PendingRequestsTab;
