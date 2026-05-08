import { Chip, Grid, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { HeartPulse } from 'lucide-react';
import BuilderPanel from '../components/BuilderPanel.jsx';
import { calcMaxHp, getPrimaryClassLevel, getProficiencyBonus } from '../logic/calculations.js';

export default function LevelPanel({ character, dispatch }) {
  const tab = character.activeClassTab || 0;
  const isExtra = tab > 0;
  const extraIdx = tab - 1;
  const extraClass = isExtra ? character.extraClasses[extraIdx] : null;
  const cls = isExtra ? extraClass?.cls : character.cls;
  const hp = calcMaxHp(character);
  const faces = cls?.hd?.faces || cls?.hitDie || '?';
  const otherExtra = (character.extraClasses || []).filter((_, idx) => idx !== extraIdx).reduce((sum, ec) => sum + (Number(ec.level) || 0), 0);
  const primaryLv = getPrimaryClassLevel(character);
  const maxLv = isExtra ? Math.max(1, 20 - primaryLv - otherExtra) : 20;
  const currentLevel = isExtra ? (extraClass?.level || 1) : character.level;
  const setLevel = (value) => {
    if (isExtra) dispatch({ type: 'extra-class/level', index: extraIdx, level: value });
    else dispatch({ type: 'field/set', field: 'level', value });
  };
  return (
    <BuilderPanel
      id="panel-level"
      title={isExtra ? `Level — ${extraClass?.name || ''}` : 'Level'}
      icon={HeartPulse}
      note={isExtra ? `Lv ${currentLevel} (max ${maxLv}) - Hit Die ${faces}` : `HP ${hp || '-'} - PB +${getProficiencyBonus(character.level)} - Hit Die ${faces}`}
    >
      <Grid container spacing={1.5} alignItems="center">
        <Grid item xs={12} md={4}>
          <Select fullWidth value={currentLevel} onChange={(event) => setLevel(Number(event.target.value))}>
            {Array.from({ length: maxLv }, (_, index) => index + 1).map((level) => (
              <MenuItem key={level} value={level}>Level {level}</MenuItem>
            ))}
          </Select>
        </Grid>
        {!isExtra ? (
          <Grid item xs={12} md={8}>
            <ToggleButtonGroup value={character.hpMode} exclusive size="small" onChange={(_, mode) => mode && dispatch({ type: 'hp/mode', mode })}>
              <ToggleButton value="average">Average HP</ToggleButton>
              <ToggleButton value="rolled">Manual HP</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        ) : null}
        <Grid item xs={12} md={isExtra ? 12 : 8}>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {Array.from({ length: maxLv }, (_, index) => index + 1).map((level) => (
              <Chip
                key={level}
                label={level}
                color={level === currentLevel ? 'primary' : 'default'}
                onClick={() => setLevel(level)}
              />
            ))}
          </Stack>
        </Grid>
        {!isExtra && character.hpMode === 'rolled' ? (
          <Grid item xs={12}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {Array.from({ length: Math.max(0, primaryLv - 1) }, (_, index) => index + 2).map((level) => (
                <TextField
                  key={level}
                  size="small"
                  type="number"
                  label={`Lv ${level}`}
                  value={character.hpManualRolls[level] || ''}
                  inputProps={{ min: 1, max: character.cls?.hd?.faces || 12 }}
                  sx={{ width: 92 }}
                  onChange={(event) => dispatch({ type: 'hp/roll', key: level, value: Number(event.target.value) || 0 })}
                />
              ))}
            </Stack>
          </Grid>
        ) : null}
      </Grid>
    </BuilderPanel>
  );
}
