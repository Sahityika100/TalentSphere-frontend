import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await authApi.signup({ fullName: form.fullName, email: form.email, password: form.password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Smith', icon: User },
    { name: 'email', label: 'Work Email', type: 'email', placeholder: 'hr@company.com', icon: Mail },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: Lock, toggle: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', icon: Lock },
  ];

  return (
    <div style={styles.page}>
      <div className="login-card-pad animate-fade-up" style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>T</div>
          <div>
            <div style={styles.logoText}>Talent<span style={{ color: 'var(--accent)' }}>Sphere</span></div>
            <div style={styles.logoSub}>HR MANAGEMENT</div>
          </div>
        </div>

        <h2 style={styles.title}>Create your account</h2>
        <p style={styles.sub}>Set up your HR portal in seconds</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          {fields.map(({ name, label, type, placeholder, icon: Icon, toggle }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <div style={styles.inputWrap}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <Icon size={15} style={styles.inputIcon} />
                <input
                  name={name} required
                  type={type === 'password' ? (showPass ? 'text' : 'password') : type}
                  value={form[name]} onChange={handle}
                  placeholder={placeholder}
                  style={{ ...styles.input, paddingRight: toggle ? 44 : 12 }}
                />
                {toggle && (
                  <button type="button" onClick={() => setShowPass(s => !s)} style={styles.eyeBtn}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? <><Loader2 size={16} style={styles.spinner} /> Creating account…</> : 'Create HR Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>

      <div style={styles.orb1} />
      <div style={styles.orb2} />
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px 16px', position: 'relative', overflow: 'hidden' },
  card: { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px 36px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, boxShadow: 'var(--shadow)' },
  logo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 },
  logoIcon: { width: 40, height: 40, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#fff' },
  logoText: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-0.03em' },
  logoSub: { fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginTop: 2 },
  title: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--text)', marginBottom: 6 },
  sub: { color: 'var(--text-3)', fontSize: 14, marginBottom: 24 },
  errorBox: { background: 'var(--red-soft)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 500, color: 'var(--text-2)' },
  inputWrap: { display: 'flex', alignItems: 'center', position: 'relative', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'border-color 0.2s' },
  inputIcon: { position: 'absolute', left: 12, color: 'var(--text-3)' },
  input: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, padding: '11px 12px 11px 38px', fontFamily: 'var(--font-body)', width: '100%' },
  eyeBtn: { position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 4 },
  btn: { marginTop: 6, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-body)', transition: 'opacity 0.2s', width: '100%' },
  spinner: { animation: 'spin 1s linear infinite' },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-3)' },
  link: { color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 },
  orb1: { position: 'absolute', top: '-15%', right: '-10%', width: 'min(400px,70vw)', height: 'min(400px,70vw)', background: 'radial-gradient(circle, rgba(124,106,245,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
  orb2: { position: 'absolute', bottom: '-15%', left: '-10%', width: 'min(350px,60vw)', height: 'min(350px,60vw)', background: 'radial-gradient(circle, rgba(124,106,245,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
};
