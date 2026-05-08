import { memo } from 'react';
import { Box, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { Backpack, BookOpen, Feather, Layers, Shield, Sparkles, Sword, Wand2 } from 'lucide-react';
import { STAT_LABELS, STATS } from '../constants.js';
import { calcMaxHp, formatMod, getAllFinalScores, getPrimaryClassLevel } from '../logic/calculations.js';
import { renderEntryText } from '../logic/text.js';
import { installedRegistry } from '../../../adapters/index.js';

const SOURCE_COLOR = {
  class: '#d7ad52',
  subclass: '#70b7a6',
  species: '#b58fd9',
  background: '#d69245',
  feat: '#de675f',
};

function FeatureCard({ name, level, source, body, sublabel }) {
  const tone = SOURCE_COLOR[source] || '#d7ad52';
  return (
    <Card variant="outlined" sx={{ minWidth: 0, borderLeft: `3px solid ${tone}` }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
            {level != null ? <Chip size="small" label={`Lv ${level}`} sx={{ bgcolor: tone, color: '#17120d', height: 18, fontSize: '0.65rem' }} /> : null}
            <Typography variant="body2" fontWeight={700} sx={{ flex: 1, minWidth: 0, color: tone, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Typography>
            {sublabel ? <Chip size="small" variant="outlined" label={sublabel} sx={{ height: 18, fontSize: '0.6rem' }} /> : null}
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
  return (
    <Card variant="outlined" sx={{ minWidth: 0, borderLeft: `3px solid ${SOURCE_COLOR[source] || SOURCE_COLOR.class}` }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }} flexWrap="wrap" useFlexGap>
            <Typography variant="body2" fontWeight={700} sx={{ flex: '1 1 auto', minWidth: 0, color: SOURCE_COLOR[source] || SOURCE_COLOR.class, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feature.name}</Typography>
            {extraSublabel ? <Chip size="small" variant="outlined" label={extraSublabel} sx={{ height: 20, fontSize: '0.62rem' }} /> : null}
          </Stack>
          {runtimeChips?.length ? (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {runtimeChips.map((chip, idx) => (
                <Chip key={`rt-${idx}`} size="small" label={chip} sx={{ height: 20, fontSize: '0.62rem', bgcolor: 'rgba(215, 173, 82, 0.12)' }} />
              ))}
            </Stack>
          ) : null}
          <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {renderEntryText(feature.entries).slice(0, 280)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function LevelGroup({ level, classFeatures, subFeatures, subclassName }) {
  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
        <Chip size="small" label={`Lv ${level}`} sx={{ bgcolor: SOURCE_COLOR.class, color: '#17120d', fontWeight: 700 }} />
        {subFeatures.length && subclassName ? (
          <Chip size="small" label={subclassName} sx={{ bgcolor: SOURCE_COLOR.subclass, color: '#17120d', fontWeight: 700, maxWidth: '100%' }} />
        ) : null}
      </Stack>
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
          subclassName={subclassName}
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
    else if (key.startsWith('species_')) out.species.push(entry);
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

  const selectedSpells = [
    ...(character.selectedCantrips || []).map((name) => ({ name, level: 0 })),
    ...Object.entries(character.selectedSpells || {}).flatMap(([level, list]) => (list || []).map((name) => ({ name, level: Number(level) }))),
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2, position: { md: 'sticky' }, top: 16, maxHeight: { md: '90vh' }, overflow: 'auto', minWidth: 0 }}>
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <Stack spacing={0.5}>
          <Typography variant="h2">Preview</Typography>
          <Typography variant="h1" noWrap>{character.name || 'Unnamed Character'}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Lv {character.level} {character.speciesName} {character.className} - {hp || '-'} HP
          </Typography>
        </Stack>

        <Grid container spacing={1}>
          {STATS.map((stat) => (
            <Grid key={stat} item xs={4}>
              <Card variant="outlined" sx={{ textAlign: 'center' }}>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" color="text.secondary" display="block">{STAT_LABELS[stat]}</Typography>
                  <Typography variant="h2">{scores[stat] ?? '-'}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{formatMod(scores[stat])}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider />

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

        {selectedSpells.length ? (
          <>
            <Divider />
            <Stack spacing={1} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <BookOpen size={16} />
                <Typography variant="overline" sx={{ letterSpacing: 1 }}>Spells ({selectedSpells.length})</Typography>
              </Stack>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lv) => {
                const list = selectedSpells.filter((spell) => spell.level === lv);
                if (!list.length) return null;
                return (
                  <Box key={`spl-${lv}`} sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                      {lv === 0 ? 'Cantrips' : `Level ${lv}`}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.25, color: 'text.secondary' }}>
                      {list.map((spell) => (
                        <Typography key={spell.name} component="li" variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {spell.name}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </>
        ) : null}

        <Divider />
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Chip icon={<Backpack size={14} />} size="small" label={`${character.inventory.length} items`} />
          <Chip icon={<Wand2 size={14} />} size="small" label={`${character.selectedCantrips?.length || 0} cantrip`} />
        </Stack>
      </Stack>
    </Paper>
  );
}

export default memo(PreviewPaneImpl, (prev, next) => prev.character === next.character);
