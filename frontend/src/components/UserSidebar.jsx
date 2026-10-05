import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutModal from "./LogoutModal";

export default function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const navItems = [
    { title: "Dashboard",      path: "/user/userdashboard", icon: "⊞",  sub: "Overview & Analytics" },
    { title: "Community Feed", path: "/user/feed",          icon: "📡", sub: "Live Public Grievances" },
    { title: "Report Issue",   path: "/user/reportissue",   icon: "📝", sub: "File New Complaint" },
    { title: "My Reports",     path: "/user/myreports",     icon: "🗂️", sub: "Track Your Cases" },
  ];

  const isActive = (path) => location.pathname === path;

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const SidebarContent = () => (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Ministry Top Header */}
        <div className="bg-[#050f1d] border-b border-gov-border px-4 py-2.5 text-center">
          <p className="text-[10px] font-mono text-gov-slate uppercase tracking-wider leading-relaxed">
            Ministry of Housing & Urban Affairs<br />
            <span className="text-gov-amber font-semibold">Government of India</span>
          </p>
        </div>

        {/* Portal Branding */}
        <div
          onClick={() => navigate("/user/userdashboard")}
          className="flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-gov-border/60 hover:bg-white/[0.02] transition"
        >
          <div className="w-10 h-10 rounded-full border-2 border-gov-saffron/80 bg-gov-saffron/10 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            <img src="/favicon.png" alt="JanSahayak" className="w-7 h-7 object-cover" />
          </div>
          <div className="overflow-hidden min-w-0">
            <h1 className="text-base font-bold font-serif text-white leading-tight truncate">
              JanSahayak
            </h1>
            <p className="text-[10px] text-gov-amber font-hindi truncate">
              जन सहायक — नागरिक पोर्टल
            </p>
          </div>
        </div>

        {/* Citizen Profile Card */}
        <div className="mx-3.5 mt-4 mb-3 border border-gov-border bg-[#050f1d] px-3.5 py-3 rounded-md flex items-center gap-3 shadow-inner">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600/30 to-amber-800/40 border border-gov-amber/40 flex items-center justify-center text-sm shrink-0">
            👤
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Citizen User"}</p>
            <p className="text-[10px] text-gov-slate font-mono truncate">{user?.email || "citizen@gov.in"}</p>
          </div>
          <div className="shrink-0 w-2 h-2 rounded-full bg-gov-emerald shadow-sm shadow-emerald-500/50" title="Active Session" />
        </div>

        {/* Nav Label */}
        <p className="text-[10px] font-mono text-gov-muted uppercase tracking-widest px-5 mt-4 mb-2">
          Navigation Menu
        </p>

        {/* Nav List */}
        <nav className="flex flex-col gap-1.5 px-3">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-md flex items-center gap-3 transition-all duration-150 border ${
                isActive(item.path)
                  ? "border-gov-amber/60 bg-gov-amber/15 text-gov-amber font-semibold shadow-sm"
                  : "border-transparent text-slate-300 hover:text-white hover:bg-white/[0.04] hover:border-gov-border/50"
              }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <div className="overflow-hidden min-w-0 flex-1">
                <p className={`text-xs uppercase tracking-wide truncate ${isActive(item.path) ? "font-bold text-gov-amber" : "font-medium"}`}>
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{item.sub}</p>
              </div>
              {isActive(item.path) && (
                <div className="w-1.5 h-5 rounded-full bg-gov-amber shrink-0" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-3.5 space-y-2.5 border-t border-gov-border/60 bg-[#050f1d]/50">
        <div className="border border-gov-border bg-gov-card/60 rounded px-3 py-2 text-center">
          <p className="text-[10px] font-mono text-gov-amber">📞 Citizen Helpline</p>
          <p className="text-xs font-bold font-mono text-white mt-0.5">1800-11-2026</p>
          <p className="text-[9px] text-gov-slate">Toll-Free &bull; 24x7 Citizen Support</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full py-2.5 px-3 rounded border border-red-500/30 text-red-300 hover:bg-red-950/40 hover:border-red-500/60 transition text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>⏻</span> Sign Out
        </button>

        <p className="text-[9px] text-slate-500 text-center font-mono pt-1">
          &copy; 2026 JanSahayak &bull; Govt. of India
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* ── MOBILE TOP NAVIGATION BAR (Visible < 1024px) ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gov-navy border-b border-gov-border px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/user/userdashboard")}>
          <div className="w-8 h-8 rounded-full border border-gov-saffron bg-gov-saffron/10 flex items-center justify-center overflow-hidden">
            <img src="/favicon.png" alt="logo" className="w-5 h-5 object-cover" />
          </div>
          <div>
            <span className="text-sm font-bold font-serif text-white leading-none block">JanSahayak</span>
            <span className="text-[9px] text-gov-amber font-hindi block">जन सहायक पोर्टल</span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          className="w-9 h-9 rounded-md border border-gov-border bg-gov-card flex items-center justify-center text-white hover:border-gov-amber transition active:scale-95"
        >
          {mobileOpen ? (
            <span className="text-lg font-bold leading-none">&times;</span>
          ) : (
            <span className="text-base font-bold leading-none">&#9776;</span>
          )}
        </button>
      </header>

      {/* ── MOBILE SLIDING DRAWER & BACKDROP (Visible < 1024px when open) ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-gov-navy border-r border-gov-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="tricolor-bar-h h-1 w-full shrink-0" />
        <SidebarContent />
      </aside>

      {/* ── DESKTOP FIXED SIDEBAR (Visible >= 1024px) ── */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-72 bg-gov-navy border-r border-gov-border z-30 flex-col">
        <div className="tricolor-bar-v w-1.5 shrink-0 h-full absolute left-0 top-0 bottom-0" />
        <div className="pl-1.5 h-full flex flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Logout confirmation dialog */}
      {showModal && (
        <LogoutModal
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }}
        />
      )}
    </>
  );
}
