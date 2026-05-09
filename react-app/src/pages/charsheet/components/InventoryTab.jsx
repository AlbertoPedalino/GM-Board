import { useEffect, useMemo, useState } from 'react';
import { Box, Button, IconButton, TextField, Tooltip, Typography, Alert, Stack } from '@mui/material';
import { Backpack, Check, Minus, Package, Plus, Shield, Sparkles, Swords, Trash2, AlertTriangle } from 'lucide-react';
import { loadItems } from '../../charbuilder/logic/dataLoaders.js';
import { getFinal } from '../logic/calculations.js';
import { getArmorPenalties } from '../logic/armorPenalties.js';
import { renderEntries } from '../logic/renderEntries.js';

const CURRENCY_TYPES = [
  { key: 'cp', label: 'CP' },
  { key: 'sp', label: 'SP' },
  { key: 'ep', label: 'EP' },
  { key: 'gp', label: 'GP' },
  { key: 'pp', label: 'PP' },
];

const FILTERS = [
  { key: 'all', label: 'All', icon: null },
  { key: 'weapon', label: 'Weapons', icon: Swords },
  { key: 'armor', label: 'Armor', icon: Shield },
  { key: 'gear', label: 'Gear', icon: Backpack },
  { key: 'magic', label: 'Magic', icon: Sparkles },
];

const GROUPS = [
  { key: 'weapon', label: 'Weapons', icon: Swords },
  { key: 'armor', label: 'Armor', icon: Shield },
  { key: 'magic', label: 'Magic', icon: Sparkles },
  { key: 'gear', label: 'Gear', icon: Backpack },
];

const rarityColor = {
  common: '#c4b393',
  uncommon: '#58b879',
  rare: '#4d95d6',
  'very rare': '#9d7fb8',
  legendary: '#d69245',
  artifact: '#de675f',
};

const compactInputSx = {
  '& .MuiOutlinedInput-root': { bgcolor: 'rgba(35,32,26,1)', borderRadius: 1 },
  '& input': { fontSize: '0.75rem', py: '7px' },
};

function itemType(item) {
  const type = String(item?.type || '').toUpperCase();
  if (['M', 'R'].includes(type) || type === 'WEAPON') return 'weapon';
  if (['LA', 'MA', 'HA', 'S'].includes(type) || type === 'ARMOR') return 'armor';
  if (type === 'RG' || (item?.rarity && item.rarity !== 'none')) return 'magic';
  return 'gear';
}

function normalizeStoredItem(item) {
  return {
    ...item,
    name: item.name,
    source: item.source || 'Custom',
    type: item.type || 'gear',
    rarity: item.rarity || 'none',
    weight: Number(item.weight || item.weightLb || 0),
    value: Number(item.value || 0),
    qty: Math.max(1, Number(item.qty || item.quantity || 1)),
    equipped: !!item.equipped,
    custom: !!item.custom,
  };
}

function qty(item) {
  return Number(item.qty || item.quantity || 1);
}

function formatGp(value) {
  const gp = Number(value || 0) / 100;
  if (!gp) return '';
  return `${Number.isInteger(gp) ? gp : gp.toFixed(2)} GP`;
}

export default function InventoryTab({ C, sheet, onUpdateInventory, onUpdateCurrency }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [itemsDb, setItemsDb] = useState([]);
  const [customName, setCustomName] = useState('');
  const [customWeight, setCustomWeight] = useState('');
  const [customValue, setCustomValue] = useState('');
  const inv = sheet?.sheetInventory || [];
  const currency = sheet?.sheetCurrency || {};

  useEffect(() => {
    let alive = true;
    loadItems().then((items) => {
      if (alive) setItemsDb(items);
    }).catch(() => {
      if (alive) setItemsDb([]);
    });
    return () => { alive = false; };
  }, []);

  const resolvedInv = useMemo(() => inv.map((item, index) => ({ item, index })), [inv]);
  const totalItems = inv.reduce((sum, item) => sum + qty(item), 0);
  const totalWeight = inv.reduce((sum, item) => sum + Number(item.weight || item.weightLb || 0) * qty(item), 0);
  const totalGp = inv.reduce((sum, item) => sum + (Number(item.value || 0) / 100) * qty(item), 0);
  const maxCarry = Math.max(1, getFinal(C, 'str') * 15);
  const carryPct = Math.min(100, (totalWeight / maxCarry) * 100);
  const overloaded = totalWeight > maxCarry;

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    let items = itemsDb;
    if (q) items = items.filter((item) => (item.name || '').toLowerCase().includes(q));
    if (filter !== 'all') items = items.filter((item) => itemType(item) === filter);
    return items.slice(0, 45);
  }, [itemsDb, search, filter]);

  const updateInv = (next) => onUpdateInventory?.(next);

  const addItem = (item) => {
    if (!item?.name) return;
    const stored = normalizeStoredItem(item);
    const idx = inv.findIndex((entry) => entry.name === stored.name && entry.source === stored.source);
    const next = idx === -1
      ? [...inv, stored]
      : inv.map((entry, index) => (index === idx ? { ...entry, qty: qty(entry) + 1 } : entry));
    updateInv(next);
  };

  const addCustom = () => {
    const name = customName.trim();
    if (!name) return;
    addItem({
      name,
      source: 'Custom',
      type: 'gear',
      custom: true,
      weight: Number(customWeight || 0),
      value: Number(customValue || 0) * 100,
    });
    setCustomName('');
    setCustomWeight('');
    setCustomValue('');
  };

  const adjustQty = (index, delta) => {
    const next = inv.flatMap((item, idx) => {
      if (idx !== index) return [item];
      const nextQty = Math.max(0, qty(item) + delta);
      return nextQty > 0 ? [{ ...item, qty: nextQty }] : [];
    });
    updateInv(next);
  };

  const removeItem = (index) => updateInv(inv.filter((_, idx) => idx !== index));

  const toggleEquipped = (index) => {
    const target = inv[index];
    if (!target) return;
    const targetType = String(target.type || '').toUpperCase();
    const next = inv.map((item, idx) => {
      if (idx === index) return { ...item, equipped: !item.equipped };
      const type = String(item.type || '').toUpperCase();
      if (['LA', 'MA', 'HA'].includes(targetType) && ['LA', 'MA', 'HA'].includes(type)) return { ...item, equipped: false };
      if (targetType === 'S' && type === 'S') return { ...item, equipped: false };
      return item;
    });
    updateInv(next);
  };

  const updateCoin = (coin, value) => {
    const next = { ...currency, [coin]: Math.max(0, Number(value || 0)) };
    onUpdateCurrency?.(next);
  };

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '5px', mb: 0.75 }}>
        {CURRENCY_TYPES.map((ct) => (
          <Box key={ct.key} sx={{ bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, p: '5px 4px', textAlign: 'center' }}>
            <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', letterSpacing: '0.08em', mb: '3px', color: 'text.secondary' }}>{ct.label}</Typography>
            <TextField
              type="number"
              variant="standard"
              value={currency[ct.key] || 0}
              onChange={(event) => updateCoin(ct.key, event.target.value)}
              inputProps={{ min: 0 }}
              sx={{
                width: '100%',
                '& input': { textAlign: 'center', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.875rem', fontWeight: 700, color: '#edd48a', py: '2px' },
              }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
        <Box sx={statPillSx}>Weight: <b>{totalWeight.toFixed(1)} / {maxCarry} lb</b></Box>
        <Box sx={statPillSx}>Value: <b>{totalGp.toFixed(1)} GP</b></Box>
        <Box sx={{ width: '100%', mt: 0.3 }}>
          <Box sx={{ height: 6, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden', border: 1, borderColor: 'divider' }}>
            <Box sx={{ width: `${carryPct}%`, height: '100%', bgcolor: overloaded ? '#de675f' : '#58b879' }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', mt: 0.25 }}>
            <Box sx={{ color: 'text.secondary', fontFamily: '"Cinzel", Georgia, serif' }}>{totalWeight.toFixed(1)} / {maxCarry} lb</Box>
            <Box sx={{ px: 0.75, py: '1px', borderRadius: 1, bgcolor: overloaded ? 'rgba(222,103,95,0.14)' : 'rgba(63,166,108,0.14)', color: overloaded ? '#de675f' : '#58b879', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.6rem' }}>
              {overloaded ? 'Over Capacity' : 'OK'}
            </Box>
          </Box>
        </Box>
      </Box>

      <TextField
        size="small"
        fullWidth
        placeholder="Search items to add (e.g. Sword, Potion, Torch...)"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{ ...compactInputSx, mb: 0.5 }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px', mb: 0.6 }}>
        {FILTERS.map((filterDef) => {
          const Icon = filterDef.icon;
          return (
            <Button
              key={filterDef.key}
              size="small"
              onClick={() => setFilter(filterDef.key)}
              startIcon={Icon ? <Icon size={12} /> : null}
              sx={{
                minHeight: 0,
                px: '10px',
                py: '3px',
                border: 1,
                borderColor: filter === filterDef.key ? '#caa550' : 'divider',
                borderRadius: 999,
                bgcolor: filter === filterDef.key ? 'rgba(202,165,80,0.12)' : 'transparent',
                color: filter === filterDef.key ? '#edd48a' : 'text.secondary',
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '0.56rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {filterDef.label}
            </Button>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: 180, overflowY: 'auto', mb: 0.75 }}>
        {searchResults.map((item) => (
          <Box key={`${item.name}-${item.source}`} onClick={() => addItem(item)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, px: '10px', py: '6px', bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, cursor: 'pointer', '&:hover': { borderColor: '#caa550', bgcolor: 'rgba(44,40,33,1)' } }}>
            <Typography sx={{ flex: 1, minWidth: 0, fontSize: '0.875rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', flexShrink: 0 }}>{item.type || 'gear'}</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', flexShrink: 0 }}>{formatGp(item.value)}</Typography>
          </Box>
        ))}
        {!searchResults.length && (
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic', py: 0.5 }}>{itemsDb.length ? 'No items found.' : 'Loading items.'}</Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: '6px', mb: 0.75, flexWrap: 'wrap' }}>
        <TextField size="small" value={customName} placeholder="Add custom item..." onChange={(event) => setCustomName(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') addCustom(); }}
          sx={{ ...compactInputSx, flex: 1, minWidth: 120 }} />
        <TextField size="small" type="number" value={customWeight} placeholder="lb" onChange={(event) => setCustomWeight(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') addCustom(); }}
          inputProps={{ min: 0, step: 0.1 }} sx={{ ...compactInputSx, width: 58 }} />
        <TextField size="small" type="number" value={customValue} placeholder="gp" onChange={(event) => setCustomValue(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') addCustom(); }}
          inputProps={{ min: 0, step: 0.01 }} sx={{ ...compactInputSx, width: 62 }} />
        <Button size="small" onClick={addCustom} disabled={!customName.trim()}
          sx={{ px: '14px', border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'rgba(35,32,26,1)', color: 'text.secondary', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.65rem', whiteSpace: 'nowrap', '&:hover': { borderColor: '#caa550', color: '#caa550' } }}>
          + Add
        </Button>
      </Box>

      <SectionHeader icon={Package} label={`Inventory (${totalItems} items)`} />

      {GROUPS.map((group) => {
        const inGroup = resolvedInv.filter(({ item }) => itemType(item) === group.key);
        if (!inGroup.length) return null;
        return (
          <Box key={group.key}>
            <SectionHeader icon={group.icon} label={group.label} />
            {inGroup.map(({ item, index }) => (
              <InventoryRow key={`${item.name}-${item.source}-${index}`} item={item} index={index} onQty={adjustQty} onRemove={removeItem} onEquip={toggleEquipped} C={C} />
            ))}
          </Box>
        );
      })}
      {!inv.length && <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic', py: 0.5 }}>Inventory empty.</Typography>}
    </Box>
  );
}

function SectionHeader({ icon: Icon, label }) {
  return (
    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary', borderBottom: 1, borderColor: 'divider', pb: '3px', mt: 0.6, mb: 0.4 }}>
      {Icon ? <Icon size={12} /> : null}
      {label}
    </Typography>
  );
}

function InventoryRow({ item, index, onQty, onRemove, onEquip, C }) {
  const [open, setOpen] = useState(false);
  const type = String(item.type || '').toUpperCase();
  const canEquip = ['M', 'R', 'LA', 'MA', 'HA', 'S', 'SCF', 'WD', 'RD', 'ST', 'WI', 'WEAPON', 'ARMOR'].includes(type);
  const rarity = item.rarity && item.rarity !== 'none' ? item.rarity : null;
  const color = rarityColor[rarity] || '#c4b393';
  const typeLabel = rarity || item.type || 'gear';
  const meta = [
    item.weight ? `${item.weight}lb` : null,
    item.dmg1 ? `${item.dmg1}${item.dmgType ? ` ${item.dmgType}` : ''}` : null,
    item.ac ? `AC ${item.ac}` : null,
    Array.isArray(item.property) && item.property.length ? item.property.join(', ') : null,
  ].filter(Boolean).join(' - ');
  
  const isArmor = ['LA', 'MA', 'HA', 'S'].includes(item.type);
  const armorPenalty = isArmor && item.equipped && C ? getArmorPenalties(C, item) : null;
  const penaltyMsg = armorPenalty?.hasPenalty ? (() => {
    const parts = [];
    if (armorPenalty.penalties) {
      armorPenalty.penalties.forEach(p => {
        if (p.type === 'disadvantage') {
          const labels = p.applies.map(x => x === 'dex-stealth' ? 'Stealth' : x.split('-')[0].toUpperCase());
          parts.push(`Disadvantage on ${labels.join('/')}`);
        } else if (p.type === 'speed-penalty') {
          parts.push(`Speed -${Math.abs(p.amount)} ft`);
        } else if (p.type === 'no-shield-ac') {
          parts.push('No shield AC');
        } else if (p.type === 'no-spellcasting') {
          parts.push("Can't cast spells");
        }
      });
    }
    return parts.join(' • ');
  })() : '';
  
  const body = renderEntries(item.entries);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', px: '10px', py: '6px', bgcolor: item.equipped ? 'rgba(26,188,156,0.06)' : 'rgba(35,32,26,1)', border: 1, borderColor: penaltyMsg ? 'warning.main' : (item.equipped ? '#2ca797' : 'divider'), borderRadius: 1, mb: '3px', '&:hover': { borderColor: 'rgba(202,165,80,0.34)' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0, minWidth: 52 }}>
          <Box sx={{ color, border: 1, borderColor: color, borderRadius: '3px', px: '5px', py: '1px', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.56rem', lineHeight: 1.35, textTransform: 'uppercase', textAlign: 'center' }}>{typeLabel}</Box>
        </Box>
        <Box onClick={() => setOpen(!open)} sx={{ flex: 1, minWidth: 0, cursor: body ? 'pointer' : 'default' }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name} {item.custom ? <Box component="span" sx={{ fontSize: '0.56rem', color: 'text.secondary' }}>[custom]</Box> : null}
          </Typography>
          {meta ? <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{meta}</Typography> : null}
          {penaltyMsg && (
            <Typography sx={{ fontSize: '0.6rem', color: 'warning.main', mt: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={10} /> {penaltyMsg}
            </Typography>
          )}
        </Box>
        {canEquip ? (
          <Button size="small" onClick={() => onEquip(index)} startIcon={item.equipped ? <Check size={11} /> : null}
            sx={{ minWidth: 0, px: '7px', py: '2px', border: 1, borderColor: item.equipped ? '#2ca797' : 'divider', borderRadius: '3px', color: item.equipped ? '#2ca797' : 'text.secondary', bgcolor: item.equipped ? 'rgba(26,188,156,0.12)' : 'transparent', fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.58rem' }}>
            {item.equipped ? 'Equip.' : 'Equip'}
          </Button>
        ) : null}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <QtyButton onClick={() => onQty(index, -1)}><Minus size={12} /></QtyButton>
          <Box sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.8125rem', fontWeight: 700, color: '#edd48a', minWidth: 18, textAlign: 'center' }}>{qty(item)}</Box>
          <QtyButton onClick={() => onQty(index, 1)}><Plus size={12} /></QtyButton>
        </Box>
        <Tooltip title="Remove">
          <span>
            <QtyButton danger onClick={() => onRemove(index)}><Trash2 size={12} /></QtyButton>
          </span>
        </Tooltip>
      </Box>
      {open && body ? (
        <Box sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.45, bgcolor: '#12100e', border: 1, borderColor: 'divider', borderRadius: 1, px: '10px', py: '6px', mt: '-2px', mb: '4px' }} dangerouslySetInnerHTML={{ __html: body }} />
      ) : null}
    </Box>
  );
}

function QtyButton({ children, danger = false, onClick }) {
  return (
    <IconButton size="small" onClick={onClick}
      sx={{ width: 20, height: 20, border: 1, borderColor: 'divider', borderRadius: '3px', color: 'text.secondary', '&:hover': { borderColor: danger ? '#de675f' : '#caa550', color: danger ? '#de675f' : '#caa550' } }}>
      {children}
    </IconButton>
  );
}

const statPillSx = {
  bgcolor: 'rgba(35,32,26,1)',
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  px: '10px',
  py: '4px',
  fontSize: '0.8125rem',
  color: 'text.secondary',
  '& b': { color: '#edd48a', fontFamily: '"Cinzel", Georgia, serif' },
};
