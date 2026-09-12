import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import '../../styles/admin.css';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      console.error('Supabase sign-in error:', signInError.status, signInError.message);
      setError(
        signInError.status === 400 || signInError.status === 422
          ? 'Email o contraseña incorrectos.'
          : `No pudimos iniciar sesión (${signInError.message}).`
      );
      setLoading(false);
      return;
    }

    window.location.href = '/admin/dashboard';
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-seal">K&amp;B</div>
        <p className="admin-login-title">Panel administrativo</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Contraseña</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="admin-login-submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
