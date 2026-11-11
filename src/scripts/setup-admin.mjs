import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const dataFile = path.join(process.cwd(), "data", "salon_data.json");

function askHidden(question) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Run this command in an interactive PowerShell or terminal window.");
  }

  return new Promise((resolve, reject) => {
    let value = "";
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();

    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.removeListener("data", onData);
    };
    const onData = (chunk) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003") {
          cleanup();
          stdout.write("\n");
          reject(new Error("Setup cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          cleanup();
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (character === "\u0008" || character === "\u007f") {
          if (value.length) {
            value = value.slice(0, -1);
            stdout.write("\b \b");
          }
          continue;
        }
        if (character >= " ") {
          value += character;
          stdout.write("*");
        }
      }
    };

    stdin.on("data", onData);
  });
}

async function main() {
  const useSupabase = Boolean(process.env.DATABASE_URL);
  if (!useSupabase && !fs.existsSync(dataFile)) {
    throw new Error("Local salon data was not found. Start the app once, then run this command from the project folder.");
  }

  const pool = useSupabase ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: false },
    max: 1,
  }) : null;
  const client = pool ? await pool.connect() : null;
  let transactionOpen = false;
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    let db;
    if (client) {
      await client.query("BEGIN");
      transactionOpen = true;
      const result = await client.query("SELECT data FROM public.salon_state WHERE id = 1 FOR UPDATE");
      if (!result.rowCount) throw new Error("The hosted database is not initialized. Open the deployed site once, then retry.");
      db = result.rows[0].data;
    } else {
      db = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    }
    const enteredEmail = process.argv[2] || await rl.question("Owner email: ");
    const email = enteredEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid email address.");
    }

    if (!Array.isArray(db.users)) db.users = [];
    let user = db.users.find((item) => item.email?.toLowerCase() === email);

    if (!user) {
      stdout.write(`No local account exists for ${email}. Create the owner account now.\n`);
      const fullName = (await rl.question("Full name: ")).trim();
      const phone = (await rl.question("Phone number (include country code if needed): ")).trim();
      if (!fullName || fullName.length > 100) throw new Error("Enter a name between 1 and 100 characters.");
      if (phone.replace(/\D/g, "").length < 7 || phone.length > 32) throw new Error("Enter a valid phone number.");

      rl.close();
      const password = await askHidden("Password (12+ characters, with a letter and number): ");
      const confirmation = await askHidden("Confirm password: ");
      if (password !== confirmation) throw new Error("Passwords do not match. Run the command again to retry.");
      if (password.length < 12 || password.length > 72 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        throw new Error("Choose a password of 12–72 characters that includes at least one letter and one number.");
      }

      const normalizedPhone = phone.replace(/\D/g, "");
      if (db.users.some((item) => item.phone?.replace(/\D/g, "") === normalizedPhone)) {
        throw new Error("That phone number already belongs to another account. Use the existing account or a different number.");
      }

      const firstName = fullName.split(/\s+/)[0].replace(/[^a-z0-9]/gi, "").toUpperCase() || "OWNER";
      let referralCode;
      do {
        referralCode = `${firstName}${Math.floor(100 + Math.random() * 900)}`;
      } while (db.users.some((item) => item.referralCode === referralCode));

      user = {
        id: `user-${randomUUID()}`,
        fullName,
        phone,
        email,
        passwordHash: bcrypt.hashSync(password, 12),
        role: "OWNER",
        gender: "prefer-not-to-say",
        loyaltyPoints: 0,
        styleStreak: 0,
        lastVisitDate: null,
        referralCode,
        preferredChannel: "whatsapp",
        createdAt: new Date().toISOString(),
        isAdmin: true,
      };
      db.users.push(user);
    } else {
      user.role = "OWNER";
      user.isAdmin = true;
    }

    if (!Array.isArray(db.loyaltyTransactions)) db.loyaltyTransactions = [];
    if (client) {
      await client.query("UPDATE public.salon_state SET data = $1::jsonb, updated_at = now() WHERE id = 1", [JSON.stringify(db)]);
      await client.query("COMMIT");
      transactionOpen = false;
    } else {
      const tempFile = `${dataFile}.tmp.${process.pid}`;
      fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf8");
      fs.renameSync(tempFile, dataFile);
    }
    stdout.write(`Owner access is ready for ${email}. Sign in at /auth, then open /admin.\n`);
  } finally {
    rl.close();
    if (client) {
      if (transactionOpen) await client.query("ROLLBACK").catch(() => undefined);
      client.release();
      await pool.end();
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
