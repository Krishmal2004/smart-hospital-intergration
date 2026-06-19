import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const QueueingTab = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [queues, setQueues] = useState([]); // Local state for active queues
  
  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/patients').then(res => res.json()),
      fetch('http://localhost:8080/api/doctors').then(res => res.json())
    ]).then(([patientsData, doctorsData]) => {
      setPatients(patientsData);
      setDoctors(doctorsData);
    }).catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedDoctorId) return alert("Please select both a patient and a doctor.");
    
    setIsSubmitting(true);
    const patient = patients.find(p => p.id === selectedPatientId);
    const doctor = doctors.find(d => d.id === selectedDoctorId);

    const payload = {
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      department: doctor.specialty,
      status: "Waiting"
    };

    try {
      const response = await fetch('http://localhost:8080/api/queues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        // Add to local list so the user sees it immediately
        setQueues([...queues, { ...payload, qNumber: `Q-${(queues.length + 1).toString().padStart(3, '0')}` }]);
        setSelectedPatientId('');
        setSelectedDoctorId('');
      } else {
        alert("Failed to assign queue.");
      }
    } catch (error) {
      console.error("Queue assignment error:", error);
      alert("Failed to connect to the backend. Is Ballerina running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Doctor Routing & Queueing</h4>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="border rounded p-3 bg-light">
              <h5 className="mb-3 d-flex align-items-center"><Activity size={20} className="me-2 text-primary" /> Assign to Doctor</h5>
              <form onSubmit={handleAssign}>
                <div className="mb-3">
                  <label className="form-label text-muted small">Select Patient</label>
                  <select className="form-select" value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} required>
                    <option value="">Select a verified patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id.substring(0,8)}...)</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small">Select Department/Doctor</label>
                  <select className="form-select" value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)} required>
                    <option value="">Select Doctor...</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.specialty} - {d.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100" style={{backgroundColor: 'var(--primary-color, #ff6b35)', borderColor: 'var(--primary-color, #ff6b35)'}}>
                  {isSubmitting ? 'Assigning...' : 'Assign Queue Number'}
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3 h-100">
              <h5 className="mb-3">Current Queue Status</h5>
              <ul className="list-group list-group-flush">
                {queues.length === 0 ? (
                  <li className="list-group-item text-muted">No patients currently in queue.</li>
                ) : (
                  queues.map((q, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <div>
                        <span className="fw-bold">{q.qNumber}</span> - {q.patientName}
                        <div className="small text-muted">{q.department}</div>
                      </div>
                      <span className="badge bg-primary rounded-pill">{q.status}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueingTab;