import { NavLink } from 'react-router-dom';

function NavBar({ isDarkMode, setIsDarkMode }) {
  return (
    <nav>
      <span className="nav-brand">DevPortfolio</span>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/projects">Projects</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
      <button className="toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? 'Light' : 'Dark'}
      </button>
    </nav>
  );
}

export default NavBar;
