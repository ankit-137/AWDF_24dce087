import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="notfound">
      <div className="code">404</div>
      <h2>Page Not Found</h2>
      <p>The path you are looking for does not exist.</p>
      <Link to="/" className="btn-home">← Return Home</Link>
    </div>
  );
}

export default NotFound;
