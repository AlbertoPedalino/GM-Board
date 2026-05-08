import React, { useEffect, useState } from 'react';

/**
 * DiceRollToast - displays dice roll results
 * Listens to 'gb-dice-roll' events dispatched by sheetRuntime
 */
export function DiceRollToast() {
  const [rolls, setRolls] = useState([]);

  useEffect(() => {
    function handleDiceRoll(event) {
      const { detail } = event;
      if (!detail) return;

      const roll = {
        id: Date.now() + Math.random(),
        type: detail.type,
        label: detail.label,
        result: detail.result,
        timestamp: Date.now(),
      };

      setRolls((prev) => [roll, ...prev].slice(0, 5)); // Keep last 5 rolls

      // Auto-hide after 4 seconds
      setTimeout(() => {
        setRolls((prev) => prev.filter((r) => r.id !== roll.id));
      }, 4000);
    }

    window.addEventListener('gb-dice-roll', handleDiceRoll);
    return () => window.removeEventListener('gb-dice-roll', handleDiceRoll);
  }, []);

  if (rolls.length === 0) return null;

  return (
    <div style={containerStyle}>
      {rolls.map((roll) => (
        <RollItem key={roll.id} roll={roll} />
      ))}
    </div>
  );
}

function RollItem({ roll }) {
  const { type, label, result } = roll;

  let displayText = '';
  let color = 'var(--text2)';

  if (type === 'damage' || type === 'flat-damage') {
    displayText = `🔥 ${label}: ${result.total}`;
    color = 'var(--red2)';
  } else if (type === 'save') {
    displayText = `🛡️ ${label}: ${result.total}`;
    color = 'var(--blue)';
  } else if (type === 'skill') {
    displayText = `🎲 ${label}: ${result.total}`;
    color = 'var(--purple)';
  } else if (type === 'ability') {
    displayText = `💪 ${label}: ${result.total}`;
    color = 'var(--gold)';
  } else if (type === 'initiative') {
    displayText = `⚔️ ${label}: ${result.total}`;
    color = 'var(--green)';
  } else {
    displayText = `${label}: ${result.total}`;
  }

  const rollsText = result.rolls && Array.isArray(result.rolls)
    ? result.rolls.join(' + ')
    : result.roll1 && result.roll2
      ? `${result.roll1}, ${result.roll2}${result.advantage ? ` (${result.advantage})` : ''} → ${result.result}`
      : '?';

  return (
    <div style={{ ...toastItemStyle, borderLeftColor: color }}>
      <div style={toastMainStyle}>{displayText}</div>
      <div style={toastSubStyle}>{rollsText}</div>
    </div>
  );
}

const containerStyle = {
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  zIndex: 5000,
  pointerEvents: 'none',
};

const toastItemStyle = {
  background: 'var(--bg2)',
  borderLeft: '4px solid var(--text2)',
  borderRadius: '4px',
  padding: '0.75rem 1rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  minWidth: '200px',
  maxWidth: '300px',
  animation: 'slideIn 0.3s ease-out',
};

const toastMainStyle = {
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--text2)',
  marginBottom: '0.25rem',
};

const toastSubStyle = {
  fontSize: '0.8rem',
  color: 'var(--text3)',
  fontFamily: 'monospace',
};

// Add animation to document if not already there
if (typeof document !== 'undefined' && !document.querySelector('style[data-dice-toast]')) {
  const style = document.createElement('style');
  style.setAttribute('data-dice-toast', 'true');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
