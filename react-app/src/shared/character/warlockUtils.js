function norm(value) {
  return String(value || '').split('|')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function warlockHasInvocation(character, invocationName) {
  if (!character?.choices || !invocationName) return false;
  const wanted = norm(invocationName);
  return Object.entries(character.choices).some(function(e) {
    return e[0].replace(/^mc\d+_/, '').startsWith('warlock_invocation_') &&
      norm(e[1]) === wanted;
  });
}

export function warlockHasInvocationInChoices(choices, invocationName) {
  if (!choices || !invocationName) return false;
  const wanted = norm(invocationName);
  return Object.entries(choices).some(function(e) {
    return e[0].replace(/^mc\d+_/, '').startsWith('warlock_invocation_') &&
      norm(e[1]) === wanted;
  });
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
  if (!character?.choices) return [];
  return Object.entries(character.choices)
    .filter(function (entry) { return entry[0].replace(/^mc\d+_/, '').startsWith('warlock_invocation_'); })
    .map(function (entry) { return norm(entry[1]); })
    .filter(Boolean);
}
