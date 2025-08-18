"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = require("../queues/bull");
const pdf_service_1 = require("../services/pdf.service");
bull_1.pdfQueue.process(async (job) => {
    const { html, key } = job.data;
    return (0, pdf_service_1.htmlToPdfAndUpload)(html, key);
});
