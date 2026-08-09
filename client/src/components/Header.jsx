function Header({ name, themeColor }) {
  return (
    <header className="hero">
      <div className="hero-badge">Portfolio</div>
      <h1 style={{ color: themeColor }}>{name}</h1>
      <p>Welcome to my corner of the web — exploring code, creativity, and technology.</p>
    </header>
  );
}

export default Header;
