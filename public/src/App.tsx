import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import RoutesPage from './pages/RoutesPage';

import EmergencyButton from './components/emergency/EmergencyButton';

/**
 * NotFound component - displays 404 error page
 * @component
 * @returns {JSX.Element} 404 error message
 */
const NotFound = () => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold text-red-600">404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

/**
 * App - Main root component that sets up routing
 * @component
 * @returns {JSX.Element} Router with all app routes
 * @remarks
 * Routes configured:
 * - / → Home page
 * - /routes → Route search page
 * - /* → 404 Not Found page
 * Also renders EmergencyButton globally on all pages.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <EmergencyButton />
    </BrowserRouter>
  );
}

export default App;
