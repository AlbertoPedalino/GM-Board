function SheetSection({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function SheetHeader({ html }) {
  return <SheetSection html={html} />;
}

function SheetScoreStrip({ scoresHtml, statsHtml }) {
  return (
    <>
      <SheetSection html={scoresHtml} />
      <SheetSection html={statsHtml} />
    </>
  );
}

function SheetLeftColumn({ html }) {
  return <div className="main-col-left" dangerouslySetInnerHTML={{ __html: html }} />;
}

function SheetSkillsColumn({ html }) {
  return <div className="main-col-middle" dangerouslySetInnerHTML={{ __html: html }} />;
}

function SheetRightColumn({ summaryHtml, tabsHtml }) {
  return (
    <div className="main-col-right">
      <SheetSection html={summaryHtml} />
      <SheetSection html={tabsHtml} />
    </div>
  );
}

export default function CharacterSheetLayout({ sections }) {
  return (
    <div className="character-sheet-root">
      <SheetHeader html={sections.header} />
      <SheetScoreStrip scoresHtml={sections.scores} statsHtml={sections.stats} />

      <div className="main-grid">
        <SheetLeftColumn html={sections.leftColumn} />
        <SheetSkillsColumn html={sections.skillsColumn} />
        <SheetRightColumn
          summaryHtml={sections.rightSummary}
          tabsHtml={sections.tabsPanel}
        />
      </div>
    </div>
  );
}
