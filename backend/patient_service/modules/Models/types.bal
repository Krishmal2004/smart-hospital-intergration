public type PatientRequest record {|
    string id;
    string name;
    string age?;
    string location?;
    string allergies?;
    string bloodGroup?;
|};

public type PrescriptionDetails record {|
    string date;
    string diagnosis;
    string medication;
    string instructions;
    string notes?;
|};

public type DoctorAppointment record {|
    int id;
    string time;
    string patient;     
    string patientId; 
    string 'type;
    string status;
    string history; 
|};

public type PrescriptionPayload record {|
    PatientRequest patient;        
    PrescriptionDetails prescription;
|};
