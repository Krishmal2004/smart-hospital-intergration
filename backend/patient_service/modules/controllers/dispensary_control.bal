import patient_service.Models;

public isolated function getAllPrescriptions() returns Models:DispensaryResponse[]|error {
    Models:DispensaryResponse[] rxList = [];
    stream<record{}, error?> resultStream = dbClient->query(
        `SELECT id, patient_id, patient_name, CAST(issue_date AS VARCHAR) as issue_date, 
         diagnosis, medication, instructions, COALESCE(status, 'pending') as status 
         FROM prescriptions ORDER BY id DESC`
    );
    
    check from record{} row in resultStream
        do {
            int rxId = <int>row["id"];
            
            Models:DispenseItem item = {
                name: row["medication"] is string ? <string>row["medication"] : "Prescribed Medication",
                instructions: row["instructions"] is string ? <string>row["instructions"] : "As directed by physician",
                qty: 1,    
                stock: 150  
            };

            rxList.push({
                id: rxId,
                displayId: "RX-" + rxId.toString(),
                patientId: <string>row["patient_id"],
                patientName: <string>row["patient_name"],
                doctorName: "Clinic Physician", 
                time: row["issue_date"] is string ? <string>row["issue_date"] : "Today",
                status: <string>row["status"],
                items: [item]
            });
        };
        
    check resultStream.close();
    return rxList;
}

public isolated function fulfillPrescription(int rxId) returns json|error {
    _ = check dbClient->execute(`UPDATE prescriptions SET status = 'fulfilled' WHERE id = ${rxId}`);
    return { "message": "Prescription fulfilled successfully" };
}