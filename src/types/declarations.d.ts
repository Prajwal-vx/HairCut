// Type declarations for modules that lack @types packages.
// Note: jsonwebtoken, bcryptjs, and canvas-confetti all have @types packages
// installed in devDependencies — no module declarations needed here.
// This file is kept for any future untyped third-party modules.

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      picture?: string;
      isAdmin?: boolean;
      role?: string;
    };
  }

  interface User {
    id?: string;
    email?: string;
    name?: string;
    picture?: string;
    isAdmin?: boolean;
    role?: string;
    dbUser?: import("@/lib/types").User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    picture?: string;
    isAdmin?: boolean;
    role?: string;
    userId?: string;
  }
}
