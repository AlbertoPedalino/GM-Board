import { TextField, Box } from '@mui/material';

export default function NotesTab({ sheet }) {
  return (
    <Box>
      <TextField
        multiline fullWidth minRows={6}
        placeholder="Write your notes here…"
        defaultValue={sheet?.notes || ''}
        onChange={e => {
          localStorage.setItem('5e_notes', e.target.value);
        }}
        sx={{
          '& .MuiInputBase-root': { bgcolor: 'rgba(35,32,26,1)', color: 'text.primary', fontFamily: 'Georgia, serif', fontSize: '0.875rem' },
          '& fieldset': { borderColor: 'divider' },
          '&:focus-within fieldset': { borderColor: 'primary.main' },
        }}
      />
    </Box>
  );
}
