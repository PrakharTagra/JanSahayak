import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  Globe,
  Scale,
  Phone,
  Zap,
  AlertTriangle,
  Lightbulb,
  Trash2,
  Droplets,
  Car,
  Wrench,
  ShieldCheck,
  FileText,
  Cpu,
  Vote,
  CheckCircle2,
  Mail,
  Building2,
  ArrowRight
} from "lucide-react";
import pothole from "../assets/pothole.jpg";
import light from "../assets/streetlight.jpg";
import garbage from "../assets/garbage.jpg";
import logo from "/favicon.png";
import water from "../assets/Water.jpg";
import drainage from "../assets/Drainage.jpg";
import traffic from "../assets/Traffic.jpg";

// ── Helpers ──
const Badge = ({ children }) => (
  <span className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3 py-1 rounded shadow-sm font-mono">
    {children}
  </span>
);

const Divider = () => (
  <div className="flex items-center gap-3 my-2.5 max-w-xs">
    <div className="h-0.5 flex-1 bg-gradient-to-r from-gov-amber/60 to-transparent" />
    <div className="w-1.5 h-1.5 rotate-45 bg-gov-amber" />
    <div className="h-0.5 flex-1 bg-gradient-to-l from-gov-amber/60 to-transparent" />
  </div>
);

const StatCard = ({ number, label, sub }) => (
  <div className="border border-gov-border/70 bg-gov-card/80 p-5 sm:p-6 text-center shadow-gov-card rounded-sm">
    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gov-amberLight font-mono tracking-tight">{number}</div>
    <div className="text-white font-semibold mt-1 text-xs sm:text-sm">{label}</div>
    {sub && <div className="text-gov-slate text-[11px] sm:text-xs mt-0.5">{sub}</div>}
  </div>
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 font-sans selection:bg-amber-600 selection:text-white">

      {/* ══ TOP TRICOLOR BAR ══ */}
      <div className="tricolor-bar-h h-1.5 w-full shrink-0" />

      {/* ══ ANNOUNCEMENT TICKER ══ */}
      <div className="bg-[#0b1b30] border-b border-gov-border/80 py-2 overflow-hidden flex items-center gap-3 px-4">
        <span className="shrink-0 text-gov-amber text-[10px] sm:text-xs font-bold tracking-wider uppercase font-mono bg-gov-amber/15 px-2 py-0.5 rounded border border-gov-amber/30 flex items-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5" />
          <span>Official Notice:</span>
        </span>
        <div className="overflow-hidden flex-1 relative">
          <p className="whitespace-nowrap text-xs text-slate-300 animate-pulse sm:animate-none">
            JanSahayak Portal v2.0 Live &bull; File civic grievances with geo-location & photographic proof &bull; Mandated 15-day SLA resolution &bull; नागरिक शिकायत निवारण सेवा
          </p>
        </div>
      </div>

      {/* ══ GOVERNMENT HEADER ══ */}
      <header className="bg-gov-navy border-b border-gov-border py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Left: Emblem & National Title */}
          <div className="flex items-center gap-3.5 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gov-saffron bg-gov-saffron/10 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                <img src={logo} alt="JanSahayak Emblem" className="w-8 h-8 sm:w-9 sm:h-9 object-cover" />
              </div>
              <div>
                <div className="text-gov-amber text-[10px] sm:text-xs tracking-[0.18em] uppercase font-mono font-semibold">
                  Government of India Initiative
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-serif leading-tight">
                  JanSahayak
                </h1>
                <p className="text-gov-slate text-[11px] sm:text-xs font-hindi">
                  जन सहायक — नागरिक शिकायत निवारण पोर्टल
                </p>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex md:hidden gap-2">
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 border border-gov-amber/60 text-gov-amber hover:bg-gov-amber/10 rounded text-xs font-semibold uppercase tracking-wider font-mono transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="btn-gov-primary px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider font-mono"
              >
                Register
              </button>
            </div>
          </div>

          {/* Center: Ministry Label (Desktop) */}
          <div className="hidden lg:block text-center border-x border-gov-border/60 px-6">
            <p className="text-gov-slate text-[11px]">Under the aegis of</p>
            <p className="text-white text-xs sm:text-sm font-semibold tracking-wide">
              Ministry of Housing & Urban Affairs
            </p>
            <p className="text-gov-amber text-[11px] font-hindi">आवासन और शहरी कार्य मंत्रालय &bull; भारत सरकार</p>
          </div>

          {/* Right: Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 border border-gov-amber/60 text-gov-amber hover:bg-gov-amber/10 rounded text-xs sm:text-sm font-bold tracking-wider uppercase font-mono transition active:scale-95 shadow-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="btn-gov-primary px-5 py-2.5 rounded text-xs sm:text-sm font-bold tracking-wider uppercase font-mono shadow-gov-btn"
            >
              Register Citizen
            </button>
          </div>
        </div>
      </header>

      {/* ══ RESPONSIVE NAV BAR ══ */}
      <nav className="bg-[#0b1c34] border-b border-gov-border sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5 text-xs font-semibold tracking-wider uppercase font-mono overflow-x-auto gap-4">
          <div className="flex items-center gap-4 sm:gap-6 whitespace-nowrap">
            {[
              ["Home", "/"],
              ["About Portal", "#about"],
              ["Report Issue", "/login"],
              ["Track Status", "/login"],
              ["Categories", "#categories"],
              ["FAQ", "#faq"],
            ].map(([label, path]) => (
              <button
                key={label}
                onClick={() => {
                  if (path.startsWith("#")) {
                    const el = document.querySelector(path);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate(path);
                  }
                }}
                className="text-slate-300 hover:text-gov-amber transition pb-0.5 border-b-2 border-transparent hover:border-gov-amber text-xs"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="shrink-0 text-gov-slate text-[11px] flex items-center gap-1.5 pl-2">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-white hover:text-gov-amber cursor-pointer">EN</span>
            <span>|</span>
            <span className="text-slate-400 hover:text-gov-amber cursor-pointer font-hindi">हिन्दी</span>
          </div>
        </div>
      </nav>

      {/* ══ HERO SECTION ══ */}
      <section className="relative gov-pattern overflow-hidden border-b border-gov-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <Badge>National Grievance Portal</Badge>
            <Divider />
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif leading-[1.15] text-white mt-3">
              Report Civic Issues. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gov-saffron via-amber-400 to-amber-200">
                Empower Your City.
              </span>
            </h2>
            
            <p className="mt-4 sm:mt-5 text-slate-300 leading-relaxed text-sm sm:text-base max-w-2xl">
              JanSahayak is an integrated citizen grievance redressal platform enabling residents across India to report municipal issues—potholes, garbage dumps, non-functioning streetlights, and drainage blockages—with real-time GPS tagging and photographic evidence.
            </p>
            
            <div className="mt-4 border-l-3 border-gov-amber bg-gov-card/60 p-3.5 rounded-r max-w-2xl border border-gov-border flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-gov-amber shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Legal Backing:</strong> All complaints filed are treated as formal civic representations under Public Grievance Acts, mandating official department acknowledgement within 5 days.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 mt-7 sm:mt-8">
              <button
                onClick={() => navigate("/login")}
                className="btn-gov-primary px-7 py-3.5 rounded text-sm font-bold uppercase tracking-wider font-mono text-center shadow-gov-btn flex items-center justify-center gap-2"
              >
                <span>File a Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-gov-secondary px-6 py-3.5 rounded text-sm font-bold uppercase tracking-wider font-mono text-center"
              >
                How It Works
              </button>
            </div>

            {/* Helpline badge */}
            <div className="mt-6 inline-flex items-center gap-3 border border-gov-border bg-gov-card/90 px-4 py-2.5 rounded text-xs text-slate-300 font-mono shadow-sm">
              <Phone className="w-4 h-4 text-gov-amber" />
              <span>Toll-Free Helpline: <strong className="text-white text-sm">1800-11-2026</strong> (24×7 Citizen Support)</span>
            </div>
          </motion.div>

          {/* Hero Right: Quick Grievance Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="border border-gov-border bg-gov-card rounded-lg p-5 sm:p-6 shadow-gov-card relative">
              <div className="flex items-center justify-between border-b border-gov-border/80 pb-3 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gov-amber flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quick Grievance Filing</span>
                </span>
                <span className="text-[10px] font-mono text-gov-emerald bg-emerald-950/40 border border-emerald-600/40 px-2 py-0.5 rounded">
                  System Active
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Select your grievance category for automated routing to the responsible municipal department:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: AlertTriangle, label: "Pothole & Roads", priority: "High" },
                  { icon: Lightbulb, label: "Street Lighting", priority: "Medium" },
                  { icon: Trash2, label: "Garbage Overflow", priority: "Urgent" },
                  { icon: Droplets, label: "Waterlogging", priority: "High" },
                  { icon: Car, label: "Traffic Signal", priority: "Medium" },
                  { icon: Wrench, label: "Drainage Blocks", priority: "Urgent" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate("/login")}
                      className="flex flex-col items-start gap-1 p-3 rounded border border-gov-border bg-[#0a192f] hover:border-gov-amber/70 hover:bg-gov-amber/5 transition text-left group active:scale-95"
                    >
                      <Icon className="w-5 h-5 text-gov-amber group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-white group-hover:text-gov-amber transition-colors line-clamp-1">{item.label}</span>
                      <span className="text-[10px] text-gov-slate font-mono">{item.priority}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full mt-4 py-3 rounded border border-dashed border-gov-amber/60 text-gov-amber text-xs font-bold uppercase tracking-wider hover:bg-gov-amber/10 transition font-mono text-center active:scale-95"
              >
                + View All Civic Departments
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS SECTION ══ */}
      <section className="bg-gov-navy border-b border-gov-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gov-border/60">
          <StatCard number="12,400+" label="Issues Registered" sub="Across smart municipalities" />
          <StatCard number="8,950+" label="Resolved Cases" sub="72% positive redressal rate" />
          <StatCard number="24" label="Participating Cities" sub="Across 8 Indian States" />
          <StatCard number="15 Days" label="Average Resolution" sub="Compliant with Citizen Charter" />
        </div>
      </section>

      {/* ══ ABOUT PORTAL ══ */}
      <section id="about" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <Badge>Civic Governance</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif mt-3 text-white leading-tight">
              About the JanSahayak Framework
            </h2>
            <Divider />
            <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base">
              JanSahayak is an open, citizen-first civic grievance monitoring portal established under the Smart Cities Mission. Designed in accordance with Digital India guidelines, it brings complete visibility to everyday infrastructure failures.
            </p>
            <p className="text-slate-300 mt-3 leading-relaxed text-sm sm:text-base">
              The platform utilizes automated <strong>AI Computer Vision</strong> to categorize issues directly from submitted photos, verifies coordinates through geo-tagging, and leverages community upvoting so critical hazards are escalated immediately.
            </p>
            <div className="mt-6 border border-gov-amber/40 bg-gov-amber/10 p-4 rounded text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-gov-amber shrink-0 mt-0.5" />
              <div>
                <strong>Citizen Charter Guarantee:</strong> Grievances logged with photographs are prioritized for inspection by municipal engineers within 48 hours.
              </div>
            </div>
          </div>

          <div id="faq" className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gov-amber font-bold mb-3">
              Frequently Asked Questions (FAQ)
            </h3>
            {[
              { q: "Who can register complaints on JanSahayak?", a: "Any citizen residing in India with a verified email or phone number can log in and file grievances for their ward." },
              { q: "Is there any charge for reporting civic issues?", a: "No. JanSahayak is a 100% free public service provided by the municipal authorities and Government of India." },
              { q: "How are submitted complaints tracked?", a: "Every complaint generates a unique tracking ID (e.g. JS-2026-XXXX). Citizens receive status updates via dashboard and email." },
              { q: "What happens if a complaint is delayed beyond the SLA?", a: "Complaints exceeding the 15-day resolution window are escalated automatically to higher municipal commissioners." },
            ].map((faq, i) => (
              <details key={i} className="border border-gov-border bg-gov-card rounded group transition overflow-hidden">
                <summary className="flex justify-between items-center px-4 py-3 cursor-pointer text-xs sm:text-sm font-semibold text-white hover:bg-white/[0.03] select-none list-none">
                  <span>{faq.q}</span>
                  <span className="text-gov-amber text-lg group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-4 pb-3.5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-gov-border/60 pt-3 bg-[#0a192f]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CIVIC PROBLEM CATEGORIES ══ */}
      <section id="categories" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gov-navy border-y border-gov-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <Badge>Reportable Issues</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif mt-3 text-white">
              Official Grievance Categories
            </h2>
            <p className="text-gov-slate mt-2 max-w-xl mx-auto text-xs sm:text-sm">
              Issues assigned directly to designated municipal departments with mandated Service Level Agreements (SLA).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { title: "Potholes & Road Cracks", img: pothole, dept: "Public Works (PWD)", sla: "15 Days", desc: "Hazardous potholes and broken road pavements causing vehicular damage and traffic risks." },
              { title: "Broken Street Lights", img: light, dept: "Electricity Board", sla: "7 Days", desc: "Defective luminaires and dark stretches causing unsafe nighttime conditions." },
              { title: "Garbage Overflow", img: garbage, dept: "Solid Waste Dept.", sla: "3 Days", desc: "Overflowing public bins and roadside waste dumps creating health hazards." },
              { title: "Water Leakage & Supply", img: water, dept: "Jal Sansthan", sla: "7 Days", desc: "Ruptured municipal pipelines, contaminated drinking supply, or zero water pressure." },
              { title: "Blocked Drains & Sludge", img: drainage, dept: "Drainage Board", sla: "5 Days", desc: "Clogged stormwater drains causing water stagnation, foul odor, and mosquito breeding." },
              { title: "Traffic Signal Malfunctions", img: traffic, dept: "Traffic Division", sla: "3 Days", desc: "Non-functional intersection timers and signals causing urban road congestion." },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gov-border hover:border-gov-amber/60 bg-gov-card rounded-lg overflow-hidden transition-all duration-200 group flex flex-col shadow-gov-card"
              >
                <div className="relative h-44 overflow-hidden bg-black/40">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gov-card via-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-gov-emerald/90 text-white px-2.5 py-1 rounded shadow">
                    SLA: {item.sla}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-gov-amber transition-colors">{item.title}</h3>
                    <div className="mt-2 text-[10px] font-mono text-gov-amber bg-gov-amber/10 border border-gov-amber/30 px-2 py-0.5 rounded w-fit">
                      {item.dept}
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="mt-4 pt-3 border-t border-gov-border/60 text-xs text-gov-amber font-mono font-semibold uppercase tracking-wider hover:underline flex items-center justify-between"
                  >
                    <span>File Complaint</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STEP BY STEP PROCESS ══ */}
      <section id="process" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <Badge>Transparent Workflow</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif mt-3 text-white">
            How Complaints Are Processed
          </h2>
          <p className="text-gov-slate mt-2 text-xs sm:text-sm">
            5 clear steps from initial reporting to verified civic resolution
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {[
            { step: "01", icon: FileText, title: "File Grievance", desc: "Submit grievance with photograph, title, and exact location description." },
            { step: "02", icon: Cpu, title: "AI Categorization", desc: "Computer vision automatically detects issue type and assigns correct department." },
            { step: "03", icon: Vote, title: "Citizen Upvoting", desc: "Community members vote to prioritize critical emergencies in the locality." },
            { step: "04", icon: Wrench, title: "Dispatch & Action", desc: "Municipal engineers or verified volunteers inspect and fix the issue." },
            { step: "05", icon: CheckCircle2, title: "Verified Closure", desc: "Status updated to Resolved with timestamped completion proof." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="border border-gov-border bg-gov-card p-5 rounded-lg text-center flex flex-col items-center shadow-gov-card">
                <div className="w-12 h-12 rounded-full border-2 border-gov-saffron bg-gov-saffron/10 flex items-center justify-center text-gov-amber mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-gov-amber text-[10px] font-mono font-bold tracking-widest">{item.step}</span>
                <h3 className="font-bold text-sm text-white mt-1">{item.title}</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ FINAL CALL TO ACTION ══ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#091f3a] to-gov-navy border-t border-gov-border text-center">
        <div className="max-w-3xl mx-auto">
          <Badge>Active Citizen Participation</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif mt-4 text-white leading-tight">
            Be the Change in Your Neighborhood
          </h2>
          <p className="text-slate-300 mt-3 text-sm sm:text-base leading-relaxed">
            Every complaint registered on JanSahayak holds authorities accountable and helps create safer, cleaner public spaces.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3.5 mt-7">
            <button
              onClick={() => navigate("/signup")}
              className="btn-gov-primary px-8 py-3.5 rounded text-sm font-bold uppercase tracking-wider font-mono shadow-gov-btn"
            >
              Register Citizen Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn-gov-secondary px-8 py-3.5 rounded text-sm font-bold uppercase tracking-wider font-mono"
            >
              Sign In to Portal
            </button>
          </div>
        </div>
      </section>

      {/* ══ GOVERNMENT FOOTER ══ */}
      <footer className="bg-[#040b15] border-t border-gov-border pt-12 pb-6 text-xs text-gov-slate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img src={logo} className="w-6 h-6 rounded" alt="Emblem" />
              <span className="text-white font-bold font-serif text-base">JanSahayak</span>
            </div>
            <p className="leading-relaxed">
              Official Civic Grievance & Citizen Empowerment Platform, Ministry of Housing & Urban Affairs, Government of India.
            </p>
            <p className="mt-2 text-gov-amber font-hindi text-xs">सत्यमेव जयते &bull; जन सेवा ही राष्ट्र सेवा</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider font-mono text-xs">Portal Navigation</h4>
            <ul className="space-y-2">
              <li onClick={() => navigate("/")} className="hover:text-gov-amber cursor-pointer transition">Home Page</li>
              <li onClick={() => navigate("/login")} className="hover:text-gov-amber cursor-pointer transition">File Grievance</li>
              <li onClick={() => navigate("/login")} className="hover:text-gov-amber cursor-pointer transition">Track Case Status</li>
              <li onClick={() => navigate("/login")} className="hover:text-gov-amber cursor-pointer transition">Volunteer Network</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider font-mono text-xs">Gov Initiatives</h4>
            <ul className="space-y-2">
              <li className="hover:text-gov-amber cursor-pointer transition">Smart Cities Mission</li>
              <li className="hover:text-gov-amber cursor-pointer transition">Digital India Programme</li>
              <li className="hover:text-gov-amber cursor-pointer transition">Swachh Bharat Abhiyan</li>
              <li className="hover:text-gov-amber cursor-pointer transition">CPGRAMS Portal</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider font-mono text-xs">Support & Helpline</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gov-amber" /> Toll-Free: <strong className="text-white font-mono">1800-11-2026</strong></li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gov-amber" /> Support: <span className="text-white">support@jansahayak.gov.in</span></li>
              <li className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-gov-amber" /> Mon–Sat: 09:00 AM – 06:00 PM</li>
              <li className="text-[10px] text-gov-muted">Emergency Services: Dial 112</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gov-border/60 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-mono">
          <p>&copy; 2026 JanSahayak &bull; Government of India. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gov-amber cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gov-amber cursor-pointer">Terms of Service</span>
            <span className="hover:text-gov-amber cursor-pointer">Accessibility Statement</span>
            <span className="hover:text-gov-amber cursor-pointer">Site Map</span>
          </div>
        </div>

        <div className="tricolor-bar-h h-1 w-full mt-5" />
      </footer>
    </div>
  );
}
