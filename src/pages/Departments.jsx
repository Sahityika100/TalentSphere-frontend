import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { departmentApi, employeeApi } from '../api';
import {
  PageHeader, Button, Card, Table, Modal, Field,
  Input, ConfirmDialog, Spinner, Toast, Badge
} from '../components/ui.jsx';
import { useToast } from '../hooks/useToast.js';

const EMPTY_FORM = { name: '', description: '' };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
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
    Promise.all([departmentApi.getAll(), employeeApi.getAll()])
      .then(([d, e]) => { setDepartments(d.data); setEmployees(e.data); })
      .catch(() => toast('Failed to load departments', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name || '', description: row.description || '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast('Department name is required', 'error');
    setSaving(true);
    try {
      if (editing) { await departmentApi.update(editing.id, form); toast('Department updated'); }
      else { await departmentApi.add(form); toast('Department added'); }
      setModalOpen(false);
      load();
    } catch { toast('Something went wrong', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await departmentApi.delete(deleteTarget.id);
      toast('Department deleted');
      setDeleteTarget(null);
      load();
    } catch { toast('Failed to delete', 'error'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (v) => <span style={{ fontWeight: 600, color: 'var(--text)' }}>{v}</span> },
    { key: 'description', label: 'Description' },
    { key: 'id', label: 'Employees', render: (id) => { const count = employees.filter(e => e.departmentId === id).length; return <Badge color="accent">{count}</Badge>; } },
    { key: 'createdAt', label: 'Created', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div className="page-pad" style={{ padding: '32px' }}>
      <PageHeader
        title="Departments"
        subtitle="Manage your organizational departments"
        action={<Button onClick={openAdd}><Plus size={16} /> Add Department</Button>}
      />

      <Card style={{ padding: 0 }}>
        {loading ? <Spinner /> : (
          <Table columns={columns} data={departments} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="No departments found. Add your first department." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <Field label="Department Name" required>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Engineering" />
        </Field>
        <Field label="Description">
          <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
        </Field>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => setModalOpen(false)} variant="ghost">Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{editing ? 'Save Changes' : 'Add Department'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Department"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
