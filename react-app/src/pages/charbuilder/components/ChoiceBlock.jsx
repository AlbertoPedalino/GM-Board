import { Chip, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { Check } from 'lucide-react';
import { optionLabel } from '../spells/choiceSpecs.js';

const CHOICE_KEYS = ['choose', 'any', 'anyTool', 'anyArtisansTool', 'anyMusicalInstrument', 'anyGamingSet', 'anyStandard', 'anyExotic'];

function normChoice(value) {
  return String(value || '')
    .split('|')[0]
    .replace(/\{@[a-z]+ ([^|}]+)(?:\|[^}]*)?\}/gi, '$1')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function specProficiencyKind(spec) {
  const key = String(spec?.key || '').toLowerCase();
  const label = String(spec?.label || '').toLowerCase();
  if (spec?.type === 'skill_choice' || key.includes('skill')) return 'skill';
  if (spec?.type === 'language_choice' || key.includes('language') || key.includes('lang')) return 'language';
  if (key.includes('tool') || label.includes('tool') || label.includes('instrument')) return 'tool';
  if (key.includes('weapon') || label.includes('weapon proficiency')) return 'weapon';
  return null;
}

function keyProficiencyKind(key) {
  const raw = String(key || '').toLowerCase();
  if (raw.includes('skill')) return 'skill';
  if (raw.includes('language') || raw.includes('lang')) return 'language';
  if (raw.includes('tool') || raw.includes('instrument')) return 'tool';
  if (raw.includes('weapon')) return 'weapon';
  return null;
}

function addFixedBlocks(out, blocks) {
  (Array.isArray(blocks) ? blocks : [blocks]).forEach((block) => {
    if (!block) return;
    if (typeof block === 'string') {
      block.split(/[;,]/).forEach((value) => { if (value.trim()) out.add(normChoice(value)); });
      return;
    }
    Object.keys(block)
      .filter((key) => !CHOICE_KEYS.includes(key) && block[key] !== false)
      .forEach((key) => out.add(normChoice(key)));
  });
}

function collectBlockedProficiencies({ character, choices, currentKey, kind }) {
  const blocked = new Set();
  Object.entries(choices || {}).forEach(([key, value]) => {
    if (key === currentKey || keyProficiencyKind(key) !== kind) return;
    (Array.isArray(value) ? value : [value]).forEach((item) => { if (item) blocked.add(normChoice(item)); });
  });

  if (!character) return blocked;
  if (kind === 'skill') {
    (character.selectedSkills?.proficient || []).forEach((item) => blocked.add(normChoice(item)));
    addFixedBlocks(blocked, character.bgObj?.skillProficiencies);
    addFixedBlocks(blocked, character.speciesObj?.skillProficiencies);
  }
  if (kind === 'tool') {
    addFixedBlocks(blocked, character.cls?.startingProficiencies?.tools);
    addFixedBlocks(blocked, character.cls?.startingProficiencies?.toolProficiencies);
    addFixedBlocks(blocked, character.bgObj?.toolProficiencies);
    addFixedBlocks(blocked, character.speciesObj?.toolProficiencies);
  }
  if (kind === 'language') {
    addFixedBlocks(blocked, character.cls?.startingProficiencies?.languages);
    addFixedBlocks(blocked, character.cls?.startingProficiencies?.languageProficiencies);
    addFixedBlocks(blocked, character.bgObj?.languageProficiencies);
    addFixedBlocks(blocked, character.speciesObj?.languageProficiencies);
  }
  if (kind === 'weapon') {
    addFixedBlocks(blocked, character.cls?.startingProficiencies?.weapons);
    addFixedBlocks(blocked, character.cls?.startingProficiencies?.weaponProficiencies);
  }

  [
    ...(character.allFeatures || []),
    ...(character.allSubFeatures || []),
    ...((character.extraClasses || []).flatMap((extra) => [...(extra.allFeatures || []), ...(extra.allSubFeatures || [])])),
  ].forEach((feature) => {
    if (kind === 'skill') addFixedBlocks(blocked, feature.skillProficiencies);
    if (kind === 'tool') addFixedBlocks(blocked, feature.toolProficiencies);
    if (kind === 'language') addFixedBlocks(blocked, feature.languageProficiencies);
    if (kind === 'weapon') addFixedBlocks(blocked, feature.weaponProficiencies);
  });

  return blocked;
}

export default function ChoiceBlock({ spec, choices, dispatch, character }) {
  const selected = Array.isArray(choices[spec.key]) ? choices[spec.key] : (choices[spec.key] ? [choices[spec.key]] : []);
  const proficiencyKind = specProficiencyKind(spec);
  const blockedValues = proficiencyKind
    ? collectBlockedProficiencies({ character, choices, currentKey: spec.key, kind: proficiencyKind })
    : new Set();
  const options = spec.options?.length
    ? spec.options.map((option) => ({
      value: option.value ?? option.key ?? option.label,
      label: option.label ?? option.value ?? option.key,
    }))
    : (spec.from || []).map((value) => ({ value, label: optionLabel(value) }));
  const max = spec.count || 1;
  return (
    <Paper variant="outlined" sx={{ p: 1, minWidth: 0 }}>
      <Stack spacing={0.8} sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={0.65} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'text.secondary',
              fontSize: '0.72rem',
              fontWeight: 800,
              lineHeight: 1.25,
            }}
          >
            {spec.label}
          </Typography>
          <Chip size="small" label={`${selected.length}/${max}`} color={selected.length >= max ? 'primary' : 'default'} variant={selected.length >= max ? 'filled' : 'outlined'} />
        </Stack>
        <Paper variant="outlined" sx={{ maxHeight: 210, overflow: 'auto', bgcolor: 'background.default' }}>
          <List dense disablePadding>
            {options.map(({ value, label }) => {
              const active = selected.includes(value);
              const full = !active && selected.length >= max;
              const duplicate = !active && blockedValues.has(normChoice(value));
              return (
                <ListItemButton
                  key={`${spec.key}-${value}`}
                  divider
                  selected={active}
                  disabled={full || duplicate}
                  onClick={() => dispatch({
                    type: 'choice/toggle-item',
                    key: spec.key,
                    value,
                    max,
                    blockedValues: [...blockedValues],
                  })}
                  sx={{
                    minWidth: 0,
                    py: 0.65,
                    px: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        noWrap
                        sx={{
                          color: active ? 'inherit' : 'text.primary',
                          fontSize: '0.82rem',
                          fontWeight: active ? 800 : 500,
                        }}
                      >
                        {label}
                      </Typography>
                    }
                  />
                  {active ? <Check size={16} color="currentColor" /> : null}
                </ListItemButton>
              );
            })}
          </List>
        </Paper>
      </Stack>
    </Paper>
  );
}
