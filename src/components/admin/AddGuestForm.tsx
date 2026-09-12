import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

export interface NewGuest {
  id: string;
  token: string;
  name_1: string;
  name_2: string | null;
  invite_type: 'single' | 'double';
  confirmed: boolean | null;
  confirmed_at: string | null;
}

interface AddGuestFormProps {
  onCreated: (guest: NewGuest) => void;
  onCancel: () => void;
}

export default function AddGuestForm({ onCreated, onCancel }: AddGuestFormProps) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [inviteType, setInviteType] = useState<'single' | 'double'>('single');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName1 = name1.trim();
    const trimmedName2 = name2.trim();

    if (!trimmedName1) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (inviteType === 'double' && !trimmedName2) {
      setError('Ingresa el segundo nombre para una invitación doble.');
      return;
    }

    setSaving(true);

    const { data, error: insertError } = await supabase
      .from('guests')
      .insert({
        token: crypto.randomUUID(),
        name_1: trimmedName1,
        name_2: inviteType === 'double' ? trimmedName2 : null,
        invite_type: inviteType,
      })
      .select('id, token, name_1, name_2, invite_type, confirmed, confirmed_at')
      .single();

    setSaving(false);

    if (insertError || !data) {
      setError(`No se pudo agregar el invitado (${insertError?.message ?? 'error desconocido'}).`);
      return;
    }

    onCreated(data);
    setName1('');
    setName2('');
    setInviteType('single');
  }

  return (
    <form className="admin-add-panel" onSubmit={handleSubmit}>
      <div className="admin-add-fields">
        <div className="admin-field">
          <label htmlFor="new-guest-name1">Nombre</label>
          <input
            id="new-guest-name1"
            type="text"
            required
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="Ej. Guadalupe Estévez"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="new-guest-type">Tipo de invitación</label>
          <select
            id="new-guest-type"
            value={inviteType}
            onChange={(e) => setInviteType(e.target.value as 'single' | 'double')}
          >
            <option value="single">Individual</option>
            <option value="double">Doble</option>
          </select>
        </div>

        {inviteType === 'double' && (
          <div className="admin-field">
            <label htmlFor="new-guest-name2">Acompañante</label>
            <input
              id="new-guest-name2"
              type="text"
              required
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Nombre del acompañante"
            />
          </div>
        )}
      </div>

      {error && <p className="admin-login-error">{error}</p>}

      <div className="admin-add-actions">
        <button type="button" className="admin-signout" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="admin-login-submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar invitado'}
        </button>
      </div>
    </form>
  );
}
