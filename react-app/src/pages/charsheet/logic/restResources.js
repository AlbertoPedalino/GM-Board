export function normalizeResourceMax(def) {
  const raw = def?.maxComputed ?? def?.max ?? 1;
  if (typeof raw === 'function') return 1;
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw === Infinity ? Infinity : 1;
  return Math.max(0, Math.floor(n));
}

function resourceRestText(def) {
  return String(def?.recharge || '').toLowerCase();
}

function shortRestFullyRecovers(def, character) {
  const recharge = resourceRestText(def);
  if (!/\b(sr|short)\b/.test(recharge)) return false;
  const ownerLevel = Number(def?.ownerLevel ?? character?.classLevel ?? character?.level ?? 1);
  if (def?.srMinLevel && ownerLevel < Number(def.srMinLevel)) return false;
  return true;
}

export function getAllResourceDefs(character) {
  const runtime = character?.adapterRuntime || {};
  return [
    ...(runtime.classResources || []),
    ...(runtime.subclassResources || []),
    ...(runtime.speciesResources || []),
    ...(runtime.featResources || []),
  ];
}

export function getTotalHitDice(character) {
  return (character.classLevel || character.level) + (character.extraClasses || []).reduce((sum, ec) => sum + (ec.level || 1), 0);
}

export function getHitDicePools(character, usedPools = {}, legacyUsed = 0) {
  if (!character) return [];
  const pools = [];
  pools.push({
    key: 'primary',
    label: character.className || 'Class',
    faces: getHitDieFaces(character.clsSnapshot?.hd),
    total: Math.max(0, Number(character.classLevel || character.level || 1)),
  });
  (character.extraClasses || []).forEach((ec, index) => {
    pools.push({
      key: `extra_${index}`,
      label: ec.name || 'Class',
      faces: getHitDieFaces(ec.clsSnapshot?.hd),
      total: Math.max(0, Number(ec.level || 1)),
    });
  });

  const hasPoolState = usedPools && typeof usedPools === 'object' && Object.keys(usedPools).length > 0;
  let remainingLegacy = Math.max(0, Math.floor(Number(legacyUsed) || 0));
  return pools.map((pool) => {
    const rawUsed = hasPoolState ? Number(usedPools[pool.key] || 0) : Math.min(pool.total, remainingLegacy);
    if (!hasPoolState) remainingLegacy -= rawUsed;
    const used = Math.max(0, Math.min(pool.total, Math.floor(rawUsed)));
    return { ...pool, used, remaining: Math.max(0, pool.total - used) };
  });
}

export function getUsedHitDiceTotal(usedPools = {}) {
  return Object.values(usedPools || {}).reduce((sum, value) => sum + Math.max(0, Math.floor(Number(value) || 0)), 0);
}

function getHitDieFaces(hd) {
  if (hd?.faces) return Number(hd.faces) || 8;
  if (Array.isArray(hd) && hd[0]?.faces) return Number(hd[0].faces) || 8;
  const parsed = String(hd || '').match(/d(\d+)/i);
  return parsed ? Number(parsed[1]) || 8 : 8;
}

export function applyResourceRest(resources, defs, character, type) {
  const next = { ...resources };
  defs.forEach(def => {
    if (!def.key) return;
    const max = normalizeResourceMax(def);
    if (type === 'long') {
      next[def.key] = max;
      return;
    }
    if (shortRestFullyRecovers(def, character)) {
      next[def.key] = max;
      return;
    }
    if (def.srRecover) {
      const gain = Number(def.srRecover) || 0;
      next[def.key] = Math.min((Number(next[def.key]) || 0) + gain, max);
    }
  });
  return next;
}
