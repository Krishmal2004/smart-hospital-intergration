import { useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import {
  Clock, User, FileText, Activity, TrendingUp, Users, Calendar,
  Stethoscope, ChevronRight, CheckCircle, AlertCircle, Timer,
  Heart, Droplets, Thermometer, Pill, ClipboardList, Bell,
  Shield, Star, ArrowUpRight, Search, MoreHorizontal, X
} from 'lucide-react';

/* ───────── Mock Data ───────── */
const mockAppointments = [
  { id: 1, time: '09:00 AM', patient: 'Sarah Jenkins', type: 'Follow-up', status: 'completed', age: 34, room: 'R-201' },
  { id: 2, time: '10:30 AM', patient: 'Michael Chen', type: 'Consultation', status: 'active', age: 56, room: 'R-104' },
  { id: 3, time: '01:00 PM', patient: 'Emma Davis', type: 'Lab Review', status: 'upcoming', age: 28, room: 'R-305' },
  { id: 4, time: '03:15 PM', patient: 'James Wilson', type: 'Routine Check', status: 'upcoming', age: 67, room: 'R-102' },
  { id: 5, time: '04:30 PM', patient: 'Lisa Park', type: 'ECG Review', status: 'upcoming', age: 45, room: 'R-210' },
];

const recentPatients = [
  { name: 'Ava Thompson', lastVisit: '2 days ago', condition: 'Stable' },
  { name: 'Raj Patel', lastVisit: '1 week ago', condition: 'Improving' },
  { name: 'Maria Garcia', lastVisit: '3 days ago', condition: 'Under review' },
];

/* ───────── Animated Count ───────── */
const AnimatedNumber = ({ target, duration = 1200 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
};

/* ───────── Mini Bar Chart ───────── */
const MiniBarChart = () => {
  const data = [3, 5, 4, 7, 6, 4, 5];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const max = Math.max(...data);

  return (
    <div className="d-flex align-items-end gap-1 justify-content-center" style={{ height: 60 }}>
      {data.map((val, i) => (
        <div key={i} className="d-flex flex-column align-items-center gap-1">
          <div
            className="mini-bar"
            style={{
              width: 18,
              height: `${(val / max) * 44}px`,
              background: i === 4 ? 'var(--primary-orange)' : '#e5e7eb',
              borderRadius: 4,
              transition: 'height 0.8s ease',
              transitionDelay: `${i * 0.08}s`,
            }}
          />
          <span style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 600 }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
};

/* ───────── Stat Card ───────── */
const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <div className="theme-card p-3 border-0 doctor-stat-card">
    <div className="d-flex align-items-start justify-content-between mb-2">
      <div className="p-2 rounded-3" style={{ backgroundColor: bg, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={color} />
      </div>
      <MoreHorizontal size={16} className="text-muted" style={{ opacity: 0.4 }} />
    </div>
    <h3 className="fw-bold text-dark mb-0 mt-2" style={{ fontSize: '1.5rem' }}>
      {typeof value === 'number' ? <AnimatedNumber target={value} /> : value}
    </h3>
    <small className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>{label}</small>
    {sub && <div className="mt-1"><small className="text-success fw-bold" style={{ fontSize: '0.68rem' }}>↑ {sub}</small></div>}
  </div>
);

/* ───────── Status Badge ───────── */
const StatusBadge = ({ status }) => {
  const config = {
    completed: { bg: '#d1fae5', color: '#059669', icon: CheckCircle, text: 'Done' },
    active: { bg: '#ffedd5', color: '#f97316', icon: Timer, text: 'In Progress' },
    upcoming: { bg: '#f3f4f6', color: '#6b7280', icon: Clock, text: 'Upcoming' },
  };
  const c = config[status] || config.upcoming;
  const Icon = c.icon;
  return (
    <span className="badge rounded-pill d-flex align-items-center gap-1" style={{ background: c.bg, color: c.color, fontWeight: 600, fontSize: '0.68rem', padding: '5px 10px' }}>
      <Icon size={12} /> {c.text}
    </span>
  );
};

/* ───────── Enhanced Patient Modal ───────── */
const PatientModal = ({ isOpen, onClose, patientName }) => {
  const [activeTab, setActiveTab] = useState('overview');
  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vitals', label: 'Vitals' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }}
      tabIndex="-1"
      onClick={onClose}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.5rem', overflow: 'hidden', animation: 'modalSlideIn 0.3s ease-out' }}>
          {/* Modal Header */}
          <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 60%)', padding: '2rem 2rem 1rem' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center gap-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-4"
                  style={{ width: 72, height: 72, background: 'var(--orange-light)' }}
                >
                  <User size={32} color="var(--primary-orange)" />
                </div>
                <div>
                  <h3 className="fw-bold mb-1 text-dark">{patientName}</h3>
                  <div className="d-flex align-items-center gap-3">
                    <small className="text-muted fw-medium">ID: #PT-84729</small>
                    <span className="badge rounded-pill" style={{ background: '#d1fae5', color: '#059669', fontWeight: 600, fontSize: '0.68rem' }}>Active</span>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                onClick={onClose}
                style={{ width: 36, height: 36 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="d-flex gap-1" style={{ marginBottom: '-1px' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="border-0 px-3 py-2 rounded-top-3 fw-medium"
                  style={{
                    fontSize: '0.82rem',
                    background: activeTab === tab.id ? '#fff' : 'transparent',
                    color: activeTab === tab.id ? 'var(--primary-orange)' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4">
            {activeTab === 'overview' && (
              <>
                <div className="row g-3 mb-4">
                  {[
                    { icon: Heart, label: 'Heart Rate', value: '72 bpm', color: '#ef4444', bg: '#fee2e2' },
                    { icon: Activity, label: 'Blood Pressure', value: '120/80', color: '#f97316', bg: '#ffedd5' },
                    { icon: Droplets, label: 'SpO2', value: '98%', color: '#3b82f6', bg: '#dbeafe' },
                    { icon: Thermometer, label: 'Temp', value: '36.6°C', color: '#10b981', bg: '#d1fae5' },
                  ].map((vital, i) => {
                    const VIcon = vital.icon;
                    return (
                      <div key={i} className="col-6 col-md-3">
                        <div className="text-center p-3 rounded-3" style={{ background: vital.bg }}>
                          <VIcon size={20} color={vital.color} className="mb-1" />
                          <p className="text-muted mb-0" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{vital.label}</p>
                          <h5 className="fw-bold mb-0 mt-1" style={{ color: vital.color }}>{vital.value}</h5>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)', borderLeft: '4px solid var(--primary-orange)' }}>
                  <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <ClipboardList size={16} className="text-orange" /> Medical History Summary
                  </h6>
                  <p className="text-muted mb-0 small lh-lg">
                    Patient has a history of mild hypertension, currently managed with lifestyle changes. No known allergies. Last comprehensive metabolic panel was 3 months ago with normal results. Complains of occasional migraines.
                  </p>
                </div>
              </>
            )}

            {activeTab === 'vitals' && (
              <div className="text-center py-4">
                <Activity size={48} className="text-muted mb-3" style={{ opacity: 0.3 }} />
                <p className="text-muted fw-medium">Detailed vitals chart will appear here</p>
                <small className="text-muted">Connected to health monitoring systems</small>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="d-flex flex-column gap-3">
                {['Annual checkup — Oct 2023', 'Blood panel review — Sep 2023', 'ECG screening — Jul 2023'].map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: '#fafafa' }}>
                    <div className="p-2 rounded-circle" style={{ background: '#ffedd5' }}>
                      <FileText size={14} color="#f97316" />
                    </div>
                    <small className="fw-medium text-dark">{item}</small>
                    <ChevronRight size={14} className="text-muted ms-auto" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 d-flex gap-2">
            <button className="btn-primary-orange flex-fill py-2">
              <FileText size={16} /> Write Prescription
            </button>
            <button className="btn-outline-gray flex-fill py-2">
              <Pill size={16} /> Order Labs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN DOCTOR DASHBOARD
   ═══════════════════════════════════════════ */
const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const workloadPercentage = 75;

  // Asgardeo Authentication Hook using Decoded Token for custom attributes
  const { state, getDecodedIDToken } = useAuthContext();
  const [doctorInfo, setDoctorInfo] = useState({ name: "Loading...", isAuthorized: false, isLoading: true });

  // Fetch User Data and Verify Group or Registration Attribute
  useEffect(() => {
    if (state.isAuthenticated) {
      getDecodedIDToken().then((token) => {
        // Check for traditional Asgardeo Groups
        const userGroups = token.groups || [];
        
        // Check for the custom Self-Registration Attribute
        const accountType = token.account_type || token.accountType || ""; 
        
        // Authorize if they meet either condition
        const isDoctor = userGroups.includes("Doctors") || accountType.toLowerCase() === "doctor";

        setDoctorInfo({
          // Token claims use underscores (given_name) instead of camelCase (givenName)
          name: token.given_name ? `Dr. ${token.given_name} ${token.family_name || ''}` : (token.username || "Doctor"),
          isAuthorized: isDoctor,
          isLoading: false
        });
      }).catch((error) => {
        console.error("Failed to fetch user info", error);
        setDoctorInfo(prev => ({ ...prev, isLoading: false }));
      });
    }
  }, [state.isAuthenticated, getDecodedIDToken]);

  // Loading State
  if (state.isLoading || doctorInfo.isLoading) {
    return (
      <div className="container text-center py-5 mt-5">
        <div className="d-flex flex-column align-items-center gap-3">
          <div className="spinner-border" role="status" style={{ color: 'var(--primary-orange)', width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Security Gate: Block access if not authorized
  if (!doctorInfo.isAuthorized) {
    return (
      <div className="container text-center py-5 mt-5">
        <div className="theme-card p-5 d-inline-block border-0" style={{ borderTop: '4px solid #ef4444' }}>
          <div className="mb-3">
            <Shield size={48} color="#ef4444" />
          </div>
          <h2 className="text-danger fw-bold mb-3">Access Denied</h2>
          <p className="text-muted mb-0">You do not have medical staff permissions to view this dashboard.</p>
        </div>
      </div>
    );
  }

  const filteredAppointments = mockAppointments.filter(apt =>
    apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="doctor-dashboard-page">
      <style>{`
        .doctor-dashboard-page {
          padding: 2rem 0 4rem;
          animation: dashFadeIn 0.5s ease-out;
        }
        @keyframes dashFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .doctor-hero {
          background: linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fef3c7 100%);
          border-radius: 1.25rem;
          padding: 2rem 2.5rem;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(249, 115, 22, 0.1);
        }
        .doctor-hero::before {
          content: '';
          position: absolute;
          top: -60%;
          right: -15%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%);
          border-radius: 50%;
        }

        .doctor-stat-card {
          transition: all 0.25s ease !important;
          cursor: default;
        }
        .doctor-stat-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 16px 32px -8px rgba(0,0,0,0.1) !important;
        }

        .timeline-connector {
          position: absolute;
          left: 23px;
          top: 48px;
          bottom: -12px;
          width: 2px;
          background: linear-gradient(to bottom, #e5e7eb 0%, transparent 100%);
        }
        .timeline-dot {
          position: absolute;
          left: 16px;
          top: 18px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid #fff;
          z-index: 1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .appointment-card {
          margin-left: 48px;
          transition: all 0.25s ease;
          cursor: pointer;
          border: 1px solid transparent !important;
        }
        .appointment-card:hover {
          transform: translateX(4px);
          border-color: var(--orange-muted) !important;
          box-shadow: 0 8px 24px -4px rgba(249, 115, 22, 0.12) !important;
        }
        .appointment-card.active-appointment {
          border-color: var(--primary-orange) !important;
          background: linear-gradient(135deg, #fff 0%, #fff7ed 100%) !important;
        }

        .recent-patient-row {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .recent-patient-row:hover {
          background: #fff !important;
          transform: translateX(4px);
        }

        .quick-action-card {
          transition: all 0.25s ease;
          cursor: pointer;
          border: none !important;
        }
        .quick-action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px -4px rgba(0,0,0,0.1) !important;
        }

        .search-input-wrapper {
          position: relative;
        }
        .search-input-wrapper .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .search-input-wrapper input {
          padding-left: 36px;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          background: #fafafa;
          transition: all 0.2s ease;
          height: 40px;
          font-size: 0.85rem;
        }
        .search-input-wrapper input:focus {
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 3px var(--orange-light);
          background: #fff;
          outline: none;
        }

        .workload-ring {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .platform-badge {
          background: linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%);
          border-radius: 1rem;
          padding: 1rem;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
      `}</style>

      <div className="container">
        {/* ── Hero Section ── */}
        <div className="doctor-hero mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 position-relative" style={{ zIndex: 1 }}>
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge rounded-pill" style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--primary-orange)', fontWeight: 600, fontSize: '0.72rem', padding: '5px 12px' }}>
                  <Stethoscope size={12} style={{ marginRight: 4 }} /> Doctor Dashboard
                </span>
                <span className="badge rounded-pill" style={{ background: '#d1fae5', color: '#059669', fontWeight: 600, fontSize: '0.68rem', padding: '4px 10px' }}>
                  On Duty
                </span>
              </div>
              <h1 className="fw-bolder mb-2 text-dark" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', letterSpacing: '-0.03em' }}>
                {doctorInfo.name}
              </h1>
              <p className="text-muted mb-0 d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                Cardiology Dept <span style={{ color: '#d1d5db' }}>•</span>
                <span className="fw-medium text-dark">Today's Schedule</span>
              </p>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Notification */}
              <div className="position-relative">
                <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <Bell size={20} className="text-muted" />
                </button>
                <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%', position: 'absolute', top: -1, right: -1, animation: 'pulse 2s infinite' }}></div>
              </div>

              {/* Workload Ring */}
              <div className="theme-card p-3 border-0 d-flex align-items-center gap-3" style={{ background: '#fff' }}>
                <div className="workload-ring">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="32" fill="none"
                      stroke="var(--primary-orange)" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - workloadPercentage / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1.5s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span className="fw-bold text-dark" style={{ fontSize: '1.1rem', lineHeight: 1 }}>{workloadPercentage}%</span>
                    <span style={{ fontSize: '0.55rem', color: '#9ca3af', fontWeight: 600 }}>LOAD</span>
                  </div>
                </div>
                <div>
                  <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>Workload</small>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Peak at 1:00 PM</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <StatCard icon={Users} label="Total Patients" value={24} sub="12% from last week" color="#f97316" bg="#ffedd5" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon={Calendar} label="Today's Appointments" value={5} sub="2 remaining" color="#3b82f6" bg="#dbeafe" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon={CheckCircle} label="Completed" value={2} sub="On track" color="#10b981" bg="#d1fae5" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon={AlertCircle} label="Pending Reviews" value={3} sub="Action needed" color="#f59e0b" bg="#fef3c7" />
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="row g-4 mb-4">
          {/* Timeline Column */}
          <div className="col-lg-8">
            <div className="theme-card p-4 border-0 h-100">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2">
                  <Clock className="text-orange" size={22} />
                  <h5 className="mb-0 fw-bold text-dark">Daily Timeline</h5>
                  <span className="badge rounded-pill ms-2" style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem' }}>
                    {mockAppointments.length} appointments
                  </span>
                </div>
                <div className="search-input-wrapper" style={{ width: 220 }}>
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="d-flex flex-column gap-3">
                {filteredAppointments.map((apt, index) => (
                  <div key={apt.id} className="position-relative" onClick={() => setSelectedPatient(apt.patient)} style={{ minHeight: 80 }}>
                    {/* Vertical Connector */}
                    {index < filteredAppointments.length - 1 && <div className="timeline-connector" />}
                    
                    {/* Dot */}
                    <div
                      className="timeline-dot"
                      style={{
                        background: apt.status === 'completed' ? '#10b981'
                          : apt.status === 'active' ? 'var(--primary-orange)'
                          : '#d1d5db',
                      }}
                    />

                    {/* Card */}
                    <div className={`theme-card p-3 appointment-card border-0 ${apt.status === 'active' ? 'active-appointment' : ''}`}>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                          style={{ width: 44, height: 44, background: apt.status === 'active' ? 'var(--orange-light)' : '#f3f4f6', fontWeight: 700, fontSize: '0.85rem', color: apt.status === 'active' ? 'var(--primary-orange)' : '#6b7280' }}
                        >
                          {apt.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: '0.92rem' }}>{apt.patient}</h6>
                            <StatusBadge status={apt.status} />
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <small className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                              <Clock size={12} /> {apt.time}
                            </small>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Age {apt.age}
                            </small>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {apt.room}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge rounded-pill" style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 500, fontSize: '0.72rem' }}>
                            {apt.type}
                          </span>
                          <ChevronRight size={16} className="text-muted" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredAppointments.length === 0 && (
                  <div className="text-center py-4">
                    <Search size={36} className="text-muted mb-2" style={{ opacity: 0.3 }} />
                    <p className="text-muted fw-medium mb-0">No matching appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4 d-flex flex-column gap-4">
            {/* Quick Actions */}
            <div className="theme-card p-4 border-0">
              <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <Star size={16} className="text-orange" /> Quick Actions
              </h6>
              <div className="d-grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {[
                  { icon: FileText, label: 'Prescription', color: '#f97316', bg: '#ffedd5' },
                  { icon: Activity, label: 'Order Labs', color: '#3b82f6', bg: '#dbeafe' },
                  { icon: ClipboardList, label: 'Notes', color: '#8b5cf6', bg: '#ede9fe' },
                  { icon: Users, label: 'Referral', color: '#10b981', bg: '#d1fae5' },
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button key={i} className="theme-card p-3 quick-action-card d-flex flex-column align-items-center gap-2">
                      <div className="p-2 rounded-3" style={{ background: action.bg }}>
                        <Icon size={18} color={action.color} />
                      </div>
                      <small className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>{action.label}</small>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient Volume Chart */}
            <div className="theme-card p-4 border-0">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <TrendingUp size={16} className="text-orange" /> This Week
                </h6>
                <small className="text-muted fw-medium" style={{ fontSize: '0.72rem' }}>Patient Volume</small>
              </div>
              <MiniBarChart />
            </div>

            {/* Recent Patients */}
            <div className="theme-card p-4 border-0">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold text-dark mb-0">Recent Patients</h6>
                <button className="btn btn-sm btn-light rounded-pill px-3" style={{ fontSize: '0.72rem' }}>
                  View All <ArrowUpRight size={12} />
                </button>
              </div>
              <div className="d-flex flex-column gap-2">
                {recentPatients.map((patient, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 p-2 rounded-3 recent-patient-row" style={{ background: '#fafafa' }}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 36, height: 36, background: '#f3f4f6', fontWeight: 700, fontSize: '0.72rem', color: '#6b7280', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-grow-1">
                      <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.82rem' }}>{patient.name}</p>
                      <small className="text-muted" style={{ fontSize: '0.68rem' }}>{patient.lastVisit}</small>
                    </div>
                    <span className="badge rounded-pill" style={{
                      background: patient.condition === 'Stable' ? '#d1fae5' : patient.condition === 'Improving' ? '#dbeafe' : '#fef3c7',
                      color: patient.condition === 'Stable' ? '#059669' : patient.condition === 'Improving' ? '#2563eb' : '#d97706',
                      fontWeight: 600,
                      fontSize: '0.62rem',
                      padding: '3px 8px',
                    }}>
                      {patient.condition}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Status */}
            <div className="platform-badge">
              <div className="d-flex align-items-center gap-3">
                <div className="orange-icon-bg p-2 rounded-3" style={{ width: 40, height: 40 }}>
                  <Shield size={18} />
                </div>
                <div>
                  <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.06em' }}>Platform Status</small>
                  <span className="text-success fw-bold d-flex align-items-center gap-2 small">
                    <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '0.4rem', height: '0.4rem' }}></span>
                    Secured by Asgardeo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PatientModal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        patientName={selectedPatient}
      />
    </div>
  );
};

export default DoctorDashboard;