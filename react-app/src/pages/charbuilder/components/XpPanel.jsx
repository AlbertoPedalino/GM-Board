import { LinearProgress, Stack, TextField } from '@mui/material';
import { Layers } from 'lucide-react';
import BuilderPanel from './BuilderPanel.jsx';
import { getXpProgress } from '../logic/calculations.js';

export default function XpPanel({ character, dispatch }) {
  const progress = getXpProgress(character.xp, character.level);
  return (
    <BuilderPanel id="panel-xp" title="Experience (XP)" icon={Layers} note={`${progress}% toward level 2 threshold`}>
      <Stack spacing={1.25}>
        <LinearProgress variant="determinate" value={progress} />
        <TextField
          type="number"
          value={character.xp}
          inputProps={{ min: 0 }}
          placeholder="Total XP"
          onChange={(event) => dispatch({ type: 'xp/set', value: Number(event.target.value) || 0 })}
        />
      </Stack>
    </BuilderPanel>
  );
}
