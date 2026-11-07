import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Disc, 
  Plus, 
  Users, 
  X, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const MemberBands = () => {
  const { myBands, addBand, user, showToast } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [memberCount, setMemberCount] = useState(5);
  const [creatorMode, setCreatorMode] = useState('Self'); // 'Self' or 'Others'
  const [bandName, setBandName] = useState('');
  const [members, setMembers] = useState([
    { name: user ? user.name : 'Michael Dias', reg: user ? user.regNumber : '24BCE5259', key: user?.secretKey || '68ff9228ab0faf069397bb24' },
    { name: '', reg: '', key: '' },
    { name: '', reg: '', key: '' },
    { name: '', reg: '', key: '' },
    { name: '', reg: '', key: '' }
  ]);
  const [formError, setFormError] = useState('');

  const handleMemberCountChange = (count) => {
    const num = Math.max(1, Math.min(12, parseInt(count) || 1));
    setMemberCount(num);

    setMembers(prev => {
      const next = [...prev];
      while (next.length < num) {
        next.push({ name: '', reg: '', key: '' });
      }
      return next.slice(0, num);
    });
  };

  const handleCreatorModeChange = (mode) => {
    setCreatorMode(mode);
    setMembers(prev => {
      const updated = [...prev];
      if (mode === 'Self') {
        updated[0] = {
          name: user ? user.name : 'Michael Dias',
          reg: user ? user.regNumber : '24BCE5259',
          key: user?.secretKey || '68ff9228ab0faf069397bb24'
        };
      } else {
        updated[0] = { name: '', reg: '', key: '' };
      }
      return updated;
    });
  };

  const handleMemberFieldChange = (index, field, value) => {
    setMembers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!bandName.trim()) {
      setFormError('Please enter a band name.');
      return;
    }

    const hasEmpty = members.some(m => !m.name.trim() || !m.reg.trim());
    if (hasEmpty) {
      setFormError('Please enter name and register number for all members.');
      return;
    }

    addBand({
      name: bandName,
      genre: 'Official Lineup',
      leader: creatorMode === 'Self' ? (user ? user.name : members[0].name) : members[0].name,
      madeBy: user ? user.name : 'Michael Dias',
      memberCount: memberCount,
      memberNames: members.map(m => m.name),
      registerNumbers: members.map(m => m.reg),
      memberKeys: members.map(m => m.key)
    });

    setBandName('');
    setIsModalOpen(false);
    showToast(`Band "${bandName}" formed successfully!`);
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
            My Bands
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Bands you have created or are a registered member of in VITC Music Club.
          </p>
        </div>

        <button
          onClick={() => {
            handleCreatorModeChange('Self');
            setIsModalOpen(true);
          }}
          className="btn-primary"
          style={{ fontSize: '0.88rem', padding: '9px 18px' }}
        >
          <Plus className="w-4 h-4" /> Form Band
        </button>
      </div>

      {/* Band Cards */}
      {myBands.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center' }}>
          <Disc className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '1.1rem' }}>No bands registered yet</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>You are not currently a member of any band. Form your band roster with fellow club musicians.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary"
            style={{ marginTop: '16px', fontSize: '0.82rem' }}
          >
            Form Your Band
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {myBands.map((band, idx) => (
            <div 
              key={band.id || idx}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge-sky">Band {idx + 1}</span>
                    <span className="badge-success">{band.status || 'Active'}</span>
                  </div>

                  <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC' }}>
                    {band.name}
                  </h3>
                  
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '4px' }}>
                    Made by: <strong style={{ color: '#CBD5E1' }}>{band.madeBy || band.leader}</strong> • Lineup: <strong style={{ color: 'var(--blue-sky)' }}>{band.memberCount || band.memberNames.length} Members</strong>
                  </div>
                </div>

                <div className="badge-sky" style={{ fontSize: '0.78rem' }}>
                  Registered {band.createdAt || '2026-10-15'}
                </div>
              </div>

              {/* Members Table */}
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--blue-border)', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 12px' }}>S.No.</th>
                      <th style={{ padding: '8px 12px' }}>Member Name</th>
                      <th style={{ padding: '8px 12px' }}>Registration Number</th>
                      <th style={{ padding: '8px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {band.memberNames.map((name, mIdx) => (
                      <tr 
                        key={mIdx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                          color: '#CBD5E1'
                        }}
                      >
                        <td style={{ padding: '10px 12px', color: '#64748B' }}>{mIdx + 1}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#F8FAFC' }}>
                          {name}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>
                          {band.registerNumbers ? band.registerNumbers[mIdx] : '24BCE1000'}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ color: '#34D399', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal: Form Band (Matching Screenshot 3) */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            backgroundColor: 'rgba(8, 12, 22, 0.88)',
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
              maxWidth: '720px',
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

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                FORM YOUR BAND
              </h2>
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Member Count */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  How many members you want to add in band ?
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={memberCount}
                  onChange={(e) => handleMemberCountChange(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Creator Mode: Self vs Others */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: creatorMode === 'Self' ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                    background: creatorMode === 'Self' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    color: creatorMode === 'Self' ? 'var(--blue-sky)' : '#94A3B8',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <input
                    type="radio"
                    name="creatorMode"
                    value="Self"
                    checked={creatorMode === 'Self'}
                    onChange={() => handleCreatorModeChange('Self')}
                    style={{ accentColor: 'var(--blue-sky)' }}
                  />
                  Self
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: creatorMode === 'Others' ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                    background: creatorMode === 'Others' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    color: creatorMode === 'Others' ? 'var(--blue-sky)' : '#94A3B8',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <input
                    type="radio"
                    name="creatorMode"
                    value="Others"
                    checked={creatorMode === 'Others'}
                    onChange={() => handleCreatorModeChange('Others')}
                    style={{ accentColor: 'var(--blue-sky)' }}
                  />
                  Others
                </label>
              </div>

              {/* Band Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Band Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Band Name"
                  value={bandName}
                  onChange={(e) => setBandName(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Dynamic Member Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                {members.map((m, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '10px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      border: '1px solid var(--blue-border)'
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '4px' }}>
                        Member {idx + 1} name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`Enter Member ${idx + 1} name`}
                        value={m.name}
                        onChange={(e) => handleMemberFieldChange(idx, 'name', e.target.value)}
                        className="input-field"
                        style={{ paddingBlock: '6px', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '4px' }}>
                        Register number {idx + 1}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`Register number ${idx + 1}`}
                        value={m.reg}
                        onChange={(e) => handleMemberFieldChange(idx, 'reg', e.target.value)}
                        className="input-field"
                        style={{ paddingBlock: '6px', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '4px' }}>
                        Member {idx + 1} key
                      </label>
                      <input
                        type="text"
                        placeholder={`Member ${idx + 1} key`}
                        value={m.key}
                        onChange={(e) => handleMemberFieldChange(idx, 'key', e.target.value)}
                        className="input-field"
                        style={{ paddingBlock: '6px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '0.95rem' }}
              >
                Form Now
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
