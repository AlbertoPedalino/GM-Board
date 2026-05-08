/**
 * Dice rolling utilities for character sheet
 * Handles D20 rolls, damage rolls, and other dice mechanics
 */

/**
 * Parse a dice formula like "2d6+3" into components
 * @param {string} formula - e.g., "2d6+3", "1d20", "3d8-1"
 * @returns {{dice: number, sides: number, modifier: number}}
 */
export function parseDiceFormula(formula) {
  if (!formula) return { dice: 1, sides: 20, modifier: 0 };
  
  const match = String(formula).match(/^(\d+)d(\d+)([-+]\d+)?$/i);
  if (!match) return { dice: 1, sides: 20, modifier: 0 };
  
  return {
    dice: parseInt(match[1], 10) || 1,
    sides: parseInt(match[2], 10) || 20,
    modifier: parseInt(match[3] || '0', 10) || 0,
  };
}

/**
 * Roll dice and return individual rolls + total
 * @param {number} dice - number of dice
 * @param {number} sides - sides per die
 * @param {number} modifier - flat modifier
 * @returns {{rolls: number[], total: number}}
 */
export function rollDice(dice = 1, sides = 20, modifier = 0) {
  const rolls = [];
  for (let i = 0; i < dice; i += 1) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  const sum = rolls.reduce((a, b) => a + b, 0);
  return {
    rolls,
    total: sum + modifier,
    modifier,
  };
}

/**
 * Roll a D20 check with advantage/disadvantage
 * @param {number} modifier - flat modifier (e.g., proficiency + ability)
 * @param {'adv'|'disadv'|null} advantage - advantage or disadvantage flag
 * @returns {{roll1: number, roll2: number, result: number, modifier: number, advantage: string}}
 */
export function rollD20(modifier = 0, advantage = null) {
  const roll1 = Math.floor(Math.random() * 20) + 1;
  const roll2 = Math.floor(Math.random() * 20) + 1;
  
  let result = roll1;
  let effectiveAdv = null;
  
  if (advantage === 'adv') {
    result = Math.max(roll1, roll2);
    effectiveAdv = 'Advantage';
  } else if (advantage === 'disadv') {
    result = Math.min(roll1, roll2);
    effectiveAdv = 'Disadvantage';
  } else if (advantage === true) {
    result = Math.max(roll1, roll2);
    effectiveAdv = 'Advantage';
  } else if (advantage === false) {
    result = Math.min(roll1, roll2);
    effectiveAdv = 'Disadvantage';
  }
  
  return {
    roll1,
    roll2,
    result,
    total: result + modifier,
    modifier,
    advantage: effectiveAdv,
  };
}

/**
 * Format a roll result for display
 * @param {{rolls: number[], total: number, modifier: number}} rollResult
 * @param {string} label
 * @returns {string}
 */
export function formatRollResult(rollResult, label = '') {
  const rollsText = rollResult.rolls.join(' + ');
  const modText = rollResult.modifier ? (rollResult.modifier > 0 ? `+ ${rollResult.modifier}` : `- ${Math.abs(rollResult.modifier)}`) : '';
  return `${label ? `${label}: ` : ''}[${rollsText}] ${modText} = ${rollResult.total}`.trim();
}

/**
 * Format D20 result for display
 * @param {{roll1: number, roll2: number, result: number, total: number, modifier: number, advantage: string}} d20Result
 * @param {string} label
 * @returns {string}
 */
export function formatD20Result(d20Result, label = '') {
  const rolls = d20Result.advantage
    ? `${d20Result.roll1}, ${d20Result.roll2} (${d20Result.advantage}: ${d20Result.result})`
    : d20Result.roll1;
  const modText = d20Result.modifier ? (d20Result.modifier > 0 ? `+ ${d20Result.modifier}` : `- ${Math.abs(d20Result.modifier)}`) : '';
  return `${label ? `${label}: ` : ''}[${rolls}] ${modText} = ${d20Result.total}`.trim();
}

/**
 * Simulate damage rolls with advantage/disadvantage on attack roll
 * @param {string} formula - damage formula like "2d6+3"
 * @param {number} critMultiplier - 2 for critical hit, 1 for normal
 * @returns {{rolls: number[], total: number}}
 */
export function rollDamage(formula, critMultiplier = 1) {
  const { dice, sides, modifier } = parseDiceFormula(formula);
  const diceCount = dice * critMultiplier;
  
  const rolls = [];
  for (let i = 0; i < diceCount; i += 1) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  
  const sum = rolls.reduce((a, b) => a + b, 0);
  return {
    rolls: rolls.map((r, idx) => idx < dice ? r : `${r}*`), // Mark extra dice from crit
    total: sum + modifier,
    modifier,
  };
}
