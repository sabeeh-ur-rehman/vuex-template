"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = require("../queues/bull");
const email_service_1 = require("../services/email.service");
bull_1.emailQueue.process(async (job) => {
    const { config, options } = job.data;
    await (0, email_service_1.sendEmail)(config, options);
});
