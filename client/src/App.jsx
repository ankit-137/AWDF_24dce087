import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

// ── Route-based code splitting ────────────────────────────────────────────────
// BEFORE: All pages were bundled into a single main.bundle.js and loaded
//         upfront on every page visit, even if the user never navigated there.
//
// AFTER:  Each page is a separate chunk loaded only on first visit to that route.
//         main.bundle.js   → loads on first visit (NavBar, Footer, Spinner, etc.)
//         Home.chunk.js    → loaded only when "/" is visited
//         Projects.chunk.js→ loaded only when "/projects" is visited
//         Tasks.chunk.js   → loaded only when "/tasks" is visited
//         Login.chunk.js   → loaded only when "/login" is visited
//         Register.chunk.js→ loaded only when "/register" is visited
//         Contact.chunk.js → loaded only when "/contact" is visited
//         NotFound.chunk.js→ loaded only when an unknown route is visited
// ─────────────────────────────────────────────────────────────────────────────
const Home     = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Tasks    = lazy(() => import('./pages/Tasks'));
const Login    = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Contact  = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ── Auth state: check localStorage on initial load ────────────
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <NavBar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        user={user}
        onLogout={handleLogout}
      />
      <main>
        {/* Suspense catches lazy-loaded route chunks while they fetch from the server.
            The Spinner is shown until the chunk JS file has loaded and React can render the page. */}
        <Suspense fallback={<Spinner message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route
              path="/tasks"
              element={user ? <Tasks /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/tasks" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/tasks" replace /> : <Register onLogin={handleLogin} />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
