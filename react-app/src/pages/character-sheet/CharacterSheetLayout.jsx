import { useEffect, useState } from 'react';

function callLegacy(name, ...args) {
  const fn = window[name];
  if (typeof fn === 'function') return fn(...args);
  return undefined;
}

function Icon({ name }) {
  return <i data-lucide={name} className="lucide-emoji" />;
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

function SheetScoresRow({ scores, onScoreClick }) {
  if (!scores?.hasContent) {
    return <div className="scores-row react-scores-row" />;
  }

  return (
    <div className="scores-row react-scores-row">
      <div className="scores-left">
        {scores.scores.map((score, index) => (
          <div
            key={`${score.label}-${index}`}
            className="score-box"
            style={{ cursor: score.onclick ? 'pointer' : 'default' }}
            title={score.title}
            onClick={() => onScoreClick(score.onclick)}
          >
            <div className="score-lbl">{score.label}</div>
            <div className="score-mod">{score.mod}</div>
            <div
              className="score-base"
              dangerouslySetInnerHTML={{ __html: score.baseHtml }}
            />
          </div>
        ))}
        <div className="stat-box green">
          <div className="stat-box-val">{scores.pb}</div>
          <div className="stat-box-lbl">Prof. Bonus</div>
        </div>
        {scores.speed && (
          <div
            className="stat-box"
            title={scores.speed.title}
            dangerouslySetInnerHTML={{ __html: scores.speed.html }}
          />
        )}
      </div>
    </div>
  );
}

function SheetScoreStrip({
  scores,
  vitals,
  onScoreClick,
  onHpAdjust,
  onHpQuickAction,
  onDeathSaveAction,
}) {
  return (
    <div className="react-scores-strip">
      <SheetScoresRow scores={scores} onScoreClick={onScoreClick} />
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

function SheetLeftColumn({ vitals, leftPanels, onHitDieToggle }) {
  const panels = leftPanels || { savesHtml: '', sensesHtml: '', profsHtml: '' };

  return (
    <div className="main-col-left">
      <Panel icon="dice-5" title="Saving Throws">
        <HtmlPanelBody html={panels.savesHtml} />
      </Panel>
      <Panel icon="eye" title="Senses">
        <HtmlPanelBody html={panels.sensesHtml} />
      </Panel>
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

function SheetSkillsColumn({ skills }) {
  const html = skills?.html || '';

  return (
    <div className="main-col-middle">
      <Panel title="Skills" style={{ marginBottom: 0 }}>
        <div className="skills-header">
          <span />
          <span>Prof.</span>
          <span>Skill</span>
          <span>Mod.</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className="legacy-skills-mirror" aria-hidden="true">
          <div id="skills-body" />
        </div>
      </Panel>
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
            callLegacy('rollInitiative');
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
            callLegacy('toggleInspirationSheet');
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
          <div
            className="def-text phmsg"
            dangerouslySetInnerHTML={{ __html: summary.defensesHtml }}
          />
        </div>
        <div className="conditions-block">
          <div className="block-title">Conditions</div>
          <div
            className="def-text"
            onClick={() => window.setTimeout(onRefresh, 0)}
            dangerouslySetInnerHTML={{ __html: summary.conditionsHtml }}
          />
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

function TabButton({ name, active, children }) {
  return (
    <button
      className={`tab-btn${active ? ' active' : ''}`}
      type="button"
      onClick={(event) => callLegacy('switchTab', name, event.currentTarget)}
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

function SheetTabsPanel() {
  return (
    <div className="panel" style={{ marginBottom: 0 }}>
      <div className="tabs-bar">
        <TabButton name="actions" active>Actions</TabButton>
        <TabButton name="spells">Spells</TabButton>
        <TabButton name="inventory">Inventory</TabButton>
        <TabButton name="features">Features</TabButton>
        <TabButton name="background">Background</TabButton>
        <TabButton name="notes">Notes</TabButton>
      </div>

      <div id="tab-actions" className="tab-content active">
        <div className="action-filters">
          <ActionFilter filter="all" active>All</ActionFilter>
          <ActionFilter filter="attack">Attack</ActionFilter>
          <ActionFilter filter="action">Action</ActionFilter>
          <ActionFilter filter="bonus">Bonus Action</ActionFilter>
          <ActionFilter filter="reaction">Reaction</ActionFilter>
        </div>
        <div id="attacks-table-wrap" />
        <div id="combat-actions-wrap" style={{ marginTop: '.75rem' }} />
      </div>

      <div id="tab-spells" className="tab-content">
        <div id="spells-wrap" />
      </div>

      <div id="tab-inventory" className="tab-content">
        <div className="currency-row" id="currency-row" />
        <div className="inv-stat-row" id="inv-stats-row" />
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
        <div className="inv-search-list" id="inv-search-results" />

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
          <Icon name="package" /> Inventory (<span id="inv-count">0</span> items)
        </div>
        <div id="inv-list" />
      </div>

      <div id="tab-features" className="tab-content">
        <div id="features-wrap" />
      </div>

      <div id="tab-background" className="tab-content">
        <div id="background-wrap" />
      </div>

      <div id="tab-notes" className="tab-content">
        <textarea
          className="notes-area"
          id="notes-area"
          placeholder="Write your notes here..."
          onInput={() => callLegacy('saveNotes')}
        />
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

function SheetRightColumn({ summary, onSummaryRefresh }) {
  return (
    <div className="main-col-right">
      <SheetRightSummary summary={summary} onRefresh={onSummaryRefresh} />
      <SheetTabsPanel />
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
  onHeaderXpChange,
  onSummaryRefresh,
  onRuntimeRefresh,
  onHpAdjust,
  onHpQuickAction,
  onDeathSaveAction,
  onHitDieToggle,
  onScoreClick,
}) {
  return (
    <div className="character-sheet-root">
      <SheetHeader header={header} onXpChange={onHeaderXpChange} onAfterRest={onRuntimeRefresh} />
      <SheetScoreStrip
        scores={scores}
        vitals={vitals}
        onScoreClick={onScoreClick}
        onHpAdjust={onHpAdjust}
        onHpQuickAction={onHpQuickAction}
        onDeathSaveAction={onDeathSaveAction}
      />

      <div className="main-grid">
        <SheetLeftColumn vitals={vitals} leftPanels={leftPanels} onHitDieToggle={onHitDieToggle} />
        <SheetSkillsColumn skills={skills} />
        <SheetRightColumn summary={summary} onSummaryRefresh={onSummaryRefresh} />
      </div>
    </div>
  );
}
