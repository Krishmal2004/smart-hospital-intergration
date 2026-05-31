import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthContext } from "@asgardeo/auth-react";

const PatientLogin = () => {
  const navigate = useNavigate();
  const { signIn, state } = useAuthContext();

  // Redirect if they are already logged in
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/patient');
    }
  }, [state.isAuthenticated, navigate]);

  return (
    <div className="container row justify-content-center align-items-center mx-auto" style={{ minHeight: '80vh' }}>
      <div className="col-12 col-md-6 col-lg-5">
        <div className="text-center mb-5">
          <div className="orange-icon-bg mx-auto mb-3" style={{ width: '56px', height: '56px', borderRadius: '50%' }}>
            <UserCircle size={28} />
          </div>
          <h2 className="fw-bolder">Patient Portal</h2>
          <p className="text-muted">Access your health records and appointments.</p>
        </div>

        <div className="theme-card p-4 p-md-5 text-center">
          <ShieldCheck size={48} className="text-orange mb-4 mx-auto" />
          <h4 className="fw-bold mb-3">Secure Login</h4>
          <p className="text-muted mb-4">
            Your privacy is our priority. We use Asgardio enterprise security to protect your personal health information.
          </p>

          <button 
            onClick={() => signIn()} 
            className="btn-primary-orange w-100 py-3 shadow-sm d-flex justify-content-center align-items-center gap-2"
          >
            Continue with Asgardio <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;