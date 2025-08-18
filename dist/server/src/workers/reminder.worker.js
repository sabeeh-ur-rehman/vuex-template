"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleReminders = scheduleReminders;
exports.cancelReminders = cancelReminders;
const bull_1 = require("../queues/bull");
const steps_service_1 = require("../services/steps.service");
bull_1.reminderQueue.process('send', async (job) => {
    const { email } = job.data;
    await bull_1.emailQueue.add('send', email, { removeOnComplete: true });
});
async function scheduleReminders({ appointmentId, due, rules, email }) {
    const dueDate = new Date(due);
    const dates = (0, steps_service_1.reminderDates)(dueDate, rules);
    for (const date of dates) {
        date.setHours(16, 0, 0, 0); // 4 PM
        const delay = date.getTime() - Date.now();
        if (delay > 0) {
            await bull_1.reminderQueue.add('send', { appointmentId, email }, {
                delay,
                removeOnComplete: true,
                jobId: `${appointmentId}:${date.getTime()}`,
            });
        }
    }
}
async function cancelReminders(appointmentId) {
    const jobs = await bull_1.reminderQueue.getDelayed();
    await Promise.all(jobs
        .filter(job => job.data.appointmentId === appointmentId)
        .map(job => job.remove()));
}
