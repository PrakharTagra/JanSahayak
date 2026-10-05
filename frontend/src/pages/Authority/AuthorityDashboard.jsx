import { useState, useMemo, useEffect, useCallback } from "react";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const API = `${import.meta.env.VITE_API_URL}/api/v1`;
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });
const jsonHeaders = () => ({ ...authHeaders(), "Content-Type": "application/json" });

const statusColor = (s) => {
  if (s === "resolved")  return "text-emerald-400 bg-emerald-950/40 border-emerald-600/50";
  if (s === "assigned")  return "text-blue-400 bg-blue-950/40 border-blue-600/50";
  if (s === "pending")   return "text-amber-400 bg-amber-950/40 border-amber-600/50";
  return "text-slate-400 bg-slate-800 border-slate-700";
};

const categoryIcon = (c = "") => {
  const map = { garbage:"🗑️", bad_road:"🛣️", broken_light:"💡", waterlogging:"💧", other:"📋" };
  return map[c] || "📋";
};
const categoryLabel = (c = "") => {
  const map = { garbage:"Sanitation", bad_road:"Roads & PWD", broken_light:"Electricity", waterlogging:"Water Supply", other:"Other" };
  return map[c] || c;
};

const timeAgo = (d) => {
  if (!d) return "—";
  const diff = Date.now() - new Date(d);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

const scoreApplicant = (b) => {
  const maxAmount = 10000, maxDays = 30;
  return (1 - b.estimatedAmount / maxAmount) * 0.5 + (1 - b.estimatedDays / maxDays) * 0.5;
};

const Badge = ({ label, className = "" }) => (
  <span className={`text-[10px] font-mono px-2 py-0.5 border rounded uppercase tracking-wider font-semibold ${className}`}>{label}</span>
);

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { background: #050f1d; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; }
  .serif { font-family: 'Merriweather', Georgia, serif; }
  .tricolor { background: linear-gradient(to right,#FF9933 33.3%,white 33.3%,white 66.6%,#138808 66.6%); }
  .gov-grid { background-image: linear-gradient(rgba(255,153,51,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,153,51,0.02) 1px,transparent 1px); background-size:36px 36px; }

  .card { border:1px solid #1c3c66; background:#0f233d; border-radius:6px; transition:border-color 0.2s, transform 0.15s; }
  .card:hover { border-color:#d97706; }

  .btn-primary { background:linear-gradient(135deg, #FF9933 0%, #D97706 100%); color:#ffffff; border:none; font-family:'JetBrains Mono',monospace; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; font-size:11px; cursor:pointer; padding:9px 18px; border-radius:4px; transition:all 0.15s; box-shadow:0 2px 6px rgba(217,119,6,0.3); }
  .btn-primary:hover { background:linear-gradient(135deg, #FFA74D 0%, #E67E00 100%); transform:translateY(-1px); }
  .btn-primary:active { transform:scale(0.98); }
  .btn-primary:disabled { background:#334155; color:#64748b; cursor:not-allowed; box-shadow:none; transform:none; }

  .btn-ghost { background:transparent; color:#FF9933; border:1px solid rgba(255,153,51,0.5); font-family:'JetBrains Mono',monospace; font-weight:600; font-size:10px; cursor:pointer; padding:7px 14px; border-radius:4px; transition:all 0.15s; text-transform:uppercase; letter-spacing:0.06em; }
  .btn-ghost:hover { border-color:#FF9933; background:rgba(255,153,51,0.1); }
  .btn-ghost:active { transform:scale(0.98); }

  .btn-danger { background:rgba(239,68,68,0.15); color:#fca5a5; border:1px solid rgba(239,68,68,0.4); font-family:'JetBrains Mono',monospace; font-weight:600; font-size:10px; cursor:pointer; padding:7px 14px; border-radius:4px; transition:all 0.15s; text-transform:uppercase; }
  .btn-danger:hover { background:rgba(239,68,68,0.25); border-color:#ef4444; color:#ffffff; }

  input, select { background:#071322; border:1px solid #1c3c66; color:white; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; padding:8px 12px; outline:none; width:100%; border-radius:4px; }
  input:focus, select:focus { border-color:#FF9933; }
  input::placeholder { color:#64748b; }

  .feed-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:16px; padding:16px; }
  @media (min-width: 640px) {
    .feed-grid { grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:20px; padding:24px; }
  }

  .modal-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.8); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:16px; }
  .modal-box { background:#0a192f; border:1px solid #1c3c66; width:100%; max-width:820px; max-height:90vh; overflow-y:auto; border-radius:8px; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.6); }

  .stat-card { border:1px solid #1c3c66; background:#0f233d; padding:16px 20px; border-radius:6px; box-shadow:0 4px 12px rgba(5,15,29,0.5); }
  .vol-row { padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:background 0.15s; }
  .vol-row:hover { background:rgba(255,153,51,0.06); }
  .vol-row.active { background:rgba(255,153,51,0.12); border-left:3px solid #FF9933; }

  .section-label { font-size:10px; color:#FF9933; font-family:'JetBrains Mono',monospace; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; margin-bottom:12px; }
`;

// ─── EXPORT HELPER ────────────────────────────────────────────────────────────
const handleExcelExport = async () => {
  try {
    const res = await fetch(`${API}/reports/export`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JanSahayak_Grievances_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Export could not be generated: " + err.message);
  }
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ active, setView, counts }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const items = [
    { id:"dashboard", label:"Dashboard", icon:"⬡" },
    { id:"assign",    label:"Assign",    icon:"👷", badge: counts.pending },
    { id:"pending",   label:"In Progress", icon:"⏳", badge: counts.assigned },
    { id:"resolved",  label:"Resolved",  icon:"✅" },
    { id:"volunteers",label:"Volunteers",icon:"👥" },
  ];

  return (
    <nav style={{ background:"#071324", borderBottom:"1px solid #1c3c66", position:"sticky", top:0, zIndex:100 }}>
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 360, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "white" }} className="serif">
              Sign Out of Authority Portal
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>
              End current administrative session?
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button
                className="btn-danger"
                style={{ flex: 1 }}
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 16px", minHeight:56, flexWrap:"wrap", gap:8 }}>
        {/* Emblem & Title */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => setView("dashboard")}>
          <div className="w-8 h-8 rounded-full border border-gov-saffron bg-gov-saffron/10 flex items-center justify-center overflow-hidden shrink-0">
            <img src="/favicon.png" alt="logo" className="w-5 h-5 object-cover" />
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", color:"white" }}>JanSahayak</div>
            <div style={{ fontSize:9, color:"#FF9933", letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>MUNICIPAL AUTHORITY</div>
          </div>
        </div>

        {/* Responsive Nav Tabs */}
        <div style={{ display:"flex", gap:4, overflowX:"auto", maxWidth:"100%", padding:"2px 0" }}>
          {items.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              background: active===n.id ? "rgba(255,153,51,0.15)" : "transparent",
              border: active===n.id ? "1px solid rgba(255,153,51,0.5)" : "1px solid transparent",
              color: active===n.id ? "#FF9933" : "#94a3b8",
              fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700,
              textTransform:"uppercase", letterSpacing:"0.06em",
              padding:"6px 12px", cursor:"pointer", transition:"all 0.15s",
              display:"flex", alignItems:"center", gap:5, borderRadius:4, whiteSpace:"nowrap"
            }}>
              <span>{n.icon}</span>{n.label}
              {n.badge > 0 && (
                <span style={{ background:"#FF9933", color:"#050f1d", fontSize:8, fontWeight:900, borderRadius:6, padding:"1px 5px", marginLeft:2 }}>
                  {n.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button
            onClick={handleExcelExport}
            style={{
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.4)",
              color: "#34d399",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "6px 10px",
              cursor: "pointer",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono',monospace",
              whiteSpace: "nowrap"
            }}
          >
            📊 Export Excel
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              background: "transparent",
              border: "1px solid rgba(239,68,68,0.4)",
              color: "#fca5a5",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "6px 10px",
              cursor: "pointer",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono',monospace",
              whiteSpace: "nowrap"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ setView, complaints, volunteers }) {
  const resolved   = complaints.filter(c => c.status === "resolved");
  const assigned   = complaints.filter(c => c.status === "assigned");
  const pending    = complaints.filter(c => c.status === "pending");
  const activeVols = volunteers.filter(v => !v.volunteerDetails?.isAvailable);

  const stats = [
    { label:"Total Complaints", value: complaints.length,  icon:"📋", color:"white",    sub:"Registered grievances" },
    { label:"Resolved",         value: resolved.length,    icon:"✅", color:"#10B981",  sub:`${complaints.length ? Math.round(resolved.length/complaints.length*100) : 0}% redressal rate` },
    { label:"Awaiting Action",  value: pending.length,     icon:"⏳", color:"#FF9933",  sub:"Unassigned grievances" },
    { label:"Active Assigned",  value: assigned.length,    icon:"🔧", color:"#60a5fa",  sub:"Work crew in progress" },
    { label:"Total Volunteers", value: volunteers.length,  icon:"👷", color:"#a78bfa",  sub:`${activeVols.length} active in field` },
    { label:"Available Staff",  value: volunteers.length - activeVols.length, icon:"🟢", color:"#34d399", sub:"Ready for assignment" },
  ];

  return (
    <div style={{ padding: "20px 16px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="section-label">Municipal Grievance Matrix</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:14 }}>
          {stats.map((s,i) => (
            <div key={i} className="stat-card" style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
              <span style={{ fontSize:22, marginTop:2 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{s.label}</div>
                <div style={{ fontSize:28, fontWeight:900, color:s.color, fontFamily:"'JetBrains Mono',monospace", lineHeight:1.1, marginTop:2 }}>{s.value}</div>
                <div style={{ fontSize:10, color:"#64748b", marginTop:3 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:14, marginBottom: 24 }}>
        {[
          { id:"assign",    icon:"👷", label:"Assign Field Tasks", sub:`${pending.length} awaiting deployment`,  color:"#FF9933" },
          { id:"pending",   icon:"⏳", label:"Active Tasks in Progress", sub:`${assigned.length} currently active`, color:"#60a5fa" },
          { id:"resolved",  icon:"✅", label:"Resolved History", sub:`${resolved.length} cases completed`,      color:"#10B981" },
          { id:"volunteers",icon:"👥", label:"Volunteer Directory", sub:`${volunteers.length} verified members`,    color:"#a78bfa" },
        ].map(n => (
          <div key={n.id} className="card" onClick={() => setView(n.id)}
            style={{ padding:18, cursor:"pointer", display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:26 }}>{n.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:n.color }}>{n.label}</div>
              <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>{n.sub}</div>
            </div>
            <span style={{ color:"#FF9933", fontSize:16 }}>&rarr;</span>
          </div>
        ))}
      </div>

      {complaints.slice(0,6).length > 0 && (
        <div>
          <div className="section-label">Latest Registered Complaints</div>
          <div className="card" style={{ overflow:"hidden" }}>
            {complaints.slice(0,6).map((c,i) => (
              <div key={c._id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom: i<5 ? "1px solid rgba(255,255,255,0.04)" : "none", flexWrap:"wrap" }}>
                <span style={{ fontSize:18 }}>{categoryIcon(c.category)}</span>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }} className="serif">{c.title}</div>
                  <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>📍 {c.location} &bull; {timeAgo(c.createdAt)}</div>
                </div>
                <Badge label={c.status} className={statusColor(c.status)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BID CARD ─────────────────────────────────────────────────────────────────
function BidCard({ bid, rank, isAssigned, onAssign, canAssign, assigning }) {
  const vol = bid.volunteer;
  const score = Math.round(scoreApplicant(bid) * 100);
  const isTop = rank === 0;
  const initials = vol?.name ? vol.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "??";

  return (
    <div className="card" style={{
      padding:16, position:"relative",
      borderColor: isAssigned ? "rgba(16,185,129,0.6)" : isTop ? "rgba(255,153,51,0.6)" : undefined,
    }}>
      {isTop && !isAssigned && (
        <div style={{ position:"absolute", top:0, right:12, background:"#FF9933", color:"#050f1d", fontSize:9, fontWeight:900, padding:"2px 8px", borderRadius:"0 0 4px 4px", fontFamily:"'JetBrains Mono',monospace" }}>RECOMMENDED MATCH</div>
      )}
      {isAssigned && (
        <div style={{ position:"absolute", top:0, right:12, background:"#10B981", color:"#050f1d", fontSize:9, fontWeight:900, padding:"2px 8px", borderRadius:"0 0 4px 4px", fontFamily:"'JetBrains Mono',monospace" }}>ASSIGNED &check;</div>
      )}

      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, marginTop:4 }}>
        {bid.selfie
          ? <img src={bid.selfie} alt="selfie" style={{ width:42, height:42, objectFit:"cover", border:"2px solid rgba(255,153,51,0.4)", borderRadius:4, flexShrink:0 }} />
          : <div style={{ width:42, height:42, background:"#FF9933", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:"#050f1d", borderRadius:4, flexShrink:0 }}>{initials}</div>
        }
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:"white" }} className="serif">{vol?.name || "Unknown"}</div>
          <div style={{ fontSize:10, color:"#94a3b8" }}>{vol?.email}</div>
          <div style={{ fontSize:10, color:"#34d399", marginTop:2 }}>
            &check; {vol?.volunteerDetails?.totalTasksCompleted || 0} completed tasks
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:10 }}>
        {[
          { label:"Bid Amount", value:`₹${bid.estimatedAmount?.toLocaleString()}`, color:"#60a5fa" },
          { label:"Est. Days",  value:`${bid.estimatedDays}d`,                     color:"#f59e0b" },
          { label:"Suitability",value:`${score}%`,                                 color: isTop ? "#FF9933" : "#94a3b8" },
        ].map((m,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.03)", padding:"8px 10px", borderRadius:4 }}>
            <div style={{ fontSize:9, color:"#94a3b8", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace" }}>{m.label}</div>
            <div style={{ fontSize:14, fontWeight:900, color:m.color, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", padding:"8px 10px", marginBottom:12, fontSize:10, color:"#94a3b8", borderRadius:4 }}>
        🏦 Bank: {bid.bankDetails?.bankName} &bull; A/C: ••••{bid.bankDetails?.accountNumber?.slice(-4)} &bull; {bid.bankDetails?.accountHolder}
      </div>

      {canAssign && !isAssigned && (
        <button className="btn-primary" style={{ width:"100%" }}
          disabled={assigning}
          onClick={() => onAssign(bid._id, bid.volunteer._id)}>
          {assigning ? "Assigning..." : "Assign This Task &rarr;"}
        </button>
      )}
    </div>
  );
}

// ─── COMPLAINT DETAIL MODAL ───────────────────────────────────────────────────
function ComplaintModal({ complaint, onClose, onAssigned, onResolved }) {
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch(`${API}/volunteer/complaint/${complaint._id}/bids`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) setBids(data.bids);
      } catch (e) { console.error(e); }
      finally { setBidsLoading(false); }
    };
    fetchBids();
  }, [complaint._id]);

  const sorted = [...bids].sort((a,b) => scoreApplicant(b) - scoreApplicant(a));

  const handleAssign = async (bidId, volunteerId) => {
    setAssigning(true);
    try {
      const res = await fetch(`${API}/volunteer/assign`, {
        method:"POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ complaintId: complaint._id, volunteerId, bidId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onAssigned(complaint._id, data.complaint);
      onClose();
    } catch (e) { alert(e.message); }
    finally { setAssigning(false); }
  };

  const handleResolve = async () => {
    if (!window.confirm("Mark this complaint as resolved?")) return;
    setResolving(true);
    try {
      const res = await fetch(`${API}/volunteer/complaint/${complaint._id}/resolve`, {
        method:"PUT",
        headers: jsonHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onResolved(complaint._id, data.complaint);
      onClose();
    } catch (e) { alert(e.message); }
    finally { setResolving(false); }
  };

  const isAssignedTo = (bid) => complaint.assignedTo?._id === bid.volunteer?._id || complaint.assignedTo === bid.volunteer?._id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="tricolor" style={{ height:3 }} />

        {complaint.photo ? (
          <div style={{ width:"100%", height:200, overflow:"hidden", position:"relative" }}>
            <img src={complaint.photo} alt="complaint" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(10,25,47,0.95) 0%,transparent 60%)" }} />
            <div style={{ position:"absolute", bottom:16, left:18 }}>
              <div style={{ fontSize:10, color:"#FF9933", letterSpacing:"0.15em", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>
                #{complaint._id?.slice(-8).toUpperCase()}
              </div>
              <div className="serif" style={{ fontSize:18, fontWeight:700, color:"white" }}>{complaint.title}</div>
            </div>
            <button onClick={onClose} style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.6)", border:"1px solid rgba(255,255,255,0.2)", color:"white", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>&times;</button>
          </div>
        ) : (
          <div style={{ padding:"18px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10, color:"#FF9933", letterSpacing:"0.15em", fontFamily:"'JetBrains Mono',monospace" }}>#{complaint._id?.slice(-8).toUpperCase()}</div>
              <div className="serif" style={{ fontSize:18, fontWeight:700, color:"white", marginTop:2 }}>{complaint.title}</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"white", width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>&times;</button>
          </div>
        )}

        <div style={{ padding: 20 }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
            <Badge label={categoryLabel(complaint.category)} className="text-blue-400 bg-blue-950/40 border-blue-600/50" />
            <Badge label={complaint.status} className={statusColor(complaint.status)} />
            <span style={{ fontSize:11, color:"#94a3b8" }}>📍 {complaint.location}</span>
            <span style={{ fontSize:11, color:"#94a3b8" }}>🕐 {timeAgo(complaint.createdAt)}</span>
          </div>

          <p style={{ fontSize:12, color:"#cbd5e1", lineHeight:1.6, marginBottom:18 }}>{complaint.description}</p>

          {complaint.assignedTo && (
            <div style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.3)", padding:12, borderRadius:6, marginBottom:18, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <span style={{ fontSize:20 }}>🛡️</span>
              <div style={{ flex:1, minWidth:160 }}>
                <div style={{ fontSize:12, color:"#34d399", fontWeight:700 }}>Assigned To: {complaint.assignedTo?.name || "Volunteer"}</div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>{complaint.assignedTo?.email}</div>
              </div>
              {complaint.status === "assigned" && (
                <button className="btn-primary" onClick={handleResolve} disabled={resolving}>
                  {resolving ? "Resolving..." : "✅ Mark as Resolved"}
                </button>
              )}
            </div>
          )}

          <div className="section-label">
            Volunteer Applications ({bidsLoading ? "…" : bids.length})
          </div>

          {bidsLoading && <div style={{ textAlign:"center", color:"#94a3b8", fontSize:11, padding:20 }}>Loading bids…</div>}

          {!bidsLoading && bids.length === 0 && (
            <div style={{ textAlign:"center", color:"#94a3b8", fontSize:11, padding:24, border:"1px dashed #1c3c66", borderRadius:6 }}>
              No volunteer applications submitted yet for this grievance.
            </div>
          )}

          {!bidsLoading && sorted.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:12 }}>
              {sorted.map((bid, rank) => (
                <BidCard
                  key={bid._id}
                  bid={bid}
                  rank={rank}
                  isAssigned={isAssignedTo(bid)}
                  onAssign={handleAssign}
                  canAssign={complaint.status === "pending"}
                  assigning={assigning}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ASSIGN TASK VIEW ─────────────────────────────────────────────────────────
function AssignTaskView({ complaints, setComplaints, loading }) {
  const [filter, setFilter] = useState("pending");
  const [modal, setModal] = useState(null);

  const displayed = filter === "all" ? complaints : complaints.filter(c => c.status === filter);

  const handleAssigned = (complaintId, updated) => {
    setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, ...updated, status:"assigned" } : c));
  };
  const handleResolved = (complaintId, updated) => {
    setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, ...updated, status:"resolved" } : c));
  };

  return (
    <>
      {modal && (
        <ComplaintModal
          complaint={modal}
          onClose={() => setModal(null)}
          onAssigned={handleAssigned}
          onResolved={handleResolved}
        />
      )}

      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #1c3c66", background:"#071324", position:"sticky", top:56, zIndex:50, flexWrap:"wrap" }}>
        <div style={{ fontSize:11, color:"#FF9933", textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>Filter Tasks:</div>
        <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
          {["pending","assigned","resolved","all"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontSize:9, padding:"5px 12px", textTransform:"uppercase", letterSpacing:"0.08em",
              background: filter===f ? "#FF9933" : "transparent",
              color: filter===f ? "#050f1d" : "#94a3b8",
              border:`1px solid ${filter===f ? "#FF9933" : "#1c3c66"}`,
              borderRadius:4, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700,
            }}>{f}</button>
          ))}
        </div>
        <div style={{ marginLeft:"auto", fontSize:10, color:"#94a3b8", fontFamily:"'JetBrains Mono',monospace" }}>{displayed.length} complaints</div>
      </div>

      {loading && <div style={{ textAlign:"center", color:"#94a3b8", padding:40, fontSize:12 }}>Loading complaints…</div>}

      <div className="feed-grid">
        {displayed.map(c => (
          <div key={c._id} className="card" onClick={() => setModal(c)} style={{ overflow:"hidden", display:"flex", flexDirection:"column" }}>
            {c.photo ? (
              <div style={{ position:"relative", width:"100%", height:160, overflow:"hidden" }}>
                <img src={c.photo} alt={c.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,#0f233d 0%,transparent 60%)" }} />
                <Badge label={c.status} className={`absolute top-3 right-3 ${statusColor(c.status)}`} />
              </div>
            ) : (
              <div style={{ height:100, background:"#071322", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, position:"relative" }}>
                {categoryIcon(c.category)}
                <Badge label={c.status} className={`absolute top-3 right-3 ${statusColor(c.status)}`} />
              </div>
            )}

            <div style={{ padding:16, flex:1, display:"flex", flexDirection:"column", justifyContent:"between" }}>
              <div>
                <div style={{ fontSize:9, color:"#FF9933", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>#{c._id?.slice(-6).toUpperCase()}</div>
                <h3 style={{ fontSize:13, fontWeight:700, color:"white", marginTop:4 }} className="serif">{c.title}</h3>
                <p style={{ fontSize:11, color:"#94a3b8", marginTop:4, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                  {c.description}
                </p>
                <div style={{ fontSize:10, color:"#64748b", marginTop:8 }}>📍 {c.location}</div>
              </div>

              <div style={{ marginTop:14, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:10, color:"#94a3b8" }}>{timeAgo(c.createdAt)}</span>
                <span style={{ fontSize:10, color:"#FF9933", fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>Review &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── PENDING / ACTIVE TASKS VIEW ──────────────────────────────────────────────
function PendingView({ complaints, setComplaints, loading }) {
  const active = complaints.filter(c => c.status === "assigned");

  const handleResolve = async (complaintId) => {
    if (!window.confirm("Mark this grievance as resolved?")) return;
    try {
      const res = await fetch(`${API}/volunteer/complaint/${complaintId}/resolve`, {
        method: "PUT", headers: jsonHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setComplaints(prev => prev.map(c =>
        c._id === complaintId ? { ...c, status: "resolved", resolvedAt: new Date() } : c
      ));
    } catch (e) { alert(e.message); }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>Loading active tasks…</div>;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div className="section-label">Assigned Work Orders</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Municipal tasks currently being resolved in the field</div>
        </div>
        <Badge label={`${active.length} active`} className="text-blue-400 bg-blue-950/40 border-blue-600/50" />
      </div>

      {active.length === 0 ? (
        <div style={{ textAlign: "center", color: "#94a3b8", padding: 60, border: "1px dashed #1c3c66", borderRadius: 8, fontSize: 12 }}>
          No active work orders currently assigned.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {active.map(c => (
            <div key={c._id} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {c.photo && (
                  <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                    <img src={c.photo} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#0f233d 0%,transparent 70%)" }} />
                  </div>
                )}
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 10, color: "#FF9933", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>#{c._id?.slice(-6).toUpperCase()}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginTop: 4 }} className="serif">{c.title}</h3>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>{c.description}</p>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 8 }}>📍 {c.location}</div>

                  {c.assignedTo && (
                    <div style={{ marginTop: 12, padding: 10, background: "#071322", borderRadius: 4, border: "1px solid #1c3c66" }}>
                      <div style={{ fontSize: 10, color: "#34d399", fontWeight: 700 }}>👷 Assigned: {c.assignedTo.name}</div>
                      <div style={{ fontSize: 9, color: "#94a3b8" }}>{c.assignedTo.email}</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>Assigned {timeAgo(c.updatedAt)}</span>
                <button className="btn-primary" onClick={() => handleResolve(c._id)}>
                  Mark Resolved &check;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── RESOLVED VIEW ────────────────────────────────────────────────────────────
function ResolvedView({ complaints, loading }) {
  const [search, setSearch] = useState("");
  const resolved = complaints.filter(c => c.status === "resolved");

  const filtered = useMemo(() => {
    if (!search) return resolved;
    const q = search.toLowerCase();
    return resolved.filter(r =>
      r.title?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r._id?.toLowerCase().includes(q) ||
      r.assignedTo?.name?.toLowerCase().includes(q)
    );
  }, [resolved, search]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>Loading resolved history…</div>;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div>
          <div className="section-label">Resolved Grievance Ledger</div>
          <div style={{ fontSize:11, color:"#94a3b8" }}>{resolved.length} total municipal issues successfully closed</div>
        </div>
        <div style={{ minWidth:240 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resolved records…"
          />
        </div>
      </div>

      <div className="card" style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #1c3c66", background:"rgba(255,153,51,0.05)" }}>
              {["ID / Title", "Category", "Location", "Volunteer", "Date Resolved"].map((h, i) => (
                <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:9, color:"#FF9933", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding:30, textAlign:"center", color:"#94a3b8", fontSize:11 }}>No matching records found.</td></tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:"#FF9933", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>#{r._id?.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:"white" }} className="serif">{r.title}</div>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <Badge label={categoryLabel(r.category)} className="text-blue-400 bg-blue-950/40 border-blue-600/50" />
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:11, color:"#cbd5e1" }}>📍 {r.location}</td>
                  <td style={{ padding:"12px 14px", fontSize:11, color:"#34d399" }}>
                    {r.assignedTo?.name || "Direct Municipal Action"}
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:10, color:"#94a3b8", fontFamily:"'JetBrains Mono',monospace" }}>
                    {r.resolvedAt ? new Date(r.resolvedAt).toLocaleDateString("en-IN") : "Completed"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── VOLUNTEERS DIRECTORY VIEW ────────────────────────────────────────────────
function VolunteersView() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API}/volunteer/all`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { if (d.success) setVolunteers(d.volunteers); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return volunteers;
    const q = search.toLowerCase();
    return volunteers.filter(v =>
      v.name?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.volunteerDetails?.skills?.some(s => s?.toLowerCase().includes(q))
    );
  }, [volunteers, search]);

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#94a3b8", fontSize:12 }}>Loading volunteer directory…</div>;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:16, padding:"20px 16px", maxWidth:1200, margin:"0 auto" }}>
      {/* Directory List */}
      <div className="card" style={{ overflow:"hidden", display:"flex", flexDirection:"column", maxHeight:"80vh" }}>
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #1c3c66", background:"#071324" }}>
          <div className="section-label">Verified Volunteers ({filtered.length})</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by name or domain skill…" />
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {filtered.map(v => (
            <div
              key={v._id}
              className={`vol-row ${selected?._id === v._id ? "active" : ""}`}
              onClick={() => setSelected(v)}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, background:"#FF9933", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#050f1d", borderRadius:4, flexShrink:0 }}>
                  {v.name?.slice(0,2).toUpperCase() || "VO"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"white" }} className="serif">{v.name}</div>
                  <div style={{ fontSize:10, color:"#94a3b8", truncate:true }}>{v.email}</div>
                </div>
                <Badge label={v.volunteerDetails?.isAvailable ? "Free" : "Active"} className={v.volunteerDetails?.isAvailable ? "text-emerald-400 bg-emerald-950/40 border-emerald-600/40" : "text-amber-400 bg-amber-950/40 border-amber-600/40"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Volunteer Detail */}
      <div className="card" style={{ padding:20 }}>
        {!selected ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", color:"#64748b", minHeight:200 }}>
            <span style={{ fontSize:40, marginBottom:8 }}>👷</span>
            <span style={{ fontSize:12, fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>Select a volunteer to inspect profile</span>
          </div>
        ) : (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:48, height:48, background:"#FF9933", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#050f1d", borderRadius:4 }}>
                {selected.name?.slice(0,2).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"white" }} className="serif">{selected.name}</h3>
                <p style={{ fontSize:11, color:"#94a3b8" }}>{selected.email}</p>
                {selected.phone && <p style={{ fontSize:11, color:"#94a3b8" }}>📱 {selected.phone}</p>}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              <div style={{ background:"#071322", padding:12, borderRadius:4, border:"1px solid #1c3c66" }}>
                <div style={{ fontSize:9, color:"#94a3b8", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace" }}>Tasks Completed</div>
                <div style={{ fontSize:20, fontWeight:900, color:"#34d399", fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>
                  {selected.volunteerDetails?.totalTasksCompleted || 0}
                </div>
              </div>
              <div style={{ background:"#071322", padding:12, borderRadius:4, border:"1px solid #1c3c66" }}>
                <div style={{ fontSize:9, color:"#94a3b8", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace" }}>Status</div>
                <div style={{ fontSize:14, fontWeight:700, color: selected.volunteerDetails?.isAvailable ? "#34d399" : "#FF9933", marginTop:4 }}>
                  {selected.volunteerDetails?.isAvailable ? "Available" : "Assigned"}
                </div>
              </div>
            </div>

            <div>
              <div className="section-label">Registered Skills</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {selected.volunteerDetails?.skills?.filter(Boolean).map(s => (
                  <Badge key={s} label={s} className="text-blue-400 bg-blue-950/40 border-blue-600/50" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function AuthorityDashboard() {
  const [view, setView] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, vRes] = await Promise.all([
        fetch(`${API}/complaint/all`, { headers: authHeaders() }),
        fetch(`${API}/volunteer/all`, { headers: authHeaders() }),
      ]);
      const [cData, vData] = await Promise.all([cRes.json(), vRes.json()]);
      if (cData.success) setComplaints(cData.complaints);
      if (vData.success) setVolunteers(vData.volunteers);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const counts = {
    pending:  complaints.filter(c => c.status === "pending").length,
    assigned: complaints.filter(c => c.status === "assigned").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  };

  const views = {
    dashboard: <DashboardView setView={setView} complaints={complaints} volunteers={volunteers} />,
    assign:    <AssignTaskView complaints={complaints} setComplaints={setComplaints} loading={loading} />,
    pending:   <PendingView complaints={complaints} setComplaints={setComplaints} loading={loading} />,
    resolved:  <ResolvedView complaints={complaints} loading={loading} />,
    volunteers:<VolunteersView />,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight:"100vh", background:"#050f1d" }}>
        <div className="tricolor" style={{ height:3 }} />
        <Navbar active={view} setView={setView} counts={counts} />
        <div className="gov-grid" style={{ minHeight:"calc(100vh - 60px)" }}>
          {views[view]}
        </div>
        <div className="tricolor" style={{ height:3 }} />
      </div>
    </>
  );
}
