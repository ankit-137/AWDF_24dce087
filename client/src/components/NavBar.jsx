import { NavLink } from 'react-router-dom';

function NavBar({ isDarkMode, setIsDarkMode, user, onLogout }) {
  return (
    <nav>
      <span className="nav-brand">DevPortfolio</span>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/projects">Projects</NavLink></li>
        <li><NavLink to="/tasks">Tasks</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn-logout" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className="btn-login-link">Login</NavLink>
        )}
        <button className="toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
