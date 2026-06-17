import React, { useState } from 'react';
import { Users, Activity, CreditCard, Calendar } from 'lucide-react';
import RegistrationTab from './components/RegistrationTab';
import QueueingTab from './components/QueueingTab';
import BillingTab from './components/BillingTab';
import DoctorScheduleTab from './components/DoctorScheduleTab';

const ReceptionDashboard = () => {
  const [activeTab, setActiveTab] = useState('registration');

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">Reception & Billing</h2>
          <p className="text-muted mb-0">Manage patient workflow from entry to payment</p>
        </div>
        <div className="badge bg-primary px-3 py-2 fs-6">Front Desk Agent</div>
      </div>

      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm rounded-3 border-0">
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'registration' ? 'active' : ''}`}
              onClick={() => setActiveTab('registration')}
              style={activeTab === 'registration' ? {backgroundColor: 'var(--primary-color, #ff6b35)', color: '#fff'} : {}}
            >
              <Users size={20} className="me-3" /> 
              <span className="fw-medium">Registration</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'queueing' ? 'active' : ''}`}
              onClick={() => setActiveTab('queueing')}
              style={activeTab === 'queueing' ? {backgroundColor: 'var(--primary-color, #ff6b35)', color: '#fff'} : {}}
            >
              <Activity size={20} className="me-3" /> 
              <span className="fw-medium">Doctor Routing</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
              style={activeTab === 'billing' ? {backgroundColor: 'var(--primary-color, #ff6b35)', color: '#fff'} : {}}
            >
              <CreditCard size={20} className="me-3" /> 
              <span className="fw-medium">Billing & Payment</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex align-items-center py-3 border-0 ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
              style={activeTab === 'schedule' ? {backgroundColor: 'var(--primary-color, #ff6b35)', color: '#fff'} : {}}
            >
              <Calendar size={20} className="me-3" /> 
              <span className="fw-medium">Doctor Schedule</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9">
          {activeTab === 'registration' && <RegistrationTab />}
          {activeTab === 'queueing' && <QueueingTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'schedule' && <DoctorScheduleTab />}
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
