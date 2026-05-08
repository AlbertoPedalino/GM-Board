import { useEffect } from 'react';
import { CharbuilderProvider, useCharbuilderContext } from './CharbuilderContext.jsx';
import StepIndicator from './StepIndicator.jsx';
import PreviewSidebar from './PreviewSidebar.jsx';
import ClassTab from './ClassTab.jsx';
import SpeciesTab from './SpeciesTab.jsx';
import BackgroundTab from './BackgroundTab.jsx';
import AbilityScoresTab from './AbilityScoresTab.jsx';
import EquipmentTab from './EquipmentTab.jsx';
import FeatsTab from './FeatsTab.jsx';
import SheetTab from './SheetTab.jsx';

const STYLES = {
  tabPane: {
    display: 'none',
  },
  tabPaneActive: {
    display: 'block',
  },
};

function CharbuilderInner() {
  const { state, actions } = useCharbuilderContext();

  useEffect(() => {
    actions.loadClassData();
    actions.loadSpeciesData();
    actions.loadBackgroundsData();
    actions.loadFeatsData();
    actions.loadSpellsData();
  }, []);

  useEffect(() => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
    }
  });

  const doneSteps = {
    1: !!state.className,
    2: !!state.speciesName,
    3: !!state.bgName,
    5: !!(state.cls?.startingEquipment || state.bgObj?.startingEquipment),
    6: !!state.choices?.feat_origin,
  };

  const renderTab = (tabNum) => {
    const active = state.activeTab === tabNum;
    const style = active ? { ...STYLES.tabPane, ...STYLES.tabPaneActive } : STYLES.tabPane;
    switch (tabNum) {
      case 1: return <div key="t1" style={style}><ClassTab /></div>;
      case 2: return <div key="t2" style={style}><SpeciesTab /></div>;
      case 3: return <div key="t3" style={style}><BackgroundTab /></div>;
      case 4: return <div key="t4" style={style}><AbilityScoresTab /></div>;
      case 5: return <div key="t5" style={style}><EquipmentTab /></div>;
      case 6: return <div key="t6" style={style}><FeatsTab /></div>;
      case 7: return <div key="t7" style={style}><SheetTab /></div>;
      default: return null;
    }
  };

  return (
    <div className="app charbuilder-app">
      <header>
        <h1>Character Builder</h1>
        <div className="sub">D&amp;D 5e 2024 · 5etools</div>
        <div className="header-mark" aria-hidden="true">
          <i data-lucide="sparkles" style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: '-0.12em', strokeWidth: 2, color: 'currentColor' }} aria-hidden="true" />
        </div>
      </header>

      <StepIndicator
        activeTab={state.activeTab}
        doneSteps={doneSteps}
        onSelect={actions.setActiveTab}
      />

      <div className="cb-grid">
        <div>
          {renderTab(1)}
          {renderTab(2)}
          {renderTab(3)}
          {renderTab(4)}
          {renderTab(5)}
          {renderTab(6)}
          {renderTab(7)}
        </div>
        <div className="cb-preview-col">
          <PreviewSidebar char={state} spellDb={state.spellDb} />
        </div>
      </div>

      <footer>
        Data from <a href="https://5e.tools">5etools</a> via GitHub mirror · D&amp;D 5e is a trademark of Wizards of the Coast
      </footer>
    </div>
  );
}

export default function CharbuilderPage({ active, title }) {
  return (
    <section
      className={`charbuilder-page${active ? ' active' : ''}`}
      aria-label={title}
      hidden={!active}
    >
      {active && (
        <CharbuilderProvider>
          <CharbuilderInner />
        </CharbuilderProvider>
      )}
    </section>
  );
}
