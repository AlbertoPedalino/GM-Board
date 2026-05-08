export const levelHeaderSx = {
  fontFamily: '"Cinzel", Georgia, serif',
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#4d95d6',
  textTransform: 'uppercase',
  borderBottom: 1,
  borderColor: 'rgba(77,149,214,0.14)',
  pb: '4px',
  mb: 0.4,
};

export const spellRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  px: '8px',
  py: '4px',
  bgcolor: 'rgba(35,32,26,1)',
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  mb: '3px',
  color: 'text.primary',
  cursor: 'pointer',
  '&:hover': { borderColor: 'rgba(202,165,80,0.34)' },
};

export const spellBodySx = {
  fontSize: '0.7rem',
  color: 'text.secondary',
  lineHeight: 1.5,
  bgcolor: '#12100e',
  border: 1,
  borderColor: 'divider',
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
  px: '10px',
  py: '6px',
  mt: '-3px',
  mb: '3px',
};

export const addButtonSx = {
  bgcolor: 'rgba(202,165,80,0.12)',
  border: 1,
  borderColor: '#caa550',
  borderRadius: 1,
  color: '#caa550',
  fontFamily: '"Cinzel", Georgia, serif',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  px: '14px',
  py: '5px',
};

export const compactInputSx = {
  '& .MuiOutlinedInput-root': { bgcolor: 'rgba(35,32,26,1)', borderRadius: 1 },
  '& input': { fontSize: '0.75rem', py: '7px' },
};

export const levelToggleSx = {
  flexWrap: 'wrap',
  '& .MuiToggleButton-root': {
    minHeight: 0,
    px: '9px',
    py: '4px',
    fontFamily: '"Cinzel", Georgia, serif',
    fontSize: '0.58rem',
    letterSpacing: '0.08em',
    color: 'text.secondary',
    borderColor: 'divider',
    '&.Mui-selected': { color: '#edd48a', bgcolor: 'rgba(202,165,80,0.12)', borderColor: '#caa550' },
  },
};
