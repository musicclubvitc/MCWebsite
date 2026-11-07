import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AVAILABLE_INSTRUMENTS } from '../../data/clubData';
import { 
  Guitar, 
  Plus, 
  X, 
  AlertCircle
} from 'lucide-react';

export const MemberInstruments = () => {
  const { instrumentRequests, addInstrumentRequest, instruments } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use live database instruments, falling back to catalog if inventory is initially unpopulated
  const activeInventory = (instruments && instruments.length > 0) ? instruments : AVAILABLE_INSTRUMENTS;

  // Form State
  const [selectedInstId, setSelectedInstId] = useState(() => activeInventory[0]?.id || 'inst-1');
  const [borrowDate, setBorrowDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [borrowTime, setBorrowTime] = useState('17:00');
  const [returnDate, setReturnDate] = useState(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  });
  const [returnTime, setReturnTime] = useState('10:00');
  const [purpose, setPurpose] = useState('Campus Battle of Bands Rehearsal');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!agreedToTerms) {
      setFormError('Please accept the club equipment safety policy before requesting.');
      return;
    }

    const inst = activeInventory.find(i => i.id === selectedInstId);

    addInstrumentRequest({
      instrumentName: inst ? inst.name : 'Club Instrument',
      instrumentCode: inst ? inst.code : 'INST-01',
      borrowDate,
      borrowTime,
      returnDate,
      returnTime,
      purpose
    });

    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner & Action */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
            Instrument Requisition & Checkout
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Borrow verified club instruments, synthesizers, and drum hardware
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          style={{ fontSize: '0.88rem', padding: '9px 18px' }}
        >
          <Plus className="w-4 h-4" /> Request Instrument
        </button>
      </div>

      {/* Available Gear Inventory Preview */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-sky)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Available Club Gear Inventory
        </div>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px'
          }}
        >
          {activeInventory.slice(0, 6).map((inst) => (
            <div 
              key={inst.id}
              className="glass-panel"
              style={{
                padding: '14px',
                borderRadius: '12px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <img 
                src={inst.image} 
                alt={inst.name}
                style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} 
              />
              <div>
                <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.88rem' }}>{inst.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{inst.code}</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{inst.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Requests List */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', textTransform: 'uppercase', marginBottom: '12px' }}>
          Requisition History
        </div>

        {instrumentRequests.length === 0 ? (
          <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <Guitar className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '1.1rem' }}>No instrument requests</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>Borrow guitars, synthesizers, or microphones for practice.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-secondary"
              style={{ marginTop: '16px', fontSize: '0.82rem' }}
            >
              Request Gear Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {instrumentRequests.map((req) => {
              const statusBadges = {
                Approved: 'badge-success',
                Pending: 'badge-warning',
                Returned: 'badge-sky',
                Rejected: 'badge-danger'
              };

              return (
                <div 
                  key={req.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span className="font-display font-bold text-lg" style={{ color: '#F8FAFC' }}>
                          {req.instrumentName}
                        </span>
                        <span className={statusBadges[req.status] || 'badge-sky'}>
                          {req.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>
                        Tag: {req.instrumentCode}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'monospace', color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.82rem' }}>
                        {req.id}
                      </div>
                      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>
                        Requested {req.createdAt}
                      </div>
                    </div>
                  </div>

                  <div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '10px',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      border: '1px solid var(--blue-border)'
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>ISSUE WINDOW</span>
                      <strong style={{ color: '#F1F5F9' }}>{req.borrowDate} @ {req.borrowTime}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>RETURN SCHEDULED</span>
                      <strong style={{ color: '#CBD5E1' }}>{req.returnDate} @ {req.returnTime}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>PURPOSE</span>
                      <span style={{ color: '#CBD5E1' }}>{req.purpose}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Request Instrument */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            backgroundColor: 'rgba(8, 12, 22, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              border: '1.5px solid var(--blue-sky)',
              borderRadius: '16px',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
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

            <div style={{ marginBottom: '20px' }}>
              <span className="badge-sky">GEAR REQUISITION</span>
              <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC', marginTop: '6px' }}>
                Request Club Instrument
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
                Borrow gear for rehearsals and performances.
              </p>
            </div>

            {formError && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.85rem'
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                  Select Instrument *
                </label>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="input-field"
                >
                  {activeInventory.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.code}) - {inst.available ? 'Available' : 'In Use'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Borrow Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Borrow Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={borrowTime}
                    onChange={(e) => setBorrowTime(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Return Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Return Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                  Purpose *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage Performance Rehearsal"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Terms Checkbox */}
              <div 
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: agreedToTerms ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                  cursor: 'pointer'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={agreedToTerms} 
                  onChange={() => {}} 
                  style={{ marginTop: '2px' }} 
                />
                <span style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                  I agree to return this equipment in good working order and accept responsibility for any physical damage.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit Requisition
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
