/**
 * 5e 2024 Armor Proficiency Penalties
 * 
 * Rules (from PHB 2024):
 * - Heavy armor NOT proficient:
 *   1. Disadvantage on ALL STR/DEX ability checks and saving throws
 *   2. -5 penalty to movement speed (stacks with other penalties)
 * 
 * - Medium armor NOT proficient:
 *   1. Disadvantage on DEX ability checks and saving throws (not STR)
 *   2. No speed penalty
 * 
 * - Light armor NOT proficient:
 *   1. No mechanical penalties (light armor doesn't restrict movement)
 * 
 * - Heavy armor (even if proficient):
 *   1. Disadvantage on DEX checks and saves (inherent property of heavy armor)
 *   2. -10 ft to speed if movement speed is based on ability checks
 * 
 * - Shield (no proficiency):
 *   1. Disadvantage on DEX ability checks and saving throws
 *   2. No AC bonus
 */

import { getArmorTrainingInfo } from './proficiencies.js';

function normKey(v) {
  return String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getArmorPenalties(C, item) {
  if (!item || !['LA', 'MA', 'HA', 'S'].includes(item.type)) {
    return { hasPenalty: false, penalties: [] };
  }

  const { trained } = getArmorTrainingInfo(C, item);
  if (trained) {
    // Even with proficiency, heavy armor gives DEX disadvantage
    if (item.type === 'HA') {
      return {
        hasPenalty: true,
        penalties: [
          { type: 'disadvantage', applies: ['dex-checks', 'dex-saves'], reason: 'Heavy Armor Property' },
          { type: 'speed-penalty', amount: -10, reason: 'Heavy Armor Property' },
        ],
      };
    }
    return { hasPenalty: false, penalties: [] };
  }

  // NOT PROFICIENT
  const penalties = [];
  
  if (item.type === 'HA') {
    // Heavy armor not proficient: disadvantage on all STR/DEX checks/saves + speed penalty
    penalties.push(
      { type: 'disadvantage', applies: ['str-checks', 'str-saves', 'dex-checks', 'dex-saves'], reason: 'Not Proficient in Heavy Armor' },
      { type: 'speed-penalty', amount: -10, reason: 'Not Proficient in Heavy Armor' }
    );
  } else if (item.type === 'MA') {
    // Medium armor not proficient: disadvantage on DEX checks/saves only
    penalties.push(
      { type: 'disadvantage', applies: ['dex-checks', 'dex-saves'], reason: 'Not Proficient in Medium Armor' }
    );
  } else if (item.type === 'S') {
    // Shield not proficient: disadvantage on DEX checks/saves
    penalties.push(
      { type: 'disadvantage', applies: ['dex-checks', 'dex-saves'], reason: 'Not Proficient with Shields' },
      { type: 'ac-penalty', amount: -2, reason: 'Shield grants no AC bonus' }
    );
  }
  
  return {
    hasPenalty: penalties.length > 0,
    penalties,
  };
}

export function getEquippedArmorPenalties(C, inventory) {
  const equippedArmor = (inventory || [])
    .filter(item => item.equipped && ['LA', 'MA', 'HA', 'S'].includes(item.type));

  const allPenalties = equippedArmor
    .flatMap(item => {
      const { hasPenalty, penalties } = getArmorPenalties(C, item);
      return hasPenalty ? penalties.map(p => ({ ...p, item: item.name })) : [];
    });

  // Aggregate penalties
  const result = {
    hasPenalty: allPenalties.length > 0,
    disadvantageOn: new Set(),
    speedPenalty: 0,
    acPenalty: 0,
    details: allPenalties,
  };

  allPenalties.forEach(penalty => {
    if (penalty.type === 'disadvantage') {
      penalty.applies.forEach(app => result.disadvantageOn.add(app));
    } else if (penalty.type === 'speed-penalty') {
      result.speedPenalty = Math.min(result.speedPenalty, penalty.amount);
    } else if (penalty.type === 'ac-penalty') {
      result.acPenalty += penalty.amount;
    }
  });

  result.disadvantageOn = Array.from(result.disadvantageOn);
  return result;
}

export function formatArmorPenaltyMessage(penalties) {
  if (!penalties.hasPenalty) return '';
  
  const parts = [];
  
  if (penalties.disadvantageOn.length > 0) {
    const checks = penalties.disadvantageOn.filter(x => x.includes('checks')).map(x => x.split('-')[0].toUpperCase()).join('/');
    const saves = penalties.disadvantageOn.filter(x => x.includes('saves')).map(x => x.split('-')[0].toUpperCase()).join('/');
    if (checks) parts.push(`Disadvantage on ${checks} checks`);
    if (saves && saves !== checks) parts.push(`Disadvantage on ${saves} saves`);
  }
  
  if (penalties.speedPenalty < 0) {
    parts.push(`Speed -${Math.abs(penalties.speedPenalty)} ft`);
  }
  
  if (penalties.acPenalty < 0) {
    parts.push(`AC ${penalties.acPenalty}`);
  }
  
  return parts.join(' • ');
}

export function getArmorAC(item) {
  if (!item) return 0;
  if (item.type === 'LA') return item.ac || 10;
  if (item.type === 'MA') return item.ac || 12;
  if (item.type === 'HA') return item.ac || 14;
  return 0;
}
