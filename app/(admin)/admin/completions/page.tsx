"use client";
import { useEffect, useState, useCallback } from "react";

interface Completion {
  id: number;
  user_id: number;
  user_name: string;
  email: string;
  task_title: string;
  category: string;
  proof_type: string;
  proof_value: string | null;
  completed_at: string;
  status: string;
  rejection_reason: string | null;
  reward: number;
}

const TH: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #eee", whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "14px 16px", fontSize: 13, color: "#333", borderBottom: "1px solid #f5f5f5", verticalAlign: "middle" };

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "#fff8e1", color: "#e67e22" },
  approved: { bg: "#e8f5e9", color: "#2e7d32" },
  rejected: { bg: "#fce4ec", color: "#c62828" },
};

const PROOF_COLORS: Record<string, { bg: string; color: string }> = {
  screenshot: { bg: "#e8f5e9", color: "#2e7d32" },
  url:        { bg: "#e3f2fd", color: "#1565c0" },
  text:       { bg: "#fff8e1", color: "#e67e22" },
  none:       { bg: "#f5f5f5", color: "#999" },
};

const REJECTION_REASONS = [
  "Screenshot does not match task requirement",
  "Username not visible in screenshot",
  "Task not completed correctly",
  "Duplicate or reused submission",
  "Suspicious activity detected",
  "Profile link does not match",
];

function ProofBadge({ type, value }: { type: string; value: string | null }) {
  const c = PROOF_COLORS[type] ?? PROOF_COLORS.none;
  if (!value) return <span style={{ color: "#aaa", fontSize: 12 }}>—</span>;
  if (value === "[screenshot uploaded]" || value.startsWith("[")) {
    return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>Screenshot</span>;
  }
  if (type === "url") {
    return <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#1565c0", fontSize: 12, wordBreak: "break-all" }}>{value.length > 50 ? value.slice(0, 50) + "…" : value}</a>;
  }
  return <span style={{ fontSize: 12, color: "#555" }}>{value.length > 60 ? value.slice(0, 60) + "…" : value}</span>;
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
    } finally {
      setLoading(false);
    }
  }, [page, proofFilter, statusFilter]);

  useEffect(() => { fetchCompletions(); }, [fetchCompletions]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    await fetch("/api/admin/completions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completionId: id, action: "approve" }),
    });
    setActionLoading(null);
    fetchCompletions();
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id);
    const reason = customReason.trim() || rejectReason;
    await fetch("/api/admin/completions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completionId: rejectModal.id, action: "reject", rejectionReason: reason }),
    });
    setActionLoading(null);
    setRejectModal(null);
    setCustomReason("");
    fetchCompletions();
  };

  const totalPages = Math.ceil(total / 30);
  const pendingCount = completions.filter(c => c.status === "pending").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: "#1A1A1A" }}>Task Submissions</h1>
          <p style={{ margin: 0, color: "#888", fontSize: 14 }}>{total.toLocaleString()} total • {pendingCount} pending review</p>
        </div>
        {statusFilter === "pending" && pendingCount > 0 && (
          <div style={{ background: "#fff8e1", border: "1px solid #f5a623", borderRadius: 10, padding: "8px 16px", fontSize: 13, color: "#e67e22", fontWeight: 600 }}>
            {pendingCount} awaiting review
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { val: "pending", label: "Pending" },
          { val: "approved", label: "Approved" },
          { val: "rejected", label: "Rejected" },
          { val: "", label: "All" },
        ].map(f => (
          <button key={f.val} onClick={() => { setStatusFilter(f.val); setPage(1); }}
            style={{ padding: "8px 18px", borderRadius: 20, border: "1.5px solid", borderColor: statusFilter === f.val ? "#1AEF22" : "#e0e0e0", background: statusFilter === f.val ? "#1AEF22" : "#fff", color: statusFilter === f.val ? "#fff" : "#666", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Proof Type Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["", "screenshot", "url", "text"].map((f) => (
          <button key={f} onClick={() => { setProofFilter(f); setPage(1); }}
            style={{ padding: "6px 14px", borderRadius: 20, border: "1.5px solid", borderColor: proofFilter === f ? "#555" : "#e0e0e0", background: proofFilter === f ? "#555" : "#fff", color: proofFilter === f ? "#fff" : "#888", cursor: "pointer", fontSize: 12 }}>
            {f === "" ? "All Types" : f}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={TH}>ID</th>
              <th style={TH}>User</th>
              <th style={TH}>Task</th>
              <th style={TH}>Reward</th>
              <th style={TH}>Proof</th>
              <th style={TH}>Status</th>
              <th style={TH}>Date</th>
              <th style={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ ...TD, textAlign: "center", color: "#aaa", padding: 40 }}>Loading…</td></tr>
            ) : completions.length === 0 ? (
              <tr><td colSpan={8} style={{ ...TD, textAlign: "center", color: "#aaa", padding: 40 }}>No submissions found</td></tr>
            ) : completions.map((c) => (
              <tr key={c.id} style={{ background: c.status === "pending" ? "#fffdf5" : "white" }}>
                <td style={TD}>{c.id}</td>
                <td style={TD}>
                  <div style={{ fontWeight: 500 }}>{c.user_name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{c.email}</div>
                </td>
                <td style={{ ...TD, maxWidth: 200 }}>
                  <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.task_title}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{c.category}</div>
                  {c.rejection_reason && (
                    <div style={{ fontSize: 11, color: "#c62828", marginTop: 2 }}>Reason: {c.rejection_reason}</div>
                  )}
                </td>
                <td style={TD}>
                  <span style={{ fontWeight: 700, color: "#2e7d32" }}>{c.reward?.toLocaleString()} QLT</span>
                </td>
                <td style={{ ...TD, maxWidth: 220 }}>
                  <ProofBadge type={c.proof_type} value={c.proof_value} />
                </td>
                <td style={TD}>
                  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: (STATUS_COLORS[c.status] ?? STATUS_COLORS.pending).bg, color: (STATUS_COLORS[c.status] ?? STATUS_COLORS.pending).color }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ ...TD, color: "#888", whiteSpace: "nowrap" }}>
                  {new Date(c.completed_at).toLocaleDateString()} {new Date(c.completed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td style={TD}>
                  {c.status === "pending" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => handleApprove(c.id)}
                        disabled={actionLoading === c.id}
                        style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#1AEF22", color: "#000", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                        {actionLoading === c.id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => setRejectModal({ id: c.id, title: c.task_title })}
                        disabled={actionLoading === c.id}
                        style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#fce4ec", color: "#c62828", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                        Reject
                      </button>
                    </div>
                  )}
                  {c.status !== "pending" && <span style={{ color: "#ccc", fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 20, alignItems: "center" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}>← Prev</button>
          <span style={{ fontSize: 13, color: "#666" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}>Next →</button>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>Reject Submission</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#888" }}>{rejectModal.title}</p>

            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 0.5 }}>Rejection Reason</label>
            <select value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              style={{ width: "100%", marginTop: 8, marginBottom: 12, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, outline: "none" }}>
              {REJECTION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 0.5 }}>Custom Reason (optional)</label>
            <input value={customReason} onChange={e => setCustomReason(e.target.value)}
              placeholder="Override with a custom reason..."
              style={{ width: "100%", marginTop: 8, marginBottom: 20, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, outline: "none" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setRejectModal(null); setCustomReason(""); }}
                style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleReject} disabled={actionLoading !== null}
                style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "#c62828", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                {actionLoading !== null ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
