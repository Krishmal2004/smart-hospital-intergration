import React, { useState } from 'react';
import { Activity, Clock, CheckCircle } from 'lucide-react';

const SampleProcessingTab = ({ processing, handleFinalizeReport }) => {
  const [resultText, setResultText] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (processing.length > 0) {
      handleFinalizeReport(processing[0].id, resultText);
      setResultText(''); 
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Sample Processing & Results</h4>
        <div className="row g-4">
          <div className="col-md-5">
            <div className="list-group border-0 shadow-sm">
              {processing.length === 0 ? (
                <div className="text-center py-4 text-muted border rounded">No samples currently processing</div>
              ) : (
                processing.map(p => (
                  <button key={p.id} className="list-group-item list-group-item-action p-3 border mb-2 rounded">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold">LR-{String(p.id).padStart(4, '0')}</span>
                      <span className="badge bg-warning text-dark"><Clock size={12} className="me-1"/>Processing</span>
                    </div>
                    <div className="fw-medium">{p.patientName}</div>
                    <div className="small text-muted">{p.test}</div>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="col-md-7">
            <div className="border rounded p-4 bg-light h-100">
              <h5 className="mb-4">Input Test Results</h5>
              {processing.length > 0 ? (
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Selected Request</label>
                    <input type="text" className="form-control bg-white" value={`LR-${String(processing[0].id).padStart(4, '0')} - ${processing[0].patientName}`} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Test Type</label>
                    <input type="text" className="form-control bg-white" value={processing[0].test} disabled />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Result Notes / Values</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Enter findings, numeric values, or observations..."
                      value={resultText}
                      onChange={(e) => setResultText(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-success w-100 d-flex justify-content-center align-items-center">
                    <CheckCircle size={18} className="me-2" /> Finalize Report
                  </button>
                </form>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                  <Activity size={48} className="mb-3 opacity-25" />
                  <p>Select a sample from the list to input results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleProcessingTab;