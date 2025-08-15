interface SmsConfig {
  accountSid: string;
  authToken: string;
  from: string;
}

/** Send an SMS using Twilio */
export async function sendSms(
  config: SmsConfig,
  to: string,
  body: string
): Promise<void> {
  const twilioModule = await import('twilio');
  const client = twilioModule.default(config.accountSid, config.authToken);
  await client.messages.create({ from: config.from, to, body });
}
