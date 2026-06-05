import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Calendar, Pill, Save, ArrowLeft, FileText } from 'lucide-react';
import { useAuthContext } from '@asgardeo/auth-react';

const WritePrescription = ({ onBack }) => {
  const { getAccessToken } = useAuthContext();
  
  const [patientDB, setPatientDB] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  
  const [prescriptionData, setPrescriptionData] = useState({
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    medication: '',
    instructions: '',
    notes: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await getAccessToken();
        
        const response = await fetch('http://localhost:8080/api/patients', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          const formattedPatients = data.map(p => ({
            id: p.id ? p.id.substring(0, 8) : 'Unknown', 
            name: p.name,
            age: 'N/A', 
            location: 'N/A', 
            bloodGroup: 'N/A', 
            allergies: 'N/A'
          }));
          
          setPatientDB(formattedPatients);
          setSearchResults(formattedPatients); 
        } else {
          console.error("Backend returned an error:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [getAccessToken]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // If the search bar is empty, show all patients. Otherwise, filter them.
    if (term.trim() === '') {
      setSearchResults(patientDB);
    } else {
      const results = patientDB.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase()) || 
        p.id.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Prescription Saved:", { patient: selectedPatient, prescription: prescriptionData });
    alert("Prescription saved successfully!");
    
    setSelectedPatient(null);
    setSearchTerm('');
    setSearchResults(patientDB); // Reset list to show all patients after saving
    setPrescriptionData({ ...prescriptionData, diagnosis: '', medication: '', instructions: '', notes: '' });
  };

  return (
    <div className="container pb-5">
      {/* Header Section */}
      <div className="d-flex align-items-center gap-3 mb-4">
        {onBack && (
          <button onClick={onBack} className="btn btn-light rounded-circle p-2 shadow-sm border-0">
            <ArrowLeft size={20} className="text-dark" />
          </button>
        )}
        <div>
          <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <Pill className="text-orange" size={28} /> Write Prescription
          </h2>
          <p className="text-muted mb-0">Select a patient to issue new medication</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Search & Patient Details */}
        <div className="col-lg-4">
          <div className="theme-card p-4 border-0 bg-section h-100 d-flex flex-column">
            
            {/* Search Bar */}
            <div className="mb-3">
              <label className="text-muted small fw-bold text-uppercase mb-2">Search Patient</label>
              <div className="position-relative">
                <Search size={18} className="position-absolute text-muted" style={{ top: '12px', left: '12px' }} />
                <input 
                  type="text" 
                  className="form-control bg-white border-0 shadow-sm ps-5 py-2" 
                  placeholder="Name or Patient ID..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  disabled={selectedPatient !== null}
                />
              </div>
            </div>

            {/* Automatically Loaded Patient List */}
            {!selectedPatient && (
              <div className="bg-white shadow-sm rounded-3 border overflow-auto flex-grow-1" style={{ maxHeight: '450px' }}>
                {isLoading ? (
                  <div className="p-4 text-center text-muted small">
                    <div className="spinner-border spinner-border-sm text-orange mb-2" role="status"></div>
                    <p className="small mb-0">Loading patients...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(patient => (
                    <div 
                      key={patient.id} 
                      className="p-3 border-bottom d-flex justify-content-between align-items-center"
                      style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setSearchTerm(patient.name);
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{patient.name}</h6>
                        <small className="text-muted">{patient.id}</small>
                      </div>
                      <span className="badge bg-light text-dark border">Select</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted small">No patients found.</div>
                )}
              </div>
            )}

            {/* Selected Patient Details Card */}
            {selectedPatient && (
              <div className="bg-white p-4 rounded-4 shadow-sm border border-light position-relative mt-2">
                <button 
                  className="btn-close position-absolute" 
                  style={{ top: '15px', right: '15px', fontSize: '10px' }}
                  onClick={() => {
                    setSelectedPatient(null);
                    setSearchTerm('');
                    setSearchResults(patientDB); // Reset search results when closing patient details
                  }}
                ></button>
                
                <div className="text-center mb-3">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '64px', height: '64px', backgroundColor: 'var(--orange-light)' }}>
                    <User size={32} className="text-orange" />
                  </div>
                  <h5 className="fw-bold text-dark mb-0">{selectedPatient.name}</h5>
                  <p className="text-muted small mb-0">{selectedPatient.id}</p>
                </div>

                <hr className="text-muted opacity-25" />

                <div className="d-flex flex-column gap-2 mt-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small d-flex align-items-center gap-2"><Calendar size={14}/> Age</span>
                    <span className="fw-medium text-dark">{selectedPatient.age}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small d-flex align-items-center gap-2"><MapPin size={14}/> Location</span>
                    <span className="fw-medium text-dark">{selectedPatient.location}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small d-flex align-items-center gap-2"><FileText size={14}/> Blood Group</span>
                    <span className="fw-medium text-danger">{selectedPatient.bloodGroup}</span>
                  </div>
                  <div className="p-2 mt-2 rounded-3" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffe69c' }}>
                    <span className="text-dark small fw-bold d-block mb-1">Allergies:</span>
                    <span className="text-danger small">{selectedPatient.allergies}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Prescription Form */}
        <div className="col-lg-8">
          <div className="theme-card p-4 p-md-5 border-0 h-100 position-relative" style={{ opacity: selectedPatient ? 1 : 0.6, pointerEvents: selectedPatient ? 'auto' : 'none', transition: 'all 0.3s ease' }}>
            
            {!selectedPatient && (
              <div className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center z-2" style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(2px)' }}>
                <div className="badge bg-dark px-4 py-2 fs-6 rounded-pill shadow">Awaiting Patient Selection</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase mb-2">Date of Issue</label>
                  <input 
                    type="date" 
                    className="form-control bg-section border-0 shadow-sm py-2" 
                    value={prescriptionData.date}
                    onChange={(e) => setPrescriptionData({...prescriptionData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase mb-2">Diagnosis / Condition</label>
                  <input 
                    type="text" 
                    className="form-control bg-section border-0 shadow-sm py-2" 
                    placeholder="e.g., Acute Bronchitis"
                    value={prescriptionData.diagnosis}
                    onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-bold text-uppercase mb-2">Medication (Rx)</label>
                <textarea 
                  className="form-control bg-section border-0 shadow-sm p-3" 
                  rows="4" 
                  placeholder="1. Amoxicillin 500mg - 1 capsule&#10;2. Paracetamol 500mg - 2 tablets"
                  value={prescriptionData.medication}
                  onChange={(e) => setPrescriptionData({...prescriptionData, medication: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-bold text-uppercase mb-2">Dosage Instructions</label>
                <textarea 
                  className="form-control bg-section border-0 shadow-sm p-3" 
                  rows="3" 
                  placeholder="Take Amoxicillin three times a day after meals for 5 days. Take Paracetamol when needed for fever/pain."
                  value={prescriptionData.instructions}
                  onChange={(e) => setPrescriptionData({...prescriptionData, instructions: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="mb-5">
                <label className="text-muted small fw-bold text-uppercase mb-2">Additional Notes (Optional)</label>
                <input 
                  type="text" 
                  className="form-control bg-section border-0 shadow-sm py-2" 
                  placeholder="e.g., Drink plenty of fluids, rest for 3 days."
                  value={prescriptionData.notes}
                  onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                />
              </div>

              <div className="d-flex justify-content-end gap-3 border-top pt-4">
                <button type="button" className="btn btn-light px-4 fw-bold" onClick={() => {
                   setPrescriptionData({ date: new Date().toISOString().split('T')[0], diagnosis: '', medication: '', instructions: '', notes: '' });
                }}>
                  Clear Form
                </button>
                <button type="submit" className="btn px-4 py-2 d-flex align-items-center gap-2" style={{ backgroundColor: 'var(--primary-orange)', color: '#fff', fontWeight: 'bold' }}>
                  <Save size={18} /> Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritePrescription;