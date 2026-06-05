import ballerina/http;
import ballerina/url;
import patient_service.controllers;
import patient_service.models;

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
        scopes: ["internal_user_mgt_list"]
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

    //Doctors Endpoint
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

    //Patients Endpoint
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

    //Prescription endpoint
    isolated resource function post prescriptions(models:PrescriptionPayload payload) returns json|http:InternalServerError {
        json|error result = controllers:savePrescriptionToDB(payload);
        
        if result is error {
            return <http:InternalServerError>{
                body: { "error": "Failed to save prescription", "details": result.message() }
            };
        }
        
        return result;
    }
}