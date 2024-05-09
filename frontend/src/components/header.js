import { useNavigate } from 'react-router-dom';
import Logo from '../images/genericLogo.png';
import Settings from '../images/settings.png';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  
  return (
    <div className="header">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="app-title">Sportscar Spotter</span>
        </div>
        <button className="settings-btn" onClick={() => {navigate("/settings")}}>
          <img src={Settings} alt="Settings" className="settings" />
        </button>
    </div>
  );
}