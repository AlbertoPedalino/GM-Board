import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import {
  battleMapDialogActionsSx, battleMapDialogContentSx,
  battleMapDialogPaperSx, battleMapDialogTitleSx,
} from '../map/battleMapSurface.js';

export default function DeletePiecesDialog({
  open, pieces, busy, error, container, onCancel, onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      container={container}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-pieces-title"
      aria-describedby="delete-pieces-description"
      slotProps={{ paper: { sx: battleMapDialogPaperSx } }}
    >
      <DialogTitle id="delete-pieces-title" sx={battleMapDialogTitleSx}>
        Delete selected pieces?
      </DialogTitle>
      <DialogContent sx={battleMapDialogContentSx} aria-busy={busy}>
        <DialogContentText id="delete-pieces-description" sx={{ pt: 2 }}>
          {pieces.length === 1
            ? `Remove ${pieces[0]?.label || 'this piece'} from the map?`
            : `Remove ${pieces.length} selected pieces from the map?`}
          {' '}This cannot be undone.
        </DialogContentText>
        {error ? <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> : null}
      </DialogContent>
      <DialogActions sx={battleMapDialogActionsSx}>
        <Button autoFocus disabled={busy} onClick={onCancel}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          startIcon={<Trash2 size={16} />}
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
