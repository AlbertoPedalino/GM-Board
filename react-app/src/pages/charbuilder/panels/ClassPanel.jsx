import { Box, Button, Chip, List, ListItemButton, ListItemText, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Plus, Sword, Trash2 } from 'lucide-react';
import BuilderPanel from '../components/BuilderPanel.jsx';
import { getFinalScore } from '../logic/calculations.js';
import { installedRegistry } from '../../../adapters/index.js';

function ClassRow({ cls, selected, onSelect, prereqMet = true }) {
  const Icon = cls.icon || Sword;
  const hitDie = cls.hitDie || `d${cls.hd?.faces || '?'}`;
  const saves = (cls.proficiency || []).map((save) => save.toUpperCase()).join(', ');
  return (
    <ListItemButton
      selected={selected}
      divider
      disabled={!prereqMet}
      onClick={onSelect}
      sx={{ alignItems: 'flex-start', gap: 1.25, opacity: prereqMet ? 1 : 0.45 }}
    >
      <Box sx={{ pt: 0.35 }}>
        <Icon size={20} />
      </Box>
      <ListItemText
        primary={<Typography fontWeight={selected ? 700 : 500}>{cls.name}</Typography>}
        secondary={(
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
            <Chip size="small" label={`Hit Die ${hitDie}`} />
            {cls.primary ? <Chip size="small" label={`Primary ${cls.primary}`} /> : null}
            {saves ? <Chip size="small" label={`Saves ${saves}`} /> : null}
            {!prereqMet ? <Chip size="small" color="warning" label="Prereq NO" /> : null}
          </Stack>
        )}
        secondaryTypographyProps={{ component: 'div' }}
      />
      <Chip size="small" label={cls.source} />
    </ListItemButton>
  );
}

function checkMcPrereq(character, className) {
  const reqs = installedRegistry.getClassRuntimeConfig(className)?.multiclassPrerequisites;
  if (!reqs) return true;
  const scores = {
    str: getFinalScore(character, 'str'),
    dex: getFinalScore(character, 'dex'),
    con: getFinalScore(character, 'con'),
    int: getFinalScore(character, 'int'),
    wis: getFinalScore(character, 'wis'),
    cha: getFinalScore(character, 'cha'),
  };
  return reqs.some((group) => Object.entries(group).every(([ability, min]) => scores[ability] >= min));
}

export default function ClassPanel({ state, character, dispatch }) {
  const classes = state.data.classes;
  const activeExtra = character.activeClassTab > 0 ? character.extraClasses[character.activeClassTab - 1] : null;
  const isExtraTab = !!activeExtra;
  const takenNames = new Set([character.className, ...character.extraClasses.map((extra) => extra.name)]);
  return (
    <BuilderPanel
      title="Class"
      icon={Sword}
      note={activeExtra ? 'Selecting multiclass class' : 'Selecting primary class'}
      action={
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
          {activeExtra ? (
            <Button size="small" color="error" startIcon={<Trash2 size={16} />} onClick={() => dispatch({ type: 'multiclass/remove', index: character.activeClassTab - 1 })}>
              Remove
            </Button>
          ) : null}
          <Button size="small" startIcon={<Plus size={16} />} onClick={() => dispatch({ type: 'multiclass/add' })}>
            Multiclass
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <ToggleButtonGroup value={character.activeClassTab} exclusive size="small" onChange={(_, tab) => tab != null && dispatch({ type: 'class-tab/set', tab })}>
          <ToggleButton value={0}>{character.className || 'Primary'}</ToggleButton>
          {character.extraClasses.map((extraClass, index) => (
            <ToggleButton key={`${extraClass.name}-${index}`} value={index + 1}>
              {extraClass.name || `Class ${index + 2}`} Lv {extraClass.level || 1}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Paper variant="outlined" sx={{ maxHeight: 440, overflow: 'auto' }}>
          <List dense disablePadding>
            {classes.map((cls) => {
              const selected = activeExtra
                ? activeExtra.name === cls.name && activeExtra.source === cls.source
                : character.className === cls.name && character.classSource === cls.source;
              const prereqMet = isExtraTab && !selected
                ? !takenNames.has(cls.name) && checkMcPrereq(character, cls.name)
                : true;
              return (
                <ClassRow
                  key={`${cls.name}-${cls.source}`}
                  cls={cls}
                  selected={selected}
                  prereqMet={prereqMet}
                  onSelect={() => dispatch({ type: 'class/select', className: cls.name, source: cls.source, classObject: cls })}
                />
              );
            })}
          </List>
        </Paper>
      </Stack>
    </BuilderPanel>
  );
}
