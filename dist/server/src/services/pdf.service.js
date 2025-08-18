"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToPdfAndUpload = htmlToPdfAndUpload;
/**
 * Generate a PDF from HTML using Playwright and upload to S3.
 * Returns the public URL of the uploaded PDF.
 */
async function htmlToPdfAndUpload(html, key) {
    const { chromium } = await Promise.resolve().then(() => __importStar(require('playwright')));
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const buffer = await page.pdf({ format: 'A4' });
    await browser.close();
    const { S3Client, PutObjectCommand } = await Promise.resolve().then(() => __importStar(require('@aws-sdk/client-s3')));
    const bucket = process.env.S3_BUCKET || 'tmp-bucket';
    const region = process.env.AWS_REGION || 'us-east-1';
    const client = new S3Client({ region });
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: 'application/pdf',
    }));
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
