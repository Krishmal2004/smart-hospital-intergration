public type PatientRequest record {|
    string id;
    string name;
    string age?;
    string location?;
    string allergies?;
|};

public type PrescriptionDetails record {|
    string date;
    string diagnosis;
    string medication;
    string instructions;
    string notes?;
|};

public type PrescriptionPayload record {|
    PatientRequest patient;        
    PrescriptionDetails prescription;
|};