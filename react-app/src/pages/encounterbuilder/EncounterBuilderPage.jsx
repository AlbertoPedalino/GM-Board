import { useLocation } from 'react-router-dom';
import StandaloneHtmlFrame from '../../components/StandaloneHtmlFrame.jsx';

export default function EncounterBuilderPage() {
  const location = useLocation();
  const src = `${import.meta.env.BASE_URL}tools/encounter-builder.html${location.search}`;
  return <StandaloneHtmlFrame title="Encounter Builder" src={src} />;
}
