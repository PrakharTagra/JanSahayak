import UserSidebar from "../../components/UserSidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusStyle = {
    Resolved: "text-emerald-300 bg-emerald-950/60 border-emerald-600/50",
    Pending:  "text-amber-300 bg-amber-950/60 border-amber-600/50",
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/complaint/my/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.complaints)) {
          setReports(
            data.complaints.map((item) => ({
              id: item._id,
              code: `JS-${item._id.slice(-6).toUpperCase()}`,
              title: item.title,
              desc: item.description,
              location: item.location,
              dept: item.category ? item.category.replace(/_/g, " ") : "General Civic",
              status: item.status === "resolved" ? "Resolved" : "Pending",
              filed: new Date(item.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }),
              updated: item.updatedAt
                ? new Date(item.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                : "-",
              img: item.photo,
              upvotes: item.upvotes?.length || 0,
            }))
          );
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch complaints error:", err);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const resolved = reports.filter((r) => r.status === "Resolved").length;
  const pending  = reports.filter((r) => r.status === "Pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gov-dark text-white flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-3 border-gov-amber border-t-transparent rounded-full animate-spin" />
        <p className="text-gov-slate text-xs font-mono">Loading Your Filed Grievances…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col lg:flex-row">
      <UserSidebar />

      <div className="lg:pl-72 w-full flex-1 flex flex-col min-h-screen pt-14 lg:pt-0">
        <div className="tricolor-bar-h h-1 w-full shrink-0" />

        {/* Top Header Bar */}
        <div className="bg-gov-navy border-b border-gov-border px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <h1 className="text-base sm:text-lg font-bold font-serif text-white leading-tight">
              My Registered Grievances
            </h1>
            <p className="text-[10px] sm:text-xs text-gov-slate font-hindi">
              नागरिक शिकायत स्थिति ट्रैकिंग &bull; Personal Docket
            </p>
          </div>
          <button
            onClick={() => navigate("/user/reportissue")}
            className="btn-gov-primary px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider shadow-gov-btn w-fit active:scale-95"
          >
            + File New Grievance
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 gov-pattern p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Metric Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Total Complaints", value: reports.length, color: "text-white", border: "border-gov-border" },
                { label: "Resolved by Authority", value: resolved, color: "text-emerald-400", border: "border-emerald-600/40" },
                { label: "Under Municipal Process", value: pending, color: "text-amber-400", border: "border-amber-600/40" },
              ].map((s) => (
                <div key={s.label} className={`border ${s.border} bg-gov-card p-4 rounded-lg text-center shadow-gov-card`}>
                  <p className={`text-2xl sm:text-3xl font-black font-mono ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-gov-slate font-mono uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Complaints List */}
            {reports.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gov-border rounded-lg bg-gov-card/40">
                <p className="text-3xl mb-2">🗂️</p>
                <p className="text-sm font-semibold text-white">No Complaints Logged in This Docket</p>
                <p className="text-xs text-gov-slate mt-1 max-w-sm mx-auto">
                  You haven't filed any civic grievances yet. Use the button above to report road defects, garbage issues, or street lighting problems.
                </p>
                <button
                  onClick={() => navigate("/user/reportissue")}
                  className="btn-gov-primary px-5 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider mt-4"
                >
                  File a Complaint Now &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((r, i) => (
                  <article
                    key={r.id || i}
                    className="border border-gov-border hover:border-gov-amber/60 bg-gov-card rounded-lg overflow-hidden transition-all duration-200 shadow-gov-card flex flex-col"
                  >
                    {/* Attached Photo */}
                    {r.img && (
                      <div className="relative h-48 sm:h-56 overflow-hidden bg-black/40">
                        <img
                          src={r.img}
                          alt={r.title}
                          className="w-full h-full object-cover opacity-80 hover:opacity-95 transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gov-card via-transparent" />
                        <span className={`absolute top-3 right-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded border shadow ${statusStyle[r.status] || "text-slate-300"}`}>
                          {r.status}
                        </span>
                      </div>
                    )}

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta header */}
                        <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] font-mono">
                          <span className="font-bold text-gov-amber bg-gov-amber/10 border border-gov-amber/30 px-2 py-0.5 rounded">
                            {r.code}
                          </span>
                          <span className="text-slate-300 bg-[#050f1d] border border-gov-border px-2 py-0.5 rounded uppercase">
                            {r.dept}
                          </span>
                          {!r.img && (
                            <span className={`ml-auto font-bold px-2 py-0.5 rounded border ${statusStyle[r.status] || "text-slate-300"}`}>
                              {r.status}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold font-serif text-white leading-snug">
                          {r.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                          {r.desc}
                        </p>

                        {/* Location and Timestamps */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-gov-border/60 text-xs text-gov-slate">
                          <span className="truncate">📍 Location: <strong className="text-slate-200">{r.location}</strong></span>
                          <span>🏛️ Department: <strong className="text-slate-200 uppercase">{r.dept}</strong></span>
                          <span>📅 Filed On: <strong className="text-slate-200">{r.filed}</strong></span>
                          <span>🔄 Last Status Update: <strong className="text-slate-200">{r.updated}</strong></span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gov-border/60 text-xs font-mono">
                        <span className="text-gov-slate">
                          ▲ Community Support: <strong className="text-gov-amber">{r.upvotes}</strong> upvotes
                        </span>
                        <span className="text-[11px] text-gov-amber">
                          Mandated Resolution Window: 15 Days
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="border border-gov-border bg-gov-card/60 rounded-md py-3 px-4 text-center text-xs text-gov-slate font-mono">
              JanSahayak Portal &bull; Official Citizen Grievance Docket &bull; Toll-Free Support: <strong className="text-gov-amber">1800-11-2026</strong>
            </div>

          </div>
        </main>

        <div className="tricolor-bar-h h-1 w-full shrink-0" />
      </div>
    </div>
  );
}
