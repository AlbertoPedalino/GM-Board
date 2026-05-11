import { useLocation } from 'react-router-dom';
import StandaloneHtmlFrame from '../../components/StandaloneHtmlFrame.jsx';

export default function GmBoardPage() {
  const location = useLocation();
  const src = `${import.meta.env.BASE_URL}tools/gmboard.html${location.search}`;
  return <StandaloneHtmlFrame title="GM Board" src={src} />;
}
