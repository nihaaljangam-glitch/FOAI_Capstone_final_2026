import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InputPlaygroundPage from './pages/InputPlaygroundPage';
import ComparisonViewPage from './pages/ComparisonViewPage';
import ValidationWorkbenchPage from './pages/ValidationWorkbenchPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';

export default function App() {
  // Enforcing dark mode for Aetheric design
  document.documentElement.classList.add('dark');

  return (
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
  );
}
