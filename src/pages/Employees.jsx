import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { employeeApi, departmentApi, designationApi } from '../api';
import {
  PageHeader, Button, Card, Table, Modal, Field,
  Input, Select, ConfirmDialog, Spinner, Toast, Badge
} from '../components/ui.jsx';
import { useToast } from '../hooks/useToast.js';

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '',
  phoneNumber: '', salary: '', departmentId: '', designationId: '',
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, toast } = useToast();

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      employeeApi.getAll(),
      departmentApi.getAll(),
      designationApi.getAll(),
    ]).then(([emp, dept, desig]) => {
      setEmployees(emp.data);
      setDepartments(dept.data);
      setDesignations(desig.data);
    }).catch(() => toast('Failed to load data', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const r = await employeeApi.search(q);
      setSearchResults(r.data);
    } catch {
      toast('Search failed', 'error');
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = () => { setSearchQuery(''); setSearchResults(null); };
  const displayedEmployees = searchResults !== null ? searchResults : employees;
  const getDeptName = (id) => departments.find(d => d.id === id)?.name || '—';
  const getDesigTitle = (id) => designations.find(d => d.id === id)?.title || '—';

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      firstName: row.firstName || '', lastName: row.lastName || '',
      email: row.email || '', phoneNumber: row.phoneNumber || '',
      salary: row.salary || '',
      departmentId: row.departmentId ? String(row.departmentId) : '',
      designationId: row.designationId ? String(row.designationId) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return toast('First and last name required', 'error');
    if (!form.email.trim()) return toast('Email is required', 'error');
    setSaving(true);
    try {
      const payload = {
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        designationId: form.designationId ? Number(form.designationId) : null,
      };
      if (editing) {
        await employeeApi.update(editing.id, payload);
        toast('Employee updated');
      } else {
        await employeeApi.add(payload);
        toast('Employee added');
      }
      setModalOpen(false);
      loadAll();
    } catch {
      toast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeApi.delete(deleteTarget.id);
      toast('Employee deleted');
      setDeleteTarget(null);
      loadAll();
    } catch {
      toast('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const columns = [
    {
      key: 'firstName', label: 'Employee',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-display)', flexShrink: 0,
          }}>
            {(v?.[0] || '?').toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14, whiteSpace: 'nowrap' }}>
              {row.firstName} {row.lastName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{row.email}</div>
          </div>
        </div>
      )
    },
    { key: 'phoneNumber', label: 'Phone', render: v => v || '—' },
    { key: 'departmentId', label: 'Department', render: (v) => v ? <Badge color="amber">{getDeptName(v)}</Badge> : '—' },
    { key: 'designationId', label: 'Designation', render: (v) => v ? <Badge color="green">{getDesigTitle(v)}</Badge> : '—' },
    { key: 'salary', label: 'Salary', render: (v) => v ? <span style={{ color: 'var(--accent)', fontWeight: 500 }}>₹{Number(v).toLocaleString()}</span> : '—' },
  ];

  return (
    <div className="page-pad" style={{ padding: '32px' }}>
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} team members`}
        action={<Button onClick={openAdd}><Plus size={16} /> Add Employee</Button>}
      />

      {/* Search bar */}
      <div className="search-row" style={{ marginBottom: 20, display: 'flex', gap: 10, maxWidth: 480 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(searchQuery); }}
            placeholder="Search by name... (press Enter)"
            style={{
              width: '100%', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              padding: '9px 36px 9px 36px', color: 'var(--text)', fontSize: 14,
              fontFamily: 'var(--font-body)', outline: 'none',
            }}
          />
          {searchQuery && (
            <button onClick={clearSearch} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
              <X size={14} />
            </button>
          )}
        </div>
        <Button onClick={() => handleSearch(searchQuery)} variant="secondary" loading={searching}>Search</Button>
      </div>

      {searchResults !== null && (
        <div style={{ marginBottom: 14, fontSize: 13, color: 'var(--text-3)' }}>
          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
          {' · '}<button onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13 }}>Clear</button>
        </div>
      )}

      <Card style={{ padding: 0 }}>
        {loading ? <Spinner /> : (
          <Table
            columns={columns}
            data={displayedEmployees}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            emptyMessage={searchResults !== null ? 'No employees match your search.' : 'No employees yet. Add your first employee.'}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Employee' : 'Add Employee'}>
        <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="First Name" required><Input value={form.firstName} onChange={setF('firstName')} placeholder="John" /></Field>
          <Field label="Last Name" required><Input value={form.lastName} onChange={setF('lastName')} placeholder="Doe" /></Field>
        </div>
        <Field label="Email" required><Input value={form.email} onChange={setF('email')} placeholder="john@company.com" type="email" /></Field>
        <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="Phone Number"><Input value={form.phoneNumber} onChange={setF('phoneNumber')} placeholder="+91 98765 43210" /></Field>
          <Field label="Salary (₹)"><Input value={form.salary} onChange={setF('salary')} placeholder="500000" type="number" /></Field>
        </div>
        <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="Department">
            <Select value={form.departmentId} onChange={setF('departmentId')}>
              <option value="">No department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </Field>
          <Field label="Designation">
            <Select value={form.designationId} onChange={setF('designationId')}>
              <option value="">No designation</option>
              {designations.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </Select>
          </Field>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => setModalOpen(false)} variant="ghost">Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{editing ? 'Save Changes' : 'Add Employee'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Employee"
        message={`Delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This cannot be undone.`}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
