"use strict";
const request = require("./request");
const alerts = require("../alerts");
module.exports = async (payload, callback) => {
    try {
        const result = await request(payload);
        if (result.body.alerts) {
            alerts.registerAlerts(result.body.alerts);
        }
        // make callbacks and promises work
        if (callback) {
            callback(null, result.res, result.body);
        }
        return result;
    }
    catch (error) {
        if (callback) {
            return callback(error);
        }
        throw error;
    }
};
//# sourceMappingURL=index.js.map