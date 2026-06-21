import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit } from 'lucide-react';

const RegistrationTab = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: ''
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editPatientData, setEditPatientData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    country: '',
    mobileNumber: '',
    birthDate: ''
  });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/patients');
      const data = await response.json();
      const formattedPatients = data.map(p => ({
        id: p.id,
        name: p.name,
        phone: p.phone|| 'Not Provided', 
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

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
      });

      if (response.ok) {
        alert("Patient account created successfully in Asgardeo!");
        setShowModal(false);
        setNewPatient({ firstName: '', lastName: '', email: '', mobileNumber: '', password: '' });
        fetchPatients(); 
      } else {
        const errorData = await response.json();
        alert(`Failed to create patient: ${errorData.details || errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      alert("Network error. Could not reach the backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (patient) => {
    // Split the full name back into First and Last as a best guess
    const nameParts = patient.name.split(' ');
    
    setEditPatientData({
      id: patient.id,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      country: '',
      mobileNumber: '',
      birthDate: ''
    });
    setShowEditModal(true);
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch('http://localhost:8080/api/patients', {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPatientData)
      });

      if (response.ok) {
        alert("Patient profile verified and updated in Asgardeo!");
        setShowEditModal(false);
        fetchPatients(); 
      } else {
        const errorData = await response.json();
        alert(`Failed to update patient: ${errorData.details || errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Network error. Could not reach the backend.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card shadow-sm border-0 mb-4 position-relative">
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
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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
                      {/* FIX: Added onClick handler to open edit modal */}
                      <button 
                        className="btn btn-sm btn-outline-primary me-2 d-inline-flex align-items-center"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <Edit size={14} className="me-1"/> Verify/Edit
                      </button>
                      {p.status === 'Verified' && <button className="btn btn-sm btn-outline-success">Route</button>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- REGISTRATION MODAL ---------------- */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Register New Patient</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleRegisterPatient}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small text-muted">First Name</label>
                      <input type="text" className="form-control" required 
                        value={newPatient.firstName} onChange={e => setNewPatient({...newPatient, firstName: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted">Last Name</label>
                      <input type="text" className="form-control" required 
                        value={newPatient.lastName} onChange={e => setNewPatient({...newPatient, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Email Address (Used as Username)</label>
                    <input type="email" className="form-control" required 
                      value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Mobile Number</label>
                    <input type="text" className="form-control" required 
                      value={newPatient.mobileNumber} onChange={e => setNewPatient({...newPatient, mobileNumber: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-muted">Temporary Password</label>
                    <input type="password" className="form-control" required 
                      value={newPatient.password} onChange={e => setNewPatient({...newPatient, password: e.target.value})} />
                    <small className="text-muted" style={{fontSize: '11px'}}>Must contain 8+ characters, a number, and a special character.</small>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Create Patient Account'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- EDIT / VERIFY MODAL ---------------- */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Verify & Update Patient Data</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-light mb-4 border small">
                  <strong>Patient ID:</strong> {editPatientData.id}
                </div>
                
                <form onSubmit={handleUpdatePatient}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small text-muted">First Name</label>
                      <input type="text" className="form-control" required 
                        value={editPatientData.firstName} onChange={e => setEditPatientData({...editPatientData, firstName: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted">Last Name</label>
                      <input type="text" className="form-control" required 
                        value={editPatientData.lastName} onChange={e => setEditPatientData({...editPatientData, lastName: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small text-muted">Mobile Number</label>
                      <input type="text" className="form-control" required 
                        value={editPatientData.mobileNumber} onChange={e => setEditPatientData({...editPatientData, mobileNumber: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted">Date of Birth</label>
                      <input type="date" className="form-control" required 
                        value={editPatientData.birthDate} onChange={e => setEditPatientData({...editPatientData, birthDate: e.target.value})} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small text-muted">Country</label>
                    <input type="text" className="form-control" placeholder="e.g., Sri Lanka" required 
                      value={editPatientData.country} onChange={e => setEditPatientData({...editPatientData, country: e.target.value})} />
                  </div>
                  
                  <button type="submit" className="btn btn-success w-100 py-2" disabled={isUpdating}>
                    {isUpdating ? 'Updating in Asgardeo...' : 'Save & Verify Profile'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationTab;