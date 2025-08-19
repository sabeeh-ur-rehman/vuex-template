import { z } from "zod";

// Define helpers that include trimming AND keep the string schema
const trimmedString = () =>
  z
    .string()
    .min(1) // still requires value
    .transform((s) => s.trim());

const urlString = () =>
  z
    .string()
    .url("Must be a valid URL")
    .transform((s) => s.trim());

const emailString = () =>
  z
    .string()
    .email("Must be a valid email")
    .transform((s) => s.trim());

const EnvSchema = z
  .object({
    MONGODB_URI: trimmedString(),
    JWT_SECRET: trimmedString(),
    JWT_EXPIRES: z.string().default("1h"),
    REFRESH_EXPIRES: z.string().default("30d"),
    APP_URL: urlString(),
    ADMIN_TENANT_CODE: trimmedString().default('AWARD'),
    ADMIN_EMAIL: emailString().optional(),
    ADMIN_PASSWORD: trimmedString().optional(),
    ALLOW_SELF_REGISTER: z.string().optional(),
    EMAIL_FROM: trimmedString().optional(),
    EMAIL_TRANSPORT: trimmedString().default('json'),
    SMTP_HOST: trimmedString().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: trimmedString().optional(),
    SMTP_PASS: trimmedString().optional(),
    RESET_TOKEN_TTL_MIN: z.coerce.number().default(60),
  })
  .superRefine((val, ctx) => {
    // Enforce ADMIN pair-or-none
    const hasEmail = !!val.ADMIN_EMAIL;
    const hasPass = !!val.ADMIN_PASSWORD;
    if (hasEmail !== hasPass) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ADMIN_EMAIL and ADMIN_PASSWORD must be provided together",
        path: hasEmail ? ["ADMIN_PASSWORD"] : ["ADMIN_EMAIL"],
      });
    }
  });

const parsed = EnvSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  REFRESH_EXPIRES: process.env.REFRESH_EXPIRES,
  APP_URL: process.env.APP_URL,
  ADMIN_TENANT_CODE: process.env.ADMIN_TENANT_CODE,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ALLOW_SELF_REGISTER: process.env.ALLOW_SELF_REGISTER,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_TRANSPORT: process.env.EMAIL_TRANSPORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  RESET_TOKEN_TTL_MIN: process.env.RESET_TOKEN_TTL_MIN,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
