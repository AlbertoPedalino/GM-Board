import { Box, Paper, Stack, Typography } from '@mui/material';

export default function BuilderPanel({ id, title, icon: Icon, note, action, children, sx }) {
  return (
    <Paper id={id} variant="outlined" sx={{ p: 2, bgcolor: 'background.paper', ...sx }}>
      <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ mb: 2 }}>
        {Icon ? <Icon size={20} /> : null}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h2">{title}</Typography>
          {note ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {note}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}
