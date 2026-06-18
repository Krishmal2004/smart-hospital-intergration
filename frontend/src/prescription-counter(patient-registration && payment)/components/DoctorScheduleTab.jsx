import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DoctorScheduleTab = () => {
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]); // Local state to display submitted schedules
  
  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('15');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error("Failed to fetch doctors:", err));
  }, []);

  const handleDayToggle = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || selectedDays.length === 0 || !startTime || !endTime) {
      return alert("Please fill in all fields and select at least one day.");
    }

    setIsSubmitting(true);
    const doctor = doctors.find(d => d.id === selectedDoctorId);
    
    // Format to HH:MM:SS for Ballerina Time parsing
    const formattedStartTime = startTime.length === 5 ? `${startTime}:00` : startTime;
    const formattedEndTime = endTime.length === 5 ? `${endTime}:00` : endTime;

    const payload = {
      doctorId: doctor.id,
      days: selectedDays.join(', '),
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      duration: parseInt(duration)
    };

    try {
      const response = await fetch('http://localhost:8080/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSchedules([...schedules, { ...payload, doctorName: doctor.name }]);
        // Reset form
        setSelectedDays([]);
        setStartTime('');
        setEndTime('');
      } else {
        alert("Failed to save schedule.");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <form onSubmit={handleSaveSchedule}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Select Doctor</label>
                  <select className="form-select" value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)}>
                    <option value="">Choose doctor...</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Available Days</label>
                  <div className="d-flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <div className="form-check form-check-inline m-0" key={day}>
                        <input className="btn-check" type="checkbox" id={`day-${day}`} 
                          checked={selectedDays.includes(day)}
                          onChange={() => handleDayToggle(day)} />
                        <label className="btn btn-outline-primary btn-sm" htmlFor={`day-${day}`}>{day}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-medium">Start Time</label>
                    <input type="time" className="form-control" value={startTime} onChange={e => setStartTime(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium">End Time</label>
                    <input type="time" className="form-control" value={endTime} onChange={e => setEndTime(e.target.value)} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Consultation Duration (mins)</label>
                  <select className="form-select" value={duration} onChange={e => setDuration(e.target.value)}>
                    <option value="15">15 Minutes</option>
                    <option value="20">20 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100" style={{backgroundColor: 'var(--primary-color, #ff6b35)', borderColor: 'var(--primary-color, #ff6b35)'}}>
                  {isSubmitting ? 'Saving...' : 'Save Schedule'}
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
                    {schedules.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-3">No schedules created yet.</td></tr>
                    ) : (
                      schedules.map((s, idx) => (
                        <tr key={idx}>
                          <td className="fw-medium">{s.doctorName}</td>
                          <td>{s.days}</td>
                          <td>{s.startTime.substring(0,5)} - {s.endTime.substring(0,5)}</td>
                          <td>{s.duration} mins</td>
                          <td><span className="badge bg-success">Active</span></td>
                        </tr>
                      ))
                    )}
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