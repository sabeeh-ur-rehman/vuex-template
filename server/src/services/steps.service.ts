/**
 * Generate reminder dates based on rule offsets.
 * Each rule is the number of days before the due date to send a reminder.
 */
export function reminderDates(due: Date, rules: number[]): Date[] {
  return rules
    .sort((a, b) => a - b)
    .map(days => new Date(due.getTime() - days * 24 * 60 * 60 * 1000));
}

/** Simple token interpolation using {{token}} placeholders */
export function interpolateTokens(
  template: string,
  tokens: Record<string, string | number>
): string {
  let result = template;
  for (const [key, value] of Object.entries(tokens)) {
    const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
    result = result.replace(regex, String(value));
  }
  return result;
}
