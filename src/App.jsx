import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InputPlaygroundPage from './pages/InputPlaygroundPage';
import ComparisonViewPage from './pages/ComparisonViewPage';
import ValidationWorkbenchPage from './pages/ValidationWorkbenchPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Enforcing dark mode for Aetheric design
  document.documentElement.classList.add('dark');

  return (
    <div className="relative min-h-screen bg-aetheric-bg overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-out",
        }}
        className="relative z-10 min-h-screen"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<Layout />}>
              <Route path="/playground" element={<InputPlaygroundPage />} />
              <Route path="/comparison" element={<ComparisonViewPage />} />
              <Route path="/workbench" element={<ValidationWorkbenchPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="*" element={<Navigate to="/playground" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
