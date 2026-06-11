public type LabOrderDetails record {|
    string date;
    string time;
    string priority;
    string [] tests;
    string notes;
|};

public type LabOrderPayload record {|
    PatientRequest patient;
    LabOrderDetails 'order;
|};