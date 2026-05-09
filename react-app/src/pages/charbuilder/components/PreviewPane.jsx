import { memo } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { ChevronDown, Feather, Languages, Layers, Shield, Sparkles, Sword } from 'lucide-react';
import { STAT_LABELS, STATS } from '../constants.js';
import { calcMaxHp, formatMod, getAllFinalScores, getPrimaryClassLevel } from '../logic/calculations.js';
import { renderEntryText } from '../logic/text.js';
import { installedRegistry } from '../../../adapters/index.js';
import { collectAllProficiencies } from '../../charsheet/logic/proficiencies.js';
import { normalizeCharacterChoices } from '../../../shared/choiceNormalization.js';

const SOURCE_COLOR = {
  class: '#d7ad52',
  subclass: '#70b7a6',
  species: '#b58fd9',
  background: '#d69245',
  feat: '#de675f',
};

const darkChipText = '#17120d';

function filledChipSx(bg) {
  return {
    backgroundColor: bg,
    color: darkChipText,
    fontWeight: 700,
    border: '1px solid rgba(255, 232, 176, 0.65)',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.28) inset',
    '& .MuiChip-label': { color: darkChipText },
  };
}

function outlinedChipSx(color) {
  return {
    color,
    borderColor: color,
    fontWeight: 700,
    '& .MuiChip-label': { color },
  };
}

function FeatureCard({ name, level, source, body, sublabel }) {
  const tone = SOURCE_COLOR[source] || '#d7ad52';
  return (
    <Card variant="outlined" sx={{ minWidth: 0, borderLeft: `3px solid ${tone}` }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
            {level != null ? <Chip size="small" label={`Lv ${level}`} sx={{ ...filledChipSx(tone), height: 18, fontSize: '0.65rem' }} /> : null}
            <Typography variant="body2" fontWeight={700} sx={{ flex: 1, minWidth: 0, color: tone, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Typography>
            {sublabel ? <Chip size="small" variant="outlined" label={sublabel} sx={{ ...outlinedChipSx(tone), height: 18, fontSize: '0.6rem' }} /> : null}
          </Stack>
          {body ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {body}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

function FeatureWithChips({ entry, source, extraSublabel }) {
  const { feature, runtimeChips } = entry;
  const tone = SOURCE_COLOR[source] || SOURCE_COLOR.class;
  const body = renderEntryText(feature.entries);
  return (
    <Accordion
      disableGutters
      square
      variant="outlined"
      sx={{
        minWidth: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        borderLeft: `3px solid ${tone}`,
        '&:before': { display: 'none' },
        '&.Mui-expanded': { my: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={14} />}
        sx={{
          minHeight: 32,
          px: 1,
          py: 0,
          '&.Mui-expanded': { minHeight: 32 },
          '& .MuiAccordionSummary-content': { my: 0.5, minWidth: 0 },
          '& .MuiAccordionSummary-content.Mui-expanded': { my: 0.5 },
        }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ minWidth: 0, color: tone, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {feature.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1, pt: 0, pb: 1 }}>
        <Stack spacing={0.75} sx={{ minWidth: 0 }}>
          {extraSublabel ? <Chip size="small" variant="outlined" label={extraSublabel} sx={{ ...outlinedChipSx(tone), alignSelf: 'flex-start', height: 20, fontSize: '0.62rem' }} /> : null}
          {runtimeChips?.length ? (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {runtimeChips.map((chip, idx) => (
                <Chip key={`rt-${idx}`} size="small" label={chip} sx={{ ...outlinedChipSx('#edd48a'), height: 20, fontSize: '0.62rem', bgcolor: 'rgba(215, 173, 82, 0.12)' }} />
              ))}
            </Stack>
          ) : null}
          <Typography variant="caption" component="div" color="text.secondary" sx={{ lineHeight: 1.45, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
            {body || 'No description.'}
          </Typography>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function LevelGroup({ classFeatures, subFeatures }) {
  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        {classFeatures.map((entry) => (
          <FeatureWithChips key={`c-${entry.feature.name}-${entry.feature.level}`} entry={entry} source="class" />
        ))}
        {subFeatures.map((entry) => (
          <FeatureWithChips key={`s-${entry.feature.name}-${entry.feature.level}`} entry={entry} source="subclass" extraSublabel="sub" />
        ))}
      </Stack>
    </Stack>
  );
}

function normalizeListValue(value) {
  return String(value || '')
    .replace(/\{@[a-z]+ ([^|}]+)(?:\|[^}]*)?\}/gi, '$1')
    .replace(/[{}]/g, '')
    .replace(/\.$/, '')
    .trim();
}

function uniqueClean(values) {
  const seen = new Set();
  const out = [];
  (values || []).flat().forEach((value) => {
    const label = normalizeListValue(value);
    const key = label.toLowerCase();
    if (!label || seen.has(key)) return;
    seen.add(key);
    out.push(label);
  });
  return out.sort((a, b) => a.localeCompare(b));
}

function collectSkillProficiencies(character) {
  const fromSelected = Array.isArray(character.selectedSkills)
    ? character.selectedSkills
    : [
      ...(character.selectedSkills?.proficient || []),
      ...(character.selectedSkills?.expertise || []),
    ];
  const fromChoices = Object.entries(character.choices || [])
    .filter(([key]) => {
      const lk = key.toLowerCase();
      return lk.includes('skill') || lk.includes('exp_');
    })
    .flatMap(([, value]) => (Array.isArray(value) ? value : [value]));
  return uniqueClean([...fromSelected, ...fromChoices]);
}

function collectPreviewProficiencies(character) {
  const sheetLike = {
    ...character,
    clsSnapshot: character.clsSnapshot || character.cls || {},
    bgSnapshot: character.bgSnapshot || character.backgroundObj || {},
    speciesSnapshot: {
      ...(character.speciesSnapshot || character.speciesObj || {}),
      languageProficiencies: [{ common: true }, ...((character.speciesSnapshot || character.speciesObj || {}).languageProficiencies || [])],
    },
    allClassFeatures: [
      ...(character.allFeatures || []),
      ...(character.allSubFeatures || []),
      ...(character.extraClasses || []).flatMap((extra) => [
        ...(extra.allFeatures || []),
        ...(extra.allSubFeatures || []),
      ]),
    ],
  };
  const sections = collectAllProficiencies(sheetLike).map((section) => ({
    title: section.title,
    items: uniqueClean(section.items),
  }));
  const skillItems = collectSkillProficiencies(character);
  if (skillItems.length) sections.unshift({ title: 'Skills', items: skillItems });
  return sections.filter((section) => section.items.length);
}

function ProficiencySection({ sections }) {
  if (!sections.length) return null;
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Languages size={16} color={SOURCE_COLOR.subclass} />
        <Typography variant="overline" sx={{ letterSpacing: 1, color: SOURCE_COLOR.subclass }}>
          Proficiencies / Languages
        </Typography>
      </Stack>
      {sections.map((section) => (
        <Box key={section.title} sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {section.title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'hidden' }}>
            {section.items.map((item) => (
              <Chip
                key={`${section.title}-${item}`}
                size="small"
                variant="outlined"
                label={item}
                sx={{
                  ...outlinedChipSx(section.title === 'Languages' ? SOURCE_COLOR.subclass : '#edd48a'),
                  flex: '0 1 auto',
                  minWidth: 0,
                  height: 21,
                  maxWidth: '100%',
                  '& .MuiChip-label': {
                    color: section.title === 'Languages' ? SOURCE_COLOR.subclass : '#edd48a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function normName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function firstValue(value) {
  if (Array.isArray(value)) return value.find((item) => item != null && item !== '') || '';
  return value || '';
}

function cleanChoiceText(value) {
  if (value == null) return '';
  if (typeof value === 'object') return cleanChoiceText(value.label ?? value.name ?? value.key ?? value.value);
  return String(value).split('|')[0].replace(/\{@\w+\s+/g, '').replace(/\}/g, '').trim();
}

function compactText(value) {
  return cleanChoiceText(value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function titleCase(value) {
  const text = cleanChoiceText(value);
  return text
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function addUnique(target, value) {
  const text = cleanChoiceText(value);
  if (!text) return;
  const key = compactText(text);
  if (!target.some((item) => compactText(item) === key)) target.push(text);
}

function getNormalizedPreviewChoices(character) {
  if (character?.normalizedChoices && typeof character.normalizedChoices === 'object') {
    return character.normalizedChoices;
  }
  return normalizeCharacterChoices(character || {});
}

function getChoiceValue(character, normalized, key) {
  return firstValue(
    character?.choices?.[key]
    ?? normalized?.rawByKey?.[key]
    ?? normalized?.species?.options?.[key]
    ?? normalized?.classOptions?.[key]
    ?? normalized?.subclassOptions?.[key]
  );
}

const DRAGONBORN_DAMAGE_TYPES = {
  black: 'Acid',
  copper: 'Acid',
  blue: 'Lightning',
  bronze: 'Lightning',
  brass: 'Fire',
  gold: 'Fire',
  red: 'Fire',
  green: 'Poison',
  silver: 'Cold',
  white: 'Cold',
};

const TIEFLING_RESISTANCES = {
  abyssal: 'Poison',
  chthonic: 'Necrotic',
  infernal: 'Fire',
};

function detectDragonbornDamage(ancestry) {
  const raw = cleanChoiceText(ancestry);
  const c = compactText(raw);
  const found = Object.entries(DRAGONBORN_DAMAGE_TYPES).find(([dragon]) => c.includes(dragon));
  return found ? found[1] : '';
}

function detectTieflingResistance(legacy) {
  const c = compactText(legacy);
  const found = Object.entries(TIEFLING_RESISTANCES).find(([legacyKey]) => c.includes(legacyKey));
  return found ? found[1] : '';
}

function derivePreviewRuntime(character) {
  const normalized = getNormalizedPreviewChoices(character);
  const className = character?.className || '';
  const speciesName = character?.speciesName || '';
  const speciesKey = compactText(speciesName);
  const subclassKey = compactText(character?.subclassShortName || '');
  const level = Number(character?.level || character?.classLevel || 1);
  const primaryLv = getPrimaryClassLevel(character);
  const speciesVersion = cleanChoiceText(normalized?.species?.version || getChoiceValue(character, normalized, 'species_version'));

  const out = {
    senses: [],
    resistances: [],
    acOptions: [],
    hpBonuses: [],
    traits: [],
    warnings: [],
  };

  // Class-based preview effects
  if (compactText(className) === 'barbarian') {
    addUnique(out.acOptions, 'Unarmored Defense: 10 + DEX + CON + Shield');
    addUnique(out.resistances, 'Rage: Bludgeoning, Piercing, Slashing while raging');
  }
  if (compactText(className) === 'monk') {
    addUnique(out.acOptions, 'Unarmored Defense: 10 + DEX + WIS, no armor/shield');
  }
  if (compactText(className) === 'bard' && subclassKey.includes('dance')) {
    addUnique(out.acOptions, 'Dance of the Wind: 10 + DEX + CHA, no armor/shield');
  }
  if (compactText(className) === 'paladin' && subclassKey.includes('noblegenies')) {
    addUnique(out.acOptions, "Genie's Splendor: 10 + DEX + CHA + Shield");
  }

  // Species-based preview effects
  if (speciesKey.includes('aasimar')) {
    addUnique(out.senses, 'Darkvision 60 ft');
    addUnique(out.resistances, 'Necrotic');
    addUnique(out.resistances, 'Radiant');
    if (level >= 3) {
      if (speciesVersion) addUnique(out.traits, `Celestial Revelation: ${speciesVersion}`);
      else addUnique(out.warnings, 'Celestial Revelation not selected');
    } else {
      addUnique(out.traits, 'Celestial Revelation unlocks at Lv 3');
    }
  }

  if (speciesKey.includes('dragonborn')) {
    const ancestry = speciesVersion;
    if (ancestry) {
      const damage = detectDragonbornDamage(ancestry);
      addUnique(out.traits, `Draconic Ancestry: ${titleCase(ancestry)}`);
      if (damage) addUnique(out.resistances, damage);
    } else {
      addUnique(out.warnings, 'Draconic Ancestry not selected');
    }
  }

  if (speciesKey.includes('dwarf')) {
    addUnique(out.senses, 'Darkvision 120 ft');
    addUnique(out.resistances, 'Poison');
    addUnique(out.hpBonuses, '+1 HP per character level');
  }

  if (speciesKey.includes('elf') || speciesKey.includes('khoravar')) {
    const isDrow = compactText(speciesVersion).includes('drow');
    addUnique(out.senses, isDrow ? 'Darkvision 120 ft' : 'Darkvision 60 ft');
    addUnique(out.traits, 'Fey Ancestry');
    if (speciesVersion) addUnique(out.traits, `Elven Lineage: ${titleCase(speciesVersion)}`);
  }

  if (speciesKey.includes('gnome')) {
    const isDeep = compactText(speciesVersion).includes('deep');
    addUnique(out.senses, isDeep ? 'Darkvision 120 ft' : 'Darkvision 60 ft');
    addUnique(out.traits, 'Gnomish Cunning');
    if (speciesVersion) addUnique(out.traits, `Gnomish Lineage: ${titleCase(speciesVersion)}`);
  }

  if (speciesKey.includes('goliath')) {
    if (speciesVersion) addUnique(out.traits, `Giant Ancestry: ${titleCase(speciesVersion)}`);
    else addUnique(out.warnings, 'Giant Ancestry not selected');
  }

  if (speciesKey.includes('halfling')) {
    addUnique(out.traits, 'Brave');
    addUnique(out.traits, 'Luck');
  }

  if (speciesKey.includes('orc')) {
    addUnique(out.senses, 'Darkvision 120 ft');
    addUnique(out.traits, 'Relentless Endurance');
    addUnique(out.traits, 'Adrenaline Rush');
  }

  if (speciesKey.includes('shifter')) {
    addUnique(out.senses, 'Darkvision 60 ft');
    if (speciesVersion) addUnique(out.traits, `Shifter Lineage: ${titleCase(speciesVersion)}`);
    else addUnique(out.warnings, 'Shifter Lineage not selected');
  }

  if (speciesKey.includes('tiefling')) {
    addUnique(out.senses, 'Darkvision 60 ft');
    if (speciesVersion) {
      const resistance = detectTieflingResistance(speciesVersion);
      addUnique(out.traits, `Fiendish Legacy: ${titleCase(speciesVersion)}`);
      if (resistance) addUnique(out.resistances, resistance);
    } else {
      addUnique(out.warnings, 'Fiendish Legacy not selected');
    }
  }

  if (speciesKey.includes('warforged')) {
    addUnique(out.traits, 'Constructed Resilience');
    addUnique(out.acOptions, '+1 AC from Integrated Protection');
  }

  if (speciesKey.includes('kalashtar')) {
    addUnique(out.resistances, 'Psychic');
  }

  return out;
}

function RuntimePreviewGroup({ title, items, color = '#edd48a' }) {
  if (!items?.length) return null;
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, width: '100%', minWidth: 0 }}>
        {items.map((item) => (
          <Chip
            key={`${title}-${item}`}
            size="small"
            variant="outlined"
            label={item}
            sx={{
              ...outlinedChipSx(color),
              height: 21,
              maxWidth: '100%',
              '& .MuiChip-label': {
                color,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.62rem',
                fontWeight: 700,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

function BuilderRuntimePreview({ runtime }) {
  const hasAny = runtime.senses.length
    || runtime.resistances.length
    || runtime.acOptions.length
    || runtime.hpBonuses.length
    || runtime.traits.length
    || runtime.warnings.length;

  if (!hasAny) return null;

  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Shield size={16} color={SOURCE_COLOR.species} />
        <Typography variant="overline" sx={{ letterSpacing: 1, color: SOURCE_COLOR.species }}>
          Builder Runtime Preview
        </Typography>
      </Stack>
      <RuntimePreviewGroup title="Senses" items={runtime.senses} color={SOURCE_COLOR.species} />
      <RuntimePreviewGroup title="Resistances" items={runtime.resistances} color="#edd48a" />
      <RuntimePreviewGroup title="AC Options" items={runtime.acOptions} color={SOURCE_COLOR.class} />
      <RuntimePreviewGroup title="HP Bonuses" items={runtime.hpBonuses} color={SOURCE_COLOR.background} />
      <RuntimePreviewGroup title="Traits / Selected Options" items={runtime.traits} color={SOURCE_COLOR.subclass} />
      <RuntimePreviewGroup title="Missing Selections" items={runtime.warnings} color={SOURCE_COLOR.feat} />
    </Stack>
  );
}

function ClassSection({ icon: Icon, title, classFeatures, subFeatures, subclassName, level, runtimeActions, runtimeResources, choiceCards }) {
  const valid = classFeatures.filter((feature) => !feature?.isReprinted && (feature.level || 0) <= level);
  const validSub = subFeatures.filter((feature) => !feature?.isReprinted && (feature.level || 0) <= level && feature.subclassShortName === subclassName);
  const runtimeByName = new Map();
  (runtimeActions || []).forEach((action) => runtimeByName.set(normName(action.name), { ...action, kind: 'action' }));
  (runtimeResources || []).forEach((resource) => {
    const key = normName(resource.name);
    const existing = runtimeByName.get(key);
    runtimeByName.set(key, { ...(existing || {}), name: resource.name, max: resource.max, recharge: resource.recharge, kind: existing ? existing.kind : 'resource' });
  });

  const enrich = (feature) => {
    const rt = runtimeByName.get(normName(feature.name));
    if (!rt) return null;
    runtimeByName.delete(normName(feature.name));
    const maxValue = typeof rt.max === 'function' ? rt.max(level) : rt.max;
    const chips = [];
    if (rt.uses) chips.push(rt.uses);
    if (rt.recharge) chips.push(rt.recharge);
    if (maxValue != null) chips.push(`Max ${maxValue}`);
    return chips;
  };

  const byLevel = {};
  valid.forEach((feature) => {
    const lv = feature.level || 1;
    if (!byLevel[lv]) byLevel[lv] = { c: [], s: [] };
    byLevel[lv].c.push({ feature, runtimeChips: enrich(feature) });
  });
  validSub.forEach((feature) => {
    const lv = feature.level || 1;
    if (!byLevel[lv]) byLevel[lv] = { c: [], s: [] };
    byLevel[lv].s.push({ feature, runtimeChips: enrich(feature) });
  });
  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
        {Icon ? <Icon size={16} color={SOURCE_COLOR.class} /> : null}
        <Typography variant="overline" sx={{ letterSpacing: 1, color: SOURCE_COLOR.class }}>{title}</Typography>
      </Stack>
      {levels.map((lv) => (
        <LevelGroup
          key={`lvg-${lv}`}
          classFeatures={byLevel[lv].c}
          subFeatures={byLevel[lv].s}
        />
      ))}
      {choiceCards}
    </Stack>
  );
}

function partitionChoices(choices) {
  const out = { class: [], multiclass: {}, subclass: [], species: [], background: [], feat: [], other: [] };
  Object.entries(choices || {}).forEach(([key, value]) => {
    if (value == null || value === '') return;
    const values = Array.isArray(value) ? value.filter((item) => item != null && item !== '') : [value];
    if (!values.length) return;
    const entry = { key, values };
    const mc = key.match(/^mc(\d+)_(.*)$/);
    if (mc) {
      const idx = Number(mc[1]);
      if (!out.multiclass[idx]) out.multiclass[idx] = [];
      out.multiclass[idx].push({ ...entry, key: mc[2] });
      return;
    }
    if (key.startsWith('subclass_')) out.subclass.push(entry);
    else     if (key.startsWith('species_') && key !== 'species_origin_feat') out.species.push(entry);
    else if (key === 'species_origin_feat') out.feat.push(entry);
    else if (key.startsWith('bg_') || key === 'feat_origin' || key.startsWith('feat_origin_')) out.background.push(entry);
    else if (key.startsWith('feat_')) out.feat.push(entry);
    else if (key.startsWith('class_') || key.startsWith('start_') || key.startsWith('auto_') || key.includes('_skill_') || key.includes('_lang_') || key.includes('_tool_') || key.includes('_opt_') || key.includes('_exp_')) out.class.push(entry);
    else out.other.push(entry);
  });
  return out;
}

function labelFromKey(key) {
  return key
    .replace(/^auto_(primary|ec\d+)_feat_/, '')
    .replace(/_(skill|lang|tool|opt|exp)_\d+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function ChoiceCard({ entry, source }) {
  const tone = SOURCE_COLOR[source] || '#bda98a';
  return (
    <Card variant="outlined" sx={{ minWidth: 0, borderLeft: `3px dashed ${tone}` }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: tone, fontWeight: 700 }}>{labelFromKey(entry.key)}</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.25, color: 'text.secondary' }}>
            {entry.values.map((value, idx) => (
              <Typography key={`${value}-${idx}`} component="li" variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {String(value)}
              </Typography>
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function PreviewPaneImpl({ character }) {
  const scores = getAllFinalScores(character);
  const hp = calcMaxHp(character);
  const primaryLv = getPrimaryClassLevel(character);
  const partitioned = partitionChoices(character.choices);
  const proficiencySections = collectPreviewProficiencies(character);
  const builderRuntimePreview = derivePreviewRuntime(character);

  const classActions = installedRegistry
    .getClassSheetActions(character.className)
    .filter((action) => !action.minLevel || primaryLv >= Number(action.minLevel));
  const classResources = installedRegistry
    .getClassSheetResources(character.className)
    .filter((resource) => !resource.minLevel || primaryLv >= Number(resource.minLevel));
  const subclassActions = character.subclassShortName
    ? installedRegistry.getSubclassSheetActions(character.className, character.subclassShortName)
      .filter((action) => !action.minLevel || primaryLv >= Number(action.minLevel))
      .map((action) => ({ ...action, fromSubclass: true }))
    : [];
  const subclassResources = character.subclassShortName
    ? installedRegistry.getSubclassSheetResources(character.className, character.subclassShortName)
      .filter((resource) => !resource.minLevel || primaryLv >= Number(resource.minLevel))
    : [];

  const speciesActions = character.speciesName
    ? installedRegistry.getSpeciesSheetActions(character.speciesName, character.speciesSource)
    : [];

  return (
    <Paper variant="outlined" sx={{ p: 1, position: { md: 'sticky' }, top: 64, maxHeight: { md: 'calc(100vh - 76px)' }, overflow: 'auto', minWidth: 0 }}>
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Stack spacing={0.25}>
          <Typography variant="h2" sx={{ color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</Typography>
          <Typography variant="h1" noWrap sx={{ color: '#edd48a' }}>{character.name || 'Unnamed Character'}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.66rem' }}>
            Lv {character.level} {character.speciesName} {character.className} - {hp || '-'} HP
          </Typography>
        </Stack>

        <Grid container spacing={0.55}>
          {STATS.map((stat) => (
            <Grid key={stat} item xs={4}>
              <Card variant="outlined" sx={{ textAlign: 'center' }}>
                <CardContent sx={{ p: 0.55, '&:last-child': { pb: 0.55 } }}>
                  <Typography variant="caption" color="text.secondary" display="block">{STAT_LABELS[stat]}</Typography>
                  <Typography variant="h2">{scores[stat] ?? '-'}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{formatMod(scores[stat])}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider />
        <ProficiencySection sections={proficiencySections} />
        {proficiencySections.length ? <Divider /> : null}
        <BuilderRuntimePreview runtime={builderRuntimePreview} />
        {(builderRuntimePreview.senses.length
          || builderRuntimePreview.resistances.length
          || builderRuntimePreview.acOptions.length
          || builderRuntimePreview.hpBonuses.length
          || builderRuntimePreview.traits.length
          || builderRuntimePreview.warnings.length) ? <Divider /> : null}

        {character.cls ? (
          <ClassSection
            icon={Sword}
            title={`${character.className} ${primaryLv}${character.subclassShortName ? ` - ${character.subclassShortName}` : ''}`}
            classFeatures={character.allFeatures || []}
            subFeatures={character.allSubFeatures || []}
            subclassName={character.subclassShortName}
            level={primaryLv}
            runtimeActions={[...classActions, ...subclassActions]}
            runtimeResources={[...classResources, ...subclassResources]}
            choiceCards={[
              ...partitioned.class.map((entry) => <ChoiceCard key={`pc-${entry.key}`} entry={entry} source="class" />),
              ...partitioned.subclass.map((entry) => <ChoiceCard key={`ps-${entry.key}`} entry={entry} source="subclass" />),
            ]}
          />
        ) : null}

        {(character.extraClasses || []).map((extra, index) => {
          const ecLv = extra.level || 1;
          const ecActions = installedRegistry.getClassSheetActions(extra.name).filter((action) => !action.minLevel || ecLv >= Number(action.minLevel));
          const ecResources = installedRegistry.getClassSheetResources(extra.name).filter((resource) => !resource.minLevel || ecLv >= Number(resource.minLevel));
          const ecSubActions = extra.subclassShortName
            ? installedRegistry.getSubclassSheetActions(extra.name, extra.subclassShortName)
              .filter((action) => !action.minLevel || ecLv >= Number(action.minLevel))
              .map((action) => ({ ...action, fromSubclass: true }))
            : [];
          const ecSubResources = extra.subclassShortName
            ? installedRegistry.getSubclassSheetResources(extra.name, extra.subclassShortName)
              .filter((resource) => !resource.minLevel || ecLv >= Number(resource.minLevel))
            : [];
          const ecChoices = partitioned.multiclass[index] || [];
          return (
            <Box key={`${extra.name}-${index}`} sx={{ minWidth: 0 }}>
              <Divider sx={{ mb: 1 }} />
              <ClassSection
                icon={Shield}
                title={`MC ${index + 1} - ${extra.name} ${ecLv}${extra.subclassShortName ? ` - ${extra.subclassShortName}` : ''}`}
                classFeatures={extra.allFeatures || []}
                subFeatures={extra.allSubFeatures || []}
                subclassName={extra.subclassShortName}
                level={ecLv}
                runtimeActions={[...ecActions, ...ecSubActions]}
                runtimeResources={[...ecResources, ...ecSubResources]}
                choiceCards={ecChoices.map((entry) => <ChoiceCard key={`mc-${index}-${entry.key}`} entry={entry} source={entry.key.startsWith('subclass_') ? 'subclass' : 'class'} />)}
              />
            </Box>
          );
        })}

        <Divider />

        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Sparkles size={16} color={SOURCE_COLOR.species} />
            <Typography variant="overline" sx={{ letterSpacing: 1, color: SOURCE_COLOR.species }}>
              Species - {character.speciesName || '?'}
            </Typography>
          </Stack>
          {speciesActions.map((action) => (
            <FeatureCard
              key={action.name}
              name={action.name}
              level={action.minLevel || null}
              source="species"
              sublabel={action.cat}
              body={action.desc}
            />
          ))}
          {partitioned.species.map((entry) => (
            <ChoiceCard key={entry.key} entry={entry} source="species" />
          ))}
          {!speciesActions.length && !partitioned.species.length ? (
            <Typography variant="caption" color="text.secondary">No species abilities yet.</Typography>
          ) : null}
        </Stack>

        <Divider />
        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Feather size={16} color={SOURCE_COLOR.background} />
            <Typography variant="overline" sx={{ letterSpacing: 1, color: SOURCE_COLOR.background }}>
              Background - {character.backgroundName || '?'}
            </Typography>
          </Stack>
          {partitioned.background.map((entry) => (
            <ChoiceCard key={entry.key} entry={entry} source="background" />
          ))}
          {!partitioned.background.length ? (
            <Typography variant="caption" color="text.secondary">No background choices yet.</Typography>
          ) : null}
        </Stack>

        {partitioned.feat.length ? (
          <>
            <Divider />
            <Stack spacing={1} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Layers size={16} color={SOURCE_COLOR.feat} />
                <Typography variant="overline" sx={{ letterSpacing: 1, color: SOURCE_COLOR.feat }}>Feats</Typography>
              </Stack>
              {partitioned.feat.map((entry) => (
                <ChoiceCard key={entry.key} entry={entry} source="feat" />
              ))}
            </Stack>
          </>
        ) : null}

      </Stack>
    </Paper>
  );
}

export default memo(PreviewPaneImpl, (prev, next) => prev.character === next.character);
