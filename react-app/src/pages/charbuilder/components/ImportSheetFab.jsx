import { Button, Stack, Typography } from '@mui/material';
import { Upload } from 'lucide-react';
import { useRef } from 'react';

export default function ImportSheetFab({ message, onMessage, onFile }) {
  const inputRef = useRef(null);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ position: 'fixed', top: 14, right: 14, zIndex: 1400 }}
    >
      {message ? (
        <Typography variant="caption" sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: 'rgba(12,16,26,.78)' }}>
          {message}
        </Typography>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept=".html,.htm,text/html,application/json,.json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile?.(file);
          else onMessage('');
        }}
      />
      <Button variant="outlined" size="small" startIcon={<Upload size={16} />} onClick={() => inputRef.current?.click()}>
        Load Sheet
      </Button>
    </Stack>
  );
}
