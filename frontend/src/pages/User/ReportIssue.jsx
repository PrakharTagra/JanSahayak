import { useState } from "react";
import UserSidebar from "../../components/UserSidebar";

const CATEGORIES = [
  { value: "garbage", label: "Garbage & Waste Disposal", icon: "🗑️" },
  { value: "bad_road", label: "Pothole & Bad Roads", icon: "🕳️" },
  { value: "broken_light", label: "Broken Streetlight", icon: "💡" },
  { value: "waterlogging", label: "Waterlogging & Drainage", icon: "🌊" },
  { value: "other", label: "Other Civic Grievance", icon: "📌" },
];

export default function ReportIssue() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [aiInfo, setAiInfo] = useState(null);

  // Real GPS Geolocation handler
  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coordsStr = `GPS: ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E`;
        setLocation(coordsStr);
        setLoadingGPS(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        alert("Unable to retrieve location. Please check location permissions or type address manually.");
        setLoadingGPS(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please confirm the citizen declaration before submitting.");
      return;
    }

    if (!category) {
      alert("Please select an issue category.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in first to file a complaint.");
      window.location.href = "/login";
      return;
    }

    try {
      setLoadingSubmit(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("location", location);
      formData.append("category", category);

      if (file) {
        formData.append("photo", file);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/complaint/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (response.ok && data.success) {
        setComplaintId(data.complaint?._id ? `JS-${data.complaint._id.slice(-6).toUpperCase()}` : `JS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
        setSubmitted(true);
      } else {
        alert(data.message || "Failed to submit grievance. Please verify details and try again.");
      }

    } catch (error) {
      console.error("ERROR:", error);
      alert("Submission error: " + error.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Reset form to file another complaint
  const handleReset = () => {
    setTitle("");
    setDesc("");
    setLocation("");
    setCategory("");
    setFile(null);
    setFilePreview(null);
    setAgreed(false);
    setAiInfo(null);
    setSubmitted(false);
  };

  // ── SUBMISSION SUCCESS VIEW ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col lg:flex-row">
        <UserSidebar />
        <div className="lg:pl-72 w-full flex-1 flex flex-col min-h-screen pt-14 lg:pt-0">
          <div className="tricolor-bar-h h-1 w-full shrink-0" />
          
          <main className="flex-1 gov-pattern flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-md w-full text-center border border-gov-border bg-gov-card p-6 sm:p-8 rounded-lg shadow-gov-card">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-500 bg-emerald-950/40 text-emerald-400 text-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                ✓
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-600/40 px-3 py-1 rounded">
                Grievance Registered Successfully
              </span>

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-3">
                Complaint Registered
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Your grievance has been officially recorded in the municipal registry and dispatched to the concerned department for inspection.
              </p>

              <div className="mt-5 border border-gov-amber/40 bg-[#071322] p-4 rounded-md text-center">
                <p className="text-[10px] font-mono text-gov-slate uppercase tracking-wider">Formal Tracking Reference</p>
                <p className="text-xl sm:text-2xl font-black font-mono text-gov-amber mt-1 tracking-wider">{complaintId}</p>
                <p className="text-[10px] text-gov-muted font-mono mt-1">Keep this ID for future tracking & queries</p>
              </div>

              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                An acknowledgement receipt has been logged. You will receive updates as the municipal engineer evaluates the issue.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={handleReset}
                  className="btn-gov-primary flex-1 py-3 rounded text-xs font-mono font-bold uppercase tracking-wider shadow-gov-btn"
                >
                  File Another Grievance
                </button>
                <button
                  onClick={() => window.location.href = "/user/myreports"}
                  className="btn-gov-secondary flex-1 py-3 rounded text-xs font-mono font-semibold uppercase tracking-wider"
                >
                  Track in My Reports &rarr;
                </button>
              </div>
            </div>
          </main>

          <div className="tricolor-bar-h h-1 w-full shrink-0" />
        </div>
      </div>
    );
  }

  // ── MAIN FORM VIEW ──
  return (
    <div className="min-h-screen bg-gov-dark text-slate-100 flex flex-col lg:flex-row">
      <UserSidebar />

      <div className="lg:pl-72 w-full flex-1 flex flex-col min-h-screen pt-14 lg:pt-0">
        <div className="tricolor-bar-h h-1 w-full shrink-0" />

        {/* Top Header */}
        <div className="bg-gov-navy border-b border-gov-border px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div>
            <h1 className="text-base sm:text-lg font-bold font-serif text-white leading-tight">
              File a Civic Grievance
            </h1>
            <p className="text-[10px] sm:text-xs text-gov-slate font-hindi">
              नागरिक शिकायत पंजीकरण &bull; JanSahayak Public Portal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-gov-amber/40 bg-gov-amber/10 text-gov-amber text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded">
              📋 New Representation
            </span>
          </div>
        </div>

        {/* Form Container */}
        <main className="flex-1 gov-pattern p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Info Notice */}
            <div className="border border-gov-border bg-gov-card/80 p-3.5 sm:p-4 rounded-lg text-xs text-slate-300 leading-relaxed shadow-sm">
              ℹ️ Mandatory fields are indicated with <span className="text-gov-amber font-bold">*</span>. Attaching clear photographs expedites field inspections and verification by ward engineers.
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── SECTION 1: Issue Details ── */}
              <div className="border border-gov-border bg-gov-card rounded-lg overflow-hidden shadow-gov-card">
                <div className="border-b border-gov-border/80 px-5 py-3 flex items-center gap-2.5 bg-[#071526]">
                  <span className="w-6 h-6 rounded bg-gov-amber/20 text-gov-amber font-mono font-bold text-xs flex items-center justify-center">01</span>
                  <span className="text-white font-bold text-sm">Issue Information</span>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-semibold">
                      Complaint Title <span className="text-gov-amber">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Brief descriptive title (e.g. Open manhole on Sector 14 Main Road)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      maxLength={100}
                      className="w-full px-3.5 py-2.5 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:ring-1 focus:ring-gov-amber focus:outline-none text-white placeholder-slate-500 text-sm font-sans transition"
                    />
                    <div className="flex justify-between text-[10px] text-gov-muted font-mono mt-1">
                      <span>Be specific about the nature of the hazard</span>
                      <span>{title.length}/100</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-semibold">
                      Detailed Problem Description <span className="text-gov-amber">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe the issue in detail: when did it start, how severe is it, and does it cause traffic or safety risks..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      required
                      maxLength={500}
                      className="w-full px-3.5 py-2.5 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:ring-1 focus:ring-gov-amber focus:outline-none text-white placeholder-slate-500 text-sm font-sans transition resize-none"
                    />
                    <div className="flex justify-between text-[10px] text-gov-muted font-mono mt-1">
                      <span>Include landmark descriptions if possible</span>
                      <span>{desc.length}/500</span>
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider font-semibold">
                        Grievance Category <span className="text-gov-amber">*</span>
                      </label>
                      {loadingAI && (
                        <span className="text-[10px] font-mono text-gov-amber flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 border-2 border-gov-amber border-t-transparent rounded-full animate-spin" />
                          AI analyzing photo...
                        </span>
                      )}
                    </div>

                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setAiInfo(null);
                      }}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:ring-1 focus:ring-gov-amber focus:outline-none text-white text-sm font-sans transition"
                    >
                      <option value="" disabled className="bg-[#050f1d] text-slate-500">
                        -- Select Category (or attach photo for AI auto-detection) --
                      </option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-gov-card text-white">
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>

                    {/* AI auto-detection feedback notice */}
                    {aiInfo && (
                      <div className={`mt-2 p-2.5 rounded text-xs font-mono border flex items-center gap-2 ${
                        aiInfo.type === 'success' 
                          ? "bg-emerald-950/40 border-emerald-600/50 text-emerald-300"
                          : "bg-amber-950/40 border-amber-600/50 text-amber-300"
                      }`}>
                        <span>{aiInfo.type === 'success' ? '✨' : 'ℹ️'}</span>
                        <span>{aiInfo.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: Location & Evidence ── */}
              <div className="border border-gov-border bg-gov-card rounded-lg overflow-hidden shadow-gov-card">
                <div className="border-b border-gov-border/80 px-5 py-3 flex items-center gap-2.5 bg-[#071526]">
                  <span className="w-6 h-6 rounded bg-gov-amber/20 text-gov-amber font-mono font-bold text-xs flex items-center justify-center">02</span>
                  <span className="text-white font-bold text-sm">Location & Photographic Evidence</span>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {/* Location Input */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-semibold">
                      Street Address / Location <span className="text-gov-amber">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Street, Landmark, Ward Number, City"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="flex-1 px-3.5 py-2.5 bg-[#050f1d] border border-gov-border rounded focus:border-gov-amber focus:ring-1 focus:ring-gov-amber focus:outline-none text-white placeholder-slate-500 text-sm font-sans transition"
                      />
                      <button
                        type="button"
                        onClick={handleGPS}
                        disabled={loadingGPS}
                        className="btn-gov-secondary px-4 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-60"
                      >
                        {loadingGPS ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-gov-amber border-t-transparent rounded-full animate-spin" />
                            <span>Locating...</span>
                          </>
                        ) : (
                          <>
                            <span>📍</span>
                            <span>Auto-Fill GPS</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-gov-muted font-mono mt-1">
                      Accurate location ensures the designated ward officer inspects the right site.
                    </p>
                  </div>

                  {/* Photo Upload with Preview */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-semibold">
                      Photographic Evidence (Recommended for Fast Redressal)
                    </label>
                    <div className="relative">
                      <label
                        htmlFor="evidence-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gov-border hover:border-gov-amber/70 bg-[#050f1d] hover:bg-gov-amber/[0.02] transition-all cursor-pointer rounded-lg p-6 gap-2 text-center"
                      >
                        {filePreview ? (
                          <div className="flex flex-col items-center gap-2">
                            <img src={filePreview} alt="Evidence Preview" className="w-32 h-24 object-cover rounded border border-gov-border shadow-sm" />
                            <span className="text-xs font-mono text-emerald-400 font-semibold">
                              ✓ {file?.name} (Click to change)
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className="text-3xl">📷</span>
                            <span className="text-xs sm:text-sm font-semibold text-white">
                              Click to select photograph or capture on mobile camera
                            </span>
                            <span className="text-[11px] text-gov-slate font-mono">
                              JPG, PNG, WEBP up to 5 MB &bull; Automated AI inspection enabled
                            </span>
                          </>
                        )}
                      </label>

                      {/* AI analyzing overlay */}
                      {loadingAI && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-2 z-10">
                          <div className="w-8 h-8 border-3 border-gov-amber border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs font-mono font-bold text-gov-amber">
                            AI Computer Vision Analyzing Image...
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      id="evidence-upload"
                      type="file"
                      accept="image/*"
                      disabled={loadingAI}
                      className="hidden"
                      onChange={async (e) => {
                        const selectedFile = e.target.files?.[0];
                        if (!selectedFile) return;

                        setFile(selectedFile);
                        setFilePreview(URL.createObjectURL(selectedFile));

                        try {
                          setLoadingAI(true);
                          setAiInfo(null);

                          const formData = new FormData();
                          formData.append("image", selectedFile);

                          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/classify`, {
                            method: "POST",
                            body: formData,
                          });

                          const text = await res.text();
                          let data;
                          try {
                            data = JSON.parse(text);
                          } catch {
                            throw new Error("Invalid AI response");
                          }

                          if (res.ok && data.success && data.category) {
                            setCategory(data.category);
                            setAiInfo({
                              type: "success",
                              text: `AI Auto-Detected: ${data.category.toUpperCase().replace(/_/g, " ")} (${Math.round(data.confidence || 0)}% confidence). Category updated.`
                            });
                          } else {
                            setAiInfo({
                              type: "warn",
                              text: data.message || "AI vision warming up. Please verify the category manually above."
                            });
                          }
                        } catch (err) {
                          console.warn("AI Notice:", err);
                          setAiInfo({
                            type: "warn",
                            text: "AI service is warming up. Please verify category manually above."
                          });
                        } finally {
                          setLoadingAI(false);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: Citizen Declaration ── */}
              <div className="border border-gov-border bg-gov-card rounded-lg overflow-hidden shadow-gov-card">
                <div className="border-b border-gov-border/80 px-5 py-3 flex items-center gap-2.5 bg-[#071526]">
                  <span className="w-6 h-6 rounded bg-gov-amber/20 text-gov-amber font-mono font-bold text-xs flex items-center justify-center">03</span>
                  <span className="text-white font-bold text-sm">Citizen Declaration</span>
                </div>

                <div className="p-4 sm:p-6">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gov-border text-gov-amber focus:ring-gov-amber shrink-0"
                    />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      I solemnly affirm that the details and photographic proof submitted above are genuine and relate to an actual public infrastructure problem. I understand that submitting malicious or counterfeit complaints is prohibited under municipal rules.
                    </p>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loadingAI || loadingSubmit}
                className="btn-gov-primary w-full py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider font-mono flex items-center justify-center gap-2 shadow-gov-btn disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingSubmit ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Grievance to Municipal Registry...</span>
                  </>
                ) : (
                  <span>Submit Formal Grievance &rarr;</span>
                )}
              </button>
            </form>

            <div className="border border-gov-border bg-gov-card/60 rounded-md py-3 px-4 text-center text-xs text-gov-slate font-mono">
              Municipal Grievance Cell &bull; Call <strong className="text-gov-amber">1800-11-2026</strong> for urgent emergency escalations
            </div>
          </div>
        </main>

        <div className="tricolor-bar-h h-1 w-full shrink-0" />
      </div>

      {/* Fullscreen Submission Loader Overlay */}
      {loadingSubmit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gov-navy border border-gov-border p-6 rounded-lg max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-gov-amber border-t-transparent rounded-full animate-spin" />
            <h3 className="text-white font-bold font-serif text-sm">Registering Complaint</h3>
            <p className="text-xs text-gov-slate leading-relaxed">
              Encrypting metadata and routing grievance to municipal authority database…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
