const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Simple password hashing (in production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "salon_data.json");

// Read database
function readDatabase() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error("Database file not found. Please run the app first to create it.");
    process.exit(1);
  }

  const content = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(content);
}

// Write database
function writeDatabase(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Setup admin account
function setupAdminAccount() {
  const db = readDatabase();
  const phone = "9779808087574";
  const tempPassword = "Admin@123"; // Change this after first login!

  // Check if user already exists
  const existingUser = db.users.find(
    (u) => u.phone.replace(/[^0-9]/g, "") === phone.replace(/[^0-9]/g, "")
  );

  if (existingUser) {
    console.log("User with this phone number already exists.");
    console.log("Updating role to OWNER and password...");

    existingUser.role = "OWNER";
    existingUser.passwordHash = hashPassword(tempPassword);
    existingUser.isAdmin = true;

    writeDatabase(db);
    console.log("✓ Admin account updated successfully!");
    console.log(`  Phone: +${phone}`);
    console.log(`  Temporary Password: ${tempPassword}`);
    console.log("  ⚠️  Please change this password after first login!");
  } else {
    console.log("Creating new admin account...");

    const newUser = {
      id: "user-admin-" + Date.now(),
      fullName: "Salon Admin",
      phone: phone,
      email: "admin@haircut.com",
      passwordHash: hashPassword(tempPassword),
      role: "OWNER",
      isAdmin: true,
      gender: "prefer-not-to-say",
      profilePhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      loyaltyPoints: 1000,
      styleStreak: 0,
      lastVisitDate: null,
      referralCode: "ADMIN" + Math.floor(1000 + Math.random() * 9000),
      referredBy: null,
      preferredChannel: "whatsapp",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDatabase(db);

    console.log("✓ Admin account created successfully!");
    console.log(`  Phone: +${phone}`);
    console.log(`  Email: admin@haircut.com`);
    console.log(`  Temporary Password: ${tempPassword}`);
    console.log("  ⚠️  Please change this password after first login!");
  }
}

setupAdminAccount();
