import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  clearConditions,
  cycleSkillAdv,
  rollAbilityCheck,
  rollInitiative,
  rollSave,
  rollSkill,
  toggleCondition,
  toggleInspiration,
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
            callLegacy('doRest', 'short');
            window.setTimeout(onAfterRest, 0);
          }}
        >
          <Icon name="sun" /> SHORT REST
        </button>
        <button
          className="rest-btn long"
          type="button"
          onClick={() => {
            callLegacy('doRest', 'long');
            window.setTimeout(onAfterRest, 0);
          }}
        >
          <Icon name="moon" /> LONG REST
        </button>
        <a
          className="back-btn"
          href="charbuilder.html"
          onClick={(event) => callLegacy('goBackToBuilder', event)}
        >
          <Icon name="arrow-left" /> Builder
        </a>
        <button
          className="rest-btn"
          type="button"
          style={{ borderColor: 'var(--teal)', color: 'var(--teal)', background: 'var(--tbg)' }}
          onClick={() => callLegacy('downloadSheet')}
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

function HtmlPanelBody({ html }) {
  return (
    <div
      className="panel-body"
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
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

function SheetLeftColumn({ vitals, leftPanels, saves, senses, onHitDieToggle }) {
  const panels = leftPanels || { profsHtml: '' };

  return (
    <div className="main-col-left">
      <SheetSavesPanel saves={saves} />
      <SheetSensesPanel senses={senses} />
      <Panel icon="scroll-text" title="Proficiencies">
        <HtmlPanelBody html={panels.profsHtml} />
      </Panel>
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

function InventoryFilter({ filter, active, icon, children }) {
  return (
    <button
      className={`inv-chip${active ? ' on' : ''}`}
      type="button"
      onClick={(event) => callLegacy('setInvFilter', filter, event.currentTarget)}
    >
      {icon && <Icon name={icon} />} {children}
    </button>
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

function SheetTabsPanel({ tabs, activeTab, onTabChange }) {
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
        <HtmlBlock className="currency-row" html={t.currencyHtml} />
        <HtmlBlock className="inv-stat-row" html={t.invStatsHtml} />
        <input
          className="inv-search-box"
          id="inv-search"
          placeholder="Search items to add (e.g. Sword, Potion, Torch...)"
          onInput={() => callLegacy('renderItemSearch')}
          autoComplete="off"
        />
        <div className="inv-filter-row">
          <InventoryFilter filter="all" active>All</InventoryFilter>
          <InventoryFilter filter="weapon" icon="swords">Weapons</InventoryFilter>
          <InventoryFilter filter="armor" icon="shield">Armor</InventoryFilter>
          <InventoryFilter filter="gear" icon="backpack">Gear</InventoryFilter>
          <InventoryFilter filter="magic" icon="sparkles">Magic</InventoryFilter>
        </div>
        <HtmlBlock className="inv-search-list" html={t.invSearchResultsHtml} />

        <div style={{ display: 'flex', gap: 6, marginBottom: '.75rem', flexWrap: 'wrap' }}>
          <input
            className="inv-search-box"
            id="inv-custom-name"
            placeholder="Add custom item..."
            style={{ marginBottom: 0, flex: 1, minWidth: 120 }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') callLegacy('addCustomItemSheet');
            }}
          />
          <input
            type="number"
            id="inv-custom-weight"
            placeholder="lb"
            min="0"
            step="0.1"
            style={compactNumberInputStyle}
            onKeyDown={(event) => {
              if (event.key === 'Enter') callLegacy('addCustomItemSheet');
            }}
          />
          <input
            type="number"
            id="inv-custom-value"
            placeholder="gp"
            min="0"
            step="0.01"
            style={{ ...compactNumberInputStyle, width: 62 }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') callLegacy('addCustomItemSheet');
            }}
          />
          <button
            type="button"
            onClick={() => callLegacy('addCustomItemSheet')}
            style={addItemButtonStyle}
          >
            + Add
          </button>
        </div>

        <div className="inv-section-hdr">
          <Icon name="package" /> Inventory ({t.invCount || '0'} items)
        </div>
        <HtmlBlock html={t.invListHtml} />
      </div>

      <div className={`tab-content${isActive('features')}`}>
        <HtmlBlock html={t.featuresHtml} />
      </div>

      <div className={`tab-content${isActive('background')}`}>
        <HtmlBlock html={t.backgroundHtml} />
      </div>

      <div className={`tab-content${isActive('notes')}`}>
        <textarea
          className="notes-area"
          id="notes-area"
          placeholder="Write your notes here..."
          onInput={() => callLegacy('saveNotes')}
        />
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

function SheetRightColumn({ summary, onSummaryRefresh, tabs, activeTab, onTabChange }) {
  return (
    <div className="main-col-right">
      <SheetRightSummary summary={summary} onRefresh={onSummaryRefresh} />
      <SheetTabsPanel tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}

export default function CharacterSheetLayout({
  header,
  summary,
  vitals,
  scores,
  leftPanels,
  skills,
  tabs,
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
          leftPanels={leftPanels}
          saves={saves}
          senses={senses}
          onHitDieToggle={onHitDieToggle}
        />
        <SheetSkillsColumn skills={skills} />
        <SheetRightColumn
          summary={summary}
          onSummaryRefresh={onSummaryRefresh}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
}
