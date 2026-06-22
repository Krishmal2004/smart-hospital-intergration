public type DispenseItem record {|
    string name;
    string instructions;
    int qty;
    int stock;
|};

public type DispensaryResponse record {|
    int id;
    string displayId;
    string patientId;
    string patientName;
    string doctorName;
    string time;
    string status;
    DispenseItem[] items;
|};