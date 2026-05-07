function callLegacy(name, ...args) {
  const fn = window[name];
  if (typeof fn === 'function') return fn(...args);
  return undefined;
}

function Icon({ name }) {
  return <i data-lucide={name} className="lucide-emoji" />;
}

function SheetHeader({ header, onXpChange }) {
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
        <button className="rest-btn short" type="button" onClick={() => callLegacy('doRest', 'short')}>
          <Icon name="sun" /> SHORT REST
        </button>
        <button className="rest-btn long" type="button" onClick={() => callLegacy('doRest', 'long')}>
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

function SheetScoreStrip() {
  return (
    <>
      <div className="scores-row" id="scores-row" />
      <div className="stats-row" id="stats-row" />
    </>
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

function SheetLeftColumn() {
  return (
    <div className="main-col-left">
      <Panel icon="dice-5" title="Saving Throws">
        <div className="panel-body" id="saves-body" />
      </Panel>
      <Panel icon="eye" title="Senses">
        <div className="panel-body" id="senses-body" />
      </Panel>
      <Panel icon="scroll-text" title="Proficiencies">
        <div className="panel-body" id="profs-body" />
      </Panel>
      <Panel icon="dice-5" title="Hit Dice" titleNode={<span id="hd-label" />}>
        <div className="panel-body" id="hd-body" />
      </Panel>
    </div>
  );
}

function SheetSkillsColumn() {
  return (
    <div className="main-col-middle">
      <Panel title="Skills" style={{ marginBottom: 0 }}>
        <div className="skills-header">
          <span />
          <span>Prof.</span>
          <span>Skill</span>
          <span>Mod.</span>
        </div>
        <div id="skills-body" />
      </Panel>
    </div>
  );
}

function SheetRightSummary() {
  return (
    <div className="right-top-row">
      <div className="inspiration-block" onClick={() => callLegacy('rollInitiative')} title="Roll Initiative">
        <div className="insp-star" id="init-val">+0</div>
        <div className="block-title" style={{ marginBottom: 0, textAlign: 'center' }}>Initiative</div>
      </div>
      <div className="inspiration-block" style={{ cursor: 'default' }}>
        <div className="insp-star" id="ac-val">10</div>
        <div className="block-title" style={{ marginBottom: 0, textAlign: 'center' }}>AC</div>
      </div>
      <div
        className="inspiration-block"
        id="inspiration-block"
        onClick={() => callLegacy('toggleInspirationSheet')}
        title="Toggle Inspiration"
      >
        <div className="insp-star" id="insp-star">*</div>
        <div className="block-title" style={{ marginBottom: 0, textAlign: 'center' }} id="insp-label">No Insp.</div>
      </div>
      <div className="defenses-block" id="defenses-block">
        <div className="block-title">Defenses</div>
        <div id="def-content" className="def-text phmsg">No resistances detected.</div>
      </div>
      <div className="conditions-block">
        <div className="block-title">Conditions</div>
        <div id="conditions-content" className="def-text">
          <span className="condition-tag">- None</span>
        </div>
      </div>
    </div>
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

function SheetRightColumn() {
  return (
    <div className="main-col-right">
      <SheetRightSummary />
      <SheetTabsPanel />
    </div>
  );
}

export default function CharacterSheetLayout({ header, onHeaderXpChange }) {
  return (
    <div className="character-sheet-root">
      <SheetHeader header={header} onXpChange={onHeaderXpChange} />
      <SheetScoreStrip />

      <div className="main-grid">
        <SheetLeftColumn />
        <SheetSkillsColumn />
        <SheetRightColumn />
      </div>
    </div>
  );
}
