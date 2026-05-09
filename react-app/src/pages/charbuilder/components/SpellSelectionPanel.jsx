import { Box, Chip, InputAdornment, List, ListItemButton, ListItemText, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { BookOpen, Search } from 'lucide-react';
import BuilderPanel from './BuilderPanel.jsx';
import { SPELL_LEVEL_LABELS } from '../constants.js';
import { getSpellCounts, maxSpellLevel, spellMatchesAnyClass } from '../spells/spells.js';

export default function SpellSelectionPanel({ state, dispatch }) {
  const { character } = state;
  const activeTab = character.activeClassTab || 0;
  const extraIndex = activeTab > 0 ? activeTab - 1 : null;
  const activeExtra = extraIndex != null ? character.extraClasses?.[extraIndex] : null;
  const activeCharacter = activeExtra ? {
    ...character,
    className: activeExtra.name,
    classSource: activeExtra.source,
    classLevel: activeExtra.level || 1,
    level: activeExtra.level || 1,
    cls: activeExtra.cls,
    subclassShortName: activeExtra.subclassShortName || '',
    extraClasses: [],
  } : character;
  const { cantrips, spells, profile } = getSpellCounts(activeCharacter);
  const maxLevel = maxSpellLevel(activeCharacter);
  const activeSpellLevel = Number(character.activeSpellLevel ?? 0);
  const level = Math.min(activeSpellLevel, maxLevel || activeSpellLevel);
  const selectedCantrips = (activeExtra ? activeExtra.selectedCantrips : character.selectedCantrips) || [];
  const selectedSpells = (activeExtra ? activeExtra.selectedSpells : character.selectedSpells) || {};
  const selectedSpellsCount = Object.values(selectedSpells).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
  const autoGrantedSpells = collectAutoGrantedSpells(activeCharacter, profile);
  const query = state.search.spells.toLowerCase();
  const levels = [0, ...Array.from({ length: Math.max(0, maxLevel) }, (_, index) => index + 1)];
  const classNames = [activeCharacter.className].filter(Boolean);
  const autoNames = new Set(autoGrantedSpells.map((spell) => spell.name));
  const autoPool = autoGrantedSpells.map((auto) => state.data.spells.find((spell) => spell.name === auto.name) || { name: auto.name, level: auto.level ?? 0 });
  const basePool = state.data.spells
    .filter((spell) => spell.level === level)
    .filter((spell) => spellMatchesAnyClass(spell, classNames, state.data.classSpellIndex))
    .filter((spell) => !query || spell.name.toLowerCase().includes(query) || String(spell.schoolFull || spell.school || '').toLowerCase().includes(query));
  const pool = dedupeSpells([...autoPool.filter((spell) => Number(spell.level || 0) === level), ...basePool])
    .filter((spell) => !query || spell.name.toLowerCase().includes(query) || String(spell.schoolFull || spell.school || '').toLowerCase().includes(query))
    .slice(0, 120);
  const isCaster = !!profile.casterProgression || cantrips > 0 || spells > 0 || maxLevel > 0;

  return (
    <BuilderPanel id="panel-spells" title="Spells" icon={BookOpen} note={profile.preparedMode ? `${profile.preparedMode} casting` : 'Known/prepared spell selection'}>
      <Stack spacing={1.5}>
        {!isCaster ? (
          <Typography color="text.secondary">No spellcasting for current class/subclass.</Typography>
        ) : (
          <>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip color={selectedCantrips.length > cantrips ? 'error' : 'primary'} label={`Cantrips ${selectedCantrips.length}/${cantrips}`} />
              <Chip color={selectedSpellsCount > spells ? 'error' : 'primary'} label={`Spells ${selectedSpellsCount}/${spells}`} />
              {profile.ability ? <Chip label={`Ability ${profile.ability.toUpperCase()}`} /> : null}
            </Stack>
            {autoGrantedSpells.length ? (
              <Box>
                <Typography variant="overline" color="text.secondary">Auto Granted</Typography>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {autoGrantedSpells.map((spell) => (
                    <Chip key={`${spell.name}-${spell.mode}`} size="small" color="secondary" label={`${spell.name}${spell.mode ? ` (${spell.mode})` : ''}`} />
                  ))}
                </Stack>
              </Box>
            ) : null}
            <TextField
              fullWidth
              value={state.search.spells}
              placeholder="Search spells"
              onChange={(event) => dispatch({ type: 'search/set', scope: 'spells', value: event.target.value })}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              } }}
            />
            <ToggleButtonGroup size="small" exclusive value={level} onChange={(_, next) => next != null && dispatch({ type: 'field/set', field: 'activeSpellLevel', value: next })}>
              {levels.map((spellLevel) => (
                <ToggleButton key={spellLevel} value={spellLevel}>
                  {SPELL_LEVEL_LABELS[spellLevel] || `L${spellLevel}`}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Paper variant="outlined" sx={{ maxHeight: 460, overflow: 'auto' }}>
              <List dense disablePadding>
                {pool.map((spell) => {
                  const autoSelected = autoNames.has(spell.name);
                  const manualSelected = level === 0 ? selectedCantrips.includes(spell.name) : (selectedSpells[level] || []).includes(spell.name);
                  const selected = manualSelected || autoSelected;
                  const disabled = autoSelected || (!selected && (level === 0 ? selectedCantrips.length >= cantrips : selectedSpellsCount >= spells));
                  return (
                    <ListItemButton
                      key={`${spell.name}-${spell.source}`}
                      divider
                      selected={selected}
                      disabled={disabled}
                      sx={{ alignItems: 'flex-start', opacity: disabled ? 0.55 : 1 }}
                      onClick={() => !autoSelected && dispatch({ type: 'spell/toggle', level, name: spell.name, max: level === 0 ? cantrips : spells, extraIndex })}
                    >
                      <ListItemText
                        primary={<Typography fontWeight={selected ? 700 : 500} noWrap>{spell.name}</Typography>}
                        secondary={[spell.schoolFull || spell.school, spell.castingTime, spell.rangeText].filter(Boolean).join(' - ')}
                      />
                      <Chip size="small" color={selected ? 'primary' : 'default'} label={autoSelected ? 'Auto' : selected ? 'On' : `Lv ${spell.level}`} />
                    </ListItemButton>
                  );
                })}
              </List>
            </Paper>
            {!pool.length ? <Typography color="text.secondary">No spells found for this level/filter.</Typography> : null}
          </>
        )}
      </Stack>
    </BuilderPanel>
  );
}

function collectAutoGrantedSpells(character, profile) {
  const level = Math.max(1, Math.min(20, Number(character.classLevel || character.level || 1)));
  return [
    ...(profile.alwaysKnownSpells || []).map((spell) => ({ spell, mode: 'known' })),
    ...(profile.alwaysPreparedSpells || []).map((spell) => ({ spell, mode: 'prepared' })),
  ].map(({ spell, mode }) => ({
    name: typeof spell === 'string' ? spell : spell?.name,
    minLevel: Number(spell?.minLevel || 1),
    level: Number(spell?.level ?? 0),
    mode,
  })).filter((spell) => spell.name && level >= spell.minLevel);
}

function dedupeSpells(spells) {
  const seen = new Set();
  return (spells || []).filter((spell) => {
    const key = String(spell?.name || '').toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
