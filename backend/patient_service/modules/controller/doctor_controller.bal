import ballerina/http;
import modules.model.doctor_model;

configurable string asgardeoOrg = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

final http:Client asgardeoClient = check new ("https://api.asgardeo.io/t/" + asgardeoOrg,
    auth = {
        tokenUrl: "https://api.asgardeo.io/t/" + asgardeoOrg + "/oauth2/token",
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: ["internal_org_user_mgt_list"] 
    }
);

public isolated function get