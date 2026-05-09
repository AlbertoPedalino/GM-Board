import { Chip, InputAdornment, List, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from '@mui/material';
import { Search } from 'lucide-react';

export default function SearchList({ value, onSearch, placeholder, items, selectedName, onSelect, meta }) {
  return (
    <Stack spacing={1.5}>
      <TextField
        fullWidth
        value={value}
        placeholder={placeholder}
        onChange={(event) => onSearch(event.target.value)}
        slotProps={{ input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} />
            </InputAdornment>
          ),
        } }}
      />
      <Paper variant="outlined" sx={{ maxHeight: 460, overflow: 'auto' }}>
        <List dense disablePadding>
        {items.map((item) => {
          const selected = selectedName === item.name;
          return (
            <ListItemButton
              key={`${item.name}-${item.source}`}
              selected={selected}
              divider
                onClick={() => onSelect(item)}
              sx={{ alignItems: 'flex-start', gap: 1.5 }}
              >
              <ListItemText
                primary={<Typography fontWeight={selected ? 700 : 500}>{item.name}</Typography>}
                secondary={meta?.(item)}
                secondaryTypographyProps={{ component: 'div' }}
              />
              <Chip size="small" label={item.source} />
            </ListItemButton>
          );
        })}
        </List>
      </Paper>
    </Stack>
  );
}
