"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import BusinessSidebar from "@/components/BusinessSidebar";

type Tx = {
  id: number;
  type: "credit" | "debit";
  amount: number;
  label: string;
  status: string;
  provider: string | null;
  reference: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function BusinessWalletPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string; email: string } | null>(null);
  const [balance, setBalance] = useState(0);
  const [reserved, setReserved] = useState(0);
  const [spent, setSpent] = useState(0);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [amount, setAmount] = useState("50000");
  const [method, setMethod] = useState<"paystack" | "bank_transfer">("paystack");
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadWallet = () => {
    fetch("/api/business/wallet")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setBalance(data.balance ?? 0);
        setReserved(data.reserved ?? 0);
        setSpent(data.spent ?? 0);
        setTransactions(data.transactions ?? []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/business/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/business/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.business) setBusiness(data.business);
      });
    loadWallet();
  }, [router]);

  const fundWallet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFunding(true);
    setMessage(null);
    const res = await fetch("/api/business/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), method }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMessage({ type: "success", text: `Funding recorded. Reference: ${data.reference}` });
      setBalance(data.balance ?? balance);
      loadWallet();
    } else {
      setMessage({ type: "error", text: data.error || "Could not fund wallet" });
    }
    setFunding(false);
  };

  if (!business || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", display: "grid", placeItems: "center" }}>
        <div style={{ width: 38, height: 38, border: "3px solid #171717", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const amountNumber = Number(amount) || 0;

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body businessWallet business-page-pro">
        <header className="walletHeader">
          <div>
            <p className="eyebrow">Business Credits</p>
            <h1>Funding Wallet</h1>
            <p>Fund Qeixova credits before launching campaigns. Campaign budgets are reserved when you submit a campaign for review.</p>
          </div>
          <div className="balancePanel">
            <span>Available Balance</span>
            <strong>{balance.toLocaleString()} QLT</strong>
            <small>Use this balance to launch campaigns</small>
          </div>
        </header>

        <section className="metricGrid">
          {[
            { label: "Available", value: balance, color: "#F5A623" },
            { label: "Reserved in campaigns", value: reserved, color: "#4a9eff" },
            { label: "Spent on participation", value: spent, color: "#1AEF22" },
          ].map((item) => (
            <div key={item.label} className="metricCard" style={{ borderTopColor: item.color }}>
              <span>{item.label}</span>
              <strong>{item.value.toLocaleString()} QLT</strong>
            </div>
          ))}
        </section>

        <div className="walletGrid">
          <section className="fundCard">
            <div className="cardTitle">
              <Image src="/icon-wallet.svg" alt="" width={22} height={22} />
              <div>
                <h2>Add funds</h2>
                <p>Paystack will plug into this same checkout path later.</p>
              </div>
            </div>

            {message && <div className={message.type === "success" ? "notice success" : "notice error"}>{message.text}</div>}

            <form onSubmit={fundWallet}>
              <label>
                Funding amount
                <input type="number" min={1000} value={amount} onChange={(event) => setAmount(event.target.value)} />
              </label>

              <div className="methodGrid">
                {[
                  { key: "paystack", title: "Paystack card", sub: "Demo credit now, API-ready later" },
                  { key: "bank_transfer", title: "Bank transfer", sub: "Record transfer reference" },
                ].map((item) => (
                  <button key={item.key} type="button" onClick={() => setMethod(item.key as typeof method)} className={method === item.key ? "selected" : ""}>
                    <strong>{item.title}</strong>
                    <span>{item.sub}</span>
                  </button>
                ))}
              </div>

              {amountNumber > 0 && (
                <div className="previewBox">
                  <span>Wallet credit</span>
                  <strong>+{amountNumber.toLocaleString()} QLT</strong>
                  <small>Reference is generated immediately. Paystack authorization URL can be returned here later.</small>
                </div>
              )}

              <button className="primaryButton" type="submit" disabled={funding}>
                {funding ? "Processing..." : method === "paystack" ? "Add Funds" : "Record Bank Transfer"}
              </button>
            </form>
          </section>

          <section className="bankCard">
            <p className="eyebrow">Bank Transfer Details</p>
            <h2>Manual funding fallback</h2>
            <dl>
              <div><dt>Account Name</dt><dd>Qeixova Technologies</dd></div>
              <div><dt>Bank</dt><dd>Add bank here</dd></div>
              <div><dt>Account Number</dt><dd>0000000000</dd></div>
              <div><dt>Narration</dt><dd>{business.name} / Qeixova Funding</dd></div>
            </dl>
            <p className="helperText">These placeholders keep the flow usable while you prepare live payment details.</p>
          </section>
        </div>

        <section className="transactions">
          <div className="sectionHead">
            <h2>Funding history</h2>
            <span>{transactions.length} records</span>
          </div>
          {transactions.length === 0 ? (
            <div className="emptyState">No funding or campaign budget activity yet.</div>
          ) : (
            <div className="txList">
              {transactions.map((tx) => (
                <article key={tx.id} className="txItem">
                  <div>
                    <strong>{tx.label}</strong>
                    <span>{formatDate(tx.created_at)} {tx.reference ? `- ${tx.reference}` : ""}</span>
                  </div>
                  <p className={tx.type === "credit" ? "credit" : "debit"}>{tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString()} QLT</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <BusinessBottomNav />

      <style jsx>{`
        .businessWallet {
          max-width: 1100px;
          margin: 0 auto;
          color: #f5f5f5;
        }
        .walletHeader {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 16px;
          align-items: stretch;
          margin-bottom: 16px;
        }
        .eyebrow {
          color: #f5a623;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        h1 {
          font-size: clamp(30px, 5vw, 44px);
          line-height: 1.05;
          letter-spacing: 0;
          margin-bottom: 8px;
        }
        header p:not(.eyebrow), .cardTitle p, .helperText {
          color: #aaa;
          font-size: 14px;
          line-height: 1.6;
        }
        .balancePanel, .metricCard, .fundCard, .bankCard, .transactions {
          background: #0a0a0a;
          border: 1px solid #1b1b1b;
          border-radius: 18px;
        }
        .balancePanel {
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .balancePanel span, .metricCard span {
          color: #888;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }
        .balancePanel strong {
          color: #f5a623;
          font-size: 30px;
          margin: 8px 0 4px;
        }
        .balancePanel small {
          color: #777;
        }
        .metricGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .metricCard {
          border-top: 3px solid;
          padding: 14px;
        }
        .metricCard strong {
          display: block;
          margin-top: 7px;
          font-size: 21px;
        }
        .walletGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 14px;
          align-items: start;
          margin-bottom: 16px;
        }
        .fundCard, .bankCard, .transactions {
          padding: 18px;
        }
        .cardTitle {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 18px;
        }
        .cardTitle h2, .bankCard h2, .transactions h2 {
          font-size: 18px;
          margin-bottom: 3px;
        }
        form {
          display: grid;
          gap: 14px;
        }
        label {
          display: block;
          color: #ccc;
          font-size: 12px;
          font-weight: 800;
        }
        input {
          width: 100%;
          margin-top: 7px;
          border: 1px solid #303030;
          background: #111;
          color: #f5f5f5;
          border-radius: 12px;
          padding: 13px;
          font-size: 15px;
          outline: none;
        }
        .methodGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .methodGrid button {
          text-align: left;
          border: 1px solid #292929;
          background: #101010;
          border-radius: 13px;
          padding: 13px;
          color: #ddd;
          cursor: pointer;
        }
        .methodGrid button.selected {
          border-color: rgba(245, 166, 35, 0.45);
          background: rgba(245, 166, 35, 0.08);
        }
        .methodGrid strong, .methodGrid span {
          display: block;
        }
        .methodGrid span {
          color: #888;
          font-size: 11px;
          margin-top: 4px;
          line-height: 1.4;
        }
        .previewBox, .notice {
          border-radius: 13px;
          padding: 13px;
        }
        .previewBox {
          border: 1px solid rgba(26, 239, 34, 0.18);
          background: rgba(26, 239, 34, 0.07);
        }
        .previewBox span, .previewBox small {
          display: block;
          color: #aaa;
          font-size: 12px;
        }
        .previewBox strong {
          display: block;
          color: #1aef22;
          font-size: 20px;
          margin: 4px 0;
        }
        .primaryButton {
          border: 0;
          border-radius: 13px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #f5a623, #d89420);
          color: #000;
          font-weight: 900;
          cursor: pointer;
        }
        .primaryButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .notice.success {
          border: 1px solid rgba(26, 239, 34, 0.25);
          background: rgba(26, 239, 34, 0.08);
          color: #1aef22;
        }
        .notice.error {
          border: 1px solid rgba(229, 62, 62, 0.25);
          background: rgba(229, 62, 62, 0.08);
          color: #ff8b8b;
        }
        dl {
          display: grid;
          gap: 10px;
          margin: 14px 0;
        }
        dt {
          color: #777;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        dd {
          color: #ddd;
          font-size: 14px;
          font-weight: 700;
        }
        .sectionHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .sectionHead span {
          color: #888;
          font-size: 12px;
        }
        .emptyState {
          border: 1px dashed #252525;
          border-radius: 14px;
          padding: 28px;
          color: #888;
          text-align: center;
        }
        .txList {
          display: grid;
          gap: 9px;
        }
        .txItem {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          background: #101010;
          border: 1px solid #1f1f1f;
          border-radius: 13px;
          padding: 13px;
        }
        .txItem strong, .txItem span {
          display: block;
        }
        .txItem strong {
          font-size: 13px;
        }
        .txItem span {
          color: #888;
          font-size: 11px;
          margin-top: 3px;
        }
        .txItem p {
          font-weight: 900;
          white-space: nowrap;
        }
        .txItem p.credit {
          color: #1aef22;
        }
        .txItem p.debit {
          color: #f5a623;
        }
        @media (max-width: 820px) {
          .walletHeader, .walletGrid, .metricGrid, .methodGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
