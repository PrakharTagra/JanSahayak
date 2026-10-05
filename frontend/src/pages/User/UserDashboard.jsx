import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch stats
        const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/complaint/user/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();

        // Fetch user complaints
        const complaintsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/complaint/my/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const complaintsData = await complaintsRes.json();

        // Set stats
        if (statsData.success) {
          setStats([
            {
              label: "Total Registered",
              value: statsData.stats?.total || 0,
              icon: "📋",
              sub: "All time grievances filed",
              color: "text-gov-amber",
              badgeBg: "bg-amber-950/40 border-amber-600/40",
            },
            {
              label: "Resolved",
              value: statsData.stats?.resolved || 0,
              icon: "✅",
              sub: "Action verified by authority",
              color: "text-emerald-400",
              badgeBg: "bg-emerald-950/40 border-emerald-600/40",
            },
            {
              label: "Pending Action",
              value: statsData.stats?.pending || 0,
              icon: "⏳",
              sub: "Under municipal review",
              color: "text-amber-400",
              badgeBg: "bg-orange-950/40 border-orange-600/40",
            },
          ]);
        }

        // Set recent activity
        if (complaintsData.success && Array.isArray(complaintsData.complaints)) {
          setRecentActivity(
            complaintsData.complaints.slice(0, 4).map((item) => ({
              id: item._id,
              code: `JS-${item._id.slice(-6).toUpperCase()}`,
              title: item.title,
              category: item.category || "General",
              status: item.status === "resolved" ? "Resolved" : "Pending",
              date: new Date(item.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }),
            }))
          );
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navCards = [
    { title: "Community Feed", icon: "📡", path: "/user/feed", desc: "View & upvote civic grievances reported in your locality", tag: "Live Feed" },
    { title: "File Grievance", icon: "📝", path: "/user/reportissue", desc: "Report pothole, garbage, or streetlight failure with photo proof", tag: "New Report" },
    { title: "My Reports", icon: "🗂️", path: "/user/myreports", desc: "Inspect real-time tracking, assignment, and resolution proof", tag: "Track Status" },
  ];

  const statusStyle = {
    Resolved: "text-emerald-300 bg-emerald-950/60 border-emerald-600/50",
    Pending:  "text-amber-300 bg-amber-950/60 border-amber-600/50",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gov-dark text-white flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-3 border-gov-amber border-t-transparent rounded-full animate-spin" />
        <p className="text-gov-slate text-xs font-mono">Loading Citizen Dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col lg:flex-row">
      {/* Responsive Navigation Sidebar */}
      <UserSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-72 w-full flex-1 flex flex-col min-h-screen pt-14 lg:pt-0">
        
        {/* Tricolor Top Bar */}
        <div className="tricolor-bar-h h-1 w-full shrink-0" />

        {/* Top Header */}
        <div className="bg-gov-navy border-b border-gov-border px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div>
            <h1 className="text-base sm:text-lg font-bold font-serif text-white leading-tight">
              Citizen Overview & Dashboard
            </h1>
            <p className="text-[10px] sm:text-xs text-gov-slate font-hindi">
              नागरिक डैशबोर्ड &bull; JanSahayak Grievance Management
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="border border-emerald-600/50 bg-emerald-950/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Portal Online
            </span>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <main className="flex-1 gov-pattern p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* ── METRIC STATS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats && stats.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="border border-gov-border bg-gov-card p-4 sm:p-5 rounded-lg flex items-start gap-4 shadow-gov-card"
                >
                  <div className={`w-11 h-11 rounded-lg border ${item.badgeBg} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono text-gov-slate uppercase tracking-wider font-semibold truncate">
                      {item.label}
                    </p>
                    <p className={`text-2xl sm:text-3xl font-black font-mono mt-0.5 ${item.color}`}>
                      {item.value}
                    </p>
                    <p className="text-[11px] text-gov-muted mt-0.5 truncate">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── QUICK NAVIGATION CARDS ── */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gov-amber mb-3">
                Quick Actions & Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {navCards.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    onClick={() => navigate(item.path)}
                    className="cursor-pointer border border-gov-border hover:border-gov-amber/70 bg-gov-card p-5 rounded-lg transition-all shadow-gov-card group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl p-2 rounded bg-[#0a192f] border border-gov-border group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="text-[10px] font-mono font-bold text-gov-amber bg-gov-amber/10 border border-gov-amber/30 px-2 py-0.5 rounded uppercase tracking-wider">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="font-bold text-white group-hover:text-gov-amber transition-colors text-sm sm:text-base">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gov-border/60 text-xs text-gov-amber font-mono font-semibold flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                      <span>Access Feature</span>
                      <span>&rarr;</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── RECENT COMPLAINTS ── */}
            <div className="border border-gov-border bg-gov-card rounded-lg p-5 sm:p-6 shadow-gov-card">
              <div className="flex items-center justify-between mb-4 border-b border-gov-border/60 pb-3">
                <div>
                  <h2 className="font-bold font-serif text-white text-base">Your Recent Grievances</h2>
                  <p className="text-xs text-gov-slate">Track the current progress of complaints registered from this account</p>
                </div>
                <button
                  onClick={() => navigate("/user/myreports")}
                  className="btn-gov-secondary px-3 py-1.5 rounded text-xs font-mono font-semibold uppercase tracking-wider"
                >
                  View All &rarr;
                </button>
              </div>

              {recentActivity.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gov-border rounded-lg bg-[#071322]">
                  <p className="text-2xl mb-2">📋</p>
                  <p className="text-sm font-semibold text-white">No Grievances Filed Yet</p>
                  <p className="text-xs text-gov-slate mt-1 max-w-sm mx-auto">
                    Report local civic issues such as broken streetlights, potholes, or uncollected garbage.
                  </p>
                  <button
                    onClick={() => navigate("/user/reportissue")}
                    className="btn-gov-primary px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider mt-4"
                  >
                    File First Grievance &rarr;
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {recentActivity.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate("/user/myreports")}
                      className="border border-gov-border/80 hover:border-gov-amber/60 bg-[#071526] p-4 rounded-lg transition cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-gov-amber font-bold">{item.code}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusStyle[item.status] || "text-slate-300"}`}>
                            {item.status}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-gov-amber transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gov-slate mt-3 pt-2 border-t border-gov-border/40">
                        <span className="capitalize">{item.category.replace(/_/g, " ")}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Helpline Footer Strip */}
            <div className="border border-gov-border bg-gov-card/60 rounded-md py-3 px-4 text-center text-xs text-gov-slate font-mono">
              Citizen Grievance Cell &bull; Call <strong className="text-gov-amber">1800-11-2026</strong> (Toll-Free, 24x7) &bull; JanSahayak Portal
            </div>

          </div>
        </main>

        <div className="tricolor-bar-h h-1 w-full shrink-0" />
      </div>
    </div>
  );
}