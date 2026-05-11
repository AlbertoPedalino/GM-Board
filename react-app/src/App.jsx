import { Navigate, Route, Routes } from 'react-router-dom';
import CharBuilder from './pages/charbuilder/CharBuilder.jsx';
import CharacterSheet from './pages/charsheet/CharacterSheet.jsx';
import GmBoardPage from './pages/gmboard/GmBoardPage.jsx';
import EncounterBuilderPage from './pages/encounterbuilder/EncounterBuilderPage.jsx';
import HomePage from './pages/home/HomePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/charbuilder" element={<CharBuilder />} />
      <Route path="/charsheet" element={<CharacterSheet />} />
      <Route path="/gmboard" element={<GmBoardPage />} />
      <Route path="/encounter-builder" element={<EncounterBuilderPage />} />
      <Route path="/builder" element={<Navigate to="/charbuilder" replace />} />
      <Route path="/sheet" element={<Navigate to="/charsheet" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
