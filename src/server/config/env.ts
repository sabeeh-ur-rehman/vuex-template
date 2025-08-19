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
    ADMIN_EMAIL: emailString().optional(),
    ADMIN_PASSWORD: trimmedString().optional(),
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
  MONGODB_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  REFRESH_EXPIRES: process.env.REFRESH_EXPIRES,
  APP_URL: process.env.APP_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
