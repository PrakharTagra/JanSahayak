import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Building2,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import logo from "/favicon.png";

export function Login() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Math CAPTCHA ──
  const genCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const ops = [
      { label: `${a} + ${b}`, answer: a + b },
      { label: `${a} × ${b}`, answer: a * b },
      { label: `${Math.max(a, b)} − ${Math.min(a, b)}`, answer: Math.max(a, b) - Math.min(a, b) },
    ];
    return ops[Math.floor(Math.random() * ops.length)];
  };

  const [captcha, setCaptcha] = useState(genCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loginError, setLoginError] = useState("");

  const refreshCaptcha = () => {
    setCaptcha(genCaptcha());
    setCaptchaInput("");
    setCaptchaError(false);
    setCaptchaVerified(false);
  };

  const verifyCaptcha = () => {
    if (parseInt(captchaInput, 10) === captcha.answer) {
      setCaptchaVerified(true);
      setCaptchaError(false);
    } else {
      setCaptchaError(true);
      setCaptchaVerified(false);
      refreshCaptcha();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      setCaptchaError(true);
      return;
    }

    try {
      setLoading(true);
      setLoginError("");

      const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
      const res = await fetch(`${apiBase}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!data.success) {
        setLoginError(data.message || "Login failed. Please verify credentials.");
        refreshCaptcha();
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.role === "user") {
        navigate("/user/userdashboard");
      } else {
        navigate("/authoritydashboard");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Service temporarily unavailable. Please retry in a few moments.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white">

      {/* Tricolor Top Bar */}
      <div className="tricolor-bar-h h-1.5 w-full shrink-0" />

      {/* Mini Government Header */}
      <header className="bg-gov-navy border-b border-gov-border py-3 px-4 sm:px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gov-saffron bg-gov-saffron/10 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="JanSahayak" className="w-6 h-6 object-cover" />
            </div>
            <div>
              <p className="text-white font-bold font-serif text-sm sm:text-base leading-tight">JanSahayak</p>
              <p className="text-gov-amber text-[10px] font-hindi">नागरिक शिकायत निवारण पोर्टल</p>
            </div>
          </div>

          <div className="text-gov-slate text-xs font-mono hidden md:block">
            Ministry of Housing & Urban Affairs &bull; Government of India
          </div>

          <button
            onClick={() => navigate("/")}
            className="text-xs text-gov-amber border border-gov-border px-3 py-1.5 rounded hover:bg-gov-amber/10 transition font-mono uppercase tracking-wider active:scale-95"
          >
            &larr; Home
          </button>
        </div>
      </header>

      {/* Login Card Form */}
      <main className="flex-1 gov-pattern flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
        <div className="w-full max-w-md relative z-10">
          
          {/* Security Badge */}
          <div className="flex justify-center mb-4 sm:mb-5">
            <span className="border border-gov-amber/40 bg-gov-amber/10 text-gov-amber text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider px-3.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Government Authentication</span>
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-gov-border bg-gov-card rounded-lg shadow-gov-card overflow-hidden"
          >
            {/* Card Header */}
            <div className="border-b border-gov-border/80 px-6 py-4.5 text-center bg-[#071526]">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight">
                Portal Sign In
              </h2>
              <p className="text-gov-slate text-xs mt-0.5 font-hindi">
                नागरिक एवं शासकीय प्राधिकरण लॉगिन
              </p>
            </div>

            <div className="p-5 sm:p-7">
              {/* Role Toggle Switch */}
              <div className="mb-5">
                <label className="text-[10px] font-mono text-gov-slate uppercase tracking-wider block mb-2 font-semibold">
                  Select User Role
                </label>
                <div className="grid grid-cols-2 p-1 bg-[#050f1d] border border-gov-border rounded-md">
                  <button
                    type="button"
                    onClick={() => { setRole("user"); setLoginError(""); }}
                    className={`py-2 text-xs font-bold uppercase tracking-wider font-mono rounded transition flex items-center justify-center gap-2 ${
                      role === "user"
                        ? "bg-gov-amber text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Citizen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole("authority"); setLoginError(""); }}
                    className={`py-2 text-xs font-bold uppercase tracking-wider font-mono rounded transition flex items-center justify-center gap-2 ${
                      role === "authority"
                        ? "bg-gov-amber text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Authority</span>
                  </button>
                </div>
                <p className="text-[10px] text-gov-muted mt-2 text-center font-mono">
                  {role === "user" ? "Citizen grievance filing & community tracking" : "Municipal department officers & grievance admins"}
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {/* Email Input */}
                <div>
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-semibold">
                    Registered Email ID <span className="text-gov-amber">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:ring-1 focus:ring-gov-amber focus:outline-none text-white placeholder-slate-500 text-sm font-sans transition"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider font-semibold">
                      Password <span className="text-gov-amber">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:ring-1 focus:ring-gov-amber focus:outline-none text-white placeholder-slate-500 text-sm font-sans transition pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gov-slate hover:text-white transition text-[11px] font-mono uppercase px-1.5 py-0.5"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Math Security CAPTCHA */}
                <div className={`border rounded p-3 transition ${
                  captchaVerified
                    ? "border-emerald-600/60 bg-emerald-950/20"
                    : captchaError
                    ? "border-red-600/60 bg-red-950/20"
                    : "border-gov-border bg-[#050f1d]"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider font-semibold">
                      Security Verification <span className="text-gov-amber">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-[10px] font-mono text-gov-amber hover:underline transition flex items-center gap-1"
                      title="Generate new calculation"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {captchaVerified ? (
                    <div className="flex items-center gap-2 py-1 text-emerald-400 font-mono text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Security challenge verified</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                      <div className="border border-gov-amber/40 bg-gov-amber/15 px-3 py-1.5 rounded font-mono font-bold text-gov-amber text-base tracking-widest text-center min-w-[90px] select-none">
                        {captcha.label} = ?
                      </div>
                      <input
                        type="number"
                        placeholder="Answer"
                        value={captchaInput}
                        onChange={(e) => { setCaptchaInput(e.target.value); setCaptchaError(false); }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), verifyCaptcha())}
                        className="flex-1 min-w-[70px] px-3 py-1.5 bg-[#0a192f] border border-gov-border rounded focus:border-gov-amber focus:outline-none text-white text-sm font-mono text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={verifyCaptcha}
                        className="px-3.5 py-1.5 rounded border border-gov-amber/70 text-gov-amber hover:bg-gov-amber/15 transition text-xs font-mono uppercase tracking-wider font-bold active:scale-95"
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  {captchaError && !captchaVerified && (
                    <p className="text-red-400 text-[10px] font-mono mt-1.5">
                      Incorrect answer. Calculation regenerated.
                    </p>
                  )}
                </div>

                {/* Login Error Notification */}
                {loginError && (
                  <div className="border border-red-500/40 bg-red-950/30 rounded p-3 text-left">
                    <p className="text-red-300 text-xs font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Login Failed</span>
                    </p>
                    <p className="text-red-200/80 text-[11px] mt-0.5 leading-relaxed">{loginError}</p>
                    {loginError.toLowerCase().includes("verify") && (
                      <p className="text-amber-300 text-[10px] mt-1 font-mono">
                        Tip: Open the verification email link sent upon registration.
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gov-primary w-full py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider font-mono mt-1 flex items-center justify-center gap-2 shadow-gov-btn disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Citizen Registration Footer */}
              <div className="mt-6 pt-4 border-t border-gov-border/60 text-center">
                <p className="text-xs text-slate-300 font-sans">
                  Not registered yet?{" "}
                  <span
                    onClick={() => navigate("/signup")}
                    className="text-gov-amber hover:underline font-semibold cursor-pointer ml-1"
                  >
                    Create Citizen Account &rarr;
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Legal Notice */}
          <p className="text-center text-[10px] text-gov-muted mt-5 font-mono leading-relaxed max-w-sm mx-auto">
            Authorized portal for Indian citizens & municipal representatives under the Information Technology Act.
          </p>
        </div>
      </main>

      {/* Mini Government Footer */}
      <footer className="bg-[#050f1d] border-t border-gov-border py-2.5 px-4 text-center text-[10px] text-gov-slate font-mono shrink-0">
        &copy; 2026 JanSahayak &bull; Government of India &bull; Smart Cities Mission
      </footer>
      <div className="tricolor-bar-h h-1 w-full shrink-0" />
    </div>
  );
}
