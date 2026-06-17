import React, { useState } from 'react';
import { Search, PlusCircle } from 'lucide-react';

const RegistrationTab = () => {
  const [patients, setPatients] = useState([
    { id: 'P001', name: 'John Doe', phone: '555-0101', status: 'Verified', doctor: 'Dr. Smith', type: 'Online Booking' },
    { id: 'P002', name: 'Jane Roe', phone: '555-0102', status: 'Pending', doctor: '-', type: 'Walk-in' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
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
};

export default RegistrationTab;
