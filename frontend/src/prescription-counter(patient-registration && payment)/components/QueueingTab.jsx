import React from 'react';
import { Activity } from 'lucide-react';

const QueueingTab = () => {
  return (
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
};

export default QueueingTab;
