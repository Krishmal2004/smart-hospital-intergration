import patient_service.Models;

table<Models:QueueItem> key(queueNo) queueDb = table [
    {queueNo: "Q-001", patientId: "P001", patientName: "John Doe", doctorName: "Dr. Smith", department: "Cardiology", status: "Waiting"}
];

table<Models:Bill> key(patientId) billsDb = table [
    {
        patientId: "P001", patientName: "John Doe",
        items: [
            {description: "Consultation Fee (Dr. Smith)", amount: 50.00d},
            {description: "Lab Test (Blood Count)", amount: 35.00d},
            {description: "Pharmacy (Prescription #882)", amount: 42.50d}
        ],
        total: 127.50d, status: "Pending"
    }
];

table<Models:Schedule> key(doctorId) schedulesDb = table [
    {doctorId: "dr_smith", doctorName: "Dr. Smith", days: ["Mon", "Wed", "Fri"], startTime: "09:00", endTime: "14:00", duration: 30, status: "Active"},
    {doctorId: "dr_adams", doctorName: "Dr. Adams", days: ["Tue", "Thu", "Sat"], startTime: "10:00", endTime: "16:00", duration: 20, status: "Active"}
];

// --- Queue Logic ---
public isolated function getActiveQueue() returns Models:QueueItem[] {
    lock { return queueDb.toArray(); }
}

public isolated function assignToQueue(Models:QueueItem payload) returns json|error {
    lock {
        error? err = queueDb.add(payload);
        if err is error { return err; }
        return { "message": "Patient added to queue successfully", "queueNo": payload.queueNo };
    }
}

// --- Billing Logic ---
public isolated function getPatientBill(string patientId) returns Models:Bill|error {
    lock {
        Models:Bill? bill = billsDb[patientId];
        if bill is Models:Bill { return bill; }
        return error("No pending bills found for this patient");
    }
}

public isolated function processPayment(string patientId) returns json|error {
    lock {
        Models:Bill? bill = billsDb[patientId];
        if bill is Models:Bill {
            bill.status = "Paid";
            billsDb.put(bill);
            return { "message": "Payment processed successfully" };
        }
        return error("Bill not found");
    }
}

// --- Scheduling Logic ---
public isolated function getSchedules() returns Models:Schedule[] {
    lock { return schedulesDb.toArray(); }
}

public isolated function saveSchedule(Models:Schedule payload) returns json|error {
    lock {
        schedulesDb.put(payload);
        return { "message": "Schedule updated successfully" };
    }
}