"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJobs = registerJobs;
const absent_marking_job_1 = require("./absent-marking.job");
const auto_checkout_job_1 = require("./auto-checkout.job");
function registerJobs() {
    (0, absent_marking_job_1.registerAbsentMarkingJob)();
    (0, auto_checkout_job_1.registerAutoCheckoutJob)();
}
//# sourceMappingURL=index.js.map