import fs from "node:fs";
import path from "node:path";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node src/scripts/setup-admin.mjs <registered-email>");
  process.exit(1);
}

const dataFile = path.join(process.cwd(), "data", "salon_data.json");
const db = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const user = db.users.find((item) => item.email.toLowerCase() === email);

if (!user) {
  console.error("No account found. The user must register before owner access can be granted.");
  process.exit(1);
}

user.role = "OWNER";
user.isAdmin = true;
fs.writeFileSync(dataFile, JSON.stringify(db, null, 2), "utf8");
console.log("Owner access granted.");
