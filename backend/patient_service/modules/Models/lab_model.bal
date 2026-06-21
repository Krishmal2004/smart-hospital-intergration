public type LabOrderDetails record {|
    string date;
    string time;
    string priority;
    string [] tests;
    string notes;
|};

public type LabOrderResponse record {|
    int id;
    string patientId;
    string patientName;
    string scheduleDate;
    string priority;
    string tests;
    string status;
    string notes;
    string? results;
|};

public type LabOrderPayload record {|
    PatientRequest patient;
    LabOrderDetails 'order;
|};

public type UpdateStatusPayload record {|
    string status;
|};

public type SaveResultsPayload record {|
    string results;
|};