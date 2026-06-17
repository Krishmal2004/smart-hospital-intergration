import React, { useState, useEffect } from 'react';
import { PackageOpen, BadgeCheck, X, AlertTriangle, CheckCircle2, User } from 'lucide-react';

const DispensaryModal = ({ isOpen, onClose, prescription, onFulfill }) => {
  const [step, setStep] = useState(1); // 1: Preparation, 2: Patient Auth
  const [packedItems, setPackedItems] = useState({});
  const [patientIdInput, setPatientIdInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Reset state when a new prescription is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPackedItems({});
      setPatientIdInput('');
      setAuthError('');
    }
  }, [isOpen, prescription]);

  if (!isOpen || !prescription) return null;

  const handleTogglePack = (index) => {
    setPackedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const allPacked = prescription.items.every((_, index) => packedItems[index]);

  const handleAuthenticate = () => {
    if (patientIdInput.trim().toUpperCase() === prescription.patientId.toUpperCase()) {
      setAuthError('');
      onFulfill(prescription.id);
      onClose();
    } else {
      setAuthError('Patient ID does not match. Please verify the identity again.');
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          
          <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              {step === 1 ? <PackageOpen className="text-orange" /> : <BadgeCheck className="text-orange" />}
              {step === 1 ? 'Step 1: Preparation & Verification' : 'Step 2: Patient Authentication'}
            </h5>
            <button type="button" className="btn text-muted border-0 bg-transparent p-0" onClick={onClose}><X size={24} /></button>
          </div>

          <div className="modal-body p-4 p-md-5 pt-4">
            {/* Header Info */}
            <div className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-4 bg-light border">
              <div>
                <h4 className="fw-bold mb-1 text-dark">{prescription.patientName}</h4>
                <p className="text-muted mb-0 small">Prescribed by {prescription.doctorName}</p>
              </div>
              <div className="text-end">
                <span className="badge-orange px-3 py-2 rounded-pill d-inline-block mb-1">{prescription.id}</span>
                <p className="text-muted mb-0 small fw-bold">ID: {prescription.patientId}</p>
              </div>
            </div>

            {step === 1 ? (
              // Step 1: Verification & Preparation
              <div className="fade-in">
                <h6 className="fw-bold text-dark mb-3 text-uppercase small">Medication Details</h6>
                <div className="d-flex flex-column gap-3 mb-4">
                  {prescription.items.map((item, index) => (
                    <div key={index} className="theme-card p-3 d-flex align-items-center gap-3 border transition-all" style={{ borderColor: packedItems[index] ? 'var(--primary-orange, #f97316)' : '#e5e7eb', backgroundColor: packedItems[index] ? 'var(--orange-light, #fffaf0)' : '#fff' }}>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id={`pack-${index}`}
                          checked={packedItems[index] || false}
                          onChange={() => handleTogglePack(index)}
                          style={{ width: '1.5em', height: '1.5em', cursor: 'pointer' }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="fw-bold text-dark mb-1">{item.name} <span className="badge bg-secondary ms-2">Qty: {item.qty}</span></h6>
                          {item.stock < item.qty ? (
                            <span className="text-danger small fw-bold d-flex align-items-center gap-1"><AlertTriangle size={14}/> Out of Stock</span>
                          ) : item.stock < 50 ? (
                            <span className="text-warning small fw-bold">Low Stock ({item.stock})</span>
                          ) : (
                            <span className="text-success small fw-bold">In Stock ({item.stock})</span>
                          )}
                        </div>
                        <p className="text-muted mb-0 small">{item.instructions}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-end pt-2 border-top">
                  <button 
                    className="btn btn-primary-orange" 
                    disabled={!allPacked}
                    onClick={() => setStep(2)}
                  >
                    Proceed to Dispensation <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Patient Authentication & Dispensation
              <div className="fade-in">
                <div className="text-center mb-4">
                  <div className="orange-icon-bg d-inline-flex p-4 rounded-circle mb-3" style={{ backgroundColor: 'var(--orange-light, #fff3e0)' }}>
                    <User size={48} className="text-orange" />
                  </div>
                  <h5 className="fw-bold text-dark mb-2">Verify Patient Identity</h5>
                  <p className="text-muted">Please ask the patient for their ID or Date of Birth to ensure correct dispensation.</p>
                </div>

                <div className="mb-4 max-w-md mx-auto" style={{ maxWidth: '400px' }}>
                  <label className="fw-bold text-dark small text-uppercase mb-2">Enter Patient ID</label>
                  <input 
                    type="text" 
                    className={`input-clean w-100 ${authError ? 'border-danger' : ''}`}
                    placeholder="e.g. PT-84729"
                    value={patientIdInput}
                    onChange={(e) => {
                      setPatientIdInput(e.target.value);
                      setAuthError('');
                    }}
                  />
                  {authError && <p className="text-danger small mt-2 fw-medium">{authError}</p>}
                </div>

                <div className="d-flex justify-content-between pt-3 border-top">
                  <button className="btn btn-outline-gray" onClick={() => setStep(1)}>Back to Prep</button>
                  <button className="btn btn-primary-orange" onClick={handleAuthenticate} disabled={!patientIdInput.trim()}>
                    Confirm & Close Prescription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispensaryModal;
