"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTemplate = saveTemplate;
exports.mergeTemplate = mergeTemplate;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const TEMPLATE_DIR = path_1.default.join(process.cwd(), 'server', 'templates');
async function ensureDir() {
    await fs_1.promises.mkdir(TEMPLATE_DIR, { recursive: true });
}
async function saveTemplate(name, data) {
    await ensureDir();
    const filePath = path_1.default.join(TEMPLATE_DIR, `${name}.docx`);
    await fs_1.promises.writeFile(filePath, data);
    return filePath;
}
/**
 * Merge tokens into a DOCX template. This implementation performs simple
 * string replacement which works for templates created with plain text tokens.
 */
async function mergeTemplate(name, tokens) {
    const filePath = path_1.default.join(TEMPLATE_DIR, `${name}.docx`);
    let content = await fs_1.promises.readFile(filePath, 'utf8');
    for (const [key, value] of Object.entries(tokens)) {
        const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
        content = content.replace(regex, String(value));
    }
    return Buffer.from(content);
}
