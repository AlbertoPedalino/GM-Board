const STEPS = [
  { num: 1, label: 'Class' },
  { num: 2, label: 'Species' },
  { num: 3, label: 'Background' },
  { num: 4, label: 'Ability Scores' },
  { num: 5, label: 'Equipment' },
  { num: 6, label: 'Feats' },
  { num: 7, label: 'Sheet' },
];

function lockReason(num, doneSteps) {
  if (num === 2 && !doneSteps[1]) return 'Select a class first';
  if (num === 3 && !doneSteps[2]) return 'Select a species first';
  if (num === 5 && !doneSteps[3]) return 'Select a background first';
  if (num === 6 && !doneSteps[5]) return 'Choose equipment first';
  return null;
}

export default function StepIndicator({ activeTab, doneSteps = {}, onSelect }) {
  return (
    <div className="steps" role="tablist" aria-label="Character builder steps">
      {STEPS.map(({ num, label }) => {
        const locked = !!lockReason(num, doneSteps);
        const active = activeTab === num;
        const done = !!doneSteps[num];

        const handleClick = !locked && onSelect
          ? () => onSelect(num)
          : undefined;

        return (
          <div
            key={num}
            className={`step${active ? ' active' : ''}${done ? ' done' : ''}${locked ? ' locked' : ''}`}
            role="tab"
            aria-selected={active}
            aria-disabled={locked}
            aria-label={`Step ${num}: ${label}${locked ? ` (${lockReason(num, doneSteps)})` : ''}`}
            onClick={handleClick}
          >
            <div className="step-num">{num}</div>
            <div className="step-label">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
