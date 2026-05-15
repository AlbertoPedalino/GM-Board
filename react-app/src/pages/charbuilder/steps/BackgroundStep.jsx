import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { Feather, GraduationCap, ScrollText, SlidersHorizontal } from 'lucide-react';
import BuilderPanel from '../components/BuilderPanel.jsx';
import ChoiceBlock from '../components/ChoiceBlock.jsx';
import { FeatCategorySlot, FeatFixedSlot } from '../components/FeatSlots.jsx';
import SearchList from '../components/SearchList.jsx';
import { STAT_LABELS } from '../constants.js';
import { cleanText } from '../logic/text.js';
import { getBackgroundPattern, getBackgroundPool } from '../logic/calculations.js';
import { backgroundChoiceSpecs, fixedKeysFromBlocks } from '../logic/choiceSpecs.js';


function titleCase(value) {
  return String(value || '').replace(/[_-]/g, ' ')
    .replace(/(^|\s)\w/g, (c) => c.toUpperCase())
    .replace(/'\w/g, (m) => m.toLowerCase());
}

function camelToTitle(value) {
  const v = String(value || '');
  return v.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();
}

function extractBackgroundFeat(item) {
  if (!item) return { feat: null, classHint: null };
  if (item.feat) return { feat: item.feat, classHint: null };
  const feats = Array.isArray(item.feats) ? item.feats : [];
  const first = feats[0];
  if (!first) return { feat: null, classHint: null };
  if (typeof first === 'string') {
    const parts = first.split('|');
    const classHint = parts[2] ? parts[2].toLowerCase().replace(/[^a-z]/g, '') : null;
    return { feat: camelToTitle(parts[0]), classHint };
  }
  const key = Object.keys(first).find((k) => k !== 'choose' && first[k]);
  if (!key) return { feat: null, classHint: null };
  const raw = key.split('|')[0].split(';')[0];
  let classHint = null;
  const semicol = key.split(';').slice(1).map((s) => s.trim().split('|')[0]).find(Boolean);
  if (semicol) classHint = semicol.toLowerCase().replace(/[^a-z]/g, '');
  else {
    const pipeParts = key.split('|').map((s) => s.trim()).filter(Boolean);
    if (pipeParts.length >= 3) classHint = pipeParts[2].toLowerCase().replace(/[^a-z]/g, '');
  }
  return { feat: camelToTitle(raw), classHint };
}

function ProfList({ title, items, color }) {
  if (!items?.length) return null;
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ color, fontWeight: 700 }}>{title}</Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.25, color: 'text.secondary' }}>
        {items.map((item) => (
          <Typography key={item} component="li" variant="body2">{titleCase(item)}</Typography>
        ))}
      </Box>
    </Box>
  );
}

function extractBackgroundLore(background) {
  if (background?._lore) return cleanText(background._lore);
  const entries = background?.entries;
  if (!Array.isArray(entries)) return '';
  const first = entries[0];
  if (typeof first === 'string') return cleanText(first);
  if (first?.type === 'entries' && Array.isArray(first.entries)) {
    const inner = first.entries[0];
    if (typeof inner === 'string') return cleanText(inner);
  }
  return '';
}

function BackgroundDetailCard({ background }) {
  if (!background) return null;
  const fixedSkills = fixedKeysFromBlocks(background.skillProficiencies || []);
  const fixedTools = fixedKeysFromBlocks(background.toolProficiencies || [], ['choose', 'any', 'anyTool', 'anyArtisansTool', 'anyMusicalInstrument', 'anyGamingSet']);
  const fixedLangs = fixedKeysFromBlocks(background.languageProficiencies || [], ['choose', 'any', 'anyStandard', 'anyExotic']);
  const lore = extractBackgroundLore(background);

  return (
    <Box sx={{ minWidth: 0, p: 1 }}>
      <Stack spacing={1.25} sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="h2" sx={{ flex: 1, minWidth: 0 }}>{background.name}</Typography>
          <Chip size="small" label={background.source || ''} />
        </Stack>
        {lore ? (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontStyle: 'italic' }}>
            {lore}
          </Typography>
        ) : null}
        <Divider />
        <ProfList title="Skills (granted)" items={fixedSkills} color="#d7ad52" />
        <ProfList title="Tools (granted)" items={fixedTools} color="#70b7a6" />
        <ProfList title="Languages (granted)" items={fixedLangs} color="#b58fd9" />
      </Stack>
    </Box>
  );
}

export default function BackgroundStep({ state, dispatch }) {
  const { character, search } = state;
  const query = search.background.toLowerCase();
  const backgrounds = state.data.backgrounds.filter((item) => item.name.toLowerCase().includes(query));
  const selectedBackground = character.backgroundObj || backgrounds.find((item) => item.name === character.backgroundName);
  const abilityPool = getBackgroundPool(selectedBackground);
  const patterns = selectedBackground?.ability?.map((_, index) => getBackgroundPattern(selectedBackground, index)) || [[2, 1]];

  return (
    <Stack spacing={2}>
      <BuilderPanel id="panel-bg" title="Background" icon={Feather} note="Background picker. Card sotto mostra dettagli completi.">
        <SearchList
          value={search.background}
          placeholder="Search background"
          items={backgrounds}
          selectedName={character.backgroundName}
          onSearch={(value) => dispatch({ type: 'search/set', scope: 'background', value })}
          onSelect={(item) => {
            const { feat, classHint } = extractBackgroundFeat(item);
            dispatch({ type: 'background/select', name: item.name, source: item.source, feat, classHint, backgroundObj: item });
          }}
          meta={(item) => (
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
              {(item.abilities || getBackgroundPool(item)).map((ability) => (
                <Chip key={ability} size="small" label={STAT_LABELS[ability]} />
              ))}
              {item.feat ? <Chip size="small" color="secondary" label={item.feat} /> : null}
            </Stack>
          )}
        />
      </BuilderPanel>

      <BuilderPanel id="panel-bg-detail" title="Background Detail" icon={ScrollText} note="Granted proficiencies, origin feat, description.">
        {selectedBackground ? (
          <BackgroundDetailCard background={selectedBackground} />
        ) : (
          <Typography color="text.secondary">Select a background.</Typography>
        )}
      </BuilderPanel>

      <BuilderPanel id="panel-bg-ability" title="Background Ability Bonus" icon={SlidersHorizontal}>
        <Typography color="text.secondary" sx={{ mb: 1.5 }}>
          Choose +2/+1 or +1/+1/+1 from selected background ability pool.
        </Typography>
        <Stack spacing={1.5}>
          {patterns.length > 1 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {patterns.map((pattern, index) => (
                <Chip
                  key={pattern.join('-')}
                  label={pattern.map((value) => `+${value}`).join('/')}
                  color={character.backgroundPatternIdx === index ? 'primary' : 'default'}
                  onClick={() => dispatch({ type: 'background/pattern', index })}
                />
              ))}
            </Stack>
          ) : null}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {abilityPool.map((stat) => {
              const idx = character.backgroundAbilities.indexOf(stat);
              const bonus = idx >= 0 ? character.backgroundPattern[idx] || 0 : 0;
              return (
                <Button
                  key={stat}
                  variant={idx >= 0 ? 'contained' : 'outlined'}
                  onClick={() => dispatch({ type: 'background/ability-toggle', stat })}
                >
                  {STAT_LABELS[stat]} {bonus ? `+${bonus}` : ''}
                </Button>
              );
            })}
          </Stack>
        </Stack>
      </BuilderPanel>

      <BuilderPanel id="panel-bg-choices" title="Background Choices" icon={GraduationCap} note="Origin feat + skill/tool/language picks.">
        <Stack spacing={1.5}>
          {backgroundChoiceSpecs(character).map((spec) => {
            if (spec.type === 'feat_fixed') {
              return <FeatFixedSlot key={spec.key} spec={spec} feats={state.data.feats} character={character} state={state} dispatch={dispatch} />;
            }
            if (spec.type === 'feat_cat') {
              return <FeatCategorySlot key={spec.key} spec={spec} feats={state.data.feats} character={character} state={state} dispatch={dispatch} />;
            }
            return <ChoiceBlock key={spec.key} spec={spec} choices={character.choices} dispatch={dispatch} character={character} />;
          })}
        </Stack>
      </BuilderPanel>
    </Stack>
  );
}
