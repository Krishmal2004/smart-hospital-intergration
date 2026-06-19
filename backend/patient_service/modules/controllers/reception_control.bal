import patient_service.Models;
import ballerina/sql;

// ---- QUEUEING LOGIC ----
public isolated function saveQueueToDB(Models:QueuePayload payload) returns json|error {
    sql:ExecutionResult result = check dbClient->execute(
        `INSERT INTO queues (patient_id, patient_name, doctor_id, department, status)
         VALUES (${payload.patientId}, ${payload.patientName}, ${payload.doctorId}, ${payload.department}, ${payload.status})`
    );
    return {
        "message": "Patient added to queue successfully",
        "id": result.lastInsertId
    };
}

// ---- SCHEDULING LOGIC ----
public isolated function saveScheduleToDB(Models:SchedulePayload payload) returns json|error {
    sql:ExecutionResult result = check dbClient->execute(
        `INSERT INTO doctor_schedules (doctor_id, days, start_time, end_time, duration)
         VALUES (${payload.doctorId}, ${payload.days}, CAST(${payload.startTime} AS TIME), CAST(${payload.endTime} AS TIME), ${payload.duration})`
    );
    return {
        "message": "Doctor schedule saved successfully",
        "id": result.lastInsertId
    };
}

// ---- BILLING LOGIC ----
public isolated function generatePatientBill(string patientId) returns Models:PatientBill|error {
    Models:BillItem[] billItems = [];
    decimal total = 0.0d; // Added 'd' for decimal
    
    billItems.push({ description: "Consultation Fee", amount: 50.00d }); // Added 'd'
    total += 50.00d; // Added 'd'

    int labOrderCount = check dbClient->queryRow(
        `SELECT COUNT(*) FROM lab_orders WHERE patient_id = ${patientId}`
    );

    if (labOrderCount > 0) {
        decimal labFee = 35.00d * <decimal>labOrderCount; // Added 'd'
        billItems.push({ description: "Lab Tests", amount: labFee });
        total += labFee;
    }

    // Check for Prescriptions
    int prescriptionCount = check dbClient->queryRow(
        `SELECT COUNT(*) FROM prescriptions WHERE patient_id = ${patientId}`
    );

    if (prescriptionCount > 0) {
        decimal rxFee = 42.50d * <decimal>prescriptionCount; // Added 'd'
        billItems.push({ description: "Pharmacy", amount: rxFee });
        total += rxFee;
    }

    return {
        patientId: patientId,
        items: billItems,
        totalAmount: total
    };
}

//Get Queue Logic
public isolated function getActiveQueue() returns Models:QueueResponse[]|error {
    Models:QueueResponse[]queues =[];

    stream<Models:QueueResponse, error?> resultStream = dbClient->query(
        `SELECT queue_no, patient_id AS "patientId", patient_name AS "patientName", doctor_id AS "doctorId", department, status 
         FROM queues ORDER BY queue_no ASC`
    );
    
    check from Models:QueueResponse queue in resultStream
        do {
            queues.push(queue);
        };
        
    check resultStream.close();
    return queues;
}