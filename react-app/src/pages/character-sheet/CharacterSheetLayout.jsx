import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  addCustomItem,
  addInventoryItem,
  clearConditions,
  cycleSkillAdv,
  changeInventoryQty,
  doRest,
  downloadSheet,
  goBackToBuilder,
  INVENTORY_FILTERS,
  rollAbilityCheck,
  rollInitiative,
  rollSave,
  rollSkill,
  readSheetNotes,
  setInventoryWeaponOverride,
  toggleInventoryEquip,
  toggleInventoryFlag,
  writeSheetNotes,
  toggleCondition,
  toggleInspiration,
  updateCurrency,
} from './sheetRuntime.js';

function callLegacy(name, ...args) {
  const fn = window[name];
  if (typeof fn === 'function') return fn(...args);
  return undefined;
}

function Icon({ name }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    const placeholder = document.createElement('i');
    placeholder.setAttribute('data-lucide', name);
    placeholder.setAttribute('class', 'lucide-emoji');
    placeholder.setAttribute('aria-hidden', 'true');
    host.replaceChildren(placeholder);
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
    }
  }, [name]);

  return <span ref={ref} className="lucide-emoji-host" aria-hidden="true" />;
}

function SheetHeader({ header, onXpChange, onAfterRest }) {
  return (
    <>
      <div className="topbar">
        <div className="char-avatar">
          {header.avatar}
        </div>
        <div className="char-identity">
          <div className="char-name">{header.name}</div>
          <div className="char-meta">{header.meta}</div>
        </div>
        <div className="xp-block">
          <div className="xp-bar-wrap">
            <div className="xp-bar-fill" style={{ width: `${header.xpPct}%` }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
            <input
              className="xp-edit-input"
              type="number"
              min="0"
              value={header.xp}
              onChange={(event) => onXpChange(event.currentTarget.value)}
              title="Total XP"
            />
            <div className="xp-label" style={{ whiteSpace: 'nowrap' }}>{header.xpLabel}</div>
          </div>
        </div>
        <button
          className="rest-btn short"
          type="button"
          onClick={() => {
            doRest('short');
            window.setTimeout(onAfterRest, 0);
          }}
        >
          <Icon name="sun" /> SHORT REST
        </button>
        <button
          className="rest-btn long"
          type="button"
          onClick={() => {
            doRest('long');
            window.setTimeout(onAfterRest, 0);
          }}
        >
          <Icon name="moon" /> LONG REST
        </button>
        <a
          className="back-btn"
          href="charbuilder.html"
          onClick={goBackToBuilder}
        >
          <Icon name="arrow-left" /> Builder
        </a>
        <button
          className="rest-btn"
          type="button"
          style={{ borderColor: 'var(--teal)', color: 'var(--teal)', background: 'var(--tbg)' }}
          onClick={downloadSheet}
        >
          <Icon name="download" /> DOWNLOAD
        </button>
      </div>

      <div className="legacy-topbar-mirror" aria-hidden="true">
        <div id="top-avatar" />
        <div id="top-name" />
        <div id="top-meta" />
        <div id="xp-fill" />
        <input id="xp-input" readOnly value={header.xp} />
        <div id="xp-label" />
      </div>
    </>
  );
}

function DeathPips({ type, count }) {
  return (
    <span className="hp-ds-pips">
      {Array.from({ length: 3 }, (_, index) => (
        <span
          key={index}
          className={`hp-ds-pip ${type}${index < count ? ' on' : ''}`}
        />
      ))}
    </span>
  );
}

function SheetHpBlock({
  hp,
  onHpAdjust,
  onHpQuickAction,
  onDeathSaveAction,
}) {
  const [amount, setAmount] = useState(hp.amount || '1');

  useEffect(() => {
    setAmount(hp.amount || '1');
  }, [hp.amount]);

  const maxBonus = hp.maxBonus || '0';

  return (
    <div className="hp-block react-hp-block">
      <div className="hp-title">HP</div>
      <div className="hp-controls">
        <div className="hp-vals">
          <div className="hp-cur">{hp.current}</div>
          <div className="hp-sep">/</div>
          <div className="hp-max">{hp.max}</div>
        </div>
        <button
          className="hp-btn heal"
          type="button"
          onClick={() => onHpAdjust(1, amount)}
          title="Heal"
        >
          <Icon name="plus" />
        </button>
        <input
          className="hp-amount-input"
          type="number"
          min="1"
          value={amount}
          onChange={(event) => setAmount(event.currentTarget.value)}
          title="Amount"
        />
        <button
          className="hp-btn dmg"
          type="button"
          onClick={() => onHpAdjust(-1, amount)}
          title="Damage"
        >
          <Icon name="minus" />
        </button>
      </div>
      <div className="hp-subline">
        <span className="hp-mini">
          <Icon name="sparkles" /> TEMP <b>{hp.temp}</b>
        </span>
        <span className="hp-mini-actions">
          <button className="hp-mini-btn temp" type="button" onClick={() => onHpQuickAction('temp', -1)} title="Decrease Temp HP">
            <Icon name="minus" />
          </button>
          <button className="hp-mini-btn temp" type="button" onClick={() => onHpQuickAction('temp', 1)} title="Increase Temp HP">
            <Icon name="plus" />
          </button>
        </span>
      </div>
      <div className="hp-subline">
        <span className="hp-mini">
          <Icon name="heart-pulse" /> MAX MOD <b>{maxBonus}</b>
        </span>
        <span className="hp-mini-actions">
          <button className="hp-mini-btn max" type="button" onClick={() => onHpQuickAction('max', -1)} title="Decrease Max HP">
            <Icon name="minus" />
          </button>
          <button className="hp-mini-btn max" type="button" onClick={() => onHpQuickAction('max', 1)} title="Increase Max HP">
            <Icon name="plus" />
          </button>
        </span>
      </div>
      <div className="hp-death" hidden={!hp.showDeathSaves}>
        <span className="hp-ds-lbl">Death Saves</span>
        <DeathPips type="success" count={hp.deathSuccess} />
        <DeathPips type="fail" count={hp.deathFail} />
        <button className="roll-btn" type="button" onClick={() => onDeathSaveAction('roll')}>
          <Icon name="dice-5" /> Roll
        </button>
        <button className="roll-btn" type="button" onClick={() => onDeathSaveAction('reset')}>
          <Icon name="rotate-ccw" /> Reset
        </button>
      </div>
    </div>
  );
}

function ScoreBox({ score }) {
  return (
    <div
      className="score-box"
      style={{ cursor: 'pointer' }}
      title={score.title}
      onClick={() => rollAbilityCheck(score.stat, score.mod, score.advFlag)}
    >
      <div className="score-lbl">{score.shortLabel}</div>
      <div className="score-mod">{score.modText}</div>
      <div className="score-base">
        {score.value}
        {score.hasForcedDis && (
          <>
            {' '}
            <span
              className="adv-badge disadv"
              style={{ fontSize: '6px', padding: '0 2px' }}
            >
              DIS
            </span>
          </>
        )}
        {!score.hasForcedDis && score.featureAdv === 'adv' && (
          <>
            {' '}
            <span
              className="adv-badge adv"
              style={{ fontSize: '6px', padding: '0 2px' }}
            >
              ADV
            </span>
          </>
        )}
        {!score.hasForcedDis && score.featureAdv === 'disadv' && (
          <>
            {' '}
            <span
              className="adv-badge disadv"
              style={{ fontSize: '6px', padding: '0 2px' }}
            >
              DIS
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function SpeedBox({ speed }) {
  if (!speed) return null;
  const valStyle = speed.isOverCap ? { color: 'var(--red2)' } : undefined;

  return (
    <div className="stat-box" title={speed.title}>
      <div className="stat-box-val" style={valStyle}>
        {speed.value} ft.
      </div>
      <div className="stat-box-lbl">
        Speed
        {speed.isOverCap && (
          <>
            <br />
            <span style={{ color: 'var(--red2)', fontSize: '6px' }}>5 ft</span>
          </>
        )}
      </div>
      {speed.altModes.length > 0 && (
        <div
          style={{
            fontSize: '8px',
            color: 'var(--text2)',
            marginTop: 2,
            lineHeight: 1.2,
          }}
        >
          {speed.altModes.map((m) => `${m.label} ${m.value}`).join(' · ')}
        </div>
      )}
    </div>
  );
}

function SheetScoresRow({ scores }) {
  if (!scores?.ready) {
    return <div className="scores-row react-scores-row" />;
  }

  return (
    <div className="scores-row react-scores-row">
      <div className="scores-left">
        {scores.scores.map((score) => (
          <ScoreBox key={score.stat} score={score} />
        ))}
        <div className="stat-box green">
          <div className="stat-box-val">{scores.pb}</div>
          <div className="stat-box-lbl">Prof. Bonus</div>
        </div>
        <SpeedBox speed={scores.speed} />
      </div>
    </div>
  );
}

function SheetScoreStrip({
  scores,
  vitals,
  onHpAdjust,
  onHpQuickAction,
  onDeathSaveAction,
}) {
  return (
    <div className="react-scores-strip">
      <SheetScoresRow scores={scores} />
      <SheetHpBlock
        hp={vitals.hp}
        onHpAdjust={onHpAdjust}
        onHpQuickAction={onHpQuickAction}
        onDeathSaveAction={onDeathSaveAction}
      />
      <div className="legacy-scores-mirror" aria-hidden="true">
        <div className="scores-row" id="scores-row" />
        <div className="stats-row" id="stats-row" />
      </div>
    </div>
  );
}

function Panel({ icon, title, titleNode, children, style }) {
  return (
    <div className="panel" style={style}>
      <div className="panel-hdr">
        <span className="panel-title">
          {icon && <Icon name={icon} />} {title}
        </span>
        {titleNode}
      </div>
      {children}
    </div>
  );
}

function SheetHitDicePanel({ hitDice, onHitDieToggle }) {
  return (
    <Panel
      icon="dice-5"
      title="Hit Dice"
      titleNode={<span className="react-hd-label">{hitDice.label}</span>}
    >
      <div className="panel-body">
        <div className="hd-pips">
          {hitDice.pips.map((pip, index) => (
            <div
              key={`${pip.title}-${index}`}
              className={`hd-pip${pip.used ? ' used' : ' full'}`}
              title={pip.title}
              onClick={() => onHitDieToggle(index)}
            >
              {pip.used ? null : <Icon name="hexagon" />}
            </div>
          ))}
        </div>
        {hitDice.hint && (
          <div style={{ marginTop: '.5rem', fontSize: 'var(--fs-meta)', color: 'var(--text3)' }}>
            <i>{hitDice.hint}</i>
          </div>
        )}
        <div className="legacy-hit-dice-mirror" aria-hidden="true">
          <span id="hd-label" />
          <div id="hd-body" />
        </div>
      </div>
    </Panel>
  );
}

function SheetSavesPanel({ saves }) {
  const rows = Array.isArray(saves) ? saves : [];

  return (
    <Panel icon="dice-5" title="Saving Throws">
      <div className="panel-body">
        {rows.map((save) => {
          const titleParts = [`Roll ${save.fullLabel} saving throw`];
          if (save.hasForcedDis) titleParts.push('Disadvantage: untrained armor');
          if (save.eAdv === 'adv') titleParts.push('Advantage (feature)');
          else if (save.eAdv === 'disadv') titleParts.push('Disadvantage (feature)');

          return (
            <div
              key={save.stat}
              className="save-row"
              onClick={() => rollSave(save.stat)}
              title={titleParts.join(' | ')}
            >
              <div className={`save-dot${save.prof ? ' on' : ''}`} />
              <span className="save-stat">{save.shortLabel}</span>
              <span style={{ fontSize: 'var(--fs-body)', color: 'var(--text2)' }}>
                {save.fullLabel}
              </span>
              {save.hasForcedDis && (
                <span className="adv-badge disadv" title="Disadvantage: untrained armor">
                  DIS
                </span>
              )}
              {save.eAdv === 'adv' && (
                <span className="adv-badge adv" title="Advantage (feature)">ADV</span>
              )}
              {save.eAdv === 'disadv' && (
                <span className="adv-badge disadv" title="Disadvantage (feature)">DIS</span>
              )}
              <span className="save-bonus">{save.bonusText}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function SheetSensesPanel({ senses }) {
  const rows = Array.isArray(senses) ? senses : [];

  return (
    <Panel icon="eye" title="Senses">
      <div className="panel-body">
        {rows.map((row) => (
          <div key={row.key} className="sense-row">
            <div className="sense-val" style={row.tealValue ? { color: 'var(--teal)' } : undefined}>
              {row.value}
            </div>
            <div className="sense-lbl">{row.label}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SheetProficienciesPanel({ proficiencies }) {
  const sections = Array.isArray(proficiencies) ? proficiencies : [];

  return (
    <Panel icon="scroll-text" title="Proficiencies">
      <div className="panel-body">
        {sections.map((section, index) => (
          <div
            key={section.key || section.title}
            className="prof-section"
            style={index === sections.length - 1 ? { marginBottom: 0 } : undefined}
          >
            <div className="prof-section-title">
              <Icon name={section.icon} /> {section.title}
            </div>
            <div className="prof-text">{section.text}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SheetLeftColumn({ vitals, proficiencies, saves, senses, onHitDieToggle }) {
  return (
    <div className="main-col-left">
      <SheetSavesPanel saves={saves} />
      <SheetSensesPanel senses={senses} />
      <SheetProficienciesPanel proficiencies={proficiencies} />
      <SheetHitDicePanel hitDice={vitals.hitDice} onHitDieToggle={onHitDieToggle} />
      <div className="legacy-left-panels-mirror" aria-hidden="true">
        <div id="saves-body" />
        <div id="senses-body" />
        <div id="profs-body" />
      </div>
    </div>
  );
}

function SkillRow({ skill }) {
  const titleParts = ['Click: roll', 'Right-click: advantage/disadvantage'];
  if (skill.armorDis) titleParts.push('Disadvantage (Heavy Armor)');
  if (skill.trainingDis) titleParts.push('Disadvantage: untrained armor');
  if (skill.featureAdv === 'adv') titleParts.push('Advantage (feature)');
  else if (skill.featureAdv === 'disadv') titleParts.push('Disadvantage (feature)');

  function handleContextMenu(event) {
    event.preventDefault();
    cycleSkillAdv(skill.name);
  }

  return (
    <div
      className="skill-row"
      onClick={() => rollSkill(skill.name, skill.bonus, skill.effectiveAdv)}
      onContextMenu={handleContextMenu}
      title={titleParts.join(' | ')}
    >
      <div className={`skill-dot${skill.dotCls ? ` ${skill.dotCls}` : ''}`} />
      <span className="skill-ability">{skill.abilityLabel}</span>
      <span className="skill-name">{skill.name}</span>
      {skill.userAdv === 'adv' && <span className="adv-badge adv" title="Advantage">ADV</span>}
      {skill.userAdv === 'disadv' && <span className="adv-badge disadv" title="Disadvantage">DIS</span>}
      {!skill.userAdv && skill.featureAdv === 'adv' && (
        <span className="adv-badge adv" title="Advantage (feature)">ADV</span>
      )}
      {!skill.userAdv && skill.featureAdv === 'disadv' && (
        <span className="adv-badge disadv" title="Disadvantage (feature)">DIS</span>
      )}
      {skill.armorDis && <span className="adv-badge disadv" title="Disadvantage (Heavy Armor)">D</span>}
      {skill.trainingDis && (
        <span className="adv-badge disadv" title="Disadvantage: untrained armor">DIS</span>
      )}
      <span className="skill-bonus">{skill.bonusText}</span>
    </div>
  );
}

function SheetSkillsColumn({ skills }) {
  const rows = Array.isArray(skills) ? skills : [];

  return (
    <div className="main-col-middle">
      <Panel title="Skills" style={{ marginBottom: 0 }}>
        <div className="skills-header">
          <span />
          <span>Prof.</span>
          <span>Skill</span>
          <span>Mod.</span>
        </div>
        {rows.map((skill) => (
          <SkillRow key={skill.name} skill={skill} />
        ))}
        <div className="legacy-skills-mirror" aria-hidden="true">
          <div id="skills-body" />
        </div>
      </Panel>
    </div>
  );
}

function DefensesList({ defenses }) {
  const items = Array.isArray(defenses) ? defenses : [];
  if (!items.length) {
    return (
      <div className="def-text phmsg">
        <span style={{ fontSize: 'var(--fs-body)', color: 'var(--text3)', fontStyle: 'italic' }}>
          None
        </span>
      </div>
    );
  }

  return (
    <div className="def-text phmsg">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className={`tag ${item.color}`}>
          {item.label}
        </div>
      ))}
    </div>
  );
}

function ConditionsBlock({ conditions, onAfterChange }) {
  const data = conditions || { active: [], allOptions: [], hasAny: false };
  const active = Array.isArray(data.active) ? data.active : [];
  const allOptions = Array.isArray(data.allOptions) ? data.allOptions : [];
  const activeKeys = new Set(active.map((c) => c.key));

  function handleToggle(key) {
    toggleCondition(key);
    window.setTimeout(onAfterChange, 0);
  }

  function handleClear() {
    clearConditions();
    window.setTimeout(onAfterChange, 0);
  }

  return (
    <div className="def-text">
      <div className="conditions-wrap">
        <div className="cond-active">
          {active.length === 0 && (
            <span className="condition-tag empty">
              <Icon name="circle" /> None
            </span>
          )}
          {active.map((cond) => (
            <button
              key={cond.key}
              type="button"
              className="condition-tag on"
              onClick={() => handleToggle(cond.key)}
              title={`Remove ${cond.label}`}
            >
              <Icon name={cond.icon} /> {cond.label}
            </button>
          ))}
        </div>
        <details className="cond-details">
          <summary className="cond-summary">
            <Icon name="list-checks" /> Manage ({active.length})
          </summary>
          <div className="cond-picker">
            {allOptions.map((cond) => {
              const on = activeKeys.has(cond.key);
              return (
                <button
                  key={cond.key}
                  type="button"
                  className={`cond-btn${on ? ' on' : ''}`}
                  onClick={() => handleToggle(cond.key)}
                  title={`${on ? 'Remove' : 'Apply'} ${cond.label}`}
                >
                  <Icon name={cond.icon} /> <span>{cond.label}</span>
                </button>
              );
            })}
          </div>
        </details>
        {data.hasAny && (
          <button type="button" className="cond-clear" onClick={handleClear}>
            <Icon name="x" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

function SheetRightSummary({ summary, onRefresh }) {
  return (
    <>
      <div className="right-top-row">
        <div
          className="inspiration-block"
          onClick={() => {
            rollInitiative();
            window.setTimeout(onRefresh, 0);
          }}
          title="Roll Initiative"
        >
          <div className="insp-star">{summary.initiative}</div>
          <div className="block-title" style={{ marginBottom: 0, textAlign: 'center' }}>Initiative</div>
        </div>
        <div className="inspiration-block" style={{ cursor: 'default' }}>
          <div className="insp-star">{summary.ac}</div>
          <div className="block-title" style={{ marginBottom: 0, textAlign: 'center' }}>AC</div>
        </div>
        <div
          className={`inspiration-block${summary.inspirationActive ? ' active' : ''}`}
          onClick={() => {
            toggleInspiration();
            window.setTimeout(onRefresh, 0);
          }}
          title="Toggle Inspiration"
        >
          <div className="insp-star">*</div>
          <div
            className="block-title"
            style={{
              marginBottom: 0,
              textAlign: 'center',
              color: summary.inspirationActive ? 'var(--gold2)' : '',
            }}
          >
            {summary.inspirationLabel}
          </div>
        </div>
        <div className="defenses-block">
          <div className="block-title">Defenses</div>
          <DefensesList defenses={summary.defenses} />
        </div>
        <div className="conditions-block">
          <div className="block-title">Conditions</div>
          <ConditionsBlock conditions={summary.conditions} onAfterChange={onRefresh} />
        </div>
      </div>

      <div className="legacy-right-summary-mirror" aria-hidden="true">
        <div id="init-val" />
        <div id="ac-val" />
        <div id="inspiration-block">
          <div id="insp-star" />
          <div id="insp-label" />
        </div>
        <div id="defenses-block">
          <div id="def-content" />
        </div>
        <div id="conditions-content" />
      </div>
    </>
  );
}

function TabButton({ name, active, onSelect, children }) {
  return (
    <button
      className={`tab-btn${active ? ' active' : ''}`}
      type="button"
      onClick={() => onSelect(name)}
    >
      {children}
    </button>
  );
}

function ActionFilter({ filter, active, children }) {
  return (
    <button
      className={`af-btn${active ? ' on' : ''}`}
      type="button"
      onClick={(event) => callLegacy('filterActions', filter, event.currentTarget)}
    >
      {children}
    </button>
  );
}

function InventoryFilter({ filter, active, icon, children, onSelect }) {
  return (
    <button
      className={`inv-chip${active ? ' on' : ''}`}
      type="button"
      onClick={() => onSelect(filter)}
    >
      {icon && <Icon name={icon} />} {children}
    </button>
  );
}

const ITEM_SEARCH_URLS = [
  'https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/items-base.json',
  'https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/items.json',
  'https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/magicvariants.json',
];

const ITEM_TYPE_LABELS = {
  M: 'Melee Weapon',
  R: 'Ranged Weapon',
  LA: 'Light Armor',
  MA: 'Medium Armor',
  HA: 'Heavy Armor',
  S: 'Shield',
  G: 'Gear',
  AT: 'Tools',
  GS: 'Gaming Set',
  INS: 'Instrument',
  MNT: 'Mount',
  VEH: 'Vehicle',
  SCF: 'Spellcasting Focus',
  WD: 'Wand',
  RG: 'Ring',
  RD: 'Rod',
  ST: 'Staff',
  WI: 'Wondrous Item',
  P: 'Potion',
  SC: 'Scroll',
  OTH: 'Other',
  GV: 'Magic Variant',
};

const ITEM_RARITY_COLOR = {
  none: 'var(--text3)',
  common: 'var(--text2)',
  uncommon: 'var(--green)',
  rare: 'var(--blue)',
  'very rare': 'var(--purple)',
  legendary: 'var(--gold)',
  artifact: 'var(--red2)',
};

function itemTypeGroup(item) {
  if (['M', 'R'].includes(item?.type)) return 'weapon';
  if (['LA', 'MA', 'HA', 'S'].includes(item?.type)) return 'armor';
  if (item?.rarity && item.rarity !== 'none') return 'magic';
  return 'gear';
}

function itemMatchesRequires(item, requires) {
  if (!requires || !requires.length) return false;
  return requires.some((req) => {
    if (req.weapon && item.weapon) return true;
    if (req.sword && item.sword) return true;
    if (req.axe && item.axe) return true;
    if (req.bow && item.bow) return true;
    if (req.crossbow && item.crossbow) return true;
    if (req.hammer && item.hammer) return true;
    if (req.spear && item.spear) return true;
    if (req.staff && item.staff) return true;
    if (req.dagger && item.dagger) return true;
    if (req.armor && item.armor) return true;
    if (req.shield && item.type === 'S') return true;
    if (req.type && item.type === req.type) return true;
    return false;
  });
}

function expandMagicVariants(variants, baseItems) {
  const allowed = new Set(['XPHB', 'FRAiF', 'FRHoF', 'EFA', 'XDMG', 'DMG', 'GV']);
  const expanded = [];

  (variants || []).forEach((variant) => {
    if (!allowed.has(variant?.source)) return;
    const inherits = variant.inherits || {};
    const requires = variant.requires || [];

    if (!requires.length) {
      expanded.push({
        name: variant.name,
        source: variant.source,
        type: inherits.type || variant.type || 'WI',
        rarity: inherits.rarity || variant.rarity || 'none',
        weight: inherits.weight || variant.weight || 0,
        value: inherits.value || variant.value || 0,
        bonusWeapon: inherits.bonusWeapon || null,
        bonusAc: inherits.bonusAc || null,
        ac: inherits.ac || null,
        entries: inherits.entries || variant.entries || [],
        _variant: true,
      });
      return;
    }

    baseItems.forEach((base) => {
      if (!itemMatchesRequires(base, requires)) return;
      expanded.push({
        name: `${inherits.namePrefix || ''}${base.name}${inherits.nameSuffix || ''}`,
        source: variant.source,
        type: base.type || inherits.type || 'WI',
        rarity: inherits.rarity || variant.rarity || 'none',
        weight: inherits.weight ?? base.weight ?? 0,
        value: inherits.value ?? base.value ?? 0,
        dmg1: inherits.dmg1 || base.dmg1 || null,
        dmgType: base.dmgType || null,
        bonusWeapon: inherits.bonusWeapon || null,
        bonusAc: inherits.bonusAc || null,
        ac: inherits.ac ?? base.ac ?? null,
        property: base.property || [],
        entries: inherits.entries || variant.entries || [],
        _variant: true,
      });
    });
  });

  if (expanded.length === 0 && baseItems.length > 0) {
    const rarityByBonus = { 1: 'uncommon', 2: 'rare', 3: 'very rare' };
    baseItems.forEach((base) => {
      const isWeapon = ['M', 'R'].includes(base.type) || base.weapon;
      const isArmor = ['LA', 'MA', 'HA'].includes(base.type) || base.armor;
      const isShield = base.type === 'S' || base.shield;
      if (!isWeapon && !isArmor && !isShield) return;

      [1, 2, 3].forEach((bonus) => {
        expanded.push({
          name: `${base.name}, +${bonus}`,
          source: 'XDMG',
          type: base.type,
          rarity: rarityByBonus[bonus] || 'rare',
          weight: base.weight || 0,
          value: (base.value || 0) + bonus * 500,
          dmg1: base.dmg1 || null,
          dmgType: base.dmgType || null,
          bonusWeapon: isWeapon ? `+${bonus}` : null,
          bonusAc: (isArmor || isShield) ? `+${bonus}` : null,
          ac: base.ac ?? null,
          property: base.property || [],
          entries: [`You have a +${bonus} bonus to attack and damage rolls made with this magic weapon.`],
          _variant: true,
        });
      });
    });
  }

  return expanded;
}

function useItemSearchDb() {
  const [state, setState] = useState({ status: 'idle', items: [] });

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setState({ status: 'loading', items: [] });
      try {
        const responses = await Promise.all(ITEM_SEARCH_URLS.map((url) => fetch(url)));
        const payloads = await Promise.all(responses.map((response) => (
          response.ok ? response.json() : {}
        )));
        const baseItems = (payloads[0]?.baseitem || [])
          .filter((item) => ['XPHB', 'FRAiF', 'FRHoF', 'EFA'].includes(item.source))
          .map((item) => (typeof window.adaptItemRecord === 'function' ? window.adaptItemRecord(item) : item));
        const magicItems = (payloads[1]?.item || [])
          .filter((item) => ['XPHB', 'XDMG', 'FRAiF', 'FRHoF', 'EFA'].includes(item.source))
          .map((item) => (typeof window.adaptItemRecord === 'function' ? window.adaptItemRecord(item) : item));
        const variants = expandMagicVariants(payloads[2]?.magicvariant || [], baseItems)
          .map((item) => (typeof window.adaptItemRecord === 'function' ? window.adaptItemRecord(item) : item));
        const combined = [
          ...baseItems,
          ...magicItems,
          ...variants,
        ]
          .filter((item) => item?.name)

        const seen = new Set();
        const items = combined
          .filter((item) => {
            const key = `${item.name}|${item.source || ''}`.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        if (!cancelled) setState({ status: 'ready', items });
      } catch {
        if (!cancelled) setState({ status: 'error', items: [] });
      }
    }

    loadItems();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function NotesTextarea() {
  const [value, setValue] = useState(() => readSheetNotes());

  useEffect(() => {
    function syncFromStorage() {
      setValue(readSheetNotes());
    }
    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('gb-sheet-snapshot-change', syncFromStorage);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('gb-sheet-snapshot-change', syncFromStorage);
    };
  }, []);

  return (
    <textarea
      className="notes-area"
      id="notes-area"
      placeholder="Write your notes here..."
      value={value}
      onChange={(event) => {
        const next = event.currentTarget.value;
        setValue(next);
        writeSheetNotes(next);
      }}
    />
  );
}

function HtmlBlock({ html, className, style }) {
  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  );
}

function EntryText({ text }) {
  const raw = String(text || '').replace(/\{[^}]+\}/g, '');
  const tagPattern = /\{@([a-z]+)\s+([^}]+)\}/gi;
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = tagPattern.exec(String(text || ''))) !== null) {
    if (match.index > lastIndex) {
      nodes.push(String(text || '').slice(lastIndex, match.index).replace(/\{[^}]+\}/g, ''));
    }

    const tag = match[1].toLowerCase();
    const content = match[2];
    const value = content.split('|')[0];
    const key = `${match.index}-${tag}`;

    if (tag === 'hit') {
      const numeric = Number(value);
      nodes.push(<b key={key}>{Number.isFinite(numeric) && numeric >= 0 ? `+${numeric}` : value}</b>);
    } else if (tag === 'damage' || tag === 'condition' || tag === 'action' || tag === 'b') {
      nodes.push(<b key={key}>{value}</b>);
    } else if (tag === 'spell' || tag === 'i') {
      nodes.push(<i key={key}>{value}</i>);
    } else if (tag === 'dc') {
      nodes.push(<span key={key}>DC {value}</span>);
    } else {
      nodes.push(value);
    }

    lastIndex = tagPattern.lastIndex;
  }

  if (lastIndex === 0) return raw;
  if (lastIndex < String(text || '').length) {
    nodes.push(String(text || '').slice(lastIndex).replace(/\{[^}]+\}/g, ''));
  }

  return nodes;
}

function EntryContent({ entry }) {
  if (!entry) return null;
  if (typeof entry === 'string' || typeof entry === 'number') {
    return <EntryText text={entry} />;
  }
  if (Array.isArray(entry)) {
    return entry.map((item, index) => (
      <FragmentWithBreak key={index} showBreak={index > 0}>
        <EntryContent entry={item} />
      </FragmentWithBreak>
    ));
  }
  if (typeof entry !== 'object') return null;

  if (entry.type === 'list') {
    return (
      <ul style={{ margin: '.3rem 0 .3rem 1.2rem' }}>
        {(entry.items || []).map((item, index) => (
          <li key={index}><EntryContent entry={item} /></li>
        ))}
      </ul>
    );
  }

  if (entry.type === 'table') {
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-body)', margin: '.4rem 0' }}>
        {entry.colLabels && (
          <thead>
            <tr>
              {entry.colLabels.map((label, index) => (
                <th key={index} style={entryTableHeaderStyle}><EntryText text={label} /></th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {(entry.rows || []).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {(row || []).map((cell, cellIndex) => (
                <td key={cellIndex} style={entryTableCellStyle}><EntryContent entry={cell} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (entry.type === 'entries' || entry.type === 'section') {
    return (
      <div style={{ marginBottom: 5 }}>
        {entry.name && <><b><EntryText text={`${entry.name}.`} /></b> </>}
        <EntryContent entry={entry.entries} />
      </div>
    );
  }

  if (entry.type === 'inset') {
    return (
      <div style={entryInsetStyle}>
        <EntryContent entry={entry.entries} />
      </div>
    );
  }

  if (entry.name && entry.entries) {
    return (
      <div style={{ marginBottom: 5 }}>
        <b><i><EntryText text={`${entry.name}.`} /></i></b>{' '}
        <EntryContent entry={entry.entries} />
      </div>
    );
  }

  if (entry.entries) return <EntryContent entry={entry.entries} />;
  if (entry.entry) return <EntryContent entry={entry.entry} />;
  return null;
}

function FragmentWithBreak({ showBreak, children }) {
  return (
    <>
      {showBreak && <br />}
      {children}
    </>
  );
}

function CollapsibleFeatureItem({ item }) {
  const [open, setOpen] = useState(false);
  const source = item.source || {};
  const hasContent = !!item.entries || Array.isArray(item.values);

  return (
    <div className={`feature-item${open ? ' open' : ''}`}>
      <div
        className="feature-hdr"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="feature-name" style={{ color: item.nameColor || 'var(--text2)' }}>
            {item.badge && (
              <span style={{ fontSize: 'var(--fs-xs)', marginRight: 5, opacity: '.7' }}>
                {item.badge}
              </span>
            )}
            {item.name}
          </div>
          {source.label && (
            <div style={{ fontSize: 'var(--fs-xs)', color: source.color || 'var(--text3)', marginTop: 1 }}>
              {source.icon && <Icon name={source.icon} />} {source.label}
            </div>
          )}
        </div>
        <span className="feature-arrow"><Icon name="chevron-right" /></span>
      </div>
      <div className="feature-body">
        {Array.isArray(item.values) ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {item.values.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        ) : (
          <EntryContent entry={item.entries} />
        )}
        {!hasContent && <i style={{ color: 'var(--text3)' }}>{item.emptyText || 'No description.'}</i>}
      </div>
    </div>
  );
}

function FeatureSectionTitle({ section }) {
  return (
    <div style={featureSectionTitleStyle(section.color)}>
      {section.icon && <Icon name={section.icon} />} {section.title}
    </div>
  );
}

function FeaturesTab({ features }) {
  const sections = Array.isArray(features?.sections) ? features.sections : [];

  if (!sections.length) {
    return <div className="phmsg">{features?.emptyMessage || 'No features available.'}</div>;
  }

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <div key={section.key || section.title}>
          <FeatureSectionTitle section={section} />
          {(section.items || []).map((item) => (
            <CollapsibleFeatureItem key={item.key} item={item} />
          ))}
          {(section.choices || []).map((choice) => (
            <CollapsibleFeatureItem
              key={choice.key}
              item={{
                key: choice.key,
                name: choice.label,
                values: choice.values,
                nameColor: section.color,
                source: {
                  label: `${choice.values.length} selected`,
                  color: section.color,
                },
              }}
            />
          ))}
          {sectionIndex < sections.length - 1 && <div style={{ height: 6 }} />}
        </div>
      ))}
    </>
  );
}

function BackgroundTab({ background }) {
  const data = background || {};
  if (!data.hasBackground) {
    return <div className="phmsg">{data.emptyMessage || 'No background selected.'}</div>;
  }

  return (
    <>
      <div className="bg-section">
        <div className="bg-section-title">
          <Icon name="scroll-text" /> {data.name}
        </div>
        {(data.summaryRows || []).map((row) => (
          <p key={row.key} className="bg-text">
            <strong>{row.label}:</strong> {row.values.join(', ')}
          </p>
        ))}
        {(data.choiceRows || []).length > 0 && (
          <div style={{ marginTop: '.65rem' }}>
            {data.choiceRows.map((row) => (
              <p key={row.key} className="bg-text">
                <strong>{row.label}:</strong> {row.values.join(', ')}
              </p>
            ))}
          </div>
        )}
      </div>
      {(data.entries || []).map((entry) => (
        <CollapsibleFeatureItem key={entry.key} item={{ ...entry, source: {}, nameColor: 'var(--text2)', emptyText: '-' }} />
      ))}
    </>
  );
}

const featureSectionTitleStyle = (color) => ({
  fontFamily: 'var(--ff-display)',
  fontSize: 'var(--fs-label)',
  fontWeight: 700,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: color || 'var(--gold)',
  margin: '.75rem 0 .5rem',
});

function CurrencyRow({ currency, onAfterChange }) {
  const coins = [
    { key: 'cp', label: 'Copper', color: '#b87333' },
    { key: 'sp', label: 'Silver', color: '#aaa' },
    { key: 'ep', label: 'Electrum', color: '#888' },
    { key: 'gp', label: 'Gold', color: 'var(--gold)' },
    { key: 'pp', label: 'Platinum', color: '#e0e0ff' },
  ];

  return (
    <div className="currency-row">
      {coins.map((coin) => (
        <div key={coin.key} className="currency-cell">
          <div className="currency-lbl" style={{ color: coin.color }}>{coin.label}</div>
          <input
            type="number"
            className="currency-inp"
            min="0"
            value={currency?.[coin.key] ?? 0}
            onChange={(event) => {
              updateCurrency(coin.key, event.currentTarget.value);
              window.setTimeout(onAfterChange, 0);
            }}
          />
        </div>
      ))}
    </div>
  );
}

function InventoryStats({ stats }) {
  const s = stats || {};
  return (
    <div className="inv-stat-row">
      <div className="inv-stat-pill">Weight: <b>{s.totalWeight || '0.0'} / {s.maxCarry || 0} lb</b></div>
      <div className="inv-stat-pill">Value: <b>{s.totalValue || '0.0'} GP</b></div>
      <div style={{ width: '100%', marginTop: '.3rem' }}>
        <div className="inv-weight-track">
          <div className="inv-weight-fill" style={{ width: `${s.pct || 0}%`, background: s.barColor || 'var(--green)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--fs-label)' }}>
          <span style={{ color: 'var(--text3)', fontFamily: 'var(--ff-display)' }}>
            {s.totalWeight || '0.0'} / {s.maxCarry || 0} lb
          </span>
          <span className="inv-enc-badge" style={{ background: s.statusBg, color: s.statusColor }}>
            {s.statusText || 'OK'}
          </span>
        </div>
        {s.isOver && (
          <div style={{ marginTop: 3, fontSize: 'var(--fs-label)', color: s.statusColor, lineHeight: 1.4 }}>
            Speed 5 ft
          </div>
        )}
      </div>
    </div>
  );
}

function InventorySearchList({ items, filter, query, status, onAdd }) {
  if (status === 'loading') {
    return <div className="inv-search-list"><div className="phmsg" style={{ fontSize: 'var(--fs-body)' }}>Loading...</div></div>;
  }
  if (status === 'error') {
    return <div className="inv-search-list"><div className="phmsg" style={{ color: 'var(--red2)', fontSize: 'var(--fs-body)' }}>Error loading items.</div></div>;
  }

  const q = query.toLowerCase().trim();
  let list = items;
  if (filter !== 'all') list = list.filter((item) => itemTypeGroup(item) === filter);
  if (q) list = list.filter((item) => String(item.name || '').toLowerCase().includes(q));
  list = list.slice(0, 60);

  if (!list.length) {
    return <div className="inv-search-list"><div className="phmsg" style={{ fontSize: 'var(--fs-body)' }}>No items found.</div></div>;
  }

  return (
    <div className="inv-search-list">
      {list.map((item) => {
        const typeLabel = ITEM_TYPE_LABELS[item.type] || item.type || '-';
        const rarity = item.rarity && item.rarity !== 'none' ? item.rarity : null;
        const rc = ITEM_RARITY_COLOR[rarity] || 'var(--text3)';
        const valueGp = item.value ? `${(item.value / 100).toFixed(item.value % 100 === 0 ? 0 : 2)} GP` : '-';
        const dmg = item.dmg1 ? ` · ${item.dmg1}${item.dmgType ? ` ${item.dmgType}` : ''}` : '';
        const bonus = item.bonusWeapon ? ` · ${item.bonusWeapon}` : (item.bonusAc ? ` · AC${item.bonusAc}` : '');
        const ac = item.ac ? ` · AC ${item.ac}` : '';

        return (
          <div
            key={`${item.name}-${item.source || ''}`}
            className="inv-search-row"
            onClick={() => onAdd({
              name: item.name,
              source: item.source,
              type: item.type || null,
              weight: item.weight ?? null,
              ac: item.ac ?? null,
              value: item.value ?? null,
              rarity: item.rarity ?? null,
              property: item.property ?? null,
              dmg1: item.dmg1 ?? null,
              dmgType: item.dmgType ?? null,
              bonusWeapon: item.bonusWeapon || null,
              bonusAc: item.bonusAc || null,
            })}
          >
            <div className="inv-search-name">{item.name}</div>
            <div className="inv-search-meta" style={{ color: rc }}>{rarity || typeLabel}{dmg}{bonus}{ac}</div>
            <div className="inv-search-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <span>{valueGp}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)' }}>{item.source || ''}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InventoryItemRow({ row, onAfterChange }) {
  const [open, setOpen] = useState(false);

  function refreshAfter(action) {
    action();
    window.setTimeout(onAfterChange, 0);
  }

  return (
    <>
      <div className={`inv-row${row.equipped ? ' equipped' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0, minWidth: 52 }}>
          <div className="inv-badge" style={{ color: row.rarityColor, borderColor: row.rarityColor }}>
            {row.rarityLabel}
          </div>
          {row.magicBonus > 0 && (
            <div className="inv-badge" style={{ color: 'var(--gold)', borderColor: 'var(--gold)', fontWeight: 700 }}>
              <Icon name="sparkles" /> +{row.magicBonus}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0, cursor: row.entries ? 'pointer' : 'default' }} onClick={() => row.entries && setOpen((value) => !value)}>
          <div className="inv-row-name">
            {row.itemUrl ? (
              <a href={row.itemUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} style={{ color: 'inherit', textDecoration: 'underline dotted', textUnderlineOffset: 2 }}>
                {row.name}
              </a>
            ) : row.name}
            {row.custom && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)' }}> [custom]</span>}
          </div>
          {row.meta.length > 0 && (
            <div style={{ fontSize: 'var(--fs-label)', color: 'var(--text3)', marginTop: 1 }}>
              {row.meta.join(' · ')}
            </div>
          )}
        </div>
        {row.canEquip && (
          <button className={`inv-equip-btn${row.equipped ? ' on' : ''}`} type="button" onClick={() => refreshAfter(() => toggleInventoryEquip(row.index))}>
            {row.equipped && <Icon name="check" />} {row.equipped ? 'Equip.' : 'Equip'}
          </button>
        )}
        {row.eligibleFlags.map((flag) => (
          <button
            key={flag.key}
            className={`inv-equip-btn${flag.active ? ' on' : ''}`}
            type="button"
            style={flag.active ? purpleButtonOnStyle : purpleButtonOffStyle}
            title={flag.label}
            onClick={() => refreshAfter(() => toggleInventoryFlag(row.index, flag.key))}
          >
            {flag.active && <Icon name="check" />} {flag.icon && <Icon name={flag.icon} />} {flag.label}
          </button>
        ))}
        {row.weaponOverrides.map((override) => (
          <button key={override.key} className={`inv-equip-btn${override.active ? ' on' : ''}`} type="button" title={override.title} onClick={() => refreshAfter(() => setInventoryWeaponOverride(row.index, override.key))}>
            {override.label}
          </button>
        ))}
        <div className="inv-qty-wrap">
          <button className="inv-qty-btn" type="button" onClick={() => refreshAfter(() => changeInventoryQty(row.index, -1))}>-</button>
          <div className="inv-qty-val">{row.qty}</div>
          <button className="inv-qty-btn" type="button" onClick={() => refreshAfter(() => changeInventoryQty(row.index, 1))}>+</button>
        </div>
        <button className="inv-qty-btn del" type="button" title="Remove" onClick={() => refreshAfter(() => changeInventoryQty(row.index, -row.qty))}>
          <Icon name="trash-2" />
        </button>
      </div>
      {row.entries && (
        <div className={`inv-entry-body${open ? ' open' : ''}`}>
          <EntryContent entry={row.entries} />
        </div>
      )}
    </>
  );
}

function InventoryList({ groups, isEmpty, onAfterChange }) {
  if (isEmpty) return <div className="phmsg">Inventory empty.</div>;

  return (
    <>
      {(groups || []).map((group) => (
        <div key={group.key}>
          <div className="inv-section-hdr">
            {group.icon && <Icon name={group.icon} />} {group.label}
          </div>
          {group.items.map((row) => (
            <InventoryItemRow key={row.key} row={row} onAfterChange={onAfterChange} />
          ))}
        </div>
      ))}
    </>
  );
}

function InventoryTab({ inventory, onAfterChange }) {
  const searchDb = useItemSearchDb();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  function refreshSoon() {
    window.setTimeout(onAfterChange, 0);
  }

  function handleCustomKeyDown(event) {
    if (event.key !== 'Enter') return;
    addCustomItem();
    refreshSoon();
  }

  return (
    <>
      <CurrencyRow currency={inventory?.currency} onAfterChange={onAfterChange} />
      <InventoryStats stats={inventory?.stats} />
      <input
        className="inv-search-box"
        id="inv-search"
        placeholder="Search items to add (e.g. Sword, Potion, Torch...)"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        autoComplete="off"
      />
      <div className="inv-filter-row">
        {INVENTORY_FILTERS.map((option) => (
          <InventoryFilter key={option.key} filter={option.key} icon={option.icon} active={filter === option.key} onSelect={setFilter}>
            {option.label}
          </InventoryFilter>
        ))}
      </div>
      <InventorySearchList
        items={searchDb.items}
        filter={filter}
        query={query}
        status={searchDb.status}
        onAdd={(payload) => {
          addInventoryItem(payload);
          refreshSoon();
        }}
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: '.75rem', flexWrap: 'wrap' }}>
        <input className="inv-search-box" id="inv-custom-name" placeholder="Add custom item..." style={{ marginBottom: 0, flex: 1, minWidth: 120 }} onKeyDown={handleCustomKeyDown} />
        <input type="number" id="inv-custom-weight" placeholder="lb" min="0" step="0.1" style={compactNumberInputStyle} onKeyDown={handleCustomKeyDown} />
        <input type="number" id="inv-custom-value" placeholder="gp" min="0" step="0.01" style={{ ...compactNumberInputStyle, width: 62 }} onKeyDown={handleCustomKeyDown} />
        <button
          type="button"
          onClick={() => {
            addCustomItem();
            refreshSoon();
          }}
          style={addItemButtonStyle}
        >
          + Add
        </button>
      </div>

      <div className="inv-section-hdr">
        <Icon name="package" /> Inventory ({inventory?.stats?.totalItems || 0} items)
      </div>
      <InventoryList groups={inventory?.groups} isEmpty={inventory?.isEmpty} onAfterChange={onAfterChange} />
    </>
  );
}

const purpleButtonOnStyle = {
  background: 'var(--purple)',
  borderColor: 'var(--purple)',
  color: '#fff',
};

const purpleButtonOffStyle = {
  borderColor: 'var(--purple)',
  color: 'var(--purple)',
};

const entryTableHeaderStyle = {
  fontFamily: 'var(--ff-display)',
  fontSize: 'var(--fs-xs)',
  letterSpacing: '.08em',
  color: 'var(--text3)',
  padding: '3px 6px',
  borderBottom: '1px solid var(--bdr)',
};

const entryTableCellStyle = {
  padding: '2px 6px',
  color: 'var(--text2)',
  borderBottom: '1px solid var(--bdr)',
};

const entryInsetStyle = {
  borderLeft: '2px solid var(--bdr2)',
  padding: '5px 10px',
  margin: '5px 0',
  fontStyle: 'italic',
};

function SheetTabsPanel({ tabs, background, features, inventory, activeTab, onTabChange, onRuntimeRefresh }) {
  const t = tabs || {};
  const isActive = (name) => (activeTab === name ? ' active' : '');

  return (
    <div className="panel" style={{ marginBottom: 0 }}>
      <div className="tabs-bar">
        <TabButton name="actions" active={activeTab === 'actions'} onSelect={onTabChange}>Actions</TabButton>
        <TabButton name="spells" active={activeTab === 'spells'} onSelect={onTabChange}>Spells</TabButton>
        <TabButton name="inventory" active={activeTab === 'inventory'} onSelect={onTabChange}>Inventory</TabButton>
        <TabButton name="features" active={activeTab === 'features'} onSelect={onTabChange}>Features</TabButton>
        <TabButton name="background" active={activeTab === 'background'} onSelect={onTabChange}>Background</TabButton>
        <TabButton name="notes" active={activeTab === 'notes'} onSelect={onTabChange}>Notes</TabButton>
      </div>

      <div className={`tab-content${isActive('actions')}`}>
        <div className="action-filters">
          <ActionFilter filter="all" active>All</ActionFilter>
          <ActionFilter filter="attack">Attack</ActionFilter>
          <ActionFilter filter="action">Action</ActionFilter>
          <ActionFilter filter="bonus">Bonus Action</ActionFilter>
          <ActionFilter filter="reaction">Reaction</ActionFilter>
        </div>
        <HtmlBlock html={t.attacksTableHtml} />
        <HtmlBlock html={t.combatActionsHtml} style={{ marginTop: '.75rem' }} />
      </div>

      <div className={`tab-content${isActive('spells')}`}>
        <HtmlBlock html={t.spellsHtml} />
      </div>

      <div className={`tab-content${isActive('inventory')}`}>
        <InventoryTab inventory={inventory} onAfterChange={onRuntimeRefresh} />
      </div>

      <div className={`tab-content${isActive('features')}`}>
        <FeaturesTab features={features} />
      </div>

      <div className={`tab-content${isActive('background')}`}>
        <BackgroundTab background={background} />
      </div>

      <div className={`tab-content${isActive('notes')}`}>
        <NotesTextarea />
      </div>

      <div className="legacy-tabs-mirror" aria-hidden="true">
        <div id="attacks-table-wrap" />
        <div id="combat-actions-wrap" />
        <div id="spells-wrap" />
        <div id="currency-row" />
        <div id="inv-stats-row" />
        <div id="inv-search-results" />
        <div id="inv-list" />
        <span id="inv-count">0</span>
        <div id="features-wrap" />
        <div id="background-wrap" />
      </div>
    </div>
  );
}

const compactNumberInputStyle = {
  width: 58,
  padding: '6px 8px',
  background: 'var(--bg3)',
  border: '1px solid var(--bdr)',
  borderRadius: 'var(--r)',
  color: 'var(--text)',
  fontSize: 'var(--fs-label)',
  flexShrink: 0,
};

const addItemButtonStyle = {
  padding: '6px 14px',
  border: '1px solid var(--bdr2)',
  borderRadius: 'var(--r)',
  background: 'var(--bg3)',
  color: 'var(--text2)',
  fontFamily: 'var(--ff-display)',
  fontSize: 'var(--fs-label)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all .12s',
};

function SheetRightColumn({
  summary,
  onSummaryRefresh,
  tabs,
  background,
  features,
  inventory,
  activeTab,
  onTabChange,
  onRuntimeRefresh,
}) {
  return (
    <div className="main-col-right">
      <SheetRightSummary summary={summary} onRefresh={onSummaryRefresh} />
      <SheetTabsPanel
        tabs={tabs}
        background={background}
        features={features}
        inventory={inventory}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onRuntimeRefresh={onRuntimeRefresh}
      />
    </div>
  );
}

export default function CharacterSheetLayout({
  header,
  summary,
  vitals,
  scores,
  proficiencies,
  skills,
  tabs,
  background,
  features,
  inventory,
  saves,
  senses,
  activeTab,
  onTabChange,
  onHeaderXpChange,
  onSummaryRefresh,
  onRuntimeRefresh,
  onHpAdjust,
  onHpQuickAction,
  onDeathSaveAction,
  onHitDieToggle,
}) {
  return (
    <div className="character-sheet-root">
      <SheetHeader header={header} onXpChange={onHeaderXpChange} onAfterRest={onRuntimeRefresh} />
      <SheetScoreStrip
        scores={scores}
        vitals={vitals}
        onHpAdjust={onHpAdjust}
        onHpQuickAction={onHpQuickAction}
        onDeathSaveAction={onDeathSaveAction}
      />

      <div className="main-grid">
        <SheetLeftColumn
          vitals={vitals}
          proficiencies={proficiencies}
          saves={saves}
          senses={senses}
          onHitDieToggle={onHitDieToggle}
        />
        <SheetSkillsColumn skills={skills} />
        <SheetRightColumn
          summary={summary}
          onSummaryRefresh={onSummaryRefresh}
          tabs={tabs}
          background={background}
          features={features}
          inventory={inventory}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onRuntimeRefresh={onRuntimeRefresh}
        />
      </div>
    </div>
  );
}
