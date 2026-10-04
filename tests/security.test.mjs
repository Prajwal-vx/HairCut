import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidRequestOrigin,
  removeLegacyDemoAccounts,
  matchesPhone,
  findUserByIdentifier,
} from "../src/lib/security.ts";

test("production mutations require a matching HTTPS origin", () => {
  assert.equal(isValidRequestOrigin("https://salon.example", "salon.example", "production"), true);
  assert.equal(isValidRequestOrigin(null, "salon.example", "production"), false);
  assert.equal(isValidRequestOrigin("https://attacker.example", "salon.example", "production"), false);
  assert.equal(isValidRequestOrigin("http://salon.example", "salon.example", "production"), false);
});

test("development keeps local cross-origin workflows available", () => {
  assert.equal(isValidRequestOrigin(null, null, "development"), true);
});

test("legacy demo users and only their related records are removed", () => {
  const db = {
    users: [{ id: "user-admin" }, { id: "real-user" }],
    appointments: [{ userId: "user-admin" }, { userId: "real-user" }],
    notifications: [{ userId: "user-admin" }, { userId: "real-user" }],
    loyaltyTransactions: [{ userId: "user-admin" }, { userId: "real-user" }],
  };
  assert.equal(removeLegacyDemoAccounts(db), true);
  assert.deepEqual(db.users.map((user) => user.id), ["real-user"]);
  assert.deepEqual(db.appointments.map((record) => record.userId), ["real-user"]);
  assert.deepEqual(db.notifications.map((record) => record.userId), ["real-user"]);
  assert.deepEqual(db.loyaltyTransactions.map((record) => record.userId), ["real-user"]);
  assert.equal(removeLegacyDemoAccounts(db), false);
});

test("identifier lookup does not collide empty phone strings", () => {
  // Mock users database where a Google OAuth user has an empty phone string
  const users = [
    { id: "oauth-user-1", email: "admin@google.com", phone: "" },
    { id: "regular-user-2", email: "client@example.com", phone: "+977 9800000000" },
  ];

  // An attacker entering an email that does not exist MUST NOT match oauth-user-1 whose phone is empty
  const nonExistentEmail = "attacker@random.com";
  assert.equal(findUserByIdentifier(users, nonExistentEmail), undefined);

  // Valid email should match exactly
  assert.equal(findUserByIdentifier(users, "admin@google.com")?.id, "oauth-user-1");

  // Valid phone format should match user 2
  assert.equal(findUserByIdentifier(users, "9800000000")?.id, "regular-user-2");
  assert.equal(findUserByIdentifier(users, "+977-9800000000")?.id, "regular-user-2");

  // Short digits (< 7) or empty digits must NOT match anyone
  assert.equal(findUserByIdentifier(users, "12345"), undefined);
  assert.equal(findUserByIdentifier(users, ""), undefined);
  assert.equal(findUserByIdentifier(users, null), undefined);
});

test("matchesPhone safely validates and normalizes phone numbers", () => {
  assert.equal(matchesPhone("", ""), false);
  assert.equal(matchesPhone("123", "123"), false);
  assert.equal(matchesPhone(null, "9800000000"), false);
  assert.equal(matchesPhone("9800000000", null), false);
  assert.equal(matchesPhone("+977 9800000000", "9800000000"), true);
  assert.equal(matchesPhone("9800000000", "+977-9800000000"), true);
  assert.equal(matchesPhone("+977 9800000000", "+977 9811111111"), false);
});

