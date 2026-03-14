import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./AuthGate.module.css";

type Mode = "signin" | "signup";

export function AuthGate() {
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [mode, setMode]         = useState<Mode>("signin");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        await signUp(email, password, name);
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? "Something went wrong.";
      setError(friendlyError(msg));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? "Something went wrong.";
      setError(friendlyError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.bgGlow} aria-hidden />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>◆</span>
          <h1 className={styles.brandName}>one small win</h1>
        </div>
        <p className={styles.brandTagline}>small victories, compounding daily.</p>

        {/* Google */}
        <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
          <GoogleIcon />
          Continue with Google
        </button>

        <div className={styles.divider}><span>or</span></div>

        {/* Email / password form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="osw-name">Your name</label>
              <input
                id="osw-name"
                className={styles.input}
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="osw-email">Email</label>
            <input
              id="osw-email"
              className={styles.input}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="osw-password">Password</label>
            <input
              id="osw-password"
              className={styles.input}
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder={mode === "signup" ? "min. 6 characters" : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "..." : mode === "signin" ? "Sign in →" : "Create account →"}
          </button>
        </form>

        {/* Toggle */}
        <p className={styles.toggle}>
          {mode === "signin" ? "New here?" : "Already have an account?"}
          {" "}
          <button
            className={styles.toggleBtn}
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function friendlyError(msg: string): string {
  if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential"))
    return "Incorrect email or password.";
  if (msg.includes("email-already-in-use"))
    return "An account with this email already exists.";
  if (msg.includes("weak-password"))
    return "Password must be at least 6 characters.";
  if (msg.includes("invalid-email"))
    return "Please enter a valid email address.";
  if (msg.includes("popup-closed"))
    return "Google sign-in was cancelled.";
  if (msg.includes("network-request-failed"))
    return "Network error — check your connection.";
  return msg;
}
