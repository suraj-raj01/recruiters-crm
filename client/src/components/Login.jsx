import { Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function Login({ loading, error, onLogin }) {
  const [form, setForm] = useState({
    email: "suraj@talentdeck.dev",
    password: "suraj123"
  });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onLogin(form);
  }

  return (
    <main className="login-screen">
      <section className="login-card" aria-label="Login">
        <div className="brand-mark">TD</div>
        <div>
          <p className="eyebrow">TalentDeck</p>
          <h1>Recruiter ATS</h1>
        </div>

        <form className="login-form" onSubmit={submit}>
          <label>
            Email
            <span className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label>
            Password
            <span className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                autoComplete="current-password"
                required
              />
            </span>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-action" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
