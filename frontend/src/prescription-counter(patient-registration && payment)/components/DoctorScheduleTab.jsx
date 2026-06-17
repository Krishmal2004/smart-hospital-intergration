import React from 'react';
import { Clock } from 'lucide-react';

const DoctorScheduleTab = () => {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Doctor Schedule Management</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="border rounded p-4 bg-light h-100">
              <h5 className="mb-4 d-flex align-items-center">
                <Clock size={20} className="me-2 text-primary" /> 
                Set Clinic & Daily Time
              </h5>
              <form>
                <div className="mb-3">
                  <label className="form-label fw-medium">Select Doctor</label>
                  <select className="form-select">
                    <option value="">Choose doctor...</option>
                    <option value="dr_smith">Dr. Smith (Cardiology)</option>
                    <option value="dr_adams">Dr. Adams (General)</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Available Days</label>
                  <div className="d-flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div className="form-check form-check-inline m-0" key={day}>
                        <input className="btn-check" type="checkbox" id={`day-${day}`} autoComplete="off" />
                        <label className="btn btn-outline-primary btn-sm" htmlFor={`day-${day}`}>{day}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-medium">Start Time</label>
                    <input type="time" className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium">End Time</label>
                    <input type="time" className="form-control" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Consultation Duration (mins)</label>
                  <select className="form-select">
                    <option value="15">15 Minutes</option>
                    <option value="20">20 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>

                <button type="button" className="btn btn-primary w-100" style={{backgroundColor: 'var(--primary-color, #ff6b35)', borderColor: 'var(--primary-color, #ff6b35)'}}>
                  Save Schedule
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="border rounded p-4 h-100">
              <h5 className="mb-4">Current Schedules</h5>
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Doctor</th>
                      <th>Days</th>
                      <th>Timing</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-medium">Dr. Smith</td>
                      <td>Mon, Wed, Fri</td>
                      <td>09:00 AM - 02:00 PM</td>
                      <td>30 mins</td>
                      <td><span className="badge bg-success">Active</span></td>
                    </tr>
                    <tr>
                      <td className="fw-medium">Dr. Adams</td>
                      <td>Tue, Thu, Sat</td>
                      <td>10:00 AM - 04:00 PM</td>
                      <td>20 mins</td>
                      <td><span className="badge bg-success">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleTab;
