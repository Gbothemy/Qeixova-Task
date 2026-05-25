"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

type Business = {
  name: string;
  email: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatQlt(value: number) {
  return `${Math.round(value).toLocaleString()} QLT`;
}

export default function BusinessWalletPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [balance, setBalance] = useState(0);
  const [, setReserved] = useState(0);
  const [, setSpent] = useState(0);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [amount, setAmount] = useState("50000");
  const [method, setMethod] = useState<"paystack" | "bank_transfer">("paystack");
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const amountNumber = Math.max(0, Number(amount) || 0);
  const quickAmounts = useMemo(() => [10000, 25000, 50000, 100000], []);
  const recentTransactions = transactions.slice(0, 8);

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
      <main className="billingLoading">
        <span>Loading billing...</span>
        <style jsx>{pageStyles}</style>
      </main>
    );
  }

  return (
    <>
      <div className="businessBillingLayout">
        <BusinessSidebar name={business.name} />
        <main className="page-body business-page-pro billingPage">
          <div className="businessWorkspace billingWorkspace">
            <div className="businessAdsTopbar">
              <div className="businessAdsSearch">Billing, campaign funding, transactions</div>
              <div className="businessAdsActions">
                <Link href="/business/tasks">Campaigns</Link>
                <Link href="/business/tasks/new" className="primary">Create Campaign</Link>
              </div>
            </div>

            <section className="adsPanel billingHero">
              <div>
                <p className="eyebrow">Business billing</p>
                <h1 className="businessPageTitle">Campaign funding</h1>
                <p>Add credit, choose a payment method, and keep a clear record of wallet activity for campaign launches.</p>
              </div>
              <div className="walletPill">
                <span>Available credit</span>
                <strong>{formatQlt(balance)}</strong>
              </div>
            </section>

            <section className="billingGrid">
              <form className="adsPanel fundPanel" onSubmit={fundWallet}>
              <div className="panelTop">
                <div>
                  <p className="eyebrow">Add funds</p>
                  <h2>Top up campaign credit</h2>
                </div>
              </div>

              {message && <div className={message.type === "success" ? "notice success" : "notice error"}>{message.text}</div>}

              <label className="fieldBlock">
                Amount
                <input type="number" min={1000} value={amount} onChange={(event) => setAmount(event.target.value)} />
              </label>

              <div className="quickAmounts" aria-label="Quick funding amounts">
                {quickAmounts.map((value) => (
                  <button key={value} type="button" className={amountNumber === value ? "active" : ""} onClick={() => setAmount(String(value))}>
                    {formatQlt(value)}
                  </button>
                ))}
              </div>

              <div className="methodGrid" aria-label="Payment methods">
                <button type="button" onClick={() => setMethod("paystack")} className={method === "paystack" ? "selected" : ""}>
                  <strong>Card payment</strong>
                  <span>Fast confirmation for instant campaign funding.</span>
                </button>
                <button type="button" onClick={() => setMethod("bank_transfer")} className={method === "bank_transfer" ? "selected" : ""}>
                  <strong>Bank transfer</strong>
                  <span>Record a transfer for manual confirmation.</span>
                </button>
              </div>

              <div className="fundPreview">
                <span>Amount to credit</span>
                <strong>{formatQlt(amountNumber)}</strong>
              </div>

              <button className="primaryButton" type="submit" disabled={funding}>
                {funding ? "Processing..." : method === "paystack" ? "Add Funds" : "Record Transfer"}
              </button>
            </form>

            <aside className="billingSide">
              <section className="adsPanel transferCard">
                <p className="eyebrow">Transfer details</p>
                <h2>Manual payment</h2>
                <p>Use this only when the business wants to fund by transfer before payment automation is completed.</p>
                <dl>
                  <div><dt>Account name</dt><dd>Qeixova Technologies</dd></div>
                  <div><dt>Bank</dt><dd>Manual transfer setup pending</dd></div>
                  <div><dt>Account number</dt><dd>Provided after confirmation</dd></div>
                  <div><dt>Narration</dt><dd>{business.name} / Qeixova Funding</dd></div>
                </dl>
              </section>

              <section className="adsPanel policyCard">
                <p className="eyebrow">Funding rules</p>
                <div className="ruleList">
                  <div><span>01</span><strong>Credit wallet before launching campaigns.</strong></div>
                  <div><span>02</span><strong>Campaign pricing is shown before launch.</strong></div>
                  <div><span>03</span><strong>Unused campaign credit stays available.</strong></div>
                </div>
              </section>
            </aside>
            </section>

            <section className="adsPanel transactionsPanel">
            <div className="sectionHead">
              <div>
                <p className="eyebrow">Ledger</p>
                <h2>Recent transactions</h2>
              </div>
              <span>{transactions.length} total</span>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="emptyState">No billing activity yet.</div>
            ) : (
              <div className="txList">
                {recentTransactions.map((tx) => (
                  <article key={tx.id} className="txItem">
                    <div className={tx.type === "credit" ? "txIcon credit" : "txIcon debit"}>
                      {tx.type === "credit" ? "+" : "-"}
                    </div>
                    <div className="txCopy">
                      <strong>{tx.label}</strong>
                      <span>{formatDate(tx.created_at)}{tx.reference ? ` / ${tx.reference}` : ""}</span>
                    </div>
                    <div className="txMeta">
                      <strong className={tx.type === "credit" ? "creditText" : "debitText"}>{tx.type === "credit" ? "+" : "-"}{formatQlt(tx.amount)}</strong>
                      <span>{tx.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
            </section>
          </div>
        </main>
      </div>
      <BusinessBottomNav />
      <style jsx>{pageStyles}</style>
    </>
  );
}

const pageStyles = `
  .businessBillingLayout {
    min-height: 100vh;
    background: #000;
  }

  .billingPage {
    min-width: 0;
  }

  .billingLoading {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #000;
    color: #bbb;
  }

  .billingWorkspace {
    width: min(100%, 1440px);
    margin: 0 auto;
  }

  .eyebrow {
    margin: 0 0 6px;
    color: #F5A623;
    font-size: 11px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .billingWorkspace h1,
  .billingWorkspace h2,
  .billingWorkspace p {
    letter-spacing: 0;
  }

  .billingWorkspace h2 {
    margin: 0;
    color: #F5F5F5;
    font-size: 22px;
  }

  .billingHero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 16px;
    align-items: center;
    padding: 22px;
    margin-bottom: 16px;
  }

  .billingHero h1 {
    max-width: 720px;
    margin: 0;
    font-size: clamp(32px, 4vw, 52px);
    line-height: 1.02;
  }

  .billingHero p:not(.eyebrow) {
    max-width: 670px;
    margin: 10px 0 0;
    color: #bbb;
    font-size: 14px;
    line-height: 1.65;
  }

  .billingGrid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 390px;
    gap: 16px;
    align-items: start;
    margin-bottom: 16px;
  }

  .fundPanel,
  .transferCard,
  .policyCard,
  .transactionsPanel,
  .billingHero {
    box-shadow: 0 18px 48px rgba(0,0,0,.26);
  }

  .fundPanel,
  .transferCard,
  .policyCard,
  .transactionsPanel {
    padding: 20px;
  }

  .panelTop,
  .sectionHead {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
    margin-bottom: 22px;
  }

  .walletPill {
    padding: 15px;
    border: 1px solid rgba(245, 166, 35, .28);
    border-radius: 14px;
    background: rgba(245, 166, 35, .08);
    text-align: right;
  }

  .walletPill span,
  .walletPill strong {
    display: block;
  }

  .walletPill span {
    color: #bbb;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }

  .walletPill strong {
    margin-top: 5px;
    color: #F5F5F5;
    font-size: 24px;
  }

  .notice {
    border-radius: 14px;
    padding: 13px 14px;
    margin-bottom: 16px;
    font-size: 13px;
    font-weight: 800;
  }

  .notice.success {
    border: 1px solid rgba(26, 239, 34, .25);
    background: rgba(26, 239, 34, .08);
    color: #1AEF22;
  }

  .notice.error {
    border: 1px solid rgba(229, 62, 62, .28);
    background: rgba(229, 62, 62, .08);
    color: #ff9a9a;
  }

  .fieldBlock {
    display: grid;
    gap: 9px;
    color: #F5F5F5;
    font-size: 13px;
    font-weight: 900;
    margin-bottom: 15px;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #252525;
    border-radius: 14px;
    background: #050505;
    color: #F5F5F5;
    padding: 15px 16px;
    font: inherit;
    outline: none;
  }

  input:focus {
    border-color: rgba(245, 166, 35, .78);
    box-shadow: 0 0 0 4px rgba(245, 166, 35, .13);
  }

  .quickAmounts,
  .methodGrid {
    display: grid;
    gap: 10px;
    margin-bottom: 15px;
  }

  .quickAmounts {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .methodGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quickAmounts button,
  .methodGrid button {
    border: 1px solid #222;
    background: #0d0d0d;
    color: #F5F5F5;
    border-radius: 14px;
    cursor: pointer;
    transition: border-color .16s ease, background .16s ease, transform .16s ease;
  }

  .quickAmounts button:hover,
  .methodGrid button:hover {
    transform: translateY(-1px);
    border-color: rgba(245, 166, 35, .5);
  }

  .quickAmounts button {
    padding: 12px 10px;
    font-weight: 900;
  }

  .methodGrid button {
    min-height: 112px;
    padding: 16px;
    text-align: left;
  }

  .quickAmounts button.active,
  .methodGrid button.selected {
    border-color: #F5A623;
    background: rgba(245, 166, 35, .12);
  }

  .methodGrid strong,
  .methodGrid span {
    display: block;
  }

  .methodGrid strong {
    font-size: 15px;
  }

  .methodGrid span {
    color: #888;
    font-size: 12px;
    line-height: 1.5;
    margin-top: 6px;
  }

  .fundPreview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border: 1px solid rgba(26, 239, 34, .2);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
    background: rgba(26, 239, 34, .07);
  }

  .fundPreview span,
  .sectionHead span {
    color: #888;
    font-size: 12px;
    font-weight: 850;
  }

  .fundPreview strong {
    color: #1AEF22;
    font-size: 24px;
  }

  .primaryButton {
    width: 100%;
    border: 0;
    border-radius: 15px;
    padding: 15px 16px;
    background: #F5A623;
    color: #050505;
    font-weight: 950;
    cursor: pointer;
  }

  .primaryButton:disabled {
    opacity: .55;
    cursor: not-allowed;
  }

  .billingSide {
    display: grid;
    gap: 18px;
  }

  .transferCard,
  .policyCard {
    padding: 22px;
  }

  .transferCard p:not(.eyebrow) {
    margin: 10px 0 18px;
    color: #888;
    font-size: 13px;
    line-height: 1.65;
  }

  dl {
    margin: 0;
    display: grid;
    gap: 10px;
  }

  dl div {
    padding: 13px;
    border: 1px solid #1f1f1f;
    border-radius: 13px;
    background: #050505;
  }

  dt {
    color: #666;
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    margin-bottom: 5px;
  }

  dd {
    margin: 0;
    color: #F5F5F5;
    font-weight: 850;
    overflow-wrap: anywhere;
  }

  .ruleList {
    display: grid;
    gap: 10px;
  }

  .ruleList div {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 10px;
    align-items: center;
  }

  .ruleList span {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #F5A623;
    color: #050505;
    font-size: 11px;
    font-weight: 950;
  }

  .ruleList strong {
    color: #F5F5F5;
    font-size: 13px;
    line-height: 1.45;
  }

  .transactionsPanel {
    margin-top: 18px;
    padding: 22px;
  }

  .sectionHead {
    margin-bottom: 16px;
  }

  .emptyState {
    border: 1px dashed #303030;
    border-radius: 15px;
    padding: 36px;
    color: #888;
    text-align: center;
  }

  .txList {
    display: grid;
    gap: 10px;
  }

  .txItem {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) auto;
    gap: 13px;
    align-items: center;
    padding: 14px;
    border: 1px solid #1d1d1d;
    border-radius: 15px;
    background: #050505;
  }

  .txIcon {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    font-weight: 950;
  }

  .txIcon.credit {
    background: rgba(26, 239, 34, .11);
    color: #1AEF22;
  }

  .txIcon.debit {
    background: rgba(245, 166, 35, .12);
    color: #F5A623;
  }

  .txCopy strong,
  .txCopy span,
  .txMeta strong,
  .txMeta span {
    display: block;
  }

  .txCopy strong {
    color: #F5F5F5;
    font-size: 14px;
  }

  .txCopy span,
  .txMeta span {
    color: #777;
    font-size: 12px;
    margin-top: 4px;
  }

  .txMeta {
    text-align: right;
    white-space: nowrap;
  }

  .creditText {
    color: #1AEF22;
  }

  .debitText {
    color: #F5A623;
  }

  @media (max-width: 1180px) {
    .billingGrid,
    .billingHero {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 820px) {
    .fundPanel,
    .transferCard,
    .policyCard,
    .billingHero,
    .transactionsPanel {
      border-radius: 16px;
      box-shadow: none;
      padding: 16px;
    }

    .panelTop,
    .sectionHead,
    .fundPreview {
      flex-direction: column;
      align-items: stretch;
    }

    .walletPill {
      text-align: left;
      width: 100%;
    }

    .quickAmounts,
    .methodGrid {
      grid-template-columns: 1fr;
    }

    .txItem {
      grid-template-columns: 40px minmax(0, 1fr);
    }

    .txMeta {
      grid-column: 2;
      text-align: left;
    }
  }

  @media (min-width: 1024px) {
    .businessBillingLayout {
      display: flex;
      align-items: flex-start;
    }

    .billingPage {
      flex: 1;
      width: calc(100% - 260px);
    }
  }
`;
