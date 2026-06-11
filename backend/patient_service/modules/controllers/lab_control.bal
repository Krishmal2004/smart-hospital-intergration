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