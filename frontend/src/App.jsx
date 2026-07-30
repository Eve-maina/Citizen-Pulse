import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { Layout } from './components/Layout.jsx';
import { Home } from './pages/Home.jsx';
import { Submit } from './pages/Submit.jsx';
import { Confirmation } from './pages/Confirmation.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Feed } from './pages/Feed.jsx';
import './theme.css';

function App() {
  return (
    <LanguageProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit/:topic" element={<Submit />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </LanguageProvider>
  );
}

export default App;
