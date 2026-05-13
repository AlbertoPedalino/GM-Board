import { Chip, Stack, Typography } from '@mui/material';
import { Sparkles } from 'lucide-react';
import BuilderPanel from '../components/BuilderPanel.jsx';
import ChoiceBlock from '../components/ChoiceBlock.jsx';
import { FeatCategorySlot } from '../components/FeatSlots.jsx';
import SearchList from '../components/SearchList.jsx';
import { speciesChoiceSpecs } from '../logic/choiceSpecs.js';
import { renderEntryText } from '../logic/text.js';

export default function SpeciesStep({ state, dispatch }) {
  const { character, search } = state;
  const query = search.species.toLowerCase();
  const species = state.data.species.filter((item) => item.name.toLowerCase().includes(query));

  return (
    <Stack spacing={2}>
      <BuilderPanel id="panel-species" title="Species" icon={Sparkles} note="Search list, selected card, and adapter choice regions.">
        <SearchList
          value={search.species}
          placeholder="Search species"
          items={species}
          selectedName={character.speciesName}
          onSearch={(value) => dispatch({ type: 'search/set', scope: 'species', value })}
          onSelect={(item) => dispatch({ type: 'species/select', name: item.name, source: item.source, speciesObj: item })}
          meta={(item) => (
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              {(item.traits || item.lineage || item.size || []).slice(0, 4).map((trait) => (
                <Chip key={trait} size="small" label={trait} />
              ))}
                {item.speed ? <Chip size="small" label={`Speed ${typeof item.speed === 'number' ? item.speed : item.speed.walk || 30}`} /> : null}
              </Stack>
              {item.entries ? (
                <Typography variant="body2" color="text.secondary">
                  {renderEntryText(item.entries).slice(0, 180)}
                </Typography>
              ) : null}
            </Stack>
          )}
        />
      </BuilderPanel>

      <BuilderPanel id="panel-species-choices" title="Species Choices" icon={Sparkles}>
        <Typography color="text.secondary" sx={{ mb: 1.5 }}>
          Active species: {character.speciesName}
        </Typography>
        <Stack spacing={1.5}>
          {speciesChoiceSpecs(character).map((spec) =>
            spec.type === 'feat_cat'
              ? <FeatCategorySlot key={spec.key} spec={spec} feats={state.data.feats} character={character} state={state} dispatch={dispatch} />
              : <ChoiceBlock key={spec.key} spec={spec} choices={character.choices} dispatch={dispatch} character={character} />
          )}
        </Stack>
      </BuilderPanel>
    </Stack>
  );
}
