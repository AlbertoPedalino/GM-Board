import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { Info, X } from 'lucide-react';

export default function ChoiceDescriptionDialog({ value, onClose }) {
  return (
    <Dialog open={!!value} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <Info size={20} />
          <Typography variant="h2" component="span">
            {value?.title || 'Choice'}
          </Typography>
          <span style={{ flex: 1 }} />
          <IconButton onClick={onClose}>
            <X size={18} />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
          {value?.body || ''}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
