import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getSurgeEffect } from '../../../shared/character/wildMagicSurgeTable.js';

function getSorcererLevel(C) {
  let lv = 0;
  if (String(C?.className || '').toLowerCase() === 'sorcerer') lv += C?.classLevel || C?.level || 0;
  (C?.extraClasses || []).forEach((ec) => {
    if (String(ec?.name || '').toLowerCase() === 'sorcerer') lv += ec.level || 0;
  });
  return lv;
}

function rollD100() {
  return Math.floor(Math.random() * 100) + 1;
}

function FeatureBox({ title, accent, children }) {
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.2 }}>
      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.68rem', fontWeight: 700, color: accent || '#edd48a', letterSpacing: '0.08em', mb: 0.4 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function WildMagicPanel({ action, character, sheet, onShowToast }) {
  const [manualSurgeRoll, setManualSurgeRoll] = useState(null);
  const sorcererLevel = getSorcererLevel(character);
  const hasControlledChaos = sorcererLevel >= 14;
  const hasTamedSurge = sorcererLevel >= 18;

  const rollSurgeTable = (e) => {
    e?.stopPropagation?.();
    if (hasControlledChaos) {
      const r1 = rollD100();
      const r2 = rollD100();
      const e1 = getSurgeEffect(r1);
      const e2 = getSurgeEffect(r2);
      setManualSurgeRoll({ controlled: true, rolls: [r1, r2], effects: [e1, e2] });
      onShowToast?.('Wild Magic Surge Table',
        `#1 [${e1.range}] ${e1.effect}\n#2 [${e2.range}] ${e2.effect}\nChoose one.`,
        0, [{ v: r1, faces: 100 }, { v: r2, faces: 100 }]);
    } else {
      const r = rollD100();
      const ef = getSurgeEffect(r);
      setManualSurgeRoll({ controlled: false, result: r, effect: ef });
      onShowToast?.('Wild Magic Surge Table', `[${ef.range}] ${ef.effect}`, r, [{ v: r, faces: 100 }]);
    }
  };

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{ mt: 0.8, p: 1, bgcolor: 'rgba(237,212,138,0.04)', border: 1, borderColor: 'divider', borderRadius: 1 }}
    >
      <Stack spacing={1.2}>
        <FeatureBox title="Wild Magic Surge (Lv.3)">
          <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', lineHeight: 1.5 }}>
            Once per turn, after casting a <b>Sorcerer spell with a spell slot</b>, you can roll <b>d20</b>.<br />
            On a <b>20</b> → roll <b>d100</b> on the Wild Magic Surge table.<br />
            The effect is too wild to be affected by Metamagic.
          </Typography>
        </FeatureBox>

        <FeatureBox title="Tides of Chaos (Lv.3)">
          <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', lineHeight: 1.5 }}>
            Give yourself <b>Advantage</b> on one <b>d20 test</b> before rolling.<br />
            If you cast a <b>Sorcerer spell with a spell slot</b> before recharging via Long Rest, you automatically roll on the <b>Wild Magic Surge table</b>.<br />
            Recharge: <b>Long Rest</b> or after rolling on the <b>Wild Magic Surge table</b>.
          </Typography>
        </FeatureBox>

        {hasTamedSurge ? (
          <FeatureBox title="Tamed Surge (Lv.18)">
            <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', lineHeight: 1.5 }}>
              <b>1 / Long Rest.</b> After casting a Sorcerer spell with a slot, choose an effect from the Wild Magic Surge table instead of rolling.<br />
              Can't choose the <b>final row</b>. If the chosen effect requires a roll, you must make it.
            </Typography>
          </FeatureBox>
        ) : null}

        {hasControlledChaos ? (
          <FeatureBox title="Controlled Chaos (Lv.14)" accent="#70b7a6">
            <Typography sx={{ fontSize: '0.68rem', color: '#70b7a6', lineHeight: 1.5 }}>
              <b>Passive</b> — when you roll on the Wild Magic Surge table, roll <b>twice</b> and pick either result.
            </Typography>
          </FeatureBox>
        ) : null}

        {sorcererLevel >= 6 ? (
          <FeatureBox title="Bend Luck (Lv.6)">
            <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', lineHeight: 1.5 }}>
              <b>Reaction</b> — after a creature you see rolls a <b>d20 test</b>, spend <b>1 Sorcery Point</b> to roll <b>1d4</b>.<br />
              Add or subtract the result from that roll (your choice).
            </Typography>
          </FeatureBox>
        ) : null}

        <FeatureBox title="Roll Wild Magic Surge Table">
          <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', mb: 0.5 }}>
            Roll d100 on the Wild Magic Surge table.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={rollSurgeTable}
            sx={{ fontSize: '0.6rem', fontFamily: '"Cinzel", Georgia, serif', letterSpacing: '0.06em' }}
          >
            {hasControlledChaos ? 'Roll Two (Controlled Chaos)' : 'Roll d100'}
          </Button>
          {hasControlledChaos ? (
            <Typography sx={{ mt: 0.3, fontSize: '0.6rem', color: '#70b7a6', fontStyle: 'italic' }}>
              Controlled Chaos active: roll twice and pick either result.
            </Typography>
          ) : null}
          {manualSurgeRoll && manualSurgeRoll.controlled ? (
            <Box sx={{ mt: 0.4, p: 0.6, bgcolor: 'rgba(237,212,138,0.06)', borderRadius: 1 }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#edd48a', fontWeight: 700, mb: 0.3 }}>
                Controlled Chaos — choose one:
              </Typography>
              {manualSurgeRoll.effects?.map((ef, i) => (
                <Typography key={i} sx={{ fontSize: '0.62rem', color: 'text.secondary', mb: 0.2 }}>
                  #{i + 1} [{ef.range}] {ef.effect}
                </Typography>
              ))}
            </Box>
          ) : null}
          {manualSurgeRoll && !manualSurgeRoll.controlled ? (
            <Box sx={{ mt: 0.4, p: 0.6, bgcolor: 'rgba(237,212,138,0.06)', borderRadius: 1 }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#edd48a', fontWeight: 700 }}>
                d100: {manualSurgeRoll.result}
              </Typography>
              <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', mt: 0.2 }}>
                [{manualSurgeRoll.effect?.range}] {manualSurgeRoll.effect?.effect}
              </Typography>
            </Box>
          ) : null}
          <Box sx={{ mt: 0.5 }}>
            <Typography
              component="a"
              href="https://5e.tools/tables.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              sx={{ fontSize: '0.55rem', color: '#4d95d6', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Open Wild Magic Surge table on 5e.tools
            </Typography>
          </Box>
        </FeatureBox>
      </Stack>
    </Box>
  );
}
