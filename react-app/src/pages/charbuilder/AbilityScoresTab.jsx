import { useState } from 'react';
import { useCharbuilderContext } from './CharbuilderContext.jsx';

const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const SLBL = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
const PB_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const SA_ARR = [15, 14, 13, 12, 10, 8];
const METHODS = [
  { key: 'pointbuy', label: 'Point Buy' },
  { key: 'array', label: 'Standard Array' },
  { key: 'dice', label: 'Roll Dice' },
  { key: 'manual', label: 'Manual' },
];

function getMod(val) {
  return Math.floor(((Number(val) || 10) - 10) / 2);
}

function modStr(val) {
  const m = getMod(val);
  if (m === 0) return '±0';
  return m > 0 ? `+${m}` : `${m}`;
}

function roll4d6DropLowest() {
  const rolls = [];
  for (let i = 0; i < 4; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1);
  }
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((s, v) => s + v, 0);
}

function getSpeciesBonuses(speciesObj) {
  const out = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (!speciesObj) return out;
  const abil = speciesObj.ability || [];
  for (const entry of abil) {
    for (const s of STATS) {
      if (entry[s] != null) out[s] += Number(entry[s]);
    }
  }
  return out;
}

function getBgBonuses(bgObj, bgAbility) {
  const out = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (!bgObj) return out;
  const arr = Array.isArray(bgAbility) && bgAbility.length === 2 ? bgAbility : [];
  for (const s of arr) {
    if (s && out[s] != null) out[s] += 1;
  }
  return out;
}

const T = {
  tabRow: { display: 'flex', gap: 0, borderBottom: '1px solid rgba(199,167,99,.2)', marginBottom: 16 },
  tabBtn: (active) => ({
    flex: 1,
    padding: '8px 6px',
    cursor: 'pointer',
    background: active ? 'rgba(202,165,80,.12)' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid #caa550' : '2px solid transparent',
    color: active ? '#edd48a' : '#8f7a57',
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.05em',
    textTransform: 'uppercase',
    transition: 'all .15s',
  }),
  section: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: 13,
    fontWeight: 700,
    color: '#edd48a',
    marginBottom: 10,
    letterSpacing: '.05em',
    textTransform: 'uppercase',
  },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 },
  statCard: (highlight) => ({
    background: highlight ? 'rgba(202,165,80,.15)' : '#23201a',
    border: highlight ? '1px solid #caa550' : '1px solid rgba(199,167,99,.2)',
    borderRadius: 6,
    padding: '8px 4px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all .15s',
  }),
  statLbl: {
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: 9,
    letterSpacing: '.08em',
    color: '#8f7a57',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statVal: { fontSize: 22, fontWeight: 700, color: '#efe6d4', lineHeight: 1.2 },
  statMod: { fontSize: 12, color: '#c4b393', marginTop: 1 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' },
  label: { color: '#c4b393', fontSize: 13 },
  val: { color: '#efe6d4', fontWeight: 700, fontSize: 15, minWidth: 24, textAlign: 'center' },
  btn: (disabled) => ({
    width: 28,
    height: 28,
    borderRadius: 4,
    border: '1px solid rgba(199,167,99,.3)',
    background: disabled ? '#1a1713' : 'rgba(202,165,80,.15)',
    color: disabled ? '#5a4a3a' : '#caa550',
    fontSize: 16,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  }),
  remaining: {
    textAlign: 'center',
    padding: '8px 0',
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: 14,
    fontWeight: 700,
    color: '#edd48a',
    letterSpacing: '.05em',
  },
  saPickRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12, justifyContent: 'center' },
  saPick: (active, used) => ({
    width: 40,
    height: 40,
    borderRadius: 6,
    border: active ? '2px solid #caa550' : used ? '1px solid rgba(199,167,99,.1)' : '1px solid rgba(199,167,99,.3)',
    background: used ? '#1a1713' : active ? 'rgba(202,165,80,.2)' : '#23201a',
    color: used ? '#5a4a3a' : active ? '#edd48a' : '#efe6d4',
    fontWeight: 700,
    fontSize: 16,
    cursor: used ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s',
    opacity: used ? 0.4 : 1,
  }),
  dicePoolRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12, justifyContent: 'center' },
  dicePoolItem: (sel) => ({
    width: 44,
    height: 44,
    borderRadius: 6,
    border: sel ? '2px solid #caa550' : '1px solid rgba(199,167,99,.3)',
    background: sel ? 'rgba(202,165,80,.2)' : '#23201a',
    color: '#efe6d4',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s',
  }),
  rollBtn: {
    display: 'block',
    margin: '0 auto 12px',
    padding: '8px 20px',
    borderRadius: 6,
    border: '1px solid rgba(202,165,80,.4)',
    background: 'rgba(202,165,80,.15)',
    color: '#caa550',
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '.05em',
    textTransform: 'uppercase',
  },
  manualInput: {
    width: 50,
    background: '#1a1713',
    border: '1px solid rgba(199,167,99,.3)',
    borderRadius: 4,
    color: '#efe6d4',
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
    padding: '4px 0',
    outline: 'none',
  },
  finalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 6,
    marginTop: 16,
    padding: 12,
    background: 'rgba(202,165,80,.06)',
    border: '1px solid rgba(199,167,99,.2)',
    borderRadius: 8,
  },
  finalHdr: {
    gridColumn: '1 / -1',
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: 11,
    fontWeight: 700,
    color: '#edd48a',
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 4,
  },
  breakRow: { display: 'flex', fontSize: 11, color: '#8f7a57', justifyContent: 'center', gap: 8, marginTop: 4 },
  breakItem: { textAlign: 'center' },
};

function FinalScores({ scores, speciesBonus, bgBonus }) {
  return (
    <div style={T.finalGrid}>
      <div style={T.finalHdr}>Final Ability Scores</div>
      {STATS.map(stat => {
        const sp = speciesBonus[stat] || 0;
        const bg = bgBonus[stat] || 0;
        return (
          <div key={stat} style={T.statCard(false)}>
            <div style={T.statLbl}>{SLBL[stat]}</div>
            <div style={T.statVal}>{scores[stat]}</div>
            <div style={T.statMod}>{modStr(scores[stat])}</div>
          </div>
        );
      })}
      <div style={{ ...T.breakRow, gridColumn: '1 / -1' }}>
        <span>Species: {STATS.map(s => speciesBonus[s] ? `${SLBL[s]}+${speciesBonus[s]}` : '').filter(Boolean).join(', ') || '—'}</span>
        <span>BG: {STATS.map(s => bgBonus[s] ? `${SLBL[s]}+${bgBonus[s]}` : '').filter(Boolean).join(', ') || '—'}</span>
      </div>
    </div>
  );
}

function usePbCost(scores) {
  let total = 0;
  for (const s of STATS) {
    const v = scores[s];
    if (v != null && PB_COST[v] != null) total += PB_COST[v];
  }
  return total;
}

function PointBuySection({ scores, setScore }) {
  const cost = usePbCost(scores);
  const rem = 27 - cost;
  return (
    <div>
      <div style={T.remaining}>Points Remaining: {rem}</div>
      {STATS.map(stat => {
        const v = scores[stat] != null ? scores[stat] : 8;
        const canInc = v < 15 && rem >= (PB_COST[v + 1] - PB_COST[v]);
        const canDec = v > 8;
        return (
          <div key={stat} style={T.row}>
            <span style={T.label}>{SLBL[stat]} ({PB_COST[v]} pt)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button style={T.btn(!canDec)} disabled={!canDec} onClick={() => setScore(stat, v - 1)}>−</button>
              <span style={T.val}>{v}</span>
              <button style={T.btn(!canInc)} disabled={!canInc} onClick={() => setScore(stat, v + 1)}>+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StandardArraySection({ arrAssign, setAssign }) {
  const assignedVals = Object.values(arrAssign).filter(v => v != null);
  const [selectedVal, setSelectedVal] = useState(null);

  return (
    <div>
      <div style={T.sectionTitle}>Pick a value, then click a stat</div>
      <div style={T.saPickRow}>
        {SA_ARR.map(v => {
          const used = assignedVals.includes(v);
          const active = selectedVal === v;
          return (
            <div
              key={v}
              style={T.saPick(active, used)}
              onClick={() => { if (!used) setSelectedVal(active ? null : v); }}
            >
              {v}
            </div>
          );
        })}
      </div>
      <div style={T.grid3}>
        {STATS.map(stat => {
          const val = arrAssign[stat];
          const highlight = val != null;
          return (
            <div
              key={stat}
              style={T.statCard(highlight)}
              onClick={() => {
                if (val != null) {
                  setAssign(stat, null);
                } else if (selectedVal != null) {
                  setAssign(stat, selectedVal);
                  setSelectedVal(null);
                }
              }}
            >
              <div style={T.statLbl}>{SLBL[stat]}</div>
              <div style={T.statVal}>{val ?? '—'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RollDiceSection({ dicePool, diceAssign, setDicePool, setDiceAssign }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  function handleRoll() {
    const pool = [];
    for (let i = 0; i < 6; i++) {
      pool.push(roll4d6DropLowest());
    }
    pool.sort((a, b) => b - a);
    setDicePool(pool);
    setSelectedIdx(null);
  }

  const assignedIdxs = Object.values(diceAssign).filter(v => v != null);

  return (
    <div>
      <button style={T.rollBtn} onClick={handleRoll}>Roll 4d6 Drop Lowest</button>
      {dicePool.length > 0 && (
        <div style={T.dicePoolRow}>
          {dicePool.map((val, i) => {
            const used = assignedIdxs.includes(val) && Object.values(diceAssign).filter(v => v === val).length > dicePool.filter(v => v === val).slice(0, i).filter((_, ii) => assignedIdxs.includes(dicePool.indexOf(val, ii))).length;
            const isUsed = Object.entries(diceAssign).some(([stat, v]) => v === val && dicePool.indexOf(val) === i);
            const sel = selectedIdx === i;
            return (
              <div
                key={i}
                style={{ ...T.dicePoolItem(sel), opacity: isUsed ? 0.4 : 1, cursor: isUsed ? 'not-allowed' : 'pointer' }}
                onClick={() => { if (!isUsed) setSelectedIdx(sel ? null : i); }}
              >
                {val}
              </div>
            );
          })}
        </div>
      )}
      {dicePool.length > 0 && (
        <div style={T.grid3}>
          {STATS.map(stat => {
            const val = diceAssign[stat];
            const highlight = val != null;
            return (
              <div
                key={stat}
                style={T.statCard(highlight)}
                onClick={() => {
                  if (val != null) {
                    setDiceAssign(stat, null);
                  } else if (selectedIdx != null) {
                    setDiceAssign(stat, dicePool[selectedIdx]);
                    setSelectedIdx(null);
                  }
                }}
              >
                <div style={T.statLbl}>{SLBL[stat]}</div>
                <div style={T.statVal}>{val ?? '—'}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ManualSection({ scores, setScore }) {
  return (
    <div style={T.grid3}>
      {STATS.map(stat => (
        <div key={stat} style={T.statCard(false)}>
          <div style={T.statLbl}>{SLBL[stat]}</div>
          <input
            style={T.manualInput}
            type="number"
            min={3}
            max={20}
            value={scores[stat] != null ? scores[stat] : 10}
            onChange={e => {
              let v = parseInt(e.target.value, 10);
              if (isNaN(v)) v = 10;
              setScore(stat, Math.max(3, Math.min(20, v)));
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function AbilityScoresTab() {
  const { char, setScoreMethod, setPbScore, setArrAssign, setDicePool, setDiceAssign, setManualScore } = useCharbuilderContext();
  const method = char.scoreMethod || 'pointbuy';
  const pbScores = char.pbScores || {};
  const arrAssign = char.arrAssign || {};
  const dicePool = char.dicePool || [];
  const diceAssign = char.diceAssign || {};
  const manualScores = char.manualScores || {};

  const speciesBonus = getSpeciesBonuses(char.speciesObj);
  const bgBonus = getBgBonuses(char.bgObj, char.bgAbility);

  function computeBase() {
    if (method === 'pointbuy') return pbScores;
    if (method === 'array') return arrAssign;
    if (method === 'dice') return diceAssign;
    if (method === 'manual') return manualScores;
    return {};
  }

  const base = computeBase();
  const finalScores = {};
  for (const s of STATS) {
    finalScores[s] = (Number(base[s]) || 10) + (speciesBonus[s] || 0) + (bgBonus[s] || 0);
  }

  return (
    <div>
      <div style={T.tabRow}>
        {METHODS.map(m => (
          <button
            key={m.key}
            style={T.tabBtn(method === m.key)}
            onClick={() => setScoreMethod(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={T.section}>
        {method === 'pointbuy' && (
          <PointBuySection scores={pbScores} setScore={setPbScore} />
        )}
        {method === 'array' && (
          <StandardArraySection arrAssign={arrAssign} setAssign={setArrAssign} />
        )}
        {method === 'dice' && (
          <RollDiceSection
            dicePool={dicePool}
            diceAssign={diceAssign}
            setDicePool={setDicePool}
            setDiceAssign={setDiceAssign}
          />
        )}
        {method === 'manual' && (
          <ManualSection scores={manualScores} setScore={setManualScore} />
        )}
      </div>

      <FinalScores scores={finalScores} speciesBonus={speciesBonus} bgBonus={bgBonus} />
    </div>
  );
}
