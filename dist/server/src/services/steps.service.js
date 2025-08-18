"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminderDates = reminderDates;
exports.interpolateTokens = interpolateTokens;
/**
 * Generate reminder dates based on rule offsets.
 * Each rule is the number of days before the due date to send a reminder.
 */
function reminderDates(due, rules) {
    return rules
        .sort((a, b) => a - b)
        .map(days => new Date(due.getTime() - days * 24 * 60 * 60 * 1000));
}
/** Simple token interpolation using {{token}} placeholders */
function interpolateTokens(template, tokens) {
    let result = template;
    for (const [key, value] of Object.entries(tokens)) {
        const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
        result = result.replace(regex, String(value));
    }
    return result;
}
