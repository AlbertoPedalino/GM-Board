import { Chip, InputAdornment, List, ListItemButton, ListItemText, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { BookOpen, Search } from 'lucide-react';
import BuilderPanel from './BuilderPanel.jsx';
import { SPELL_LEVEL_LABELS } from '../constants.js';
import { getSpellCounts, maxSpellLevel, spellMatchesAnyClass } from '../spells/spells.js';

export default function SpellSelectionPanel({ state, dispatch }) {
  const { character } = state;
  const { cantrips, spells, profile } = getSpellCounts(character);
  const maxLevel = maxSpellLevel(character);
  const activeSpellLevel = Number(character.activeSpellLevel ?? 0);
  const level = Math.min(activeSpellLevel, maxLevel || activeSpellLevel);
  const selectedCantrips = character.selectedCantrips || [];
  const selectedSpells = character.selectedSpells || {};
  const selectedSpellsCount = Object.values(selectedSpells).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
  const query = state.search.spells.toLowerCase();
  const levels = [0, ...Array.from({ length: Math.max(0, maxLevel) }, (_, index) => index + 1)];
  const classNames = [character.className, ...(character.extraClasses || []).map((extra) => extra.name)].filter(Boolean);
  const pool = state.data.spells
    .filter((spell) => spell.level === level)
    .filter((spell) => spellMatchesAnyClass(spell, classNames, state.data.classSpellIndex))
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
            <TextField
              fullWidth
              value={state.search.spells}
              placeholder="Search spells"
              onChange={(event) => dispatch({ type: 'search/set', scope: 'spells', value: event.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
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
                  const selected = level === 0 ? selectedCantrips.includes(spell.name) : (selectedSpells[level] || []).includes(spell.name);
                  const disabled = !selected && (level === 0 ? selectedCantrips.length >= cantrips : selectedSpellsCount >= spells);
                  return (
                    <ListItemButton
                      key={`${spell.name}-${spell.source}`}
                      divider
                      selected={selected}
                      disabled={disabled}
                      sx={{ alignItems: 'flex-start', opacity: disabled ? 0.55 : 1 }}
                      onClick={() => dispatch({ type: 'spell/toggle', level, name: spell.name, max: level === 0 ? cantrips : spells })}
                    >
                      <ListItemText
                        primary={<Typography fontWeight={selected ? 700 : 500} noWrap>{spell.name}</Typography>}
                        secondary={[spell.schoolFull || spell.school, spell.castingTime, spell.rangeText].filter(Boolean).join(' - ')}
                      />
                      <Chip size="small" color={selected ? 'primary' : 'default'} label={selected ? 'On' : `Lv ${spell.level}`} />
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
