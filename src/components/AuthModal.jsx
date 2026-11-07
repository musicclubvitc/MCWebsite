import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, AlertCircle, Info } from 'lucide-react';

const CLUB_ROLES = [
  'Select your role',
  'Vocalist',
  'Guitarist',
  'Bassist',
  'Drummer / Percussionist',
  'Keyboardist / Pianist',
  'Violinist / Flutist',
  'Producer',
  'Developer'
];

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginWithCredentials } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

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
          setIsSignUp(false);
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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
            {isSignUp ? 'REGISTER YOURSELF' : 'LOGIN YOUR ACCOUNT'}
          </h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {isSignUp && (
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

          {isSignUp && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                  Register Number
                </label>
                <input
                  type="text"
                  name="regNumber"
                  required
                  placeholder="Enter your register number"
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

          {isSignUp && (
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
            {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Signup' : 'Login')}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.82rem', color: '#94A3B8' }}>
          {isSignUp ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                style={{ background: 'none', border: 'none', color: 'var(--blue-sky)', fontWeight: 600, cursor: 'pointer' }}
              >
                Already an account ?
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => alert("Please contact musicclubvitchennai@gmail.com with your student ID to reset your password.")}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Forget password ?
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                style={{ background: 'none', border: 'none', color: 'var(--blue-sky)', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}
              >
                New User ?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
