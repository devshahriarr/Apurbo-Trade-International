"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, LockKeyhole } from "lucide-react";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
    setBusy(false);
    if (result?.error) setError("Email or password is incorrect.");
    else router.replace("/admin");
  }
  return <main className={styles.page}><section className={styles.card}>
    <div className={styles.brand}><span><Building2 size={20}/></span><div><strong>ATI Workspace</strong><small>Business documents, in one place</small></div></div>
    <div className={styles.heading}><p>ADMINISTRATION</p><h1>Welcome back</h1><span>Sign in to manage your businesses and documents.</span></div>
    <form onSubmit={submit} className={styles.form}>
      <label>Email address<input name="email" type="email" autoComplete="username" required placeholder="you@company.com"/></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required placeholder="Enter your password"/></label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}<ArrowRight size={16}/></button>
    </form><footer><LockKeyhole size={14}/> Secure, business-scoped access</footer>
  </section><aside className={styles.aside}><div><small>APURBO TRADE INTERNATIONAL</small><h2>Your documents.<br/>Clear and organized.</h2><p>Create, issue, and find business documents across your companies from a single workspace.</p><div className={styles.asideFoot}>Document management · Business operations · Reporting</div></div></aside></main>;
}
