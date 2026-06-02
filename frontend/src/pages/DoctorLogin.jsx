import { Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthContext } from "@asgardeo/auth-react";

const DoctorLogin = () => {
  const { signIn } = useAuthContext();

  return (
    <div className="container row justify-content-center align-items-center mx-auto" style={{ minHeight: '80vh' }}>
      <div className="col-12 col-md-6 col-lg-5">
        <div className="text-center mb-5">
          <div className="orange-icon-bg mx-auto mb-3" style={{ width: '56px', height: '56px', borderRadius: '50%' }}>
            <Stethoscope size={28} />
          </div>
          <h2 className="fw-bolder">Doctor Portal</h2>
          <p className="text-muted">Securely access the clinical platform.</p>
        </div>

        <div className="theme-card p-4 p-md-5 text-center">
          <ShieldCheck size={48} className="text-orange mb-4 mx-auto" />
          <h4 className="fw-bold mb-3">Single Sign-On (SSO)</h4>
          <p className="text-muted mb-4">
            SmartHospital uses Asgardio to ensure HIPAA-compliant, secure authentication for all medical staff.
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

export default DoctorLogin;