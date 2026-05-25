"use client";

import { useState } from "react";

interface ClearOption {
  scope: string;
  label: string;
  description: string;
  danger: "medium" | "high" | "critical";
}

const OPTIONS: ClearOption[] = [
  {
    scope: "completions",
    label: "Clear Mission Submissions",
    description: "Removes all submission records and resets campaign usage counters. User balances are not affected.",
    danger: "medium",
  },
  {
    scope: "transactions",
    label: "Clear Transactions & Balances",
    description: "Deletes transaction history and resets every contributor QLT balance to zero.",
    danger: "high",
  },
  {
    scope: "tasks",
    label: "Deactivate All Missions",
    description: "Soft-disables all missions so contributors cannot discover them. They can be reactivated later.",
    danger: "medium",
  },
  {
    scope: "tasks_hard",
    label: "Delete All Missions",
    description: "Permanently deletes all missions and their submission records. This cannot be undone.",
    danger: "high",
  },
  {
    scope: "users",
    label: "Delete All Users",
    description: "Permanently deletes user accounts, balances, submissions, and transactions. Missions are kept.",
    danger: "critical",
  },
  {
    scope: "all",
    label: "Wipe All App Data",
    description: "Deletes users, missions, submissions, and transactions. Use only when resetting a test environment.",
    danger: "critical",
  },
];

export default function DataManagement() {
  const [confirming, setConfirming] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleClear = async (scope: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/clear-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
      const data = await res.json();
      setResult({ ok: res.ok, message: data.message || data.error });
    } catch {
      setResult({ ok: false, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
      setConfirming(null);
      setConfirmText("");
    }
  };

  return (
    <section className="adminPanel adminDataZone">
      <div className="adminDataHeader">
        <div>
          <h2>Data Management</h2>
          <p>Controlled reset tools for test data and operational recovery.</p>
        </div>
        <span className="adminDangerBadge">Restricted</span>
      </div>

      {result && (
        <div className={`adminResult${result.ok ? "" : " error"}`}>
          <span>{result.ok ? "Completed" : "Failed"}</span>
          <strong>{result.message}</strong>
          <button onClick={() => setResult(null)} aria-label="Dismiss result">x</button>
        </div>
      )}

      <div className="adminDangerGrid">
        {OPTIONS.map((opt) => {
          const isConfirming = confirming === opt.scope;
          const confirmPhrase = `DELETE ${opt.scope.toUpperCase()}`;

          return (
            <article key={opt.scope} className={`adminDangerCard ${opt.danger}`}>
              <span className="adminDangerLevel">{opt.danger}</span>
              <h3>{opt.label}</h3>
              <p>{opt.description}</p>

              {!isConfirming ? (
                <button
                  onClick={() => {
                    setConfirming(opt.scope);
                    setConfirmText("");
                    setResult(null);
                  }}
                >
                  Start confirmation
                </button>
              ) : (
                <div className="adminDangerConfirm">
                  <p>
                    Type <code>{confirmPhrase}</code> to confirm.
                  </p>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(event) => setConfirmText(event.target.value)}
                    placeholder={confirmPhrase}
                  />
                  <div className="adminDangerActions">
                    <button
                      onClick={() => {
                        setConfirming(null);
                        setConfirmText("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleClear(opt.scope)}
                      disabled={confirmText !== confirmPhrase || loading}
                    >
                      {loading ? "Processing..." : "Confirm"}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
