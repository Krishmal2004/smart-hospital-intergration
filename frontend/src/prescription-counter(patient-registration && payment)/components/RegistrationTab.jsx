import React, { useState, useEffect } from 'react';
import { Search, PlusCircle } from 'lucide-react';

const RegistrationTab = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/patients');
        const data = await response.json();
        
        // Mapping Asgardeo data to fit the table structure
        const formattedPatients = data.map(p => ({
          id: p.id,
          name: p.name,
          phone: 'Not provided', 
          status: 'Verified',
          type: 'Standard'
        }));
        
        setPatients(formattedPatients);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading patients from Asgardeo...</td></tr>
              ) : filteredPatients.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No patients found.</td></tr>
              ) : (
                filteredPatients.map(p => (
                  <tr key={p.id}>
                    <td><span className="badge bg-light text-dark border" title={p.id}>{p.id.substring(0, 8)}...</span></td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationTab;