"use client";
import { useEffect, useState, useCallback } from "react";

interface Completion {
  id: number;
  user_id: number;
  user_name: string;
  email: string;
  trust_score: number;
  task_title: string;
  category: string;
  mission_type: string;
  proof_type: string;
  proof_value: string | null;
  completed_at: string;
  status: string;
  rejection_reason: string | null;
  reward: number;
  xp_reward: number;
}

const TH: React.CSSProperties = { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #eee", whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "12px 14px", fontSize: 13, color: "#333", borderBottom: "1px solid #f5f5f5", verticalAlign: "middle" };

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "#fff8e1", color: "#e67e22" },
  approved: { bg: "#e8f5e9", color: "#2e7d32" },
  rejected: { bg: "#fce4ec", color: "#c62828" },
};

const MISSION_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  engagement:    { bg: "#e3f2fd", color: "#1565c0", label: "Engagement" },
  participation: { bg: "#fff8e1", color: "#e67e22", label: "Participation" },
  premium:       { bg: "#f3e5f5", color: "#7b1fa2", label: "Premium" },
};

const REJECTION_REASONS = [
  "Screenshot does not match task requirement",
  "Username not visible in screenshot",
  "Task not completed correctly",
  "Duplicate or reused submission",
  "Suspicious activity detected",
  "Profile link does not match",
];

function ProofCell({ type, value }: { type: string; value: string | null }) {
  if (!value) return <span style={{ color: "#ccc" }}>—</span>;
  if (value === "[screenshot uploaded]" || value.startsWith("[")) {
    return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: "#e8f5e9", color: "#2e7d32" }}>📸 Screenshot</span>;
  }
  if (type === "url") {
    return <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#1565c0", fontSize: 12, wordBreak: "break-all" }}>{value.length > 40 ? value.slice(0, 40) + "…" : value}</a>;
  }
  return <span style={{ fontSize: 12, color: "#555" }}>{value.length > 50 ? value.slice(0, 50) + "…" : value}</span>;
}

function TrustBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#2e7d32" : score >= 50 ? "#e67e22" : "#c62828";
  const bg    = score >= 80 ? "#e8f5e9" : score >= 50 ? "#fff8e1" : "#fce4ec";
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: bg, color }}>{score}%</span>;
}

export default function CompletionsPage() {
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [proofFilter, setProofFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: number; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  const fetchCompletions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (proofFilter) params.set("proof_type", proofFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/completions?${params}`);
      const data = await res.json();
      setCompletions(data.completions ?? []);
      setTotal(data.total ?? 0);
    } finally { setLoading(false); }
  }, [page, proofFilter, statusFilter]);

  useEffect(() => { fetchCompletions(); }, [fetchCompletions]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    await fetch("/api/admin/completions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completionId: id, action: "approve" }) });
    setActionLoading(null);
    fetchCompletions();
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id);
    const reason = customReason.trim() || rejectReason;
    await fetch("/api/admin/completions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completionId: rejectModal.id, action: "reject", rejectionReason: reason }) });
    setActionLoading(null);
    setRejectModal(null);
    setCustomReason("");
    fetchCompletions();
  };

  const totalPages = Math.ceil(total / 30);
  const pendingCount = completions.filter(c => c.status === "pending").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: "#1A1A1A" }}>Mission Submissions</h1>
          <p style={{ margin: 0, color: "#888", fontSize: 13 }}>{total.toLocaleString()} total · {pendingCount} pending review</p>
        </div>
        {statusFilter === "pending" && pendingCount > 0 && (
          <div style={{ background: "#fff8e1", border: "1px solid #f5a623", borderRadius: 10, padding: "8px 16px", fontSize: 13, color: "#e67e22", fontWeight: 600 }}>
            ⚠️ {pendingCount} awaiting review
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {[{ val: "pending", label: "Pending" }, { val: "approved", label: "Approved" }, { val: "rejected", label: "Rejected" }, { val: "", label: "All" }].map(f => (
          <button key={f.val} onClick={() => { setStatusFilter(f.val); setPage(1); }}
            style={{ padding: "7px 16px", borderRadius: 20, border: "1.5px solid", borderColor: statusFilter === f.val ? "#1AEF22" : "#e0e0e0", background: statusFilter === f.val ? "#1AEF22" : "#fff", color: statusFilter === f.val ? "#fff" : "#666", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            {f.label}
          </button>
        ))}
        <div style={{ width: 1, background: "#eee", margin: "0 4px" }} />
        {["", "screenshot", "url", "text"].map(f => (
          <button key={f} onClick={() => { setProofFilter(f); setPage(1); }}
            style={{ padding: "7px 14px", borderRadius: 20, border: "1.5px solid", borderColor: proofFilter === f ? "#555" : "#e0e0e0", background: proofFilter === f ? "#555" : "#fff", color: proofFilter === f ? "#fff" : "#888", cursor: "pointer", fontSize: 12 }}>
            {f === "" ? "All Proof" : f}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={TH}>ID</th>
              <th style={TH}>User / Trust</th>
              <th style={TH}>Mission</th>
              <th style={TH}>Type</th>
              <th style={TH}>Reward</th>
              <th style={TH}>Proof</th>
              <th style={TH}>Status</th>
              <th style={TH}>Date</th>
              <th style={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ ...TD, textAlign: "center", color: "#aaa", padding: 40 }}>Loading…</td></tr>
            ) : completions.length === 0 ? (
              <tr><td colSpan={9} style={{ ...TD, textAlign: "center", color: "#aaa", padding: 40 }}>No submissions found</td></tr>
            ) : completions.map(c => {
              const mt = MISSION_COLORS[c.mission_type] ?? MISSION_COLORS.engagement;
              return (
                <tr key={c.id} style={{ background: c.status === "pending" ? "#fffdf5" : "white" }}>
                  <td style={{ ...TD, color: "#aaa" }}>{c.id}</td>
                  <td style={TD}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.user_name}</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginBottom: 3 }}>{c.email}</div>
                    <TrustBadge score={c.trust_score ?? 100} />
                  </td>
                  <td style={{ ...TD, maxWidth: 180 }}>
                    <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.task_title}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{c.category}</div>
                    {c.rejection_reason && <div style={{ fontSize: 11, color: "#c62828", marginTop: 2 }}>↳ {c.rejection_reason}</div>}
                  </td>
                  <td style={TD}>
                    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: mt.bg, color: mt.color }}>{mt.label}</span>
                  </td>
                  <td style={TD}>
                    <div style={{ fontWeight: 700, color: "#2e7d32", fontSize: 13 }}>{c.reward?.toLocaleString()} QLT</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>+{c.xp_reward ?? 10} XP</div>
                  </td>
                  <td style={{ ...TD, maxWidth: 200 }}><ProofCell type={c.proof_type} value={c.proof_value} /></td>
                  <td style={TD}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: (STATUS_COLORS[c.status] ?? STATUS_COLORS.pending).bg, color: (STATUS_COLORS[c.status] ?? STATUS_COLORS.pending).color }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ ...TD, color: "#888", whiteSpace: "nowrap", fontSize: 12 }}>
                    {new Date(c.completed_at).toLocaleDateString()}<br />
                    <span style={{ fontSize: 11 }}>{new Date(c.completed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </td>
                  <td style={TD}>
                    {c.status === "pending" ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => handleApprove(c.id)} disabled={actionLoading === c.id}
                          style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#1AEF22", color: "#000", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                          {actionLoading === c.id ? "…" : "✓ Approve"}
                        </button>
                        <button onClick={() => setRejectModal({ id: c.id, title: c.task_title })} disabled={actionLoading === c.id}
                          style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#fce4ec", color: "#c62828", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                          ✕ Reject
                        </button>
                      </div>
                    ) : <span style={{ color: "#ccc", fontSize: 12 }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}>← Prev</button>
          <span style={{ fontSize: 13, color: "#666" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}>Next →</button>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700 }}>Reject Submission</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#888" }}>{rejectModal.title}</p>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5 }}>Reason</label>
            <select value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              style={{ width: "100%", marginTop: 6, marginBottom: 12, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 13, outline: "none" }}>
              {REJECTION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5 }}>Custom (optional)</label>
            <input value={customReason} onChange={e => setCustomReason(e.target.value)} placeholder="Override with custom reason..."
              style={{ width: "100%", marginTop: 6, marginBottom: 20, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 13, outline: "none" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setRejectModal(null); setCustomReason(""); }} style={{ flex: 1, padding: "11px", borderRadius: 9, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={handleReject} disabled={actionLoading !== null} style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", background: "#c62828", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                {actionLoading !== null ? "Rejecting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
