public type QueueItem record {|
    readonly string queueNo;
    string patientId;
    string patientName;
    string doctorName;
    string department;
    string status;
|};

public type BillItem record {|
    string description;
    decimal amount;
|};

public type Bill record {|
    readonly string patinetId;
    string patientName;
    BillItem[] items;
    decimal total;
    string status;
|};

public type Schedule record {|
    readonly string doctorId;
    string doctorName;
    string[] days;
    string startTime;
    string endTime;
    int duration;
    string status;
|};
