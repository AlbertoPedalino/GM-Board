import { useEffect, useReducer } from 'react';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import ChoiceDescriptionDialog from './components/ChoiceDescriptionDialog.jsx';
import ImportSheetFab from './components/ImportSheetFab.jsx';
import PreviewPane from './components/PreviewPane.jsx';
import { STEPS } from './constants.js';
import { adapterRegistry, loadClassAdapters, loadCoreAdapters } from '../../adapters/index.js';
import { getMod, getFinal } from '../charsheet/logic/calculations.js';
import { adaptBuilderData } from '../../adapters/adapterPipeline.js';
import { loadBackgrounds, loadClassIndex, loadFeats, loadItems, loadSpecies, loadSpells, extractSheetData, importSheetPayload } from './logic/index.js';
import { builderReducer, initialBuilderState } from './state.js';
import { BackgroundStep, ClassStep, EquipmentStep, ScoresStep, SheetStep, SpeciesStep } from './steps/index.js';
import { mergeSheetIntoBuilder } from '../../shared/builderSync.js';
import { getStorageJson } from '../../shared/storage.js';

function StepLabel({ step, index }) {
  const Icon = step.icon;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip size="small" label={index + 1} />
      <Icon size={18} />
      <span>{step.label}</span>
    </Stack>
  );
}

function ActiveStep({ state, dispatch }) {
  const props = { state, dispatch };
  switch (STEPS[state.tab].id) {
    case 'class':
      return <ClassStep {...props} />;
    case 'species':
      return <SpeciesStep {...props} />;
    case 'background':
      return <BackgroundStep {...props} />;
    case 'scores':
      return <ScoresStep {...props} />;
    case 'equipment':
      return <EquipmentStep {...props} />;
    case 'sheet':
      return <SheetStep {...props} />;
    default:
      return null;
  }
}

function createInitialBuilderState() {
  try {
    const savedBuilder = getStorageJson('5e_builder_state', null);
    const savedSheet = getStorageJson('5e_current_char', null);
    const saved = mergeSheetIntoBuilder(savedBuilder, savedSheet);
    if (saved && typeof saved === 'object') {
      return { ...initialBuilderState, character: { ...initialBuilderState.character, ...saved } };
    }
  } catch (_) {}
  return initialBuilderState;
}

export default function CharBuilder() {
  const [state, dispatch] = useReducer(builderReducer, undefined, createInitialBuilderState);
  const activeStep = STEPS[state.tab];
  const ActiveIcon = activeStep.icon;

  useEffect(() => {
    const run = async (scope, loader, mapResult) => {
      dispatch({ type: 'data/load-start', scope });
      try {
        const result = await loader();
        dispatch({ type: 'data/load-success', scope, payload: mapResult(result) });
      } catch (error) {
        dispatch({ type: 'data/load-error', scope, error: error?.message || String(error) });
      }
    };

    run('classes', loadClassIndex, (result) => ({
      classCache: result.cache,
      classes: result.classes,
      subclasses: result.subclasses,
      classFeatures: result.classFeatures,
      subclassFeatures: result.subclassFeatures,
    }));
    run('species', loadSpecies, (species) => ({ species }));
    run('backgrounds', loadBackgrounds, (backgrounds) => ({ backgrounds }));
    run('feats', loadFeats, (feats) => ({ feats }));
    run('spells', loadSpells, (result) => ({ spells: result.spells, classSpellIndex: result.classSpellIndex }));
    run('items', loadItems, (items) => ({ items }));
  }, []);

  useEffect(() => {
    if (state.adaptersLoaded || state.loading.items) return;
    let cancelled = false;
    const activeClasses = [state.character.className, ...(state.character.extraClasses || []).map((extra) => extra.name)].filter(Boolean);
    Promise.all([
      loadCoreAdapters({ items: state.data.items }),
      loadClassAdapters(activeClasses, { items: state.data.items, getMod, getFinal }),
    ])
      .then(() => {
        if (!cancelled) dispatch({ type: 'adapters/loaded' });
      })
      .catch((error) => {
        if (!cancelled) dispatch({ type: 'import/message', message: `Adapter load error: ${error?.message || error}` });
      });
    return () => {
      cancelled = true;
    };
  }, [state.adaptersLoaded, state.loading.items, state.data.items]);

  useEffect(() => {
    if (!state.adaptersLoaded) return;
    const classes = [state.character.className, ...(state.character.extraClasses || []).map((extra) => extra.name)].filter(Boolean);
    if (!classes.length) return;
    loadClassAdapters(classes, { items: state.data.items, getMod, getFinal });
  }, [state.adaptersLoaded, state.character.className, state.character.extraClasses, state.data.items]);

  useEffect(() => {
    if (!state.adaptersLoaded || state.dataAdapted || Object.values(state.loading).some(Boolean)) return;
    const adaptedData = adaptBuilderData(state.data, adapterRegistry, { items: state.data.items });
    dispatch({ type: 'data/adapt', payload: adaptedData });
  }, [state.adaptersLoaded, state.dataAdapted, state.loading, state.data]);

  useEffect(() => {
    if (!state.character.cls && state.data.classes.length) {
      const cls = state.data.classes.find((item) => item.name === state.character.className && item.source === state.character.classSource);
      if (cls) dispatch({ type: 'class/select', className: cls.name, source: cls.source, classObject: cls });
    }
    if (!state.character.speciesObj && state.data.species.length) {
      const species = state.data.species.find((item) => item.name === state.character.speciesName && item.source === state.character.speciesSource);
      if (species) dispatch({ type: 'species/select', name: species.name, source: species.source, speciesObj: species });
    }
    if (!state.character.backgroundObj && state.data.backgrounds.length) {
      const background = state.data.backgrounds.find((item) => item.name === state.character.backgroundName && item.source === state.character.backgroundSource);
      if (background) dispatch({ type: 'background/select', name: background.name, source: background.source, backgroundObj: background, feat: background.feat });
    }
  }, [state.data.classes, state.data.species, state.data.backgrounds, state.character]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ImportSheetFab
        message={state.importMessage}
        onMessage={(message) => dispatch({ type: 'import/message', message })}
        onFile={async (file) => {
          try {
            const payload = extractSheetData(await file.text());
            const count = importSheetPayload(payload, () => window.confirm('Esiste gia un personaggio in questo slot. Sovrascrivere?'));
            dispatch({ type: 'import/message', message: `Imported ${count} keys. Reloading...` });
            window.setTimeout(() => window.location.reload(), 350);
          } catch (error) {
            dispatch({ type: 'import/message', message: `Error: ${error?.message || error}` });
          }
        }}
      />

      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1.5, pr: { xs: 14, md: 18 } }}>
          <Wand2 size={24} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h1" noWrap>
              Character Builder
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              D&D 5e 2024 - React JSX, Material UI, lucide-react
            </Typography>
          </Box>
          <Tooltip title={state.adaptersLoaded ? 'Adapters loaded' : 'Loading adapters'}>
            <Button size="small" disabled={!state.adaptersLoaded}>
              {state.adaptersLoaded ? 'Adapters ready' : 'Adapters...'}
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1360, mx: 'auto', px: { xs: 1.5, md: 3 }, py: 3 }}>
        <Paper variant="outlined" sx={{ mb: 2 }}>
          <Tabs
            value={state.tab}
            onChange={(_, tab) => dispatch({ type: 'tab/set', tab })}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Character builder steps"
          >
            {STEPS.map((step, index) => (
              <Tab key={step.id} label={<StepLabel step={step} index={index} />} />
            ))}
          </Tabs>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 340px', xl: 'minmax(0, 1fr) 380px' },
            alignItems: 'start',
            gap: 2.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <ActiveIcon size={22} />
              <Typography variant="h2">{activeStep.label}</Typography>
              <Chip size="small" label={`${state.tab + 1} / ${STEPS.length}`} />
            </Stack>

            <ActiveStep state={state} dispatch={dispatch} />

            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between">
              <Button
                startIcon={<ChevronLeft size={16} />}
                disabled={state.tab === 0}
                onClick={() => dispatch({ type: 'tab/set', tab: Math.max(0, state.tab - 1) })}
              >
                Back
              </Button>
              <Button
                variant="contained"
                endIcon={<ChevronRight size={16} />}
                disabled={state.tab === STEPS.length - 1}
                onClick={() => dispatch({ type: 'tab/set', tab: Math.min(STEPS.length - 1, state.tab + 1) })}
              >
                Next
              </Button>
            </Stack>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <PreviewPane character={state.character} />
          </Box>
        </Box>

        <Typography component="footer" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
          Data from 5etools via GitHub mirror - D&D 5e is a trademark of Wizards of the Coast
        </Typography>
      </Box>

      <ChoiceDescriptionDialog value={state.choiceDialog} onClose={() => dispatch({ type: 'choice/close' })} />
    </Box>
  );
}
