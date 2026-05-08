import { useState, useMemo } from 'react';
import { useCharbuilderContext } from './CharbuilderContext.jsx';

const COIN_TYPES = [
  { key: 'cp', label: 'CP', name: 'Copper' },
  { key: 'sp', label: 'SP', name: 'Silver' },
  { key: 'ep', label: 'EP', name: 'Electrum' },
  { key: 'gp', label: 'GP', name: 'Gold' },
  { key: 'pp', label: 'PP', name: 'Platinum' },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'weapon', label: 'Weapons' },
  { key: 'armor', label: 'Armor' },
  { key: 'gear', label: 'Gear' },
  { key: 'magic', label: 'Magic' },
];

function itemTypeCategory(item) {
  const t = (item.type || '').toUpperCase();
  if (t === 'M' || t === 'R' || t === 'A' || t === 'RW') return 'weapon';
  if (t === 'LA' || t === 'MA' || t === 'HA' || t === 'S' || t === 'SH') return 'armor';
  if (t === 'G' || t === 'SC' || t === 'F' || t === 'T' || t === 'MNT') return 'gear';
  if (item.rarity && item.rarity !== 'none') return 'magic';
  return 'gear';
}

function coinValueStr(v) {
  if (v == null || v === 0) return null;
  const g = Math.floor(v / 100);
  const s = Math.floor((v % 100) / 10);
  const c = v % 10;
  const parts = [];
  if (g) parts.push(`${g} gp`);
  if (s) parts.push(`${s} sp`);
  if (c) parts.push(`${c} cp`);
  return parts.join(' ') || '0 cp';
}

const T = {
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
  subTitle: {
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: 11,
    fontWeight: 700,
    color: '#c4b393',
    marginBottom: 6,
    letterSpacing: '.05em',
    textTransform: 'uppercase',
  },
  card: {
    background: '#23201a',
    border: '1px solid rgba(199,167,99,.2)',
    borderRadius: 8,
    padding: '10px 12px',
    marginBottom: 8,
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px 0',
    borderBottom: '1px solid rgba(199,167,99,.08)',
    fontSize: 13,
    color: '#c4b393',
  },
  itemName: { color: '#efe6d4', fontWeight: 600 },
  choiceGroup: { marginBottom: 10 },
  choiceLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 0',
    fontSize: 13,
    color: '#c4b393',
    cursor: 'pointer',
  },
  radio: { accentColor: '#caa550', cursor: 'pointer' },
  checkbox: { accentColor: '#caa550', cursor: 'pointer' },
  coinGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 },
  coinCard: {
    background: '#23201a',
    border: '1px solid rgba(199,167,99,.2)',
    borderRadius: 6,
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coinLabel: {
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '.05em',
    color: '#8f7a57',
    textTransform: 'uppercase',
  },
  coinVal: { fontSize: 16, fontWeight: 700, color: '#efe6d4', minWidth: 30, textAlign: 'center' },
  btnSmall: (disabled) => ({
    width: 24,
    height: 24,
    borderRadius: 3,
    border: '1px solid rgba(199,167,99,.3)',
    background: disabled ? '#1a1713' : 'rgba(202,165,80,.15)',
    color: disabled ? '#5a4a3a' : '#caa550',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 14,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  }),
  searchInput: {
    width: '100%',
    padding: '8px 10px',
    background: '#1a1713',
    border: '1px solid rgba(199,167,99,.3)',
    borderRadius: 6,
    color: '#efe6d4',
    fontSize: 13,
    outline: 'none',
    marginBottom: 8,
    boxSizing: 'border-box',
  },
  filterRow: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 },
  filterChip: (active) => ({
    padding: '3px 10px',
    borderRadius: 12,
    border: '1px solid',
    borderColor: active ? '#caa550' : 'rgba(199,167,99,.25)',
    background: active ? 'rgba(202,165,80,.15)' : 'transparent',
    color: active ? '#edd48a' : '#8f7a57',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '.03em',
    transition: 'all .15s',
  }),
  itemDbRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5px 8px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    color: '#c4b393',
    transition: 'background .1s',
  },
  addBtn: {
    padding: '2px 10px',
    borderRadius: 4,
    border: '1px solid rgba(202,165,80,.3)',
    background: 'rgba(202,165,80,.12)',
    color: '#caa550',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  invRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5px 8px',
    borderBottom: '1px solid rgba(199,167,99,.08)',
    fontSize: 13,
    color: '#c4b393',
  },
  invName: { color: '#efe6d4', fontWeight: 600 },
  qtyBtn: {
    width: 22,
    height: 22,
    borderRadius: 3,
    border: '1px solid rgba(199,167,99,.2)',
    background: 'rgba(202,165,80,.1)',
    color: '#caa550',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyVal: { fontSize: 13, fontWeight: 700, color: '#efe6d4', minWidth: 20, textAlign: 'center' },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#b34a4a',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 700,
    padding: '0 4px',
    lineHeight: 1,
  },
  customForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 60px 80px auto',
    gap: 6,
    marginBottom: 8,
    alignItems: 'end',
  },
  customInput: {
    width: '100%',
    padding: '6px 8px',
    background: '#1a1713',
    border: '1px solid rgba(199,167,99,.3)',
    borderRadius: 4,
    color: '#efe6d4',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
  },
  customLabel: {
    fontSize: 10,
    color: '#8f7a57',
    marginBottom: 2,
    display: 'block',
    fontFamily: '"Cinzel", Georgia, serif',
    letterSpacing: '.03em',
    textTransform: 'uppercase',
  },
  emptyText: { fontSize: 12, color: '#8f7a57', fontStyle: 'italic', padding: '8px 0' },
};

function renderEquipmentItem(item, i) {
  const name = item.name || item.item || 'Unknown';
  const qty = item.qty || 1;
  const value = item.value ? coinValueStr(item.value) : null;
  const weight = item.weight != null ? `${item.weight} lb` : null;
  const meta = [value, weight].filter(Boolean).join(', ');
  return (
    <div key={i} style={T.itemRow}>
      <span>{name}{qty > 1 ? ` (${qty})` : ''}</span>
      {meta && <span style={{ fontSize: 11, color: '#8f7a57' }}>{meta}</span>}
    </div>
  );
}

function StartingEquipmentSection({ cls, bgObj, equipChoices, setEquipChoices, className }) {
  const classEq = cls && cls.startingEquipment ? cls.startingEquipment : null;
  const bgEq = bgObj && bgObj.startingEquipment ? bgObj.startingEquipment : null;

  function renderChoiceGroup(prefix, label, choiceKey, choices) {
    if (!choices) return null;
    const entries = Object.entries(choices);
    if (entries.length === 0) return null;
    return (
      <div style={T.choiceGroup}>
        <div style={T.subTitle}>{label}</div>
        {entries.map(([key, items]) => {
          const fieldName = `${prefix}_${key}`;
          const current = equipChoices[fieldName];
          const arr = Array.isArray(items) ? items : (items.items || items.choice || []);
          const numChosen = items.numChosen || (Array.isArray(items) ? 1 : 1);
          const isMulti = numChosen > 1;
          const isRadio = !isMulti && key.match(/^[abc]$/i);

          return (
            <div key={key} style={{ marginBottom: 6, fontSize: 12, color: '#c4b393' }}>
              <div style={{ marginBottom: 4, color: '#8f7a57', fontSize: 11 }}>
                Option {key.toUpperCase()}{numChosen > 1 ? ` (pick ${numChosen})` : ''}
              </div>
              {arr.map((item, i) => {
                const name = typeof item === 'string' ? item : (item.name || item.item || 'Item');
                const val = typeof item === 'string' ? item : JSON.stringify(item);
                const checked = isRadio
                  ? current === val
                  : Array.isArray(current) && current.includes(val);

                function handleChange() {
                  if (isRadio) {
                    setEquipChoices({ [fieldName]: val });
                  } else {
                    let arr = Array.isArray(current) ? [...current] : [];
                    if (arr.includes(val)) {
                      arr = arr.filter(v => v !== val);
                    } else {
                      if (arr.length < numChosen) arr.push(val);
                    }
                    setEquipChoices({ [fieldName]: arr.length ? arr : null });
                  }
                }

                return (
                  <label key={i} style={T.choiceLabel}>
                    <input
                      type={isRadio ? 'radio' : 'checkbox'}
                      style={isRadio ? T.radio : T.checkbox}
                      name={fieldName}
                      checked={checked}
                      onChange={handleChange}
                    />
                    <span>{name}</span>
                  </label>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  const hasClass = classEq && Object.keys(classEq).length > 0;
  const hasBg = bgEq && Object.keys(bgEq).length > 0;

  if (!hasClass && !hasBg) {
    return <div style={T.emptyText}>Select a class and background to see starting equipment.</div>;
  }

  return (
    <div>
      {hasClass && (
        <div style={T.card}>
          <div style={T.subTitle}>{className || cls?.name || 'Class'} Starting Equipment</div>
          {classEq._ && Array.isArray(classEq._) && classEq._.length > 0 && (
            <div style={{ marginBottom: 8 }}>{classEq._.map((item, i) => renderEquipmentItem(item, i))}</div>
          )}
          {renderChoiceGroup('class', 'Choose', classEq)}
        </div>
      )}
      {hasBg && (
        <div style={T.card}>
          <div style={T.subTitle}>{bgObj.name || 'Background'} Starting Equipment</div>
          {bgEq._ && Array.isArray(bgEq._) && bgEq._.length > 0 && (
            <div style={{ marginBottom: 8 }}>{bgEq._.map((item, i) => renderEquipmentItem(item, i))}</div>
          )}
          {renderChoiceGroup('bg', 'Choose', bgEq)}
        </div>
      )}
    </div>
  );
}

function CurrencySection({ currency, updateCurrency }) {
  return (
    <div style={T.coinGrid}>
      {COIN_TYPES.map(coin => {
        const val = currency[coin.key] || 0;
        return (
          <div key={coin.key} style={T.coinCard}>
            <div>
              <div style={T.coinLabel}>{coin.label}</div>
              <div style={{ fontSize: 10, color: '#8f7a57' }}>{coin.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                style={T.btnSmall(val <= 0)}
                disabled={val <= 0}
                onClick={() => updateCurrency(coin.key, val - 1)}
              >
                −
              </button>
              <span style={T.coinVal}>{val}</span>
              <button
                style={T.btnSmall(false)}
                onClick={() => updateCurrency(coin.key, val + 1)}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InventorySection({ allItemsDb, inventory, addInventoryItem, removeInventoryItem }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [customName, setCustomName] = useState('');
  const [customWeight, setCustomWeight] = useState('');
  const [customValue, setCustomValue] = useState('');

  const filteredItems = useMemo(() => {
    if (!Array.isArray(allItemsDb)) return [];
    let list = allItemsDb;
    if (filter !== 'all') {
      list = list.filter(item => itemTypeCategory(item) === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(item => (item.name || '').toLowerCase().includes(q));
    }
    return list.slice(0, 50);
  }, [allItemsDb, search, filter]);

  function handleCustomAdd() {
    if (!customName.trim()) return;
    addInventoryItem({
      name: customName.trim(),
      weight: parseFloat(customWeight) || 0,
      value: parseInt(customValue, 10) || 0,
      qty: 1,
      _custom: true,
    });
    setCustomName('');
    setCustomWeight('');
    setCustomValue('');
  }

  function incrementItem(idx) {
    const item = inventory[idx];
    if (!item) return;
    removeInventoryItem(idx);
    addInventoryItem({ ...item, qty: (item.qty || 1) + 1 });
  }

  function decrementItem(idx) {
    const item = inventory[idx];
    if (!item) return;
    const qty = (item.qty || 1) - 1;
    removeInventoryItem(idx);
    if (qty > 0) addInventoryItem({ ...item, qty });
  }

  const sortedInventory = useMemo(() => {
    if (!Array.isArray(inventory)) return [];
    return [...inventory].map((item, i) => ({ item, idx: i }));
  }, [inventory]);

  return (
    <div>
      <input
        style={T.searchInput}
        placeholder="Search items…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div style={T.filterRow}>
        {FILTERS.map(f => (
          <span
            key={f.key}
            style={T.filterChip(filter === f.key)}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </span>
        ))}
      </div>

      {search && (
        <div style={{ ...T.card, maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
          <div style={T.subTitle}>Item Database</div>
          {filteredItems.length === 0 && (
            <div style={T.emptyText}>No items found.</div>
          )}
          {filteredItems.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              style={T.itemDbRow}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(202,165,80,.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span>
                <span style={T.itemName}>{item.name}</span>
                {item.weight != null && (
                  <span style={{ fontSize: 10, color: '#8f7a57', marginLeft: 6 }}>
                    {item.weight} lb
                  </span>
                )}
              </span>
              <button
                style={T.addBtn}
                onClick={() => addInventoryItem({ ...item, qty: 1 })}
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={T.customForm}>
        <div>
          <span style={T.customLabel}>Name</span>
          <input
            style={T.customInput}
            placeholder="Item name"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
          />
        </div>
        <div>
          <span style={T.customLabel}>Wt</span>
          <input
            style={T.customInput}
            type="number"
            min={0}
            step={0.5}
            placeholder="0"
            value={customWeight}
            onChange={e => setCustomWeight(e.target.value)}
          />
        </div>
        <div>
          <span style={T.customLabel}>Val (cp)</span>
          <input
            style={T.customInput}
            type="number"
            min={0}
            placeholder="0"
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
          />
        </div>
        <button
          style={{ ...T.addBtn, height: 32, alignSelf: 'end' }}
          onClick={handleCustomAdd}
        >
          + Add
        </button>
      </div>

      <div style={T.card}>
        <div style={T.subTitle}>Inventory ({sortedInventory.length})</div>
        {sortedInventory.length === 0 && (
          <div style={T.emptyText}>No items in inventory.</div>
        )}
        {sortedInventory.map(({ item, idx }) => {
          const name = item.name || item.item || 'Unknown';
          const qty = item.qty || 1;
          const valueStr = item.value != null ? coinValueStr(item.value) : null;
          const weightStr = item.weight != null ? `${item.weight} lb` : null;
          const meta = [valueStr, weightStr].filter(Boolean).join(', ');
          return (
            <div key={idx} style={T.invRow}>
              <div style={{ flex: 1 }}>
                <span style={T.invName}>{name}</span>
                {meta && <span style={{ fontSize: 10, color: '#8f7a57', marginLeft: 6 }}>({meta})</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
                <button style={T.qtyBtn} onClick={() => decrementItem(idx)} disabled={qty <= 1}>
                  −
                </button>
                <span style={T.qtyVal}>{qty}</span>
                <button style={T.qtyBtn} onClick={() => incrementItem(idx)}>
                  +
                </button>
              </div>
              <button style={T.removeBtn} onClick={() => removeInventoryItem(idx)} title="Remove">
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EquipmentTab() {
  const { char, allItemsDb, loading, setEquipChoices, addInventoryItem, removeInventoryItem, updateCurrency } = useCharbuilderContext();

  return (
    <div>
      <div style={T.section}>
        <div style={T.sectionTitle}>Starting Equipment</div>
        <StartingEquipmentSection
          cls={char.cls}
          bgObj={char.bgObj}
          equipChoices={char.equipChoices || {}}
          setEquipChoices={setEquipChoices}
          className={char.className}
        />
      </div>

      <div style={T.section}>
        <div style={T.sectionTitle}>Currency</div>
        <CurrencySection currency={char.currency || {}} updateCurrency={updateCurrency} />
      </div>

      <div style={T.section}>
        <div style={T.sectionTitle}>Inventory</div>
        {loading && loading.items ? (
          <div style={T.emptyText}>Loading items…</div>
        ) : (
          <InventorySection
            allItemsDb={allItemsDb}
            inventory={Array.isArray(char.inventory) ? char.inventory : []}
            addInventoryItem={addInventoryItem}
            removeInventoryItem={removeInventoryItem}
          />
        )}
      </div>
    </div>
  );
}
