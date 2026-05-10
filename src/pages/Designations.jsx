import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { designationApi, employeeApi } from '../api';
import {
  PageHeader, Button, Card, Table, Modal, Field,
  Input, Select, ConfirmDialog, Spinner, Toast, Badge
} from '../components/ui.jsx';
import { useToast } from '../hooks/useToast.js';

const LEVELS = ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Level'];
const EMPTY_FORM = { title: '', level: '' };

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, toast } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([designationApi.getAll(), employeeApi.getAll()])
      .then(([d, e]) => { setDesignations(d.data); setEmployees(e.data); })
      .catch(() => toast('Failed to load designations', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ title: row.title || '', level: row.level || '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast('Title is required', 'error');
    setSaving(true);
    try {
      if (editing) { await designationApi.update(editing.id, form); toast('Designation updated'); }
      else { await designationApi.add(form); toast('Designation added'); }
      setModalOpen(false);
      load();
    } catch { toast('Something went wrong', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await designationApi.delete(deleteTarget.id);
      toast('Designation deleted');
      setDeleteTarget(null);
      load();
    } catch { toast('Failed to delete', 'error'); }
    finally { setDeleting(false); }
  };

  const levelColor = (level) => {
    if (!level) return 'accent';
    const l = level.toLowerCase();
    if (l.includes('senior') || l.includes('lead')) return 'amber';
    if (l.includes('manager') || l.includes('director') || l.includes('vp') || l.includes('c-')) return 'red';
    if (l.includes('junior')) return 'green';
    return 'accent';
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title', render: (v) => <span style={{ fontWeight: 600, color: 'var(--text)' }}>{v}</span> },
    { key: 'level', label: 'Level', render: (v) => v ? <Badge color={levelColor(v)}>{v}</Badge> : '—' },
    { key: 'id', label: 'Employees', render: (id) => { const count = employees.filter(e => e.designationId === id).length; return <Badge color="accent">{count}</Badge>; } },
  ];

  return (
    <div className="page-pad" style={{ padding: '32px' }}>
      <PageHeader
        title="Designations"
        subtitle="Define roles and seniority levels"
        action={<Button onClick={openAdd}><Plus size={16} /> Add Designation</Button>}
      />

      <Card style={{ padding: 0 }}>
        {loading ? <Spinner /> : (
          <Table columns={columns} data={designations} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="No designations found. Add your first designation." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Designation' : 'Add Designation'}>
        <Field label="Title" required>
          <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Software Engineer" />
        </Field>
        <Field label="Level">
          <Select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
            <option value="">Select level...</option>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
        </Field>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => setModalOpen(false)} variant="ghost">Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{editing ? 'Save Changes' : 'Add Designation'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Designation"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
