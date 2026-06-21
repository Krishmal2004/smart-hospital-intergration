import patient_service.Models;
import ballerina/sql;
//import ballerina/log;

public isolated function saveLabOrderToDB(Models:LabOrderPayload payload) returns json|error {
    string notes = payload.'order.notes;

    string testsString = "";
    foreach int i in 0 ..< payload.'order.tests.length(){
        if i >0{
            testsString += ",";
        }
        testsString += payload.'order.tests[i];
    }

    sql:ExecutionResult result = check dbClient->execute(
        `INSERT INTO lab_orders (patient_id, patient_name, schedule_date, schedule_time, priority, tests, notes)
         VALUES (${payload.patient.id}, ${payload.patient.name}, CAST(${payload.'order.date} AS DATE), CAST(${payload.'order.time} AS TIME), ${payload.'order.priority}, ${testsString}, ${notes})`
    );

    //log:printInfo("SUCCESS! PostgreSQL created a new row with ID: " + result.lastInsertId.toString());

    return {
        "message": "Lab Order Saved Successfully",
        "id": result.lastInsertId
    };
}

public isolated function getAllLabOrders() returns Models:LabOrderResponse[]|error {
    Models:LabOrderResponse[] orders = [];
    
    stream<Models:LabOrderResponse, error?> resultStream = dbClient->query(
        `SELECT id, patient_id AS "patientId", patient_name AS "patientName", 
         CAST(schedule_date AS VARCHAR) AS "scheduleDate", priority, tests, 
         COALESCE(status, 'Pending') AS status, notes, results 
         FROM lab_orders ORDER BY id DESC`
    );
    
    check from Models:LabOrderResponse orderRow in resultStream
        do {
            orders.push(orderRow);
        };
        
    check resultStream.close();
    return orders;
}

public isolated function updateLabStatus(int orderId, string newStatus) returns json|error {
    _ = check dbClient->execute(
        `UPDATE lab_orders SET status = ${newStatus} WHERE id = ${orderId}`
    );
    return { "message": "Status updated successfully" };
}

public isolated function saveLabResults(int orderId, string results) returns json|error {
    _ = check dbClient->execute(
        `UPDATE lab_orders SET status = 'Available', results = ${results} WHERE id = ${orderId}`
    );
    return { "message": "Results saved successfully" };
}