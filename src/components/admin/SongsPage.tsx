import { supabase } from '../../lib/supabase';
import { useAdminGuard } from '../../lib/useAdminGuard';
import SongsByGenre from './SongsByGenre';
import '../../styles/admin.css';

export default function SongsPage() {
  const authorized = useAdminGuard();

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/admin';
  }

  if (!authorized) {
    return <p className="admin-status">Verificando sesión…</p>;
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">K&amp;B</div>
          <span className="admin-title">Canciones por género</span>
        </div>
        <div className="admin-header-right">
          <a className="admin-nav-link" href="/admin/dashboard">
            Invitados
          </a>
          <button type="button" className="admin-signout" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-main">
        <SongsByGenre />
      </main>
    </div>
  );
}
