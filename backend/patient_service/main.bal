import ballerina/http;
import ballerina/url;
import patient_service.controllers;
import patient_service.Models;

public type PatientProfileUpdate record {|
    string id;
    string firstName;
    string lastName;
    string country;
    string mobileNumber;
    string birthDate;
|};

type Doctor record {|
    string id;
    string name;
    string specialty;
|};

type Patient record {|
    string id;
    string name;
|};

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string asgardeoOrgUrl = ?;

final http:Client asgardeoClient = check new (asgardeoOrgUrl, {
    auth: {
        tokenUrl: asgardeoOrgUrl + "/oauth2/token",
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: ["internal_user_mgt_list", "internal_user_mgt_update","internal_user_mgt_create"]
    }
});

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowCredentials: true,
        allowHeaders: ["Authorization", "Content-Type"]
    }
}
service /api on new http:Listener(8080) {

    // Doctors Endpoint
    isolated resource function get doctors() returns Doctor[]|error {
        string filterQuery = check url:encode("groups eq Doctors", "UTF-8");
        string scimPath = "/scim2/Users?filter=" + filterQuery;

        json scimResponse = check asgardeoClient->get(scimPath);
        Doctor[] doctors = [];
        json|error resources = scimResponse.Resources;
        
        if resources is json[] {
            foreach json user in resources {
                string userId = (check user.id).toString();
                string firstName = (check user.name.givenName).toString();
                string lastName = (check user.name.familyName).toString();
                
                doctors.push({
                    id: userId,
                    name: "Dr. " + firstName + " " + lastName,
                    specialty: "General Physician"
                });
            }
        }
        return doctors;
    }

    // Patients Endpoint
    isolated resource function get patients() returns Patient[]|error {
        string scimPath = "/scim2/Users";
        json scimResponse = check asgardeoClient->get(scimPath);
        Patient[] patients = [];
        
        json|error resourcesField = scimResponse.Resources;
        if resourcesField is json[] {
            foreach json user in resourcesField {
                string userJsonString = user.toJsonString().toLowerAscii();
                if userJsonString.includes("\"patient\"") {
                    string userId = (check user.id).toString();
                    string firstName = user.name.givenName is string ? (check user.name.givenName).toString() : "";
                    string lastName = user.name.familyName is string ? (check user.name.familyName).toString() : "";
                    
                    string fullName = (firstName + " " + lastName).trim();
                    if fullName == "" {
                        string rawUsername = user.userName is string ? (check user.userName).toString() : "Unknown";
                        int? slashIndex = rawUsername.indexOf("/");
                        if slashIndex is int {
                            rawUsername = rawUsername.substring(slashIndex + 1);
                        }
                        int? atIndex = rawUsername.indexOf("@");
                        if atIndex is int {
                            rawUsername = rawUsername.substring(0, atIndex);
                        }
                        if rawUsername.length() > 0 {
                            string firstLetter = rawUsername.substring(0, 1).toUpperAscii();
                            string rest = rawUsername.substring(1);
                            fullName = firstLetter + rest;
                        } else {
                            fullName = "Unknown Patient";
                        }
                    }
                    patients.push({
                        id: userId,
                        name: fullName
                    });
                }
            }
        }
        return patients;
    }

    // Update Patient Profile Endpoint
    isolated resource function patch patients(PatientProfileUpdate payload) returns json|http:InternalServerError {
        string scimPath = "/scim2/Users/" + payload.id;
        
        json scimPayload = {
            "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
            "Operations": [
                {
                    "op": "replace",
                    "value": {
                        "name": {
                            "givenName": payload.firstName,
                            "familyName": payload.lastName
                        },
                        "phoneNumbers": [
                            {
                                "type": "mobile",
                                "value": payload.mobileNumber
                            }
                        ],
                        "addresses": [
                            {
                                "type": "home",
                                "country": payload.country
                            }
                        ],
                        "urn:scim:wso2:schema": {
                            "dateOfBirth": payload.birthDate
                        }
                    }
                }
            ]
        };
        
        json|error response = asgardeoClient->patch(scimPath, scimPayload);

        if response is error {
            return <http:InternalServerError>{
                body: { "error": "Failed to update Asgardeo profile", "details": response.message() }
            };
        }
        
        return { "message": "Profile updated successfully in Asgardeo" };
    }

    // Prescription endpoint
    isolated resource function post prescriptions(Models:PrescriptionPayload payload) returns json|http:InternalServerError {
        json|error result = controllers:savePrescriptionToDB(payload);
        if result is error {
            return <http:InternalServerError>{
                body: { "error": "Failed to save prescription", "details": result.message() }
            };
        }
        return result;
    }

    //Lab Order endpont 
    isolated resource function post lab_orders(Models:LabOrderPayload payload) returns json|http:InternalServerError {
        json|error result = controllers:saveLabOrderToDB(payload);
        if result is error {
            return <http:InternalServerError> {
                body: {
                    "error": "Failed to save lab order",
                    "details": result.message()
                }
            };
        }
        return result;
    }

    // Reception queueing endpoint
    isolated resource function post queues(Models:QueuePayload payload) returns json|http:InternalServerError {
        json|error result = controllers:saveQueueToDB(payload);
        if result is error {
            return <http:InternalServerError> {
                body: {
                    "error": "Failed to assign patient to queue",
                    "details": result.message()
                }
            };
        }
        return result;
    }
    //Reception queuing get endPoint
    isolated resource function get queues() returns Models:QueueResponse[]|http:InternalServerError {
        Models:QueueResponse[]|error result = controllers:getActiveQueue();
        if result is error {
            return <http:InternalServerError> {
                body: {
                    "error": "Failed to fetch queues",
                    "details": result.message()
                }
            };
        }
        return result;
    }
    // Reception scheduling endpoint
    isolated resource function post schedules(Models:SchedulePayload payload) returns json|http:InternalServerError {
        json|error result = controllers:saveScheduleToDB(payload);
        if result is error {
            return <http:InternalServerError> {
                body: {
                    "error": "Failed to save doctor schedule",
                    "details": result.message()
                }
            };
        }
        return result;
    }
    //Reception billing endpoint
    isolated resource function get billing/[string patientId]() returns Models:PatientBill|http:InternalServerError {
        Models:PatientBill|error result = controllers:generatePatientBill(patientId);
        if result is error {
            return <http:InternalServerError> {
                body: {
                    "error": "Failed to generate bill for patient",
                    "details": result.message()
                }
            };
        }
        return result;
    }

    isolated resource function post patients(Models:NewPatientPayload payload) returns json|http:InternalServerError {
        string scimPath = "/scim2/Users";
        
        json scimPayload = {
            "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:User"
            ],
            "userName": "DEFAULT/" + payload.email, 
            "password": payload.password,
            "name": {
                "givenName": payload.firstName,
                "familyName": payload.lastName
            },
            "emails": [
                {
                    "primary": true,
                    "value": payload.email
                }
            ],
            "phoneNumbers": [
                {
                    "type": "mobile",
                    "value": payload.mobileNumber
                }
            ]
        };

        http:Response|error response = asgardeoClient->post(scimPath, scimPayload);

        if response is error {
            return <http:InternalServerError>{
                body: { "error": "Network/Client Error", "details": response.message() }
            };
        }
        if response.statusCode != 201 && response.statusCode != 200 {
            json|error errPayload = response.getJsonPayload();
            
            if errPayload is json {
                string detailMsg = errPayload.toJsonString(); 
                map<json>|error errMap = errPayload.ensureType();
                if errMap is map<json> && errMap.hasKey("detail") {
                    detailMsg = errMap["detail"].toString();
                }

                return <http:InternalServerError>{
                    body: { "error": "Asgardeo rejected creation", "details": detailMsg }
                };
            }
            return <http:InternalServerError>{
                body: { "error": "Failed to create patient", "details": "Status Code: " + response.statusCode.toString() }
            };
        }

        return { "message": "Patient created successfully in Asgardeo" };
    }
}