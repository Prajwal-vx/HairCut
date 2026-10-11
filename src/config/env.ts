/**
 * Centralized, validated environment configuration.
 * Isolates process.env access and provides type-safe environment constants.
 */

function getEnvVar(key: string, defaultValue = ""): string {
  return process.env[key]?.trim() ?? defaultValue;
}

export const env = {
  // Runtime environment
  NODE_ENV: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",

  // Authentication & Security
  jwtSecret: getEnvVar("JWT_SECRET"),
  nextAuthSecret: getEnvVar("NEXTAUTH_SECRET"),
  nextAuthUrl: getEnvVar("NEXTAUTH_URL", "http://localhost:3000"),
  cronSecret: getEnvVar("CRON_SECRET"),
  appOrigin: getEnvVar("APP_ORIGIN"),

  // Google OAuth
  googleClientId: getEnvVar("GOOGLE_CLIENT_ID"),
  googleClientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),

  // Admin whitelist (comma separated string -> lowercase array)
  adminEmailWhitelist: getEnvVar("ADMIN_EMAIL_WHITELIST")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
} as const;

/**
 * Validates critical environment variables at runtime.
 * Throws an explicit error in production if required secrets are missing.
 */
export function validateEnv(): void {
  if (env.isProduction) {
    if (!env.jwtSecret) {
      throw new Error("Missing required environment variable: JWT_SECRET");
    }
    if (env.jwtSecret.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long in production.");
    }
  }
}
