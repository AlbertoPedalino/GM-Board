import { useEffect, useState } from 'react';
import CharBuilder from './pages/charbuilder/CharBuilder.jsx';
import CharacterSheet from './pages/charsheet/CharacterSheet.jsx';

export default function App() {
  const [page, setPage] = useState('builder');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sheet') === '1') setPage('sheet');
  }, []);

  if (page === 'sheet') return <CharacterSheet />;
  return <CharBuilder />;
}
