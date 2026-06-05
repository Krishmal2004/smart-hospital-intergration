import patient_service.models;

import ballerina/sql;
import ballerinax/postgresql;

configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;
configurable string dbHost = ?;
configurable int dbPort = ?;

final postgresql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    username = dbUser,
    password = dbPassword,
    database = dbName
);

public isolated function savePrescriptionToDB(models:PrescriptionPayload payload) returns json|error {
    string notes = payload.prescription.notes ?: "";

    sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO prescriptions (patient_id, patient_name, issue_date, diagnosis, medication, instructions, notes)
     VALUES (${payload.patient.id}, ${payload.patient.name}, ${payload.prescription.date}, ${payload.prescription.diagnosis}, ${payload.prescription.medication}, ${payload.prescription.instructions}, ${notes})`
    );

    return {
        "message": "Prescription saved successfully",
        "id": result.lastInsertId
    };
}