import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import CodeInputPage from './pages/CodeInputPage';
import AnalysisResults from './pages/AnalysisResults';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="editor" element={<CodeInputPage />} />
          <Route path="results" element={<AnalysisResults />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
