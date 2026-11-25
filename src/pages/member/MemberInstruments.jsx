import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Guitar, 
  Plus, 
  X, 
  AlertCircle,
  RefreshCw,
  Printer,
  Check
} from 'lucide-react';
import { formatImageUrl } from '../../lib/imageUtils';
import { formatTime12h, parseTime12hParts } from '../../lib/timeUtils';
import { InstrumentPrintSlip } from '../../components/InstrumentPrintSlip';

const HOURS_12 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MINUTES_12 = ['00', '15', '30', '45'];

const Time12hSelect = ({ value, onChange }) => {
  const { hour12, minute, period } = parseTime12hParts(value);
  const updatePart = (nextHour, nextMin, nextPeriod) => {
    onChange(`${nextHour}:${nextMin} ${nextPeriod}`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
      <select
        value={hour12}
        onChange={(e) => updatePart(e.target.value, minute, period)}
        className="input-field"
        aria-label="Hour"
      >
        {HOURS_12.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <select
        value={MINUTES_12.includes(minute) ? minute : '00'}
        onChange={(e) => updatePart(hour12, e.target.value, period)}
        className="input-field"
        aria-label="Minute"
      >
        {MINUTES_12.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select
        value={period}
        onChange={(e) => updatePart(hour12, minute, e.target.value)}
        className="input-field"
        aria-label="AM/PM"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export const MemberInstruments = () => {
  const { user, myInstrumentRequests, addInstrumentRequest, instruments, refreshAllLiveData, showToast } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [printRequest, setPrintRequest] = useState(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshAllLiveData) await refreshAllLiveData();
    setIsRefreshing(false);
    if (showToast) showToast("Gear and requisitions refreshed!");
  };

  const userRequests = myInstrumentRequests || [];

  // Active inventory strictly from live database, no hardcoded fallbacks
  const activeInventory = instruments || [];

  // Form State
  const [selectedInstIds, setSelectedInstIds] = useState([]);
  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterClub, setRequesterClub] = useState('VITC Music Club');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    if (user?.name && !requesterName) {
      setRequesterName(user.name);
    }
  }, [user?.name]);

  const toggleInstrumentSelection = (id) => {
    setSelectedInstIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const [borrowDate, setBorrowDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [borrowTime, setBorrowTime] = useState('5:00 PM');
  const [returnDate, setReturnDate] = useState(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  });
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [purpose, setPurpose] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (activeInventory.length === 0) {
      setFormError('No instruments are currently available in the club inventory.');
      return;
    }

    if (selectedInstIds.length === 0) {
      setFormError('Please select at least one instrument from the inventory.');
      return;
    }

    if (!requesterName.trim()) {
      setFormError('Please enter the requester name.');
      return;
    }

    if (!requesterClub.trim()) {
      setFormError('Please enter the requester club or organization.');
      return;
    }

    if (!contactNumber.trim()) {
      setFormError('Please enter a valid contact number.');
      return;
    }

    if (!agreedToTerms) {
      setFormError('Please accept the club equipment safety policy before requesting.');
      return;
    }

    const selectedInstruments = activeInventory
      .filter(i => selectedInstIds.includes(i.id))
      .map(i => ({ id: i.id, name: i.name, code: i.code }));

    if (selectedInstruments.length === 0) {
      setFormError('Please select valid instruments from the inventory.');
      return;
    }

    addInstrumentRequest({
      instruments: selectedInstruments,
      instrumentName: selectedInstruments.map(i => i.name).join(', '),
      instrumentCode: selectedInstruments.map(i => i.code).join(', '),
      requesterName: requesterName.trim(),
      requesterClub: requesterClub.trim(),
      contactNumber: contactNumber.trim(),
      borrowDate,
      borrowTime,
      returnDate,
      returnTime,
      purpose: purpose.trim()
    });

    setSelectedInstIds([]);
    setPurpose('');
    setAgreedToTerms(false);
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              borderRadius: '20px',
              border: '1px solid var(--blue-border)',
              color: 'var(--blue-sky)',
              cursor: 'pointer',
              background: 'rgba(56, 189, 248, 0.08)'
            }}
            title="Refresh gear and requests"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
            style={{ fontSize: '0.88rem', padding: '9px 18px' }}
          >
            <Plus className="w-4 h-4" /> Request Instrument
          </button>
        </div>
      </div>

      {/* Available Gear Inventory Preview */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-sky)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Available Club Gear Inventory
        </div>
        {activeInventory.length === 0 ? (
          <div className="glass-panel" style={{ padding: '24px 20px', textAlign: 'center', borderRadius: '12px', border: '1px solid var(--blue-border)', background: 'rgba(15,23,42,0.6)' }}>
            <Guitar className="w-8 h-8 text-slate-500" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.95rem' }}>No equipment registered yet</div>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '4px' }}>
              Instruments and sound equipment added by club board administrators will appear here for checkout.
            </p>
          </div>
        ) : (
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
                {inst.image && (
                  <img 
                    src={formatImageUrl(inst.image)} 
                    alt={inst.name}
                    style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.88rem' }}>{inst.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{inst.code}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{inst.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Requests List */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', textTransform: 'uppercase', marginBottom: '12px' }}>
          Your Requisition History ({userRequests.length})
        </div>

        {userRequests.length === 0 ? (
          <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center' }}>
            <Guitar className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '1.1rem' }}>No instrument requests yet</h3>
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
            {userRequests.map((req) => {
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {req.status === 'Approved' && (
                        <button
                          onClick={() => setPrintRequest(req)}
                          className="btn-secondary"
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.78rem',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Printer className="w-3.5 h-3.5" /> Print Pass / PDF
                        </button>
                      )}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'monospace', color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.82rem' }}>
                          {req.id}
                        </div>
                        <div style={{ color: '#64748B', fontSize: '0.75rem' }}>
                          Requested {req.createdAt}
                        </div>
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
                      <strong style={{ color: '#F1F5F9' }}>{req.borrowDate} @ {formatTime12h(req.borrowTime)}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>RETURN SCHEDULED</span>
                      <strong style={{ color: '#CBD5E1' }}>{req.returnDate} @ {formatTime12h(req.returnTime)}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>REQUESTER</span>
                      <strong style={{ color: '#F1F5F9' }}>{req.requesterName || req.requester}</strong>
                      {req.requesterClub && (
                        <span style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8' }}>{req.requesterClub}</span>
                      )}
                      {req.contactNumber && (
                        <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{req.contactNumber}</span>
                      )}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1' }}>
                    Select Instruments (Multiple Allowed) *
                  </label>
                  {selectedInstIds.length > 0 && (
                    <span className="badge-sky" style={{ fontSize: '0.72rem' }}>
                      {selectedInstIds.length} selected
                    </span>
                  )}
                </div>

                {activeInventory.length === 0 ? (
                  <div style={{ 
                    padding: '12px 14px', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    borderRadius: '8px', 
                    color: '#fca5a5', 
                    fontSize: '0.85rem' 
                  }}>
                    No instruments are currently registered in club inventory. Contact a board administrator to register equipment before submitting a requisition.
                  </div>
                ) : (
                  <div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '8px',
                      maxHeight: '190px',
                      overflowY: 'auto',
                      padding: '8px',
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--blue-border)',
                      borderRadius: '10px'
                    }}
                  >
                    {activeInventory.map((inst) => {
                      const isSelected = selectedInstIds.includes(inst.id);
                      return (
                        <div
                          key={inst.id}
                          onClick={() => toggleInstrumentSelection(inst.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(56, 189, 248, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSelected ? '1px solid var(--blue-sky)' : '1px solid rgba(255, 255, 255, 0.08)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              border: isSelected ? '1px solid var(--blue-sky)' : '1px solid #64748B',
                              background: isSelected ? 'var(--blue-sky)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3} />}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {inst.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: inst.available ? '#38bdf8' : '#fbbf24', fontFamily: 'monospace' }}>
                              {inst.code} • {inst.available ? 'Available' : 'In Use'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Requester Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Requester Club / Org *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VITC Music Club"
                    value={requesterClub}
                    onChange={(e) => setRequesterClub(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Borrow Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="input-field"
                    style={{ colorScheme: 'dark', color: '#ffffff', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Borrow Time *
                  </label>
                  <Time12hSelect value={borrowTime} onChange={setBorrowTime} />
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
                    min={borrowDate || new Date().toISOString().split('T')[0]}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="input-field"
                    style={{ colorScheme: 'dark', color: '#ffffff', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Return Time *
                  </label>
                  <Time12hSelect value={returnTime} onChange={setReturnTime} />
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
                  disabled={activeInventory.length === 0}
                  className="btn-primary"
                  style={activeInventory.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  Submit Requisition
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Official Instrument Requisition Printout / Modal */}
      {printRequest && (
        <InstrumentPrintSlip
          request={printRequest}
          onClose={() => setPrintRequest(null)}
          approverName={printRequest?.approvedBy || (user?.isAdmin ? user?.name : 'Club Board')}
          approverRole={printRequest?.approverRole || (user?.isAdmin ? user?.role : 'Authorized Signatory')}
          approverDate={printRequest?.approvedAt || printRequest?.createdAt}
        />
      )}

    </div>
  );
};
