import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabase';

export interface BulkGuest {
  id: string;
  token: string;
  name_1: string;
  name_2: string | null;
  invite_type: 'single' | 'double';
  confirmed: boolean | null;
  confirmed_at: string | null;
}

interface ParsedRow {
  line: number;
  name1: string;
  name2: string | null;
  inviteType: 'single' | 'double';
  error?: string;
}

interface BulkAddGuestsFormProps {
  onImported: (guests: BulkGuest[]) => void;
  onCancel: () => void;
}

function rowFromNames(line: number, name1: string, name2: string): ParsedRow {
  const trimmedName1 = name1.trim();
  const trimmedName2 = name2.trim();

  if (!trimmedName1) {
    return { line, name1: '', name2: null, inviteType: 'single', error: 'Falta el nombre.' };
  }
  if (trimmedName2) {
    return { line, name1: trimmedName1, name2: trimmedName2, inviteType: 'double' };
  }
  return { line, name1: trimmedName1, name2: null, inviteType: 'single' };
}

function parseLines(text: string): ParsedRow[] {
  return text
    .split('\n')
    .map((raw, i) => ({ line: i + 1, raw: raw.trim() }))
    .filter((entry) => entry.raw.length > 0)
    .map((entry) => {
      const parts = entry.raw
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length > 2) {
        return {
          line: entry.line,
          name1: entry.raw,
          name2: null,
          inviteType: 'single' as const,
          error: 'Demasiadas comas: como máximo un nombre y un acompañante por línea.',
        };
      }
      return rowFromNames(entry.line, parts[0] ?? '', parts[1] ?? '');
    });
}

function parseSpreadsheet(rows: unknown[][]): ParsedRow[] {
  const dataRows = rows.slice(1); // first row is treated as a header and skipped
  return dataRows
    .map((cells, i) => ({ line: i + 2, cells }))
    .filter(({ cells }) => cells.some((cell) => String(cell ?? '').trim().length > 0))
    .map(({ line, cells }) =>
      rowFromNames(line, String(cells[0] ?? ''), String(cells[1] ?? ''))
    );
}

export default function BulkAddGuestsForm({ onImported, onCancel }: BulkAddGuestsFormProps) {
  const [text, setText] = useState('');
  const [fileRows, setFileRows] = useState<ParsedRow[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => fileRows ?? parseLines(text), [fileRows, text]);
  const validRows = useMemo(() => rows.filter((r) => !r.error), [rows]);
  const errorRows = useMemo(() => rows.filter((r) => r.error), [rows]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setFileError(null);
    setText('');
    setFileName(file.name);

    try {
      const isCsv = file.name.toLowerCase().endsWith('.csv');
      const workbook = isCsv
        ? XLSX.read(await file.text(), { type: 'string' })
        : XLSX.read(await file.arrayBuffer(), { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
      const parsed = parseSpreadsheet(rawRows);

      if (parsed.length === 0) {
        setFileError('No encontramos filas con datos en ese archivo.');
        setFileRows(null);
        return;
      }

      setFileRows(parsed);
    } catch {
      setFileError('No pudimos leer ese archivo. Probá con un .xlsx, .xls o .csv válido.');
      setFileRows(null);
      setFileName(null);
    }
  }

  function clearFile() {
    setFileRows(null);
    setFileName(null);
    setFileError(null);
  }

  async function handleImport() {
    if (validRows.length === 0) return;
    setError(null);
    setImporting(true);

    const payload = validRows.map((row) => ({
      token: crypto.randomUUID(),
      name_1: row.name1,
      name_2: row.name2,
      invite_type: row.inviteType,
    }));

    const { data, error: insertError } = await supabase
      .from('guests')
      .insert(payload)
      .select('id, token, name_1, name_2, invite_type, confirmed, confirmed_at');

    setImporting(false);

    if (insertError || !data) {
      setError(`No se pudo importar (${insertError?.message ?? 'error desconocido'}).`);
      return;
    }

    onImported(data);
    setText('');
    clearFile();
  }

  return (
    <div className="admin-add-panel">
      <p className="admin-bulk-instructions">
        Un invitado por línea (o por fila). Para invitación individual, deja solo el nombre. Para invitación doble,
        agrega el nombre del acompañante.
      </p>

      <div className="admin-bulk-file-row">
        <label className="admin-bulk-file-label">
          Subir Excel o CSV
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="admin-bulk-file-input"
          />
        </label>
        {fileName && (
          <span className="admin-bulk-file-name">
            {fileName}
            <button type="button" className="admin-bulk-file-clear" onClick={clearFile}>
              Quitar
            </button>
          </span>
        )}
      </div>
      <p className="admin-bulk-file-hint">
        Dos columnas: Nombre y Acompañante (opcional). La primera fila se toma como encabezado y se ignora.
      </p>
      {fileError && <p className="admin-login-error">{fileError}</p>}

      <p className="admin-bulk-or">o pega el texto directamente</p>

      <pre className="admin-bulk-example">{'Guadalupe Estévez\nRamiro Rodríguez, María López\nAna Torres'}</pre>

      <textarea
        className="admin-bulk-textarea"
        rows={6}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (fileRows) clearFile();
        }}
        placeholder={'Guadalupe Estévez\nRamiro Rodríguez, María López'}
      />

      {rows.length > 0 && (
        <div className="admin-bulk-preview">
          <p className="admin-bulk-summary">
            {validRows.length} invitado{validRows.length === 1 ? '' : 's'} listo{validRows.length === 1 ? '' : 's'}{' '}
            para importar
            {errorRows.length > 0 && ` · ${errorRows.length} con error`}
          </p>
          <ul className="admin-bulk-list">
            {rows.map((row) => (
              <li key={row.line} className={row.error ? 'has-error' : ''}>
                <span className="admin-bulk-line">#{row.line}</span>
                <span>
                  {row.error
                    ? row.error
                    : `${row.name1}${row.name2 ? ` + ${row.name2}` : ''} · ${
                        row.inviteType === 'double' ? 'Doble' : 'Individual'
                      }`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="admin-login-error">{error}</p>}

      <div className="admin-add-actions">
        <button type="button" className="admin-signout" onClick={onCancel} disabled={importing}>
          Cancelar
        </button>
        <button
          type="button"
          className="admin-login-submit"
          onClick={handleImport}
          disabled={importing || validRows.length === 0}
        >
          {importing
            ? 'Importando…'
            : `Importar ${validRows.length || ''} invitado${validRows.length === 1 ? '' : 's'}`.trim()}
        </button>
      </div>
    </div>
  );
}
