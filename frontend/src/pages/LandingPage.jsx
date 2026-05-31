import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Calendar, FileText, HeartPulse, Shield, Zap, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="pb-5">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="container text-center pt-5 pb-5 mt-4">
        <span className="badge badge-orange rounded-pill px-3 py-2 mb-4">
          ✦ NEXT-GEN HEALTHCARE OS
        </span>

        <h1 className="display-3 fw-bolder mb-4" style={{ lineHeight: '1.1', letterSpacing: '-0.03em' }}>
          AI-Powered Healthcare.<br />
          <span className="text-orange">Smart, Efficient, Caring.</span>
        </h1>

        <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
          Orchestrate your medical practice with advanced AI agents. Eliminate administrative bloat, automate scheduling, and identify patient needs instantly.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/login/doctor" className="btn-primary-orange px-4 py-3 text-decoration-none fs-6 shadow">
            Doctor Portal <ArrowRight size={18} />
          </Link>
          <Link to="/login/patient" className="btn-outline-gray px-4 py-3 text-decoration-none fs-6">
            Patient Portal
          </Link>
        </div>
      </section>

      {/* ── Portal Cards ─────────────────────────────── */}
      <section className="bg-section py-5 mt-5">
        <div className="container">
          <div className="text-center mb-5">
             <span className="badge badge-orange rounded-pill px-3 py-1 mb-3">CORE PLATFORMS</span>
             <h2 className="fw-bold mb-3 display-6">Why SmartHospital?</h2>
             <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>Built on a robust AI foundation, we deliver a seamless, transparent experience for both care providers and receivers.</p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-lg-5">
              <div className="theme-card h-100 p-5 text-start border-0">
                <div className="orange-icon-bg mb-4" style={{ width: '48px', height: '48px' }}>
                  <HeartPulse size={24} />
                </div>
                <h4 className="fw-bold mb-3">Doctor Dashboard</h4>
                <p className="text-muted mb-4">
                  Instantly parse, track, and analyze thousands of patient records using our advanced clinical intelligence engine. Visualize timelines and real-time vitals effortlessly.
                </p>
                <Link to="/login/doctor" className="text-decoration-none fw-bold text-dark d-inline-flex align-items-center gap-2 border-bottom border-dark pb-1" style={{ fontSize: '0.9rem' }}>
                  Explore Dashboard <ArrowRight size={16} className="text-orange" />
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="theme-card h-100 p-5 text-start border-0">
                <div className="orange-icon-bg mb-4" style={{ width: '48px', height: '48px' }}>
                  <Calendar size={24} />
                </div>
                <h4 className="fw-bold mb-3">Patient Portal</h4>
                <p className="text-muted mb-4">
                  Our UI models are trained to reduce friction. Book appointments, access secure documents, and fill out smart symptom checkers from a single unified pane.
                </p>
                <Link to="/login/patient" className="text-decoration-none fw-bold text-dark d-inline-flex align-items-center gap-2 border-bottom border-dark pb-1" style={{ fontSize: '0.9rem' }}>
                  Enter Portal <ArrowRight size={16} className="text-orange" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;