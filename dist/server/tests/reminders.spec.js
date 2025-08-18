"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const steps_service_1 = require("../src/services/steps.service");
(0, vitest_1.describe)('reminderDates', () => {
    (0, vitest_1.it)('generates reminder dates based on rules', () => {
        const due = new Date('2024-05-10T10:00:00Z');
        const dates = (0, steps_service_1.reminderDates)(due, [1, 3]);
        (0, vitest_1.expect)(dates).toEqual([
            new Date('2024-05-09T10:00:00.000Z'),
            new Date('2024-05-07T10:00:00.000Z'),
        ]);
    });
    const DST_TABLE = [
        {
            tz: 'America/New_York',
            due: '2024-03-11T00:00:00',
            days: 2,
            expected: '2024-03-08T23:00:00',
        },
        {
            tz: 'America/New_York',
            due: '2024-11-04T00:00:00',
            days: 2,
            expected: '2024-11-02T01:00:00',
        },
    ];
    DST_TABLE.forEach(({ tz, due, days, expected }) => {
        (0, vitest_1.it)(`handles DST transition for ${tz} around ${due}`, () => {
            const originalTZ = process.env.TZ;
            process.env.TZ = tz;
            const dueDate = new Date(due);
            const expectedDate = new Date(expected);
            const [reminder] = (0, steps_service_1.reminderDates)(dueDate, [days]);
            (0, vitest_1.expect)(reminder.toISOString()).toBe(expectedDate.toISOString());
            process.env.TZ = originalTZ;
        });
    });
});
