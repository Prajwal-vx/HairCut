"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Phone, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { salonBrand } from "@/lib/branding";

function AuthForm() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, register } = useAuth();
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [regForm, setRegForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    preferredChannel: "whatsapp",
    referralCodeInput: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    const result = await login(loginForm.identifier, loginForm.password);
    setLoading(false);
    if (result.success) {
      // Check user role for proper destination
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data?.user?.role === "ADMIN" || data?.user?.role === "OWNER") {
          router.push("/admin");
          return;
        }
      } catch {
        // fallback
      }
      router.push("/dashboard");
    } else {
      setErrorMessage(result.error || "Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    const result = await register(regForm);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0c0b] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#c5a880]/60 bg-[#c5a880]">
              <img src={salonBrand.logoSrc} alt={`${salonBrand.name} logo`} className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {salonBrand.name}
              </p>
              <p className="text-[#c5a880] text-xs tracking-widest uppercase">{salonBrand.location}</p>
            </div>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#141312] rounded-xl p-1 mb-8">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setErrorMessage("");
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t ? "bg-[#c5a880] text-[#141312]" : "text-[#78716c] hover:text-[#e0d8cd]"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Error */}
          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#c86d51]/10 border border-[#c86d51]/30 rounded-xl p-3 mb-5">
              <p className="text-[#f29a7e] text-sm">{errorMessage}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[#b0a090] text-sm font-medium mb-2">Phone or Email</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
                    <input
                      type="text"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      placeholder="98XXXXXXXX or email@gmail.com"
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 pl-10 pr-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#b0a090] text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Your password"
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 pl-10 pr-10 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#c5a880]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-70"
                >
                  {loading ? "Signing in..." : <><ArrowRight className="w-4 h-4" /> Sign In</>}
                </button>

              </motion.form>
            ) : (
              <motion.form key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[#b0a090] text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
                    <input
                      type="text"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      placeholder="Ramesh Thapa"
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 pl-10 pr-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#b0a090] text-sm font-medium mb-2">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 pl-10 pr-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#b0a090] text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="email@gmail.com"
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 pl-10 pr-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#b0a090] text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="Create a password"
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 pl-10 pr-10 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716c]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[#b0a090] text-sm font-medium mb-2">Preferred Notification Channel</label>
                  <select
                    value={regForm.preferredChannel}
                    onChange={(e) => setRegForm({ ...regForm, preferredChannel: e.target.value })}
                    className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] focus:outline-none focus:border-[#c5a880] text-sm"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="app">In-App Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#b0a090] text-sm font-medium mb-2">Referral Code (optional)</label>
                  <input
                    type="text"
                    value={regForm.referralCodeInput}
                    onChange={(e) => setRegForm({ ...regForm, referralCodeInput: e.target.value })}
                    placeholder="Friend's code (e.g. BIKASH_CUTS)"
                    className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-70"
                >
                  {loading ? "Creating account..." : <><ArrowRight className="w-4 h-4" /> Create Account — Get 50 Points Free</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return <AuthForm />;
}
