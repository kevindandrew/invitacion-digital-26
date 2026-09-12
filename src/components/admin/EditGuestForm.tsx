import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

export interface EditableGuest {
  id: string;
  name_1: string;
  name_2: string | null;
  invite_type: 'single' | 'double';
}

interface EditGuestFormProps {
  guest: EditableGuest;
  onSaved: (guest: EditableGuest) => void;
  onCancel: () => void;
}

export default function EditGuestForm({ guest, onSaved, onCancel }: EditGuestFormProps) {
  const [name1, setName1] = useState(guest.name_1);
  const [name2, setName2] = useState(guest.name_2 ?? '');
  const [inviteType, setInviteType] = useState<'single' | 'double'>(guest.invite_type);
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

    const { data, error: updateError } = await supabase
      .from('guests')
      .update({
        name_1: trimmedName1,
        name_2: inviteType === 'double' ? trimmedName2 : null,
        invite_type: inviteType,
      })
      .eq('id', guest.id)
      .select('id, name_1, name_2, invite_type')
      .single();

    setSaving(false);

    if (updateError || !data) {
      setError(`No se pudo guardar (${updateError?.message ?? 'error desconocido'}).`);
      return;
    }

    onSaved(data);
  }

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <p className="admin-modal-title">Editar invitado</p>

        <form className="admin-edit-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="edit-guest-name1">Nombre</label>
            <input
              id="edit-guest-name1"
              type="text"
              required
              value={name1}
              onChange={(e) => setName1(e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="edit-guest-type">Tipo de invitación</label>
            <select
              id="edit-guest-type"
              value={inviteType}
              onChange={(e) => setInviteType(e.target.value as 'single' | 'double')}
            >
              <option value="single">Individual</option>
              <option value="double">Doble</option>
            </select>
          </div>

          {inviteType === 'double' && (
            <div className="admin-field">
              <label htmlFor="edit-guest-name2">Acompañante</label>
              <input
                id="edit-guest-name2"
                type="text"
                required
                value={name2}
                onChange={(e) => setName2(e.target.value)}
              />
            </div>
          )}

          {error && <p className="admin-login-error">{error}</p>}

          <div className="admin-add-actions">
            <button type="button" className="admin-signout" onClick={onCancel} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="admin-login-submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
