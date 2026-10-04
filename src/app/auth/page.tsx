"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Phone, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
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

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      const result = await signIn("google", { callbackUrl: "/dashboard" });
      if (result?.error) {
        setErrorMessage("Google login failed. Please try again.");
        setLoading(false);
      }
    } catch {
      setErrorMessage("An error occurred during Google login.");
      setLoading(false);
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

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2e2b26]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-[#0d0c0b] text-[#5a544e]">or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 py-3.5 rounded-xl font-medium text-sm transition-all disabled:opacity-70 border border-gray-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {loading ? "Connecting..." : "Sign in with Google"}
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
