import { Box, Chip, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { Sparkles } from 'lucide-react';
import BuilderPanel from './BuilderPanel.jsx';
import { getPrimaryClassLevel } from '../logic/calculations.js';
import { renderEntryText } from '../logic/text.js';

export default function SubclassPanel({ character, dispatch }) {
  const tab = character.activeClassTab || 0;
  const isExtra = tab > 0;
  const extraIdx = tab - 1;
  const extra = isExtra ? character.extraClasses[extraIdx] : null;
  const cls = isExtra ? extra?.cls : character.cls;
  const subclasses = isExtra ? (extra?.subclasses || []) : (character.subclasses || []);
  const allSubFeatures = isExtra ? (extra?.allSubFeatures || []) : (character.allSubFeatures || []);
  const subclassShortName = isExtra ? (extra?.subclassShortName || '') : (character.subclassShortName || '');
  const unlockLevel = cls?.subclassLevel || 3;
  const currentLevel = isExtra ? (extra?.level || 1) : getPrimaryClassLevel(character);
  if (!cls || !subclasses.length || currentLevel < unlockLevel) return null;
  const subclassFeatures = allSubFeatures.filter(
    (feature) => feature.subclassShortName === subclassShortName
      && !feature?.isReprinted
      && Number(feature?.level || 0) <= currentLevel,
  );
  const onChange = (value) => {
    if (isExtra) dispatch({ type: 'extra-subclass/select', index: extraIdx, subclassShortName: value });
    else dispatch({ type: 'subclass/select', subclassShortName: value });
  };
  return (
    <BuilderPanel id="panel-subclass" title={isExtra ? `Subclass — ${extra?.name || ''}` : 'Subclass'} icon={Sparkles} note={`Unlock level ${unlockLevel}`}>
      <Stack spacing={1.5}>
        <FormControl fullWidth size="small">
          <InputLabel>Subclass</InputLabel>
          <Select label="Subclass" value={subclassShortName} onChange={(event) => onChange(event.target.value)}>
            <MenuItem value="">None</MenuItem>
            {subclasses.map((subclass) => (
              <MenuItem key={`${subclass.shortName || subclass.name}-${subclass.source}`} value={subclass.shortName || subclass.name}>
                {subclass.name || subclass.shortName} ({subclass.source})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {subclassShortName ? (
          <Box sx={{ maxHeight: 450, overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
            <Grid container spacing={1}>
              {subclassFeatures.map((feature) => (
                <Grid key={`${feature.name}-${feature.level}`} item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 1.25, minWidth: 0, overflow: 'hidden' }}>
                    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <Chip size="small" label={`Lv ${feature.level}`} />
                        <Typography variant="h2" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{feature.name}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', maxHeight: '6em', lineHeight: 1.4, wordBreak: 'break-word' }}>
                        {renderEntryText(feature.entries).slice(0, 500)}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
              {!subclassFeatures.length ? (
                <Grid item xs={12}>
                  <Typography color="text.secondary">No subclass features loaded for this subclass.</Typography>
                </Grid>
              ) : null}
            </Grid>
          </Box>
        ) : null}
      </Stack>
    </BuilderPanel>
  );
}
