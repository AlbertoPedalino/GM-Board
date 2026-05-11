import { memo } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { ChevronDown, Feather, Languages, Layers, Shield, Sparkles, Sword } from 'lucide-react';
import { STAT_LABELS, STATS } from '../constants.js';
import { calcMaxHp, formatMod, getAllFinalScores, getPrimaryClassLevel } from '../logic/calculations.js';
import { installedRegistry } from '../../../adapters/index.js';
import { collectAllProficiencies } from '../../charsheet/logic/proficiencies.js';
import { collectPreviewDefenseSections, collectPreviewEffectProficiencySections } from '../../charsheet/logic/sheetEffects.js';
import { collapseWeaponProficiencies, uniqueDisplayLabels } from '../../../shared/character/proficiencyDisplay.js';
import { collectResolvedWeaponMasteries } from '../../../shared/character/weaponMastery.js';

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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanPreviewText(value) {
  return escapeHtml(value)
    .replace(/\{@hit ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@damage ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@dc ([^}]+)\}/g, 'DC $1')
    .replace(/\{@spell ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@item ([^|}]+)[^}]*\}/g, '<i>$1</i>')
    .replace(/\{@condition ([^|}]+)[^}]*\}/g, '<b>$1</b>')
    .replace(/\{@action ([^|}]+)[^}]*\}/g, '<b>$1</b>')
    .replace(/\{@skill ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@ability ([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@b ([^}]+)\}/g, '<b>$1</b>')
    .replace(/\{@i ([^}]+)\}/g, '<i>$1</i>')
    .replace(/\{@[a-z]+ ([^|}]+)[^}]*\}/gi, '$1')
    .replace(/\{[^}]+\}/g, '');
}

function renderPreviewEntries(entries) {
  if (!entries) return '';
  if (typeof entries === 'string' || typeof entries === 'number') return cleanPreviewText(entries);
  if (Array.isArray(entries)) return entries.map((entry) => renderPreviewEntries(entry)).filter(Boolean).join('<br/>');
  if (typeof entries === 'object') {
    if (entries.type === 'list') {
      return `<ul style="margin:0.3rem 0 0.3rem 1.2rem;padding-left:0.4rem">${(entries.items || []).map((item) => `<li>${renderPreviewEntries(item)}</li>`).join('')}</ul>`;
    }
    if (entries.type === 'table') {
      let html = '<table style="width:100%;border-collapse:collapse;font-size:0.7rem;margin:0.4rem 0">';
      if (entries.colLabels) {
        html += `<thead><tr>${entries.colLabels.map((label) => `<th style="text-align:left;padding:3px 6px;border-bottom:1px solid rgba(237,212,138,0.25)">${cleanPreviewText(label)}</th>`).join('')}</tr></thead>`;
      }
      html += `<tbody>${(entries.rows || []).map((row) => `<tr>${(row || []).map((cell) => `<td style="padding:2px 6px;border-bottom:1px solid rgba(237,212,138,0.16)">${renderPreviewEntries(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      return `${html}</table>`;
    }
    if (entries.name && entries.entries) return `<b>${cleanPreviewText(entries.name)}.</b> ${renderPreviewEntries(entries.entries)}`;
    if (entries.entries) return renderPreviewEntries(entries.entries);
    if (entries.items) return renderPreviewEntries(entries.items);
  }
  return '';
}

function HtmlCaption({ html, clamp = false }) {
  if (!html) return null;
  return (
    <Box
      component="div"
      sx={{
        color: 'text.secondary',
        fontSize: '0.75rem',
        lineHeight: 1.45,
        wordBreak: 'break-word',
        ...(clamp ? { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
        '& b': { color: 'text.primary', fontWeight: 700 },
        '& i': { color: 'text.secondary' },
        '& ul': { my: 0.35 },
        '& li': { mb: 0.2 },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
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
          {body ? <HtmlCaption html={renderPreviewEntries(body)} clamp /> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

function FeatureWithChips({ entry, source, extraSublabel }) {
  const { feature, runtimeChips } = entry;
  const tone = SOURCE_COLOR[source] || SOURCE_COLOR.class;
  const bodyHtml = renderPreviewEntries(feature.entries);
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
          {bodyHtml ? <HtmlCaption html={bodyHtml} /> : (
            <Typography variant="caption" component="div" color="text.secondary" sx={{ lineHeight: 1.45, wordBreak: 'break-word' }}>
              No description.
            </Typography>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function LevelGroup({ level, classFeatures, subFeatures }) {
  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.4 }}>
        <Divider sx={{ flex: 1, borderColor: 'rgba(237,212,138,0.22)' }} />
        <Chip
          size="small"
          label={`Level ${level}`}
          sx={{
            ...filledChipSx('#edd48a'),
            height: 20,
            fontSize: '0.58rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        />
        <Divider sx={{ flex: 1, borderColor: 'rgba(237,212,138,0.22)' }} />
      </Box>
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

function uniqueClean(values) {
  return uniqueDisplayLabels(values);
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

function mergePreviewSection(sections, title, items, prepend = false) {
  const cleaned = title === 'Weapons' ? collapseWeaponProficiencies(items) : uniqueClean(items);
  if (!cleaned.length) return;
  const existing = sections.find((section) => section.title === title);
  if (existing) {
    existing.items = title === 'Weapons' ? collapseWeaponProficiencies([...existing.items, ...cleaned]) : uniqueClean([...existing.items, ...cleaned]);
    return;
  }
  const next = { title, items: cleaned };
  if (prepend) sections.unshift(next);
  else sections.push(next);
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
    items: section.title === 'Weapons' ? collapseWeaponProficiencies(section.items) : uniqueClean(section.items),
  }));

  collectPreviewDefenseSections(sheetLike).forEach((section) => {
    mergePreviewSection(sections, section.title, section.items);
  });

  collectPreviewEffectProficiencySections(sheetLike).forEach((section) => {
    mergePreviewSection(sections, section.title, section.items);
  });

  const skillItems = collectSkillProficiencies(character);
  if (skillItems.length) mergePreviewSection(sections, 'Skills', skillItems, true);

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

function WeaponMasterySection({ items }) {
  if (!items.length) return null;
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Sword size={16} color={SOURCE_COLOR.class} />
        <Typography variant="overline" sx={{ letterSpacing: 1, color: SOURCE_COLOR.class }}>
          Weapon Masteries
        </Typography>
      </Stack>
      <Box component="ul" sx={{ m: 0, pl: 2.25, color: 'text.secondary' }}>
        {items.map((item) => (
          <Typography key={`${item.weaponName}-${item.mastery || 'none'}`} component="li" variant="caption" sx={{ color: 'text.secondary' }}>
            {item.mastery ? `${item.weaponName} — ${item.mastery}` : item.weaponName}
          </Typography>
        ))}
      </Box>
    </Stack>
  );
}

function normName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
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
          level={lv}
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

function PreviewPaneImpl({ character, items = [] }) {
  const scores = getAllFinalScores(character);
  const hp = calcMaxHp(character);
  const primaryLv = getPrimaryClassLevel(character);
  const partitioned = partitionChoices(character.choices);
  const proficiencySections = collectPreviewProficiencies(character);
  const weaponMasteries = collectResolvedWeaponMasteries(character, items);

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
        <WeaponMasterySection items={weaponMasteries} />
        {weaponMasteries.length ? <Divider /> : null}

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

export default memo(PreviewPaneImpl, (prev, next) => prev.character === next.character && prev.items === next.items);
