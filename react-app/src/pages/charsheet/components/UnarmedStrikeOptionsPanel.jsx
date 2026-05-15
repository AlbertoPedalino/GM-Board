import { Box, Stack, Typography } from '@mui/material';

function OptionBox({ title, children }) {
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.65rem', fontWeight: 700, color: '#edd48a', letterSpacing: '0.08em', mb: 0.3 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function UnarmedStrikeOptionsPanel({ action }) {
  const dc = action.unarmedStrikeSaveDc;
  const abil = String(action.unarmedStrikeAbility || 'str').toUpperCase();

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{ mt: 1, p: 1, borderRadius: 1.5, bgcolor: 'rgba(237,212,138,0.04)', border: '1px solid', borderColor: 'divider' }}
    >
      <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.6rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.1em', mb: 0.75, textTransform: 'uppercase' }}>
        Unarmed Strike Options
      </Typography>

      <Typography sx={{ fontSize: '0.7rem', color: '#70b7a6', mb: 0.75, lineHeight: 1.4 }}>
        Make an Unarmed Strike attack roll using {abil}. On a hit, choose one of the following instead of the normal damage.
      </Typography>

      <Stack spacing={0.75}>
        <OptionBox title="Damage">
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', lineHeight: 1.5 }}>
            Deal bludgeoning damage as normal.
          </Typography>
        </OptionBox>

        <OptionBox title="Grapple">
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', lineHeight: 1.5 }}>
            Target makes a STR or DEX save.{' '}
            <Box component="span" sx={{ color: '#edd48a', fontWeight: 700, whiteSpace: 'nowrap' }}>
              DC {dc}
            </Box>
            . On fail: target has the Grappled condition. Requires a free hand. Target max one size larger. Escape{'\u00A0'}DC{' '}
            <Box component="span" sx={{ color: '#edd48a', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {dc}
            </Box>
            .
          </Typography>
        </OptionBox>

        <OptionBox title="Shove">
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', lineHeight: 1.5 }}>
            Target makes a STR or DEX save.{' '}
            <Box component="span" sx={{ color: '#edd48a', fontWeight: 700, whiteSpace: 'nowrap' }}>
              DC {dc}
            </Box>
            . On fail: push the target 5 ft away or knock it Prone. Target max one size larger.
          </Typography>
        </OptionBox>
      </Stack>
    </Box>
  );
}
