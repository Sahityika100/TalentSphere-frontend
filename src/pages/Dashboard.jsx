import React, { useEffect, useState } from 'react';
import { Users, Building2, Star, TrendingUp } from 'lucide-react';
import { employeeApi, departmentApi, designationApi } from '../api';
import { StatCard, Card, Spinner, Badge } from '../components/ui.jsx';

export default function Dashboard() {
  const [data, setData] = useState({ employees: [], departments: [], designations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      employeeApi.getAll(),
      departmentApi.getAll(),
      designationApi.getAll(),
    ]).then(([emp, dept, desig]) => {
      setData({ employees: emp.data, departments: dept.data, designations: desig.data });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const recentEmployees = data.employees.slice(-5).reverse();

  const deptCounts = {};
  data.employees.forEach(e => {
    if (e.departmentId) deptCounts[e.departmentId] = (deptCounts[e.departmentId] || 0) + 1;
  });

  return (
    <div className="page-pad" style={{ padding: '32px', animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px, 5vw, 32px)', letterSpacing: '-0.04em', color: 'var(--text)' }}>
          Good morning 👋
        </h1>
        <p style={{ color: 'var(--text-2)', marginTop: 6, fontSize: 15 }}>
          Here's what's happening with your team today.
        </p>
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Stats Grid */}
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16, marginBottom: 24,
          }}>
            <StatCard label="Total Employees" value={data.employees.length} icon={Users} color="var(--accent)" delay={0} />
            <StatCard label="Departments" value={data.departments.length} icon={Building2} color="var(--amber)" delay={0.05} />
            <StatCard label="Designations" value={data.designations.length} icon={Star} color="var(--green)" delay={0.1} />
            <StatCard label="Avg. Team Size" value={data.departments.length > 0 ? Math.round(data.employees.length / data.departments.length) : 0} icon={TrendingUp} color="#f472b6" delay={0.15} />
          </div>

          {/* Bottom cards */}
          <div className="dashboard-bottom" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Recent Employees */}
            <Card>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 18, color: 'var(--text)' }}>
                Recent Employees
              </h2>
              {recentEmployees.length === 0 ? (
                <p style={{ color: 'var(--text-3)', fontSize: 14 }}>No employees yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentEmployees.map(emp => (
                    <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-soft)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent)', fontWeight: 700, fontSize: 14,
                        fontFamily: 'var(--font-display)', flexShrink: 0,
                      }}>
                        {(emp.firstName?.[0] || '?').toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }} className="truncate">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)' }} className="truncate">{emp.email}</div>
                      </div>
                      {emp.salary && (
                        <Badge color="accent">₹{Number(emp.salary).toLocaleString()}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Departments Overview */}
            <Card>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 18, color: 'var(--text)' }}>
                Departments Overview
              </h2>
              {data.departments.length === 0 ? (
                <p style={{ color: 'var(--text-3)', fontSize: 14 }}>No departments yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {data.departments.map(dept => {
                    const count = deptCounts[dept.id] || 0;
                    const pct = data.employees.length > 0 ? (count / data.employees.length) * 100 : 0;
                    return (
                      <div key={dept.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{dept.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{count} emp</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
