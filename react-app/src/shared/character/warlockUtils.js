function norm(value) {
  return String(value || '').split('|')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function invocationNameFromValue(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value.split('|')[0].trim();
  if (typeof value === 'object') {
    const raw = value.name || value.label || value.value || value.id || '';
    return String(raw || '').split('|')[0].trim();
  }
  return String(value || '').split('|')[0].trim();
}

function invocationNamesFromChoiceValue(value) {
  const arr = Array.isArray(value) ? value : [value];
  return arr
    .map(invocationNameFromValue)
    .filter(Boolean);
}

export function warlockInvocationSelectionsFromChoices(choices, keyPrefix = '') {
  if (!choices || typeof choices !== 'object') return [];
  const prefix = String(keyPrefix || '');
  const out = [];
  Object.entries(choices).forEach(function (entry) {
    const key = String(entry[0] || '');
    const matches = prefix
      ? key.startsWith(prefix + 'warlock_invocation_')
      : key.replace(/^mc\d+_/, '').startsWith('warlock_invocation_');
    if (!matches) return;
    invocationNamesFromChoiceValue(entry[1]).forEach(function (name) { out.push(name); });
  });
  return out;
}

export function warlockInvocationSelections(character, keyPrefix = '') {
  return warlockInvocationSelectionsFromChoices(character?.choices || {}, keyPrefix);
}

export function warlockHasInvocation(character, invocationName) {
  if (!invocationName) return false;
  const wanted = norm(invocationName);
  return warlockInvocationSelections(character).some(function(name) { return norm(name) === wanted; });
}

export function warlockHasInvocationInChoices(choices, invocationName) {
  if (!invocationName) return false;
  const wanted = norm(invocationName);
  return warlockInvocationSelectionsFromChoices(choices).some(function(name) { return norm(name) === wanted; });
}

export function warlockLevel(character) {
  if (!character) return 0;
  var out = 0;
  if (String(character.className || '').toLowerCase() === 'warlock') out += Number(character.classLevel || character.level || 0);
  (character.extraClasses || []).forEach(function (ec) {
    if (String(ec?.name || '').toLowerCase() === 'warlock') out += Number(ec.level || 0);
  });
  return out;
}

export function warlockKnownInvocations(character) {
  return warlockInvocationSelections(character)
    .map(function (name) { return norm(name); })
    .filter(Boolean);
}
