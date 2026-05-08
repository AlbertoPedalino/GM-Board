import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CharBuilder from './pages/charbuilder/CharBuilder.jsx';
import CharacterSheet from './pages/charsheet/CharacterSheet.jsx';

function RootRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return <Navigate to={params.get('sheet') === '1' ? '/sheet' : '/builder'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/builder" element={<CharBuilder />} />
      <Route path="/sheet" element={<CharacterSheet />} />
      <Route path="*" element={<Navigate to="/builder" replace />} />
    </Routes>
  );
}
