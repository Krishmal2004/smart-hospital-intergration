import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, Stethoscope, UserCircle, LogOut } from 'lucide-react';
import { useAuthContext } from "@asgardeo/auth-react";

const MainLayout = () => {
  const location = useLocation();
  const { signOut, state } = useAuthContext();
  
  // Check if we are on a dashboard to show the logout button
  const onDash = (location.pathname === '/doctor' || location.pathname === '/patient');

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg bg-white sticky-top py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
            <div className="orange-icon-bg" style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
              <Activity size={18} strokeWidth={3} />
            </div>
            <span className="fw-bold fs-5 text-dark" style={{ letterSpacing: '-0.02em' }}>SmartHospital</span>
          </Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="mainNav">
            <ul className="navbar-nav align-items-center gap-3">
              {onDash || state.isAuthenticated ? (
                <li className="nav-item">
                  <button onClick={() => signOut()} className="btn-outline-gray btn-sm px-3 py-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login/patient" className="text-decoration-none text-dark fw-medium d-flex align-items-center gap-2 px-2" style={{ transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.classList.add('text-orange')} onMouseOut={(e) => e.currentTarget.classList.remove('text-orange')}>
                      <UserCircle size={18} /> Patient Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login/doctor" className="btn-primary-orange btn-sm px-4 py-2 text-decoration-none shadow-sm">
                      <Stethoscope size={16} /> Doctor Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;