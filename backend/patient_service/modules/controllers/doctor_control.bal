import patient_service.Models;

public isolated function getTodayAppointments(string doctorId) returns Models:DoctorAppointment[]|error {
    Models:DoctorAppointment[] appointments = [];
    
    // Fetch ALL waiting patients (Global Clinic Queue)
    stream<record{}, error?> resultStream = dbClient->query(
        `SELECT q.queue_no, q.patient_id, q.patient_name, q.department, q.status, 
                TO_CHAR(q.created_at, 'HH12:MI AM') AS time,
                COALESCE(p.history_text, 'No prior medical history found.') AS history
         FROM queues q
         LEFT JOIN (
             SELECT patient_id, STRING_AGG(diagnosis, ' | ') AS history_text 
             FROM prescriptions 
             GROUP BY patient_id
         ) p ON q.patient_id = p.patient_id
         WHERE q.status = 'Waiting' 
         ORDER BY q.queue_no ASC`
    );
    
    check from record{} row in resultStream
        do {
            appointments.push({
                id: <int>row["queue_no"],
                time: row["time"] is string ? <string>row["time"] : "09:00 AM",
                patient: <string>row["patient_name"],
                patientId: <string>row["patient_id"],
                'type: "Consultation",
                status: "active",
                history: row["history"] is string ? <string>row["history"] : "No history"
            });
        };
        
    check resultStream.close();
    return appointments;
}

public isolated function getPatientHistory(string doctorId) returns Models:DoctorAppointment[]|error {
    Models:DoctorAppointment[] appointments = [];
    
    // Fetch ALL completed patients
    stream<record{}, error?> resultStream = dbClient->query(
        `SELECT q.queue_no, q.patient_id, q.patient_name, q.department, q.status, 
                TO_CHAR(q.created_at, 'Mon DD') AS time,
                COALESCE(p.history_text, 'No prior medical history found.') AS history
         FROM queues q
         LEFT JOIN (
             SELECT patient_id, STRING_AGG(diagnosis, ' | ') AS history_text 
             FROM prescriptions 
             GROUP BY patient_id
         ) p ON q.patient_id = p.patient_id
         WHERE q.status = 'Completed'
         ORDER BY q.queue_no DESC`
    );
    
    check from record{} row in resultStream
        do {
            appointments.push({
                id: <int>row["queue_no"],
                time: row["time"] is string ? <string>row["time"] : "Past Visit",
                patient: <string>row["patient_name"],
                patientId: <string>row["patient_id"],
                'type: "Follow-up",
                status: "completed",
                history: row["history"] is string ? <string>row["history"] : "No history"
            });
        };
        
    check resultStream.close();
    return appointments;
}