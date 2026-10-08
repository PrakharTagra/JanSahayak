import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight
} from "lucide-react";
import logo from "/favicon.png";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error" | "expired"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the authorization link.");
      return;
    }

    (async () => {
      try {
        const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
        const res = await fetch(
          `${apiBase}/api/v1/auth/verify-email?token=${token}`
        );
        const data = await res.json();

        if (data.success) {
          setStatus("success");
        } else if (data.message?.toLowerCase().includes("expired")) {
          setStatus("expired");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message || "Invalid or unauthorized verification token.");
        }
      } catch {
        setStatus("error");
        setMessage("Unable to reach verification service. Please retry in a few moments.");
      }
    })();
  }, [token]);

  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white">

      {/* Tricolor Top Bar */}
      <div className="tricolor-bar-h h-1.5 w-full shrink-0" />

      {/* Header */}
      <header className="bg-gov-navy border-b border-gov-border py-3 px-4 sm:px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gov-saffron bg-gov-saffron/10 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="logo" className="w-6 h-6 object-cover" />
            </div>
            <div>
              <p className="text-white font-bold font-serif text-sm sm:text-base leading-tight">JanSahayak</p>
              <p className="text-gov-amber text-[10px] font-hindi">नागरिक शिकायत निवारण पोर्टल</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="text-xs text-gov-amber border border-gov-border px-3 py-1.5 rounded hover:bg-gov-amber/10 transition font-mono uppercase tracking-wider active:scale-95"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="flex-1 gov-pattern flex items-center justify-center px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md border border-gov-border bg-gov-card rounded-lg shadow-gov-card overflow-hidden"
        >
          <div className="border-b border-gov-border/80 px-6 py-4.5 text-center bg-[#071526]">
            <h2 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight">
              Email Verification
            </h2>
            <p className="text-gov-slate text-xs mt-0.5 font-hindi">ईमेल सत्यापन प्रक्रिया</p>
          </div>

          <div className="p-6 sm:p-8 text-center">
            {/* Loading */}
            {status === "loading" && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-10 h-10 border-3 border-gov-amber border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-300 text-sm font-mono">Validating secure token…</p>
              </div>
            )}

            {/* Success */}
            {status === "success" && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500 bg-emerald-950/40 flex items-center justify-center text-emerald-400 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-base">
                    Email Verified Successfully!
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    Your citizen profile has been activated. You can now access your dashboard and file civic grievances.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-gov-primary w-full py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider font-mono shadow-gov-btn mt-2 flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Expired */}
            {status === "expired" && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-amber-950/40 flex items-center justify-center text-amber-400 shadow-inner">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-base">
                    Verification Link Expired
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    {message || "This verification link has exceeded its validity period."}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-gov-secondary w-full py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider font-mono mt-2 flex items-center justify-center gap-1.5"
                >
                  <span>Return to Login & Request New Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-red-500 bg-red-950/40 flex items-center justify-center text-red-400 shadow-inner">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-red-400 font-bold text-base">
                    Verification Unsuccessful
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    {message || "The verification link is invalid or has already been used."}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-gov-secondary w-full py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider font-mono mt-2"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#050f1d] border-t border-gov-border py-2.5 px-4 text-center text-[10px] text-gov-slate font-mono shrink-0">
        &copy; 2026 JanSahayak &bull; Government of India
      </footer>
      <div className="tricolor-bar-h h-1 w-full shrink-0" />
    </div>
  );
}
