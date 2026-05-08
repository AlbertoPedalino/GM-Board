import React, { useEffect, useState } from 'react';
import { loadSheetSpellDb } from './sheetSpellDb.js';

/**
 * React-based spell picker modal
 * Allows adding/removing spells from character
 */
export function SpellPickerModal({ isOpen, character, onClose, onSpellSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('known'); // 'known', 'available', 'prepared'
  const [spellDb, setSpellDb] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load spell database on mount
  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    loadSheetSpellDb()
      .then((spells) => {
        setSpellDb(Array.isArray(spells) ? spells : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load spell database:', err);
        setSpellDb([]);
        setLoading(false);
      });
  }, [isOpen]);

  const handleSpellClick = (spell) => {
    if (onSpellSelect) {
      onSpellSelect(spell);
    }
  };

  const filteredSpells = spellDb.filter((spell) => {
    const q = searchQuery.toLowerCase();
    return String(spell?.name || '').toLowerCase().includes(q);
  }).slice(0, 50);

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <h2>Spell Picker</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text2)',
            }}
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search spells..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />

        <div style={tabsStyle}>
          <button
            onClick={() => setSelectedTab('known')}
            style={{
              ...tabButtonStyle,
              ...(selectedTab === 'known' ? tabButtonActiveStyle : {}),
            }}
          >
            Known
          </button>
          <button
            onClick={() => setSelectedTab('available')}
            style={{
              ...tabButtonStyle,
              ...(selectedTab === 'available' ? tabButtonActiveStyle : {}),
            }}
          >
            Available
          </button>
          <button
            onClick={() => setSelectedTab('prepared')}
            style={{
              ...tabButtonStyle,
              ...(selectedTab === 'prepared' ? tabButtonActiveStyle : {}),
            }}
          >
            Prepared
          </button>
        </div>

        <div style={spellListStyle}>
          {loading ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text3)' }}>
              Loading spells...
            </div>
          ) : filteredSpells.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text3)' }}>
              No spells found.
            </div>
          ) : (
            filteredSpells.map((spell) => (
              <div
                key={`${spell.name}-${spell.source || ''}`}
                onClick={() => handleSpellClick(spell)}
                style={spellItemStyle}
              >
                <div style={{ fontWeight: 500 }}>{spell.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
                  {spell.level > 0 ? `Level ${spell.level}` : 'Cantrip'} · {spell.school || '-'}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={modalFooterStyle}>
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              background: 'var(--bg2)',
              color: 'var(--text2)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
};

const modalContentStyle = {
  background: 'var(--bg1)',
  borderRadius: '8px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--bdr)',
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem',
  borderBottom: '1px solid var(--bdr)',
  h2: { margin: 0 },
};

const searchInputStyle = {
  padding: '0.75rem 1.5rem',
  border: 'none',
  background: 'var(--bg2)',
  color: 'var(--text2)',
  borderRadius: 0,
  outline: 'none',
  fontSize: '1rem',
};

const tabsStyle = {
  display: 'flex',
  borderBottom: '1px solid var(--bdr)',
  padding: '0 1.5rem',
};

const tabButtonStyle = {
  flex: 1,
  padding: '0.75rem 0',
  background: 'none',
  border: 'none',
  borderBottom: '2px solid transparent',
  color: 'var(--text3)',
  cursor: 'pointer',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tabButtonActiveStyle = {
  color: 'var(--gold)',
  borderBottomColor: 'var(--gold)',
};

const spellListStyle = {
  flex: 1,
  overflow: 'auto',
  padding: '0.75rem 1.5rem',
};

const spellItemStyle = {
  padding: '0.75rem',
  marginBottom: '0.5rem',
  background: 'var(--bg2)',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '1px solid var(--bdr2)',
  transition: 'all 0.2s ease',
  ':hover': {
    background: 'var(--bg3)',
    borderColor: 'var(--gold)',
  },
};

const modalFooterStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  padding: '1.5rem',
  borderTop: '1px solid var(--bdr)',
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: '1px solid var(--bdr)',
  cursor: 'pointer',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
