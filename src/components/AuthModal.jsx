import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, AlertCircle, Info, Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

const CLUB_ROLES = [
  'Select your role',
  'Vocalist',
  'Guitarist',
  'Bassist',
  'Drummer / Percussionist',
  'Keyboardist / Pianist',
  'Violinist / Flutist',
  'Producer'
];

export const AuthModal = ({ isOpen, onClose }) => {
  const { 
    loginWithCredentials, 
    sendPasswordResetEmail, 
    updateUserPassword, 
    isRecoveryMode, 
    setIsRecoveryMode 
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot_password' | 'update_password'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regNumber: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync mode if arriving via a recovery email link
  useEffect(() => {
    if (isRecoveryMode) {
      setMode('update_password');
      setError('');
      setInfoMessage('You have been authenticated via recovery token. Please set your new password below.');
    }
  }, [isRecoveryMode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    const isSignUp = mode === 'signup';

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!formData.role || formData.role === 'Select your role') {
        setError('Please select your role in the club.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await loginWithCredentials({ ...formData, isSignUp });
      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }
      if (res?.pendingApproval) {
        setInfoMessage('Account created! Your account is pending admin approval before you can log in.');
        setIsLoading(false);
        setTimeout(() => {
          setMode('login');
          setInfoMessage('Please wait for a board administrator to verify your account.');
        }, 3000);
        return;
      }
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!formData.email || !formData.email.trim()) {
      setError('Please enter your institutional student email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPasswordResetEmail(formData.email.trim());
      if (res?.error) {
        setError(res.error);
      } else {
        setInfoMessage(`Password reset link automatically sent to ${formData.email}! Please check your Outlook inbox and spam folder.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to dispatch password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateUserPassword(formData.password);
      if (res?.error) {
        setError(res.error);
      } else {
        setInfoMessage('Password updated successfully! You can now log in.');
        setTimeout(() => {
          setMode('login');
          setInfoMessage('');
          if (setIsRecoveryMode) setIsRecoveryMode(false);
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(9, 14, 25, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1.5px solid var(--blue-border)',
          borderRadius: '16px',
          padding: '28px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: '#94A3B8',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '10px' }} 
          />
          <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC', letterSpacing: '0.5px' }}>
            {mode === 'signup' && 'REGISTER YOURSELF'}
            {mode === 'login' && 'LOGIN YOUR ACCOUNT'}
            {mode === 'forgot_password' && 'RESET PASSWORD'}
            {mode === 'update_password' && 'SET NEW PASSWORD'}
          </h2>
          {mode === 'forgot_password' && (
            <p style={{ color: '#94A3B8', fontSize: '0.84rem', marginTop: '6px', lineHeight: '1.5' }}>
              Enter your registered student email address. Supabase will automatically send you an instant password reset link.
            </p>
          )}
          {mode === 'update_password' && (
            <p style={{ color: '#94A3B8', fontSize: '0.84rem', marginTop: '6px', lineHeight: '1.5' }}>
              Enter your new credentials below to update your music club account.
            </p>
          )}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            lineHeight: '1.4'
          }}>
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#7dd3fc',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            lineHeight: '1.4'
          }}>
            <Info className="w-4 h-4 shrink-0 text-sky-400" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* 1. LOGIN & SIGNUP FORMS */}
        {(mode === 'login' || mode === 'signup') && (
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  style={{ paddingBlock: '8px' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="student@vitstudent.ac.in"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                style={{ paddingBlock: '8px' }}
              />
            </div>

            {mode === 'signup' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Register Number
                  </label>
                  <input
                    type="text"
                    name="regNumber"
                    required
                    placeholder="e.g. 24BCE5259"
                    value={formData.regNumber}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingBlock: '8px', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Role in Club
                  </label>
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingBlock: '8px' }}
                  >
                    {CLUB_ROLES.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                style={{ paddingBlock: '8px' }}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  style={{ paddingBlock: '8px' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '10px',
                fontSize: '0.92rem',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (mode === 'signup' ? 'Creating account...' : 'Signing in...') : (mode === 'signup' ? 'Signup' : 'Login')}
            </button>
          </form>
        )}

        {/* 2. AUTOMATIC FORGOT PASSWORD FORM (SUPABASE SENDS EMAIL LINK) */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                Institutional Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="student@vitstudent.ac.in"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                style={{ paddingBlock: '8px' }}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '10px',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <Mail className="w-4 h-4" />
              {isLoading ? 'Dispatching Reset Link...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}

        {/* 3. SET NEW PASSWORD FORM (WHEN ARRIVING FROM RECOVERY LINK) */}
        {mode === 'update_password' && (
          <form onSubmit={handleUpdatePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                New Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Enter at least 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                style={{ paddingBlock: '8px' }}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                style={{ paddingBlock: '8px' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '10px',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <KeyRound className="w-4 h-4" />
              {isLoading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {/* Footer Navigation Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', fontSize: '0.82rem', color: '#94A3B8' }}>
          {mode === 'signup' && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => { setMode('forgot_password'); setError(''); setInfoMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Forgot password ?
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setInfoMessage(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--blue-sky)', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Already have an account ?
              </button>
            </div>
          )}

          {mode === 'login' && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => { setMode('forgot_password'); setError(''); setInfoMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Forgot password ?
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setInfoMessage(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--blue-sky)', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}
              >
                New User ?
              </button>
            </div>
          )}

          {mode === 'forgot_password' && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setInfoMessage(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--blue-sky)', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setInfoMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Create Account
              </button>
            </div>
          )}

          {mode === 'update_password' && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setInfoMessage(''); if (setIsRecoveryMode) setIsRecoveryMode(false); }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Cancel and return to Login
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
