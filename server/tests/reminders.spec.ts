import { describe, it, expect } from 'vitest';
import { reminderDates } from '../src/services/steps.service';

describe('reminderDates', () => {
  it('generates reminder dates based on rules', () => {
    const due = new Date('2024-05-10T10:00:00Z');
    const dates = reminderDates(due, [1, 3]);
    expect(dates).toEqual([
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
  ] as const;

  DST_TABLE.forEach(({ tz, due, days, expected }) => {
    it(`handles DST transition for ${tz} around ${due}`, () => {
      const originalTZ = process.env.TZ;
      process.env.TZ = tz;
      const dueDate = new Date(due);
      const expectedDate = new Date(expected);
      const [reminder] = reminderDates(dueDate, [days]);
      expect(reminder.toISOString()).toBe(expectedDate.toISOString());
      process.env.TZ = originalTZ;
    });
  });
});
