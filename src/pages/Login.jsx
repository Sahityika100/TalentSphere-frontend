import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="login-card-pad" style={styles.card} className="animate-fade-up">
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>T</div>
          <div>
            <div style={styles.logoText}>Talent<span style={{ color: 'var(--accent)' }}>Sphere</span></div>
            <div style={styles.logoSub}>HR MANAGEMENT</div>
          </div>
        </div>

        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Sign in to your HR portal</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                name="email" type="email" required
                value={form.email} onChange={handle}
                placeholder="hr@company.com"
                style={styles.input}
                onFocus={e => e.target.parentElement.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.parentElement.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                name="password" type={showPass ? 'text' : 'password'} required
                value={form.password} onChange={handle}
                placeholder="••••••••"
                style={{ ...styles.input, paddingRight: 44 }}
                onFocus={e => e.target.parentElement.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.parentElement.style.borderColor = 'var(--border)'}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={styles.eyeBtn}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? <><Loader2 size={16} style={styles.spinner} /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Create one</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--text-3)' }}>
          Demo: demo@talentsphere.com · Demo123
        </p>
      </div>

      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg)', padding: '20px 16px', position: 'relative', overflow: 'hidden',
  },
  card: {
    background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
    padding: '40px 36px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
    boxShadow: 'var(--shadow)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 },
  logoIcon: { width: 40, height: 40, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#fff' },
  logoText: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-0.03em' },
  logoSub: { fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginTop: 2 },
  title: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--text)', marginBottom: 6 },
  sub: { color: 'var(--text-3)', fontSize: 14, marginBottom: 28 },
  errorBox: { background: 'var(--red-soft)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: 'var(--text-2)' },
  inputWrap: { display: 'flex', alignItems: 'center', position: 'relative', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'border-color 0.2s' },
  inputIcon: { position: 'absolute', left: 12, color: 'var(--text-3)' },
  input: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, padding: '11px 12px 11px 38px', fontFamily: 'var(--font-body)', width: '100%' },
  eyeBtn: { position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 4 },
  btn: { marginTop: 4, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-body)', transition: 'opacity 0.2s, transform 0.1s', width: '100%' },
  spinner: { animation: 'spin 1s linear infinite' },
  switchText: { textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-3)' },
  link: { color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 },
  orb1: { position: 'absolute', top: '-20%', right: '-10%', width: 'min(400px, 70vw)', height: 'min(400px, 70vw)', background: 'radial-gradient(circle, rgba(124,106,245,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
  orb2: { position: 'absolute', bottom: '-20%', left: '-10%', width: 'min(350px, 60vw)', height: 'min(350px, 60vw)', background: 'radial-gradient(circle, rgba(124,106,245,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
};
