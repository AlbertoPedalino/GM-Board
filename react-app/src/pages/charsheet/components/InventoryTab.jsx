import { useState, useMemo } from 'react';
import { Box, Typography, TextField, Chip, IconButton } from '@mui/material';
import { Swords, Shield, Backpack, Sparkles, Package, Search, Plus, Minus, Trash2 } from 'lucide-react';

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

export default function InventoryTab({ C, sheet }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const inv = sheet?.sheetInventory || [];
  const currency = sheet?.sheetCurrency || {};

  const totalWeight = inv.reduce((s, i) => s + ((i.weight || i.weightLb || 0) * (i.qty || i.quantity || 1)), 0);

  const filtered = useMemo(() => {
    let items = inv;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => (i.name || '').toLowerCase().includes(q));
    }
    if (filter === 'weapon') items = items.filter(i => ['M', 'R'].includes(i.type));
    else if (filter === 'armor') items = items.filter(i => ['LA', 'MA', 'HA', 'S'].includes(i.type));
    else if (filter === 'magic') items = items.filter(i => i.rarity || i.type === 'RG');
    else if (filter === 'gear') items = items.filter(i => !['M', 'R', 'LA', 'MA', 'HA', 'S', 'RG'].includes(i.type));
    return items;
  }, [inv, search, filter]);

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(5,1fr)', sm: 'repeat(5,1fr)' }, gap: 0.3, mb: '0.75rem' }}>
        {CURRENCY_TYPES.map(ct => (
          <Box key={ct.key} sx={{ bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, p: '5px 4px', textAlign: 'center' }}>
            <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.5rem', letterSpacing: '0.08em', mb: 0.2 }}>{ct.label}</Typography>
            <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.875rem', fontWeight: 700, color: '#edd48a' }}>
              {currency[ct.key] || 0}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: '0.5rem' }}>
        <Box sx={{ bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
          <b style={{ color: '#edd48a' }}>{inv.length}</b> items
        </Box>
        <Box sx={{ bgcolor: 'rgba(35,32,26,1)', border: 1, borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
          <b style={{ color: '#edd48a' }}>{totalWeight.toFixed(1)}</b> lb
        </Box>
      </Box>

      <TextField
        size="small" fullWidth placeholder="Search items…"
        value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <Search size={14} /> }}
        sx={{ mb: 0.5, '& input': { fontSize: '0.75rem' } }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, mb: 0.5 }}>
        {FILTERS.map(f => (
          <Chip key={f.key} size="small" label={f.label} icon={f.icon ? <f.icon size={12} /> : undefined}
            variant={filter === f.key ? 'filled' : 'outlined'} color={filter === f.key ? 'primary' : 'default'}
            onClick={() => setFilter(f.key)} sx={{ fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em' }} />
        ))}
      </Box>

      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'text.secondary', borderBottom: 1, borderColor: 'divider', pb: 0.2, mb: 0.4 }}>
        <Package size={12} style={{ marginRight: 4 }} /> Inventory ({filtered.length})
      </Typography>

      {filtered.map((item, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5, fontSize: '0.8125rem', color: 'text.secondary', borderBottom: 1, borderColor: 'divider' }}>
          <Typography sx={{ flex: 1, fontSize: '0.8125rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.qty || item.quantity > 1 && <Box component="span" sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.75rem', fontWeight: 600, color: '#edd48a', mr: 0.5 }}>{item.qty || item.quantity}x</Box>}
            {item.name}
          </Typography>
          {item.type === 'M' && <Swords size={12} />}
          {item.type === 'R' && <Swords size={12} />}
          {item.equipped && <Chip size="small" label="E" variant="outlined" sx={{ fontSize: '0.44rem', height: 16, color: '#2ca797', borderColor: '#2ca797' }} />}
        </Box>
      ))}
      {filtered.length === 0 && <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic', py: 0.5 }}>No items found.</Typography>}
    </Box>
  );
}
