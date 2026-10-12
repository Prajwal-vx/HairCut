/** Environment values intentionally exposed to browser bundles. */
export const publicConfig = {
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
} as const;
