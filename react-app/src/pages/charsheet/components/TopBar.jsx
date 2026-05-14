import { useState } from 'react';
import { Box, Stack, Typography, Button, TextField } from '@mui/material';
import { ArrowLeft, Sun, Moon, Download, Wand2, Hammer, Axe, Music, Cross, Feather, Sword, Dumbbell, Shield, Compass, Eye, Sparkles, Flame, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLevelFromXp, getXpForNextLevel } from '../logic/calculations.js';
import IconColorPicker from '../../../shared/character/IconColorPicker.jsx';

const CLASS_ICONS = {
  Artificer: Hammer,
  Barbarian: Axe,
  Bard: Music,
  Cleric: Cross,
  Druid: Feather,
  Fighter: Sword,
  Monk: Dumbbell,
  Paladin: Shield,
  Ranger: Compass,
  Rogue: Eye,
  Sorcerer: Sparkles,
  Warlock: Flame,
  Wizard: BookOpen,
};

function classIcon(className) {
  return CLASS_ICONS[className] || Wand2;
}

export default function TopBar({ C, sheet, onShortRest, onLongRest, onDownload, onUpdateXp, onUpdateCharacter }) {
  const [colorAnchor, setColorAnchor] = useState(null);
  const navigate = useNavigate();
  const extra = C.extraClasses || [];
  const pLv = C.classLevel || C.level;
  const sc = C.subclassShortName ? ` (${C.subclassShortName})` : '';
  const race = C.speciesName || '';
  const bg = C.bgName || '';
  const Icon = classIcon(C.className);

  let clsDisplay;
  if (extra.length) {
    const parts = [`${C.className || '—'}${sc} ${pLv}`];
    extra.forEach(ec => {
      const s = ec.subclassShortName ? ` (${ec.subclassShortName})` : '';
      parts.push(`${ec.name}${s} ${ec.level || 1}`);
    });
    clsDisplay = parts.join(' / ') + ` [Lv.${C.level}]`;
  } else {
    clsDisplay = (C.className || '—') + sc + ' Lv.' + C.level;
  }

  const currentLevel = getLevelFromXp(sheet.xpStored);
  const currentXp = sheet.xpStored;
  const nextXp = getXpForNextLevel(currentLevel + 1);
  const prevXp = getXpForNextLevel(currentLevel);
  const xpInLevel = nextXp - prevXp;
  const xpProgress = xpInLevel > 0 ? ((currentXp - prevXp) / xpInLevel) * 100 : 0;

  return (
    <Box sx={{
      bgcolor: 'background.paper', borderBottom: 2, borderColor: 'divider',
    }}>
      <Box sx={{ maxWidth: 1280, mx: { md: 'auto' }, px: { xs: '0.6rem', md: '1.1rem' } }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: { xs: '0.4rem', md: '1rem' },
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { md: 'space-between' },
        py: { xs: '0.35rem', md: '0.6rem' },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: { xs: '100%', md: 'auto' } }}>
          <Box
            onClick={(e) => setColorAnchor(e.currentTarget)}
            sx={{
              width: { xs: 36, md: 52 }, height: { xs: 36, md: 52 },
              borderRadius: '50%', border: 2, borderColor: 'divider', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              bgcolor: C.classIconColor || 'rgba(46,42,34,1)', fontSize: { xs: '1rem', md: '1.4rem' },
              transition: 'border-color 0.15s',
              '&:hover': { borderColor: '#caa550' },
            }}
          >
            <Icon size={25} />
          </Box>
          <IconColorPicker
            anchorEl={colorAnchor}
            onClose={() => setColorAnchor(null)}
            currentColor={C.classIconColor}
            onSelect={(color) => onUpdateCharacter?.(prev => ({ ...prev, classIconColor: color }))}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: { xs: '0.85rem', md: '1.1rem' }, fontWeight: 700, color: '#edd48a', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {C.name || 'Unnamed Character'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {[race, clsDisplay, bg].filter(Boolean).join(' · ')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, width: { xs: '100%', md: 'auto' }, minWidth: { md: 120 }, alignItems: 'center' }}>
          <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(46,42,34,1)', borderRadius: 1, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', bgcolor: 'primary.main', borderRadius: 1, transition: 'width 0.4s', width: `${Math.min(100, xpProgress)}%` }} />
          </Box>
          <TextField
            size="small" type="number" value={sheet.xpStored}
            onChange={e => onUpdateXp(e.target.value)}
            sx={{ width: { xs: '100%', md: 100 }, '& input': { textAlign: 'center', fontSize: '0.75rem', py: 0.5, color: '#edd48a', fontFamily: '"Cinzel", Georgia, serif', fontWeight: 600 } }}
            slotProps={{ input: { sx: { '& fieldset': { borderColor: 'transparent', borderBottom: '1px solid', borderBottomColor: 'primary.main' } } } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Button size="small" variant="outlined" color="warning" startIcon={<Sun size={14} />}
            onClick={onShortRest} sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', letterSpacing: '0.08em' }}>
            SHORT REST
          </Button>
          <Button size="small" variant="outlined" color="info" startIcon={<Moon size={14} />}
            onClick={onLongRest} sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', letterSpacing: '0.08em' }}>
            LONG REST
          </Button>
          <Button size="small" variant="outlined" color="primary" startIcon={<ArrowLeft size={14} />}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              const charId = params.get('char') || localStorage.getItem('gb_active_char_id') || 'new';
              navigate(`/charbuilder?char=${encodeURIComponent(charId)}`);
            }}
            sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', letterSpacing: '0.08em' }}>
            Builder
          </Button>
          <Button size="small" variant="outlined" color="secondary" startIcon={<Download size={14} />}
            onClick={onDownload} sx={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '0.625rem', letterSpacing: '0.08em' }}>
            DOWNLOAD
          </Button>
      </Box>
      </Box>
      </Box>
    </Box>
  );
}
