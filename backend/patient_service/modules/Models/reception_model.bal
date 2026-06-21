public type QueuePayload record {|
    string patientId;
    string patientName; 
    string doctorId;
    string department;
    string status = "Waiting";
|};

public type SchedulePayload record {|
    string doctorId;
    string days;
    string startTime;
    string endTime;
    int duration;
|};

public type BillItem record {|
    string description;
    decimal amount;
|};

public type PatientBill record {|
    string patientId;
    BillItem[] items;
    decimal totalAmount;
|};

public type QueueResponse record {|
    int queue_no;
    string patientId;
    string patientName;
    string doctorId;
    string department;
    string status;
|};

public type NewPatientPayload record {|
    string firstName;
    string lastName;
    string email;
    string mobileNumber;
    string password;
|};