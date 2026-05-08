import { Stack, Typography } from '@mui/material';
import { Layers } from 'lucide-react';
import BuilderPanel from '../components/BuilderPanel.jsx';
import ChoiceBlock from '../components/ChoiceBlock.jsx';
import { FeatCategorySlot, FeatFixedSlot } from '../components/FeatSlots.jsx';
import SpellChoiceList from '../components/SpellChoiceList.jsx';
import { classChoiceSpecs } from '../spells/choiceSpecs.js';
import NamePanel from '../components/NamePanel.jsx';
import XpPanel from '../components/XpPanel.jsx';
import ClassPanel from '../components/ClassPanel.jsx';
import LevelPanel from '../components/LevelPanel.jsx';
import SubclassPanel from '../components/SubclassPanel.jsx';
import SpellSlotsPanel from '../components/SpellSlotsPanel.jsx';
import SpellSelectionPanel from '../components/SpellSelectionPanel.jsx';

export default function ClassStep({ state, dispatch }) {
  const { character } = state;
  const choiceSpecs = classChoiceSpecs(character, { items: state.data.items });

  const renderSpec = (spec) => {
    if (spec.type === 'spell_choice' || spec.type === 'spell_grant') {
      return <SpellChoiceList key={spec.key} spec={spec} state={state} dispatch={dispatch} />;
    }
    if (spec.type === 'feat_cat') {
      return <FeatCategorySlot key={spec.key} spec={spec} feats={state.data.feats} character={character} state={state} dispatch={dispatch} />;
    }
    if (spec.type === 'feat_fixed') {
      return <FeatFixedSlot key={spec.key} spec={spec} feats={state.data.feats} character={character} state={state} dispatch={dispatch} />;
    }
    return <ChoiceBlock key={spec.key} spec={spec} choices={character.choices} dispatch={dispatch} />;
  };

  return (
    <Stack spacing={2}>
      <NamePanel character={character} dispatch={dispatch} />
      <XpPanel character={character} dispatch={dispatch} />
      <ClassPanel state={state} character={character} dispatch={dispatch} />
      <LevelPanel character={character} dispatch={dispatch} />
      <SubclassPanel character={character} dispatch={dispatch} />
      <SpellSlotsPanel character={character} />
      <BuilderPanel id="panel-class-choices" title="Class Choices" icon={Layers} note="Class, subclass, ASI, expertise, optional, plus feat slots (Fighting Style, Epic Boon, ASI feat).">
        <Stack spacing={1.5}>
          {choiceSpecs.map(renderSpec)}
          {!choiceSpecs.length ? (
            <Typography color="text.secondary">No class choices at current level.</Typography>
          ) : null}
        </Stack>
      </BuilderPanel>
      <SpellSelectionPanel state={state} dispatch={dispatch} />
    </Stack>
  );
}
