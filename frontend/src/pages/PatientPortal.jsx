import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronRight, FileText, Pill, Receipt, CheckCircle, Activity, Heart } from 'lucide-react';

const CalendarWidget = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['9:00', '10:00', '11:00', '14:00', '15:00'];
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <div className="theme-card p-4 mb-4 border-0">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="orange-icon-bg p-2" style={{ borderRadius: '0.5rem' }}>
          <CalendarIcon size={20} />
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-dark">Book an Appointment</h5>
          <small className="text-muted">Choose a time that works for you</small>
        </div>
      </div>

      <div className="row g-2 mb-3 text-center">
        {days.map(day => (
          <div key={day} className="col fw-bold text-muted small text-uppercase border-bottom pb-2">{day}</div>
        ))}
      </div>
      
      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
        {times.map((time, i) =>
          days.map((day, j) => {
            const isAvailable = (i + j) % 3 !== 0; 
            const id = `${day}-${time}`;
            const isSelected = selectedSlot === id;
            return (
              <button
                key={id}
                disabled={!isAvailable}
                onClick={() => setSelectedSlot(id)}
                className={`btn btn-sm fw-medium ${
                  !isAvailable ? 'btn-light opacity-50 text-muted border-0' :
                  isSelected ? 'btn-primary-orange' : 'btn-outline-gray'
                }`}
                style={{ fontSize: '0.8rem' }}
              >
                {time}
              </button>
            );
          })
        )}
      </div>
      
      <button disabled={!selectedSlot} className="btn-primary-orange w-100 py-3 shadow-sm">
        Confirm Appointment <ChevronRight size={18} />
      </button>
    </div>
  );
};

const DocumentVault = () => {
  const docs = [
    { title: 'Blood Test Results', date: 'Oct 15, 2023', icon: FileText, color: '#f97316', bg: '#ffedd5' },
    { title: 'Lisinopril 10mg', date: 'Active Prescription', icon: Pill, color: '#6b7280', bg: '#f3f4f6' },
    { title: 'Cardiology Report', date: 'Sep 02, 2023', icon: Receipt, color: '#6b7280', bg: '#f3f4f6' },
  ];

  return (
    <div className="theme-card p-4 h-100 border-0 bg-section">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-0 fw-bold text-dark">Your Documents</h5>
          <small className="text-muted">All your records, safe & organized</small>
        </div>
      </div>
      <div className="d-flex flex-column gap-3">
        {docs.map((doc, i) => {
          const Icon = doc.icon;
          return (
            <div key={i} className="theme-card p-3 d-flex align-items-center gap-3 border-0">
               <div className="p-2 rounded" style={{ backgroundColor: doc.bg }}>
                  <Icon size={20} color={doc.color} />
                </div>
                <div>
                  <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem' }}>{doc.title}</p>
                  <small className="text-muted">{doc.date}</small>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PatientPortal = () => {
  return (
    <div className="container">
      <div className="mb-5 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h1 className="fw-bolder mb-1 text-dark">Good morning, Alex.</h1>
          <p className="mb-0 text-muted fs-5">Manage your health journey simply and securely.</p>
        </div>
        <div className="theme-card px-4 py-3 d-flex align-items-center gap-3 border-0">
          <Heart size={24} className="text-orange" fill="#f97316" />
          <div>
            <div className="fw-bold text-dark small text-uppercase">Next Visit</div>
            <div className="text-muted fw-medium">Nov 5 &bull; Dr. Emily Chen</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <CalendarWidget />
        </div>
        <div className="col-lg-5">
          <DocumentVault />
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;