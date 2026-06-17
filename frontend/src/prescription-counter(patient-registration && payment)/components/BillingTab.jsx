import React from 'react';
import { Search, CheckCircle, Printer } from 'lucide-react';

const BillingTab = () => {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Payment Handling & Billing</h4>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="mb-4">
              <label className="form-label">Search Patient to Bill</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Patient ID or Name..." />
                <button className="btn btn-outline-secondary"><Search size={18} /></button>
              </div>
            </div>
            
            <div className="border rounded p-3 mb-4 bg-light">
              <h5 className="mb-3">Bill Details: John Doe (P001)</h5>
              <table className="table table-sm table-borderless">
                <tbody>
                  <tr>
                    <td>Consultation Fee (Dr. Smith)</td>
                    <td className="text-end">$50.00</td>
                  </tr>
                  <tr>
                    <td>Lab Test (Blood Count)</td>
                    <td className="text-end">$35.00</td>
                  </tr>
                  <tr>
                    <td>Pharmacy (Prescription #882)</td>
                    <td className="text-end">$42.50</td>
                  </tr>
                  <tr className="border-top border-dark">
                    <td className="fw-bold pt-2">Total Amount</td>
                    <td className="text-end fw-bold pt-2 fs-5 text-primary">$127.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="border rounded p-4 h-100 d-flex flex-column">
              <h5 className="mb-4">Process Payment</h5>
              
              <div className="mb-3">
                <label className="form-label text-muted small">Payment Method</label>
                <select className="form-select mb-3">
                  <option>Credit/Debit Card</option>
                  <option>Cash</option>
                  <option>Online Gateway / UPI</option>
                </select>
              </div>

              <div className="mt-auto">
                <button className="btn btn-success w-100 py-2 mb-2 d-flex align-items-center justify-content-center">
                  <CheckCircle size={18} className="me-2" /> Complete Payment
                </button>
                <button className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center">
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
