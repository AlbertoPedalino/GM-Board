import { Chip, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { Check } from 'lucide-react';
import { optionLabel } from '../spells/choiceSpecs.js';

export default function ChoiceBlock({ spec, choices, dispatch }) {
  const selected = Array.isArray(choices[spec.key]) ? choices[spec.key] : (choices[spec.key] ? [choices[spec.key]] : []);
  const options = spec.options?.length
    ? spec.options.map((option) => ({
      value: option.value ?? option.key ?? option.label,
      label: option.label ?? option.value ?? option.key,
    }))
    : (spec.from || []).map((value) => ({ value, label: optionLabel(value) }));
  const max = spec.count || 1;
  return (
    <Paper variant="outlined" sx={{ p: 0.75, minWidth: 0 }}>
      <Stack spacing={0.65} sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={0.65} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="h2" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{spec.label}</Typography>
          <Chip size="small" label={`${selected.length}/${max}`} color={selected.length >= max ? 'primary' : 'default'} />
        </Stack>
        <Paper variant="outlined" sx={{ maxHeight: 210, overflow: 'auto' }}>
          <List dense disablePadding>
            {options.map(({ value, label }) => {
              const active = selected.includes(value);
              const full = !active && selected.length >= max;
              return (
                <ListItemButton
                  key={`${spec.key}-${value}`}
                  divider
                  selected={active}
                  disabled={full}
                  onClick={() => dispatch({ type: 'choice/toggle-item', key: spec.key, value, max })}
                  sx={{ minWidth: 0, py: 0.45 }}
                >
                  <ListItemText
                    primary={<Typography fontWeight={active ? 700 : 500} noWrap sx={{ fontSize: '0.74rem' }}>{label}</Typography>}
                  />
                  {active ? <Check size={16} /> : null}
                </ListItemButton>
              );
            })}
          </List>
        </Paper>
      </Stack>
    </Paper>
  );
}
