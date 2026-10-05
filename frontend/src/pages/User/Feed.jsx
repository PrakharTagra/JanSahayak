import { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";

const categoryMap = {
  garbage:      "Sanitation",
  bad_road:     "Infrastructure",
  broken_light: "Electricity",
  waterlogging: "Water Supply",
  other:        "General",
};

// ── Volunteer Info Modal ───────────────────────────────────────────────────
function VolunteerInfoModal({ onClose }) {
  const steps = [
    { num: "01", title: "Visit JanSahayak Seva Kendra",      desc: "Locate your nearest JanSahayak municipal centre with a valid government ID.", icon: "🏛️" },
    { num: "02", title: "Fill Volunteer Enrolment Form",     desc: "Complete the V-REG form indicating your domain skills and ward availability.", icon: "📋" },
    { num: "03", title: "Skill & Verification Check",        desc: "Undergo a short verification based on chosen categories (Sanitation, Roads, Electricity).", icon: "📝" },
    { num: "04", title: "Authorized Account Activation",     desc: "Upon clearance, your account is upgraded to Volunteer status with authorized bidding access.", icon: "✅" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative bg-gov-navy border border-gov-border max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <div className="tricolor-bar-h h-1 w-full sticky top-0 z-10" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-gov-border">
            <div>
              <p className="text-[10px] font-mono text-gov-amber uppercase tracking-wider font-semibold">JanSahayak Citizen Action Network</p>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white">How to Become a Verified Volunteer</h2>
              <p className="text-xs text-gov-slate font-hindi">स्वयंसेवक कैसे बनें &bull; नागरिक सशक्तिकरण</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded border border-gov-border text-slate-400 hover:text-white flex items-center justify-center text-lg active:scale-95"
            >
              &times;
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-5">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3.5 border border-gov-border/70 bg-[#071526] p-3 rounded hover:border-gov-amber/40 transition">
                <div className="shrink-0 w-8 h-8 rounded bg-gov-amber/15 border border-gov-amber/30 text-gov-amber flex items-center justify-center text-sm font-bold">
                  {s.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-gov-amber font-bold">{s.num}</span>
                    <span className="text-xs font-bold text-white">{s.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gov-amber/30 bg-gov-amber/10 p-3 rounded text-xs text-amber-200/90 leading-relaxed mb-4">
            ℹ️ Verified volunteers can submit remediation bids on neighborhood complaints and receive municipal honorarium upon verified completion.
          </div>

          <button
            onClick={onClose}
            className="btn-gov-secondary w-full py-2.5 rounded text-xs font-mono uppercase tracking-wider font-bold"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Volunteer Apply Modal ──────────────────────────────────────────────────
function VolunteerApplyModal({ complaint, onClose, onSubmit }) {
  const [form, setForm] = useState({
    estimatedAmount: "", estimatedDays: "",
    bankName: "", accountNumber: "", ifsc: "", accountHolder: "",
    selfieFile: null, selfiePreview: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSelfie = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, selfieFile: file, selfiePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.selfieFile) {
      alert("Please upload your verification photograph.");
      return;
    }
    setSubmitting(true);
    const res = await onSubmit({ complaintId: complaint._id, ...form });
    setSubmitting(false);
    if (res?.success) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
        <div className="bg-gov-navy border border-emerald-600/50 max-w-sm w-full p-6 text-center rounded-lg shadow-2xl">
          <div className="tricolor-bar-h h-1 w-full mb-4" />
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-base font-bold font-serif text-white mb-1">Bid Submitted Successfully</h3>
          <p className="text-xs text-slate-300 font-sans mb-5 leading-relaxed">
            Your remediation proposal has been recorded. The authority will review your cost and timeline estimates.
          </p>
          <button
            onClick={onClose}
            className="btn-gov-primary w-full py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative bg-gov-navy border border-gov-border max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <div className="tricolor-bar-h h-1 w-full sticky top-0 z-10" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-gov-border">
            <div>
              <p className="text-[10px] font-mono text-gov-amber uppercase tracking-wider font-semibold">Volunteer Action Bidding</p>
              <h2 className="text-base font-bold font-serif text-white">Claim Grievance Resolution</h2>
              <p className="text-xs text-gov-slate truncate max-w-xs">{complaint.title}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded border border-gov-border text-slate-400 hover:text-white flex items-center justify-center text-lg active:scale-95"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Resolution Estimates */}
            <div>
              <p className="text-[10px] font-mono text-gov-amber uppercase tracking-wider font-semibold mb-2">
                1. Resolution Estimates
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">Estimated Cost (₹) *</label>
                  <input
                    name="estimatedAmount"
                    type="number"
                    placeholder="e.g. 1500"
                    value={form.estimatedAmount}
                    onChange={handleChange}
                    required
                    min={1}
                    className="w-full px-3 py-2 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:outline-none text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">Time to Resolve (Days) *</label>
                  <input
                    name="estimatedDays"
                    type="number"
                    placeholder="e.g. 3"
                    value={form.estimatedDays}
                    onChange={handleChange}
                    required
                    min={1}
                    max={30}
                    className="w-full px-3 py-2 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:outline-none text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <p className="text-[10px] font-mono text-gov-amber uppercase tracking-wider font-semibold mb-2 pt-2 border-t border-gov-border/60">
                2. Honorarium Remittance Details
              </p>
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 block mb-1">Account Holder Name *</label>
                    <input
                      name="accountHolder"
                      type="text"
                      placeholder="Name per bank"
                      value={form.accountHolder}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:outline-none text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 block mb-1">Bank Name *</label>
                    <input
                      name="bankName"
                      type="text"
                      placeholder="e.g. SBI, HDFC"
                      value={form.bankName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:outline-none text-white text-xs font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 block mb-1">Account Number *</label>
                    <input
                      name="accountNumber"
                      type="text"
                      placeholder="Account number"
                      value={form.accountNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:outline-none text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 block mb-1">IFSC Code *</label>
                    <input
                      name="ifsc"
                      type="text"
                      placeholder="e.g. SBIN0001234"
                      value={form.ifsc}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:outline-none text-white text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selfie Verification */}
            <div>
              <p className="text-[10px] font-mono text-gov-amber uppercase tracking-wider font-semibold mb-2 pt-2 border-t border-gov-border/60">
                3. Identity Verification
              </p>
              <label className="flex items-center gap-3 cursor-pointer border border-dashed border-gov-border hover:border-gov-amber/60 transition p-3.5 rounded bg-[#050f1d]">
                {form.selfiePreview ? (
                  <>
                    <img src={form.selfiePreview} alt="Volunteer Preview" className="w-12 h-12 rounded object-cover border border-gov-border" />
                    <span className="text-xs font-mono text-emerald-400 font-semibold">Photograph selected ✓ (click to change)</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">📸</span>
                    <span className="text-xs text-slate-300">Click to upload live verification selfie *</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleSelfie} />
              </label>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-gov-secondary flex-1 py-2.5 rounded text-xs font-mono uppercase tracking-wider font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-gov-primary flex-1 py-2.5 rounded text-xs font-mono uppercase tracking-wider font-bold shadow-gov-btn disabled:opacity-60"
              >
                {submitting ? "Submitting Bid..." : "Submit Proposal &rarr;"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── MAIN FEED COMPONENT ────────────────────────────────────────────────────
export default function Feed() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("upvotes"); // "upvotes" | "newest"
  const [appliedComplaints, setAppliedComplaints] = useState(new Set());
  const [infoModal, setInfoModal] = useState(false);
  const [applyModal, setApplyModal] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isVolunteer = user?.isVolunteer === true;
  const currentUserId = user?._id || user?.id;
  const volunteerSkills = user?.volunteerDetails?.skills || [];

  useEffect(() => {
    fetchComplaints();
    if (isVolunteer) {
      fetchMyBids();
    }
  }, [sortBy]);

  const fetchMyBids = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/volunteer/my-bids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.bids)) {
        setAppliedComplaints(new Set(data.bids.map(b => b.complaint?._id || b.complaint)));
      }
    } catch (err) {
      console.error("Failed to fetch volunteer bids", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/complaint/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.complaints)) {
        const sorted = [...data.complaints]
          .filter(c => c.status !== "resolved" && c.status !== "assigned")
          .sort((a, b) =>
            sortBy === "upvotes"
              ? (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
              : new Date(b.createdAt) - new Date(a.createdAt)
          );
        setComplaints(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch feed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (complaintId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/complaint/${complaintId}/upvote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => prev.map(c =>
          c._id === complaintId
            ? { ...c, upvotes: data.upvoted ? [...(c.upvotes || []), currentUserId] : (c.upvotes || []).filter(id => id !== currentUserId) }
            : c
        ));
      }
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  const handleVolunteerSubmit = async (payload) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (k === "selfieFile" || k === "selfiePreview") return;
        formData.append(k, v);
      });
      if (payload.selfieFile) {
        formData.append("selfie", payload.selfieFile);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/volunteer/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAppliedComplaints(prev => new Set([...prev, payload.complaintId]));
        return { success: true };
      } else {
        alert(data.message || "Failed to submit bid proposal.");
        return { success: false };
      }
    } catch (err) {
      console.error("Apply bid failed", err);
      alert("Application submission failed.");
      return { success: false };
    }
  };

  const isUpvoted = (c) => c.upvotes?.includes(currentUserId);

  const timeAgo = (dateStr) => {
    if (!dateStr) return "Just now";
    const diff = Date.now() - new Date(dateStr);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderVolunteerButton = (post) => {
    if (!isVolunteer) {
      return (
        <button
          onClick={() => setInfoModal(true)}
          className="text-[11px] font-mono text-gov-amber hover:underline px-2.5 py-1 rounded border border-gov-amber/40 bg-gov-amber/10 flex items-center gap-1 active:scale-95"
        >
          <span>🙋</span> Become a Volunteer
        </button>
      );
    }

    const requiredSkill = (post.category || "").toLowerCase().trim();
    const categoryMatches = volunteerSkills.some(s => s?.toLowerCase() === requiredSkill);

    if (!categoryMatches) {
      return (
        <span
          className="text-[10px] font-mono text-gov-slate px-2.5 py-1 rounded border border-gov-border bg-[#050f1d] cursor-not-allowed opacity-75"
          title={`Category not covered by your approved skills (${post.category})`}
        >
          Skill Mismatch
        </span>
      );
    }

    if (appliedComplaints.has(post._id)) {
      return (
        <span className="text-[10px] font-mono text-emerald-400 px-2.5 py-1 rounded border border-emerald-600/40 bg-emerald-950/30 flex items-center gap-1">
          ✓ Proposal Logged
        </span>
      );
    }

    return (
      <button
        onClick={() => setApplyModal(post)}
        className="btn-gov-primary px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95"
      >
        <span>👷</span> Submit Bid
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col lg:flex-row">
      {/* Modal Dialogs */}
      {infoModal && <VolunteerInfoModal onClose={() => setInfoModal(false)} />}
      {applyModal && <VolunteerApplyModal complaint={applyModal} onClose={() => setApplyModal(null)} onSubmit={handleVolunteerSubmit} />}

      <UserSidebar />

      <div className="lg:pl-72 w-full flex-1 flex flex-col min-h-screen pt-14 lg:pt-0">
        <div className="tricolor-bar-h h-1 w-full shrink-0" />

        {/* Top Header Bar */}
        <div className="bg-gov-navy border-b border-gov-border px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div>
            <h1 className="text-base sm:text-lg font-bold font-serif text-white leading-tight">
              Community Grievance Feed
            </h1>
            <p className="text-[10px] sm:text-xs text-gov-slate font-hindi">
              सार्वजनिक शिकायत फीड &bull; Live Community Issues in Your Ward
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isVolunteer && (
              <span className="border border-emerald-600/50 bg-emerald-950/40 text-emerald-300 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded">
                🛡️ Verified Volunteer
              </span>
            )}
            <span className="border border-gov-amber/40 bg-gov-amber/10 text-gov-amber text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded">
              📡 Public Stream
            </span>
          </div>
        </div>

        {/* Main Feed Content */}
        <main className="flex-1 gov-pattern p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Sort & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-border/60 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-gov-slate uppercase tracking-wider">Order By:</span>
                <div className="flex gap-1.5 p-1 bg-[#050f1d] border border-gov-border rounded">
                  <button
                    onClick={() => setSortBy("upvotes")}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      sortBy === "upvotes" ? "bg-gov-amber text-white shadow-sm" : "text-gov-slate hover:text-white"
                    }`}
                  >
                    🔥 Most Upvoted
                  </button>
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      sortBy === "newest" ? "bg-gov-amber text-white shadow-sm" : "text-gov-slate hover:text-white"
                    }`}
                  >
                    🕒 Most Recent
                  </button>
                </div>
              </div>

              <p className="text-xs text-gov-slate font-mono">
                Showing {complaints.length} active civic issues
              </p>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-gov-amber border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-gov-slate">Loading Community Grievance Stream…</p>
              </div>
            )}

            {/* Complaints List */}
            {!loading && (
              <div className="space-y-4">
                {complaints.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-gov-border rounded-lg bg-gov-card/40">
                    <p className="text-3xl mb-2">🎉</p>
                    <p className="text-sm font-semibold text-white">No Unresolved Complaints Found</p>
                    <p className="text-xs text-gov-slate mt-1 max-w-sm mx-auto">
                      All grievances in your locality have either been resolved or are currently assigned to municipal work crews.
                    </p>
                  </div>
                ) : (
                  complaints.map((post) => (
                    <article
                      key={post._id}
                      className="border border-gov-border hover:border-gov-amber/60 bg-gov-card rounded-lg overflow-hidden transition-all duration-200 shadow-gov-card flex flex-col"
                    >
                      {/* Photo Header (if photo attached) */}
                      {post.photo && (
                        <div className="relative h-48 sm:h-56 overflow-hidden bg-black/40">
                          <img
                            src={post.photo}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-80 hover:opacity-95 transition-opacity duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gov-card via-transparent" />
                          <span className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-600/50 text-amber-300 px-2.5 py-1 rounded shadow">
                            Pending Remediation
                          </span>
                        </div>
                      )}

                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Metadata row */}
                          <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] font-mono">
                            <span className="font-bold text-gov-amber bg-gov-amber/10 border border-gov-amber/30 px-2 py-0.5 rounded">
                              JS-{post._id?.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-slate-300 bg-[#050f1d] border border-gov-border px-2 py-0.5 rounded uppercase">
                              {post.category?.replace(/_/g, " ")}
                            </span>
                            <span className="text-gov-muted ml-auto">
                              {timeAgo(post.createdAt)}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold font-serif text-white leading-snug">
                            {post.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                            {post.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gov-slate mt-3 pt-3 border-t border-gov-border/60">
                            <span className="flex items-center gap-1 truncate max-w-xs">
                              📍 <span>{post.location}</span>
                            </span>
                            {post.postedBy?.name && (
                              <span className="flex items-center gap-1 font-mono text-[11px] text-gov-muted">
                                👤 Reported by {post.postedBy.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gov-border/60">
                          {/* Upvote Button */}
                          <button
                            type="button"
                            onClick={() => handleUpvote(post._id)}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-bold border transition-all active:scale-95 ${
                              isUpvoted(post)
                                ? "border-gov-amber bg-gov-amber/20 text-gov-amber shadow-sm"
                                : "border-gov-border text-slate-300 hover:border-gov-amber/60 hover:text-white bg-[#050f1d]"
                            }`}
                          >
                            <span>▲</span>
                            <span>{isUpvoted(post) ? "Upvoted" : "Upvote"}</span>
                            <span className="bg-black/30 px-1.5 py-0.5 rounded text-gov-amber font-mono">
                              {post.upvotes?.length || 0}
                            </span>
                          </button>

                          {/* Volunteer action */}
                          <div className="flex items-center gap-2">
                            {renderVolunteerButton(post)}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            <div className="border border-gov-border bg-gov-card/60 rounded-md py-3 px-4 text-center text-xs text-gov-slate font-mono">
              Municipal Grievance Cell &bull; Call <strong className="text-gov-amber">1800-11-2026</strong> for urgent emergency escalations
            </div>
          </div>
        </main>

        <div className="tricolor-bar-h h-1 w-full shrink-0" />
      </div>
    </div>
  );
}
