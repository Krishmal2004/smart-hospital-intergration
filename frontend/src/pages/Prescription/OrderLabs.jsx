import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Calendar, Activity, Save, ArrowLeft, FileText, Clock, AlertCircle } from 'lucide-react';
import { useAuthContext } from '@asgardeo/auth-react';

const OrderLabs = ({ onBack, preselectedPatient = null }) => {
  const { getAccessToken } = useAuthContext();
  
  const [patientDB, setPatientDB] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(preselectedPatient);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [labData, setLabData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    priority: 'Routine',
    notes: '',
    tests: []
  });

  const availableTests = [
    "Complete Blood Count (CBC)", "Lipid Panel", "Comprehensive Metabolic Panel (CMP)",
    "HbA1c", "Thyroid Panel (TSH)", "Urinalysis", "Vitamin D, 25-Hydroxy", "ECG / EKG"
  ];

  // Fetch patients
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
            id: p.id ? p.id : 'Unknown',
            name: p.name,
            age: 'N/A', 
            location: 'N/A', 
            bloodGroup: 'N/A', 
          }));
          setPatientDB(formattedPatients);
          setSearchResults(formattedPatients); 
        } else {
          setErrorMessage('Failed to load patients');
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        setErrorMessage('Error loading patients: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [getAccessToken]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
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

  const handleTestToggle = (test) => {
    setLabData(prev => ({
      ...prev,
      tests: prev.tests.includes(test) 
        ? prev.tests.filter(t => t !== test)
        : [...prev.tests, test]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedPatient) {
      setErrorMessage('Please select a patient');
      return;
    }

    if (labData.tests.length === 0) {
      setErrorMessage('Please select at least one lab test');
      return;
    }

    if (!labData.date) {
      setErrorMessage('Please select a date');
      return;
    }

    if (!labData.time) {
      setErrorMessage('Please select a time');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = await getAccessToken();
      
      const payload = {
        patient: {
          id: selectedPatient.id,
          name: selectedPatient.name
        },
        'order': {
          date: labData.date,
          time: labData.time,
          priority: labData.priority,
          tests: labData.tests,
          notes: labData.notes
        }
      };

      console.log("Submitting Lab Order:", payload);

      const response = await fetch('http://localhost:8080/api/lab_orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage('Lab Order submitted successfully!');
        console.log("Lab Order saved:", result);
        
        // Reset form after 2 seconds
        setTimeout(() => {
          if (onBack) onBack();
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage('Failed to submit lab order: ' + (errorData.error || response.statusText));
        console.error("Error response:", errorData);
      }
    } catch (error) {
      console.error("Error submitting lab order:", error);
      setErrorMessage('Error submitting lab order: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
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
            <Activity className="text-orange" size={28} /> Order Lab Tests
          </h2>
          <p className="text-muted mb-0">Select a patient and schedule required diagnostics</p>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          <AlertCircle size={18} className="me-2" style={{ display: 'inline' }} />
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
        </div>
      )}

      {/* Success Message Alert */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Search & Patient Details */}
        <div className="col-lg-4">
          <div className="theme-card p-4 border-0 bg-section h-100 d-flex flex-column">
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

            {!selectedPatient && (
              <div className="bg-white shadow-sm rounded-3 border overflow-auto flex-grow-1" style={{ maxHeight: '450px' }}>
                {isLoading ? (
                  <div className="p-4 text-center text-muted small">
                    <div className="spinner-border spinner-border-sm text-orange mb-2"></div>
                    <p className="small mb-0">Loading patients...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(patient => (
                    <div 
                      key={patient.id} 
                      className="p-3 border-bottom d-flex justify-content-between align-items-center"
                      style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => { setSelectedPatient(patient); setSearchTerm(patient.name); }}
                    >
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{patient.name}</h6>
                        <small className="text-muted">{patient.id}</small>
                      </div>
                      <span className="badge bg-light text-dark border">Select</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted small">
                    <p className="small mb-0">No patients found</p>
                  </div>
                )}
              </div>
            )}

            {selectedPatient && (
              <div className="bg-white p-4 rounded-4 shadow-sm border border-light position-relative mt-2">
                <button 
                  className="btn-close position-absolute" 
                  style={{ top: '15px', right: '15px', fontSize: '10px' }}
                  onClick={() => { setSelectedPatient(null); setSearchTerm(''); }}
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
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lab Order Form */}
        <div className="col-lg-8">
          <div className="theme-card p-4 p-md-5 border-0 h-100 position-relative" style={{ opacity: selectedPatient ? 1 : 0.6, pointerEvents: selectedPatient ? 'auto' : 'none', transition: 'all 0.3s ease' }}>
            {!selectedPatient && (
              <div className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center z-2" style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(2px)' }}>
                <div className="badge bg-dark px-4 py-2 fs-6 rounded-pill shadow">Awaiting Patient Selection</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row mb-4 g-3">
                <div className="col-md-4">
                  <label className="text-muted small fw-bold text-uppercase mb-2 d-flex align-items-center gap-2"><Calendar size={14}/> Schedule Date</label>
                  <input 
                    type="date" 
                    className="form-control bg-section border-0 shadow-sm py-2" 
                    value={labData.date} 
                    onChange={(e) => setLabData({...labData, date: e.target.value})} 
                    required 
                  />
                </div>
                <div className="col-md-4">
                  <label className="text-muted small fw-bold text-uppercase mb-2 d-flex align-items-center gap-2"><Clock size={14}/> Time</label>
                  <input 
                    type="time" 
                    className="form-control bg-section border-0 shadow-sm py-2" 
                    value={labData.time} 
                    onChange={(e) => setLabData({...labData, time: e.target.value})} 
                    required 
                  />
                </div>
                <div className="col-md-4">
                  <label className="text-muted small fw-bold text-uppercase mb-2 d-flex align-items-center gap-2"><AlertCircle size={14}/> Priority</label>
                  <select 
                    className="form-select bg-section border-0 shadow-sm py-2" 
                    value={labData.priority} 
                    onChange={(e) => setLabData({...labData, priority: e.target.value})}
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT">STAT (Immediate)</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-bold text-uppercase mb-3">Select Diagnostics & Labs</label>
                <div className="row g-3">
                  {availableTests.map((test, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div 
                        className={`p-3 rounded-3 border d-flex align-items-center gap-3 ${labData.tests.includes(test) ? 'border-orange bg-orange-light' : 'bg-white'}`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s', borderColor: labData.tests.includes(test) ? 'var(--primary-orange)' : '#dee2e6' }}
                        onClick={() => handleTestToggle(test)}
                      >
                        <input 
                          type="checkbox" 
                          className="form-check-input mt-0" 
                          style={{ accentColor: 'var(--primary-orange)', transform: 'scale(1.2)' }}
                          checked={labData.tests.includes(test)} 
                          readOnly
                        />
                        <span className={`fw-medium ${labData.tests.includes(test) ? 'text-orange' : 'text-dark'}`} style={{ fontSize: '0.9rem' }}>{test}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-muted small fw-bold text-uppercase mb-2">Clinical Notes & Instructions</label>
                <textarea 
                  className="form-control bg-section border-0 shadow-sm p-3" 
                  rows="3" 
                  placeholder="e.g., Fasting required for 12 hours prior to draw."
                  value={labData.notes}
                  onChange={(e) => setLabData({...labData, notes: e.target.value})}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-3 border-top pt-4">
                <button 
                  type="submit" 
                  className="btn px-4 py-2 d-flex align-items-center gap-2" 
                  style={{ backgroundColor: 'var(--primary-orange)', color: '#fff', fontWeight: 'bold' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Submit Lab Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderLabs;
