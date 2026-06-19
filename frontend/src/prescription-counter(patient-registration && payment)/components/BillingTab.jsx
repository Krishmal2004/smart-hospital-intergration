import React, { useState } from 'react';
import { Search, CheckCircle, Printer } from 'lucide-react';

const BillingTab = () => {
  const [patientId, setPatientId] = useState('');
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBill = async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    setBillData(null);

    try {
      const response = await fetch(`http://localhost:8080/api/billing/${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch bill. Check patient ID.");
      const data = await response.json();
      setBillData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Payment Handling & Billing</h4>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="mb-4">
              <label className="form-label">Search Patient to Bill</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Enter Patient ID..." 
                  value={patientId} onChange={(e) => setPatientId(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && fetchBill()} />
                <button className="btn btn-outline-secondary" onClick={fetchBill}>
                  {loading ? '...' : <Search size={18} />}
                </button>
              </div>
              {error && <small className="text-danger mt-1">{error}</small>}
            </div>
            
            <div className="border rounded p-3 mb-4 bg-light min-vh-50">
              {billData ? (
                <>
                  <h5 className="mb-3">Bill Details: Patient {billData.patientId.substring(0,8)}...</h5>
                  <table className="table table-sm table-borderless">
                    <tbody>
                      {billData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.description}</td>
                          <td className="text-end">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="border-top border-dark">
                        <td className="fw-bold pt-2">Total Amount</td>
                        <td className="text-end fw-bold pt-2 fs-5 text-primary">
                          ${billData.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="text-center text-muted py-5">
                  Enter a Patient ID and click search to generate a bill based on prescriptions and lab orders.
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="border rounded p-4 h-100 d-flex flex-column">
              <h5 className="mb-4">Process Payment</h5>
              
              <div className="mb-3">
                <label className="form-label text-muted small">Payment Method</label>
                <select className="form-select mb-3" disabled={!billData}>
                  <option>Credit/Debit Card</option>
                  <option>Cash</option>
                  <option>Online Gateway / UPI</option>
                </select>
              </div>

              <div className="mt-auto">
                <button disabled={!billData} className="btn btn-success w-100 py-2 mb-2" onClick={() => alert("Payment Processed!")}>
                  <CheckCircle size={18} className="me-2" /> Complete Payment
                </button>
                <button disabled={!billData} className="btn btn-outline-secondary w-100 py-2" onClick={() => alert("Digital receipt sent!")}>
                  <Printer size={18} className="me-2" /> Send Digital Receipt
                </button>
                <div className="text-center mt-2 small text-muted">
                  Receipt will be sent via Email and SMS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;