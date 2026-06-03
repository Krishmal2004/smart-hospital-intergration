import ballerina/http;
import modules.route;
import modules.model;

@http:SerivceConfig {
    cors: {
        allowOrigins: ["http:localhost:5173"],
        allowCredentials: true,
        allowHeaders: ["*"],
        allowMethods: ["GET","OPTIONS"]
    }
}
service /api on new http: