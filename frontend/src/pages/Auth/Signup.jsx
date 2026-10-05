import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "/favicon.png";

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please confirm agreement with the Citizen Terms of Service.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Registration could not be completed.");
        return;
      }
      setSignupDone(true);
    } catch (err) {
      console.error(err);
      setError("Service connection failed. Please retry in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      alert(data.message || "Verification email has been re-dispatched.");
    } catch {
      alert("Could not re-dispatch email. Please check address and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white">

      {/* Tricolor Top Bar */}
      <div className="tricolor-bar-h h-1.5 w-full shrink-0" />

      {/* Government Header */}
      <header className="bg-gov-navy border-b border-gov-border py-3 px-4 sm:px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
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

      {/* Main Registration Area */}
      <main className="flex-1 gov-pattern flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
        <div className="w-full max-w-md relative z-10">

          {/* Badge */}
          <div className="flex justify-center mb-4 sm:mb-5">
            <span className="border border-gov-amber/40 bg-gov-amber/10 text-gov-amber text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider px-3.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
              {signupDone ? <><span>📧</span> Verification Pending</> : <><span>📋</span> Citizen Registration Portal</>}
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
                {signupDone ? "Verify Your Email Address" : "Register Citizen Account"}
              </h2>
              <p className="text-gov-slate text-xs mt-0.5 font-hindi">
                {signupDone ? "ईमेल सत्यापन आवश्यक है" : "नागरिक पंजीकरण फॉर्म"}
              </p>
            </div>

            {/* Verification State */}
            {signupDone ? (
              <div className="p-6 sm:p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-gov-amber bg-gov-amber/10 flex items-center justify-center text-3xl text-gov-amber shadow-inner">
                  📧
                </div>

                <div>
                  <h3 className="text-white font-bold text-base">
                    Verification Link Dispatched
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    A confirmation link has been sent to: <br />
                    <span className="text-gov-amber font-mono font-semibold">{email}</span>
                  </p>
                  <p className="text-gov-slate text-xs mt-2 leading-relaxed">
                    Click the link in the email to activate your citizen profile and log in.
                  </p>
                </div>

                <div className="w-full border border-gov-border bg-[#050f1d] p-3 rounded text-xs text-gov-slate font-mono">
                  Didn't receive email? Check spam folder or{" "}
                  <button
                    onClick={handleResend}
                    className="text-gov-amber hover:underline font-semibold"
                  >
                    click here to resend
                  </button>
                  .
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="btn-gov-primary w-full py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider font-mono shadow-gov-btn"
                >
                  Proceed to Login &rarr;
                </button>

                <button
                  onClick={() => { setSignupDone(false); setEmail(""); setName(""); setPassword(""); setAgreed(false); }}
                  className="text-xs text-gov-slate hover:text-white transition underline"
                >
                  Register with a different email
                </button>
              </div>
            ) : (
              /* Signup Form */
              <div className="p-5 sm:p-7">
                <div className="border border-gov-border bg-gov-navy/80 p-3 rounded mb-5 text-xs text-slate-300 leading-relaxed">
                  ℹ️ Registration is free for all residents of India. Your identity is secured under the IT Act, 2000.
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-semibold">
                      Full Legal Name <span className="text-gov-amber">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:ring-1 focus:ring-gov-amber focus:outline-none text-white placeholder-slate-500 text-sm font-sans transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-semibold">
                      Email Address <span className="text-gov-amber">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:ring-1 focus:ring-gov-amber focus:outline-none text-white placeholder-slate-500 text-sm font-sans transition"
                    />
                    <p className="text-[10px] text-gov-muted mt-1 font-mono">
                      Account activation link will be sent to this email.
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-semibold">
                      Account Password <span className="text-gov-amber">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Minimum 8 characters"
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

                    {/* Password Strength Indicator */}
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded transition-colors duration-200 ${
                            password.length === 0 ? "bg-white/10"
                            : password.length < 6 && i <= 1 ? "bg-red-500"
                            : password.length < 8 && i <= 2 ? "bg-orange-500"
                            : password.length < 12 && i <= 3 ? "bg-amber-400"
                            : "bg-emerald-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer mt-1 select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gov-border text-gov-amber focus:ring-gov-amber"
                    />
                    <span className="text-xs text-slate-300 leading-snug">
                      I agree to the <span className="text-gov-amber hover:underline">Citizen Terms of Service</span> and consent to municipal grievance verification.
                    </span>
                  </label>

                  {/* Error Notification */}
                  {error && (
                    <div className="border border-red-500/40 bg-red-950/30 rounded p-3 text-left">
                      <p className="text-red-300 text-xs font-bold flex items-center gap-1.5">
                        <span>⚠️</span> Registration Issue
                      </p>
                      <p className="text-red-200/80 text-[11px] mt-0.5">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gov-primary w-full py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider font-mono mt-1 flex items-center justify-center gap-2 shadow-gov-btn disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Complete Registration &rarr;</span>
                    )}
                  </button>
                </form>

                {/* Footer Switch */}
                <div className="mt-6 pt-4 border-t border-gov-border/60 text-center">
                  <p className="text-xs text-slate-300 font-sans">
                    Already registered?{" "}
                    <span
                      onClick={() => navigate("/login")}
                      className="text-gov-amber hover:underline font-semibold cursor-pointer ml-1"
                    >
                      Sign In to Portal &rarr;
                    </span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Legal Notice */}
          <p className="text-center text-[10px] text-gov-muted mt-5 font-mono leading-relaxed max-w-sm mx-auto">
            Authorized portal for Indian citizens under Ministry of Housing & Urban Affairs.
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
