"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BusinessLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/business/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) router.push("/business/dashboard");
    else setError(data.error || "Login failed");
    setLoading(false);
  };

  return (
    <main className="businessLoginPage">
      <nav className="loginNav">
        <Link href="/" className="brandLink">
          <Image src="/qeixova-icon.png" alt="Qeixova" width={32} height={32} />
          <span>Qeixova</span>
          <strong>Business</strong>
        </Link>
        <Link href="/register" className="navAction">Create account</Link>
      </nav>

      <section className="loginStage">
        <div className="loginWrap">
          <header className="loginHeader">
            <div className="brandMark">
              <Image src="/qeixova-icon.png" alt="" width={36} height={36} />
            </div>
            <p>Business Manager</p>
            <h1>Welcome back</h1>
            <span>Sign in to manage campaigns, billing, submissions, and growth activity.</span>
          </header>

          <section className="loginCard">
            {error && <div className="errorBox"><span>!</span>{error}</div>}

            <form onSubmit={handleSubmit} className="loginForm">
              <label>
                Email
                <input
                  type="email"
                  placeholder="business@company.com"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>

              <label>
                <span className="labelLine">
                  Password
                  <button type="button" onClick={() => setShowPass((value) => !value)}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </label>

              <button type="submit" disabled={loading} className="submitButton">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in...
                  </>
                ) : "Login"}
              </button>
            </form>

            <p className="createText">
              No account? <Link href="/register">Create one</Link>
            </p>
          </section>

          <section className="switchCard">
            <div>
              <span className="switchIcon">
                <img src="/icon-task.svg" width={14} height={14} alt="" />
              </span>
              <span>Business Login</span>
            </div>
            <Link href="/login">
              <span className="switchIcon green">
                <img src="/icon-profile.svg" width={12} height={12} alt="" />
              </span>
              Contributor Login
            </Link>
          </section>
        </div>
      </section>

      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
  .businessLoginPage {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(circle at 50% 16%, rgba(245, 166, 35, 0.16), transparent 28%),
      radial-gradient(circle at 16% 82%, rgba(26, 239, 34, 0.06), transparent 24%),
      #050505;
    color: #F5F5F5;
  }

  .loginNav {
    height: 66px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(5, 5, 5, 0.72);
    backdrop-filter: blur(18px);
  }

  .brandLink,
  .navAction,
  .switchCard a {
    text-decoration: none;
  }

  .brandLink {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .brandLink img {
    border-radius: 9px;
  }

  .brandLink span {
    color: #F5F5F5;
    font-size: 15px;
    font-weight: 850;
  }

  .brandLink strong {
    padding: 4px 9px;
    border: 1px solid rgba(245, 166, 35, 0.22);
    border-radius: 999px;
    background: rgba(245, 166, 35, 0.1);
    color: #F5A623;
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .7px;
  }

  .navAction {
    color: #F5A623;
    font-size: 13px;
    font-weight: 850;
  }

  .loginStage {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 36px 20px;
  }

  .loginWrap {
    width: min(100%, 420px);
  }

  .loginHeader {
    text-align: center;
    margin-bottom: 24px;
  }

  .brandMark {
    width: 70px;
    height: 70px;
    margin: 0 auto 18px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(245, 166, 35, 0.28);
    border-radius: 22px;
    background: linear-gradient(135deg, #F5A623, #d89420);
    box-shadow: 0 20px 46px rgba(245, 166, 35, 0.24);
  }

  .brandMark img {
    filter: brightness(0);
    object-fit: contain;
  }

  .loginHeader p {
    margin: 0 0 8px;
    color: #F5A623;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .loginHeader h1 {
    margin: 0;
    color: #fff;
    font-size: 34px;
    line-height: 1;
    letter-spacing: 0;
  }

  .loginHeader span {
    display: block;
    max-width: 360px;
    margin: 10px auto 0;
    color: #a8a8a8;
    font-size: 14px;
    line-height: 1.55;
  }

  .loginCard,
  .switchCard {
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(10, 10, 10, 0.86);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(18px);
  }

  .loginCard {
    border-radius: 24px;
    padding: 26px;
  }

  .errorBox {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 18px;
    padding: 12px 14px;
    border: 1px solid rgba(229, 62, 62, 0.24);
    border-radius: 13px;
    background: rgba(229, 62, 62, 0.08);
    color: #ff9a9a;
    font-size: 13px;
    font-weight: 750;
  }

  .errorBox span {
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(229, 62, 62, 0.16);
    color: #ff9a9a;
    font-weight: 950;
  }

  .loginForm {
    display: grid;
    gap: 16px;
  }

  .loginForm label {
    display: grid;
    gap: 8px;
    color: #b8b8b8;
    font-size: 11px;
    font-weight: 850;
    letter-spacing: .75px;
    text-transform: uppercase;
  }

  .labelLine {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .labelLine button {
    border: 0;
    background: transparent;
    color: #F5A623;
    cursor: pointer;
    font-size: 12px;
    font-weight: 850;
    padding: 0;
    text-transform: none;
    letter-spacing: 0;
  }

  .loginForm input {
    width: 100%;
    border: 1px solid #252525;
    border-radius: 14px;
    background: #070707;
    color: #F5F5F5;
    padding: 14px 15px;
    font: inherit;
    outline: none;
    transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
  }

  .loginForm input:focus {
    border-color: rgba(245, 166, 35, .8);
    background: #0d0d0d;
    box-shadow: 0 0 0 4px rgba(245, 166, 35, .12);
  }

  .submitButton {
    min-height: 49px;
    margin-top: 4px;
    border: 0;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    background: linear-gradient(135deg, #F5A623, #d89420);
    color: #050505;
    cursor: pointer;
    font-size: 15px;
    font-weight: 950;
    box-shadow: 0 14px 34px rgba(245, 166, 35, 0.2);
  }

  .submitButton:disabled {
    opacity: .58;
    cursor: not-allowed;
    box-shadow: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0,0,0,.24);
    border-top-color: #050505;
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }

  .createText {
    margin: 20px 0 0;
    text-align: center;
    color: #b8b8b8;
    font-size: 13px;
  }

  .createText a {
    color: #F5A623;
    font-weight: 850;
    text-decoration: none;
  }

  .switchCard {
    margin-top: 16px;
    padding: 13px 15px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .switchCard div,
  .switchCard a {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .switchCard span,
  .switchCard a {
    color: #b8b8b8;
    font-size: 12px;
    font-weight: 800;
  }

  .switchCard a {
    color: #1AEF22;
  }

  .switchIcon {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 9px;
    background: rgba(245, 166, 35, 0.11);
  }

  .switchIcon.green {
    background: rgba(26, 239, 34, 0.1);
  }

  .switchIcon img {
    filter: invert(72%) sepia(60%) saturate(500%) hue-rotate(5deg);
  }

  .switchIcon.green img {
    filter: invert(58%) sepia(98%) saturate(400%) hue-rotate(83deg) brightness(110%);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 520px) {
    .loginNav {
      padding: 0 16px;
    }

    .brandLink strong {
      display: none;
    }

    .loginStage {
      padding: 28px 14px;
      align-items: start;
    }

    .loginHeader h1 {
      font-size: 30px;
    }

    .loginCard {
      padding: 20px;
      border-radius: 20px;
    }

    .switchCard {
      align-items: stretch;
      flex-direction: column;
    }
  }
`;
