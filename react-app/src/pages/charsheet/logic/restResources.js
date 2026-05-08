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
