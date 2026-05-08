import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { ClipboardList, Home, Save } from 'lucide-react';
import BuilderPanel from '../components/BuilderPanel.jsx';
import { DATA_BASE } from '../constants.js';
import { saveCharacter } from '../logic/persistence.js';

export default function SheetStep({ state, dispatch }) {
  const { character } = state;
  const ready = Boolean(character.name && character.className && character.speciesName && character.backgroundName);

  return (
    <BuilderPanel id="panel-sheet" title="Generate Sheet" icon={ClipboardList} note="Final save/export from React builder state.">
      <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
        {!ready ? <Alert severity="warning">Missing required identity fields before sheet generation.</Alert> : null}
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          Finished all choices? Save character payload from reducer state.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
          <Button
            variant="contained"
            disabled={!ready}
            startIcon={<ClipboardList size={16} />}
            onClick={() => {
              const payload = saveCharacter(character, state.data);
              dispatch({ type: 'choice/open', title: 'Character Payload Saved', body: JSON.stringify(payload, null, 2) });
            }}
          >
            Save Character Payload
          </Button>
          <Button startIcon={<Save size={16} />} onClick={() => dispatch({ type: 'choice/open', title: 'Save Draft', body: JSON.stringify(character, null, 2) })}>
            Save Draft
          </Button>
          <Button href="../index.html" startIcon={<Home size={16} />}>
            Home
          </Button>
        </Stack>
        <Paper variant="outlined" sx={{ p: 1.5, width: '100%', maxWidth: 720 }}>
          <Typography variant="caption" color="text.secondary">
            Data source: {DATA_BASE}
          </Typography>
        </Paper>
      </Stack>
    </BuilderPanel>
  );
}
