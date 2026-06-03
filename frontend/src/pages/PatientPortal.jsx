import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, ChevronRight, ChevronLeft, FileText, Pill, Receipt,
  CheckCircle, Activity, Heart, Clock, Shield, Bell, TrendingUp, Droplets,
  Thermometer, User, ArrowUpRight, Star, Zap, Phone, MessageSquare
} from 'lucide-react';

/* ───────── Animated Health Ring ───────── */
const HealthRing = ({ value, max, label, icon: Icon, color, unit }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedValue / max) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="health-ring-card text-center">
      <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 12px' }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="6" />
          <circle
            cx="45" cy="45" r={radius} fill="none"
            stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: 'stroke-dashoffset 1.2s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={color} />
        </div>
      </div>
      <div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>{value}<small className="text-muted ms-1" style={{ fontSize: '0.7rem' }}>{unit}</small></div>
      <small className="text-muted" style={{ fontSize: '0.75rem' }}>{label}</small>
    </div>
  );
};

/* ───────── Stat Card ───────── */
const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => (
  <div className="theme-card p-3 border-0 stat-card-hover">
    <div className="d-flex align-items-center gap-3">
      <div className="orange-icon-bg p-2" style={{ borderRadius: '0.75rem', width: 44, height: 44 }}>
        <Icon size={20} />
      </div>
      <div className="flex-grow-1">
        <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>{label}</small>
        <div className="fw-bold text-dark" style={{ fontSize: '1.15rem' }}>{value}</div>
      </div>
      {trend && (
        <span className={`badge rounded-pill ${trendUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '0.7rem' }}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
  </div>
);

/* ───────── Calendar Widget (Enhanced) ───────── */
const CalendarWidget = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dates = [2, 3, 4, 5, 6];
  const times = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);

  return (
    <div className="theme-card p-4 border-0 h-100">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="orange-icon-bg p-2" style={{ borderRadius: '0.75rem', width: 44, height: 44 }}>
            <CalendarIcon size={20} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold text-dark">Book Appointment</h5>
            <small className="text-muted">Choose your preferred slot</small>
          </div>
        </div>
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
            <ChevronLeft size={16} />
          </button>
          <button className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day Selector */}
      <div className="d-flex gap-2 mb-4">
        {days.map((day, i) => (
          <button
            key={day}
            onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
            className={`flex-fill text-center py-2 rounded-3 border-0 day-selector-btn ${selectedDay === i ? 'active' : ''}`}
            style={{
              background: selectedDay === i ? 'var(--primary-orange)' : '#f9fafb',
              color: selectedDay === i ? '#fff' : 'var(--text-dark)',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
            }}
          >
            <small className="d-block fw-medium" style={{ fontSize: '0.7rem', opacity: 0.8 }}>{day}</small>
            <span className="fw-bold" style={{ fontSize: '1.1rem' }}>{dates[i]}</span>
          </button>
        ))}
      </div>

      {/* Time Grid */}
      <div className="d-grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {times.map((time, i) => {
          const isAvailable = (i + selectedDay) % 3 !== 0;
          const id = `${days[selectedDay]}-${time}`;
          const isSelected = selectedSlot === id;
          return (
            <button
              key={id}
              disabled={!isAvailable}
              onClick={() => setSelectedSlot(id)}
              className="time-slot-btn"
              style={{
                padding: '10px 0',
                borderRadius: '0.625rem',
                border: isSelected ? '2px solid var(--primary-orange)' : '1px solid #e5e7eb',
                background: !isAvailable ? '#f9fafb' : isSelected ? 'var(--orange-light)' : '#fff',
                color: !isAvailable ? '#d1d5db' : isSelected ? 'var(--primary-orange)' : 'var(--text-dark)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
              }}
            >
              <Clock size={14} style={{ marginRight: 4, opacity: 0.6 }} />
              {time}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        disabled={!selectedSlot}
        className="btn-primary-orange w-100 py-3 shadow-sm"
        style={{ opacity: selectedSlot ? 1 : 0.5, fontSize: '0.95rem' }}
      >
        <CheckCircle size={18} />
        Confirm Appointment
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

/* ───────── Document Vault (Enhanced) ───────── */
const DocumentVault = () => {
  const docs = [
    { title: 'Blood Test Results', date: 'Oct 15, 2023', icon: FileText, color: '#f97316', bg: '#ffedd5', badge: 'New' },
    { title: 'Lisinopril 10mg', date: 'Active Prescription', icon: Pill, color: '#8b5cf6', bg: '#ede9fe', badge: 'Active' },
    { title: 'Cardiology Report', date: 'Sep 02, 2023', icon: Receipt, color: '#3b82f6', bg: '#dbeafe', badge: null },
    { title: 'Vaccination Record', date: 'Aug 20, 2023', icon: Shield, color: '#10b981', bg: '#d1fae5', badge: null },
  ];

  return (
    <div className="theme-card p-4 h-100 border-0">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-0 fw-bold text-dark">Medical Records</h5>
          <small className="text-muted">All your records, safe & organized</small>
        </div>
        <button className="btn btn-sm btn-light rounded-pill px-3 fw-medium" style={{ fontSize: '0.8rem' }}>
          View All <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {docs.map((doc, i) => {
          const Icon = doc.icon;
          return (
            <div
              key={i}
              className="doc-item d-flex align-items-center gap-3 p-3 rounded-3"
              style={{
                background: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                border: '1px solid transparent',
              }}
            >
              <div className="p-2 rounded-3" style={{ backgroundColor: doc.bg, minWidth: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={doc.color} />
              </div>
              <div className="flex-grow-1">
                <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.88rem' }}>{doc.title}</p>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{doc.date}</small>
              </div>
              {doc.badge && (
                <span
                  className="badge rounded-pill"
                  style={{
                    background: doc.badge === 'New' ? 'var(--orange-light)' : '#ede9fe',
                    color: doc.badge === 'New' ? 'var(--primary-orange)' : '#8b5cf6',
                    fontWeight: 600,
                    fontSize: '0.68rem',
                    padding: '4px 10px',
                  }}
                >
                  {doc.badge}
                </span>
              )}
              <ChevronRight size={16} className="text-muted" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ───────── Medication Tracker ───────── */
const MedicationTracker = () => {
  const meds = [
    { name: 'Lisinopril', dose: '10mg', time: '8:00 AM', taken: true, color: '#8b5cf6' },
    { name: 'Metformin', dose: '500mg', time: '12:00 PM', taken: true, color: '#3b82f6' },
    { name: 'Aspirin', dose: '81mg', time: '6:00 PM', taken: false, color: '#f97316' },
  ];

  return (
    <div className="theme-card p-4 border-0 h-100">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-2 rounded-3" style={{ backgroundColor: '#ede9fe', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Pill size={20} color="#8b5cf6" />
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-dark">Medications</h5>
          <small className="text-muted">Today's schedule</small>
        </div>
        <div className="ms-auto">
          <span className="badge rounded-pill" style={{ background: '#d1fae5', color: '#059669', fontWeight: 600, fontSize: '0.72rem', padding: '5px 12px' }}>
            2/3 taken
          </span>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {meds.map((med, i) => (
          <div key={i} className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{
                width: 36, height: 36,
                background: med.taken ? '#d1fae5' : '#fef3c7',
                transition: 'all 0.3s ease',
              }}
            >
              {med.taken ? <CheckCircle size={18} color="#059669" /> : <Clock size={18} color="#d97706" />}
            </div>
            <div className="flex-grow-1">
              <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.88rem' }}>{med.name} <span className="text-muted fw-normal">{med.dose}</span></p>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>{med.time}</small>
            </div>
            <div className="rounded-pill" style={{ width: 8, height: 8, background: med.color }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────── Quick Actions ───────── */
const QuickActions = () => {
  const actions = [
    { icon: Phone, label: 'Call Doctor', color: '#3b82f6', bg: '#dbeafe' },
    { icon: MessageSquare, label: 'Chat Support', color: '#8b5cf6', bg: '#ede9fe' },
    { icon: FileText, label: 'Lab Results', color: '#f97316', bg: '#ffedd5' },
    { icon: Zap, label: 'Emergency', color: '#ef4444', bg: '#fee2e2' },
  ];

  return (
    <div className="theme-card p-4 border-0">
      <h5 className="mb-3 fw-bold text-dark">Quick Actions</h5>
      <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              className="quick-action-btn d-flex flex-column align-items-center justify-content-center gap-2 p-3 rounded-3 border-0"
              style={{
                background: action.bg,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <Icon size={22} color={action.color} />
              <small className="fw-bold" style={{ color: action.color, fontSize: '0.75rem' }}>{action.label}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ───────── Upcoming Appointments ───────── */
const UpcomingAppointments = () => {
  const appointments = [
    { doctor: 'Dr. Emily Chen', specialty: 'Cardiologist', date: 'Nov 5, 2023', time: '10:30 AM', avatar: '🩺' },
    { doctor: 'Dr. James Wilson', specialty: 'General Physician', date: 'Nov 12, 2023', time: '2:00 PM', avatar: '👨‍⚕️' },
  ];

  return (
    <div className="theme-card p-4 border-0">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="mb-0 fw-bold text-dark">Upcoming Visits</h5>
        <button className="btn btn-sm btn-light rounded-pill px-3 fw-medium" style={{ fontSize: '0.8rem' }}>
          See All <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="d-flex flex-column gap-3">
        {appointments.map((apt, i) => (
          <div
            key={i}
            className="d-flex align-items-center gap-3 p-3 rounded-3"
            style={{
              background: i === 0 ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' : '#fafafa',
              border: i === 0 ? '1px solid var(--orange-muted)' : '1px solid transparent',
              transition: 'all 0.25s ease',
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{ width: 48, height: 48, background: '#fff', fontSize: '1.4rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {apt.avatar}
            </div>
            <div className="flex-grow-1">
              <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.88rem' }}>{apt.doctor}</p>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>{apt.specialty}</small>
            </div>
            <div className="text-end">
              <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.82rem' }}>{apt.date}</p>
              <small className="text-orange fw-medium" style={{ fontSize: '0.72rem' }}>{apt.time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN PATIENT PORTAL
   ═══════════════════════════════════════════ */
const PatientPortal = () => {
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
    else if (hour >= 17) setGreeting('Good evening');
  }, []);

  return (
    <div className="patient-portal-page">
      <style>{`
        .patient-portal-page {
          padding: 2rem 0 4rem;
          animation: fadeInUp 0.5s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .hero-greeting {
          background: linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #fef3c7 100%);
          border-radius: 1.25rem;
          padding: 2rem 2.5rem;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(249, 115, 22, 0.1);
        }
        .hero-greeting::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
          border-radius: 50%;
        }
        .hero-greeting::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: 10%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%);
          border-radius: 50%;
        }

        .stat-card-hover {
          transition: all 0.25s ease !important;
        }
        .stat-card-hover:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 24px -8px rgba(0,0,0,0.1) !important;
        }

        .health-ring-card {
          transition: all 0.3s ease;
          padding: 1rem;
          border-radius: 1rem;
        }
        .health-ring-card:hover {
          background: #fafafa;
          transform: scale(1.05);
        }

        .doc-item:hover {
          background: #fff !important;
          border-color: var(--orange-muted) !important;
          transform: translateX(4px);
        }

        .quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px -4px rgba(0,0,0,0.08);
        }

        .time-slot-btn:hover:not(:disabled) {
          border-color: var(--primary-orange) !important;
          background: var(--orange-light) !important;
          color: var(--primary-orange) !important;
        }

        .notification-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          position: absolute;
          top: -2px;
          right: -2px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 0.5rem 0;
        }
      `}</style>

      <div className="container">
        {/* ── Hero Greeting ── */}
        <div className="hero-greeting mb-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 position-relative" style={{ zIndex: 1 }}>
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge rounded-pill" style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--primary-orange)', fontWeight: 600, fontSize: '0.72rem', padding: '5px 12px' }}>
                  <Star size={12} style={{ marginRight: 4 }} /> Patient Dashboard
                </span>
              </div>
              <h1 className="fw-bolder mb-2 text-dark" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.03em' }}>
                {greeting}, Alex.
              </h1>
              <p className="mb-0 text-muted" style={{ fontSize: '1rem', maxWidth: 420 }}>
                Your health journey at your fingertips. Let's keep you on track.
              </p>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Notification Bell */}
              <div className="position-relative">
                <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <Bell size={20} className="text-muted" />
                </button>
                <div className="notification-dot"></div>
              </div>

              {/* Next Visit Card */}
              <div className="theme-card px-4 py-3 d-flex align-items-center gap-3 border-0" style={{ background: '#fff' }}>
                <Heart size={22} className="text-orange" fill="#f97316" />
                <div>
                  <div className="fw-bold text-dark small text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>Next Visit</div>
                  <div className="text-muted fw-medium" style={{ fontSize: '0.88rem' }}>Nov 5 &bull; Dr. Emily Chen</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Health Vitals ── */}
        <div className="theme-card p-4 border-0 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <Activity size={18} className="text-orange" />
              <h6 className="mb-0 fw-bold text-dark">Health Vitals</h6>
            </div>
            <small className="text-muted fw-medium">Last updated: Today, 8:30 AM</small>
          </div>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <HealthRing value={72} max={120} label="Heart Rate" icon={Heart} color="#ef4444" unit="bpm" />
            </div>
            <div className="col-6 col-md-3">
              <HealthRing value={98} max={100} label="Oxygen" icon={Droplets} color="#3b82f6" unit="%" />
            </div>
            <div className="col-6 col-md-3">
              <HealthRing value={120} max={180} label="Blood Pressure" icon={Activity} color="#f97316" unit="mmHg" />
            </div>
            <div className="col-6 col-md-3">
              <HealthRing value={36.6} max={42} label="Temperature" icon={Thermometer} color="#10b981" unit="°C" />
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <StatCard icon={CalendarIcon} label="Appointments" value="3 Upcoming" trend="2 this week" trendUp />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon={Pill} label="Medications" value="3 Active" trend="On track" trendUp />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon={FileText} label="Lab Reports" value="5 Reports" trend="1 new" trendUp />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon={Shield} label="Insurance" value="Active" trend="Valid" trendUp />
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <CalendarWidget />
          </div>
          <div className="col-lg-5">
            <DocumentVault />
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="row g-4">
          <div className="col-lg-4">
            <MedicationTracker />
          </div>
          <div className="col-lg-4">
            <UpcomingAppointments />
          </div>
          <div className="col-lg-4">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;