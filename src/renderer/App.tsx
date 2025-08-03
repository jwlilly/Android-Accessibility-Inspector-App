import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './index.scss';
import { Theme } from 'react-daisyui';
import { useState } from 'react';
import MainView from './views/main-view';
import '@fontsource/roboto';
import '@fontsource/roboto-mono';
import '@fontsource/roboto-serif';

function Main() {
  return (
    <Theme>
      <Helmet htmlAttributes={{ lang: 'en' }} />
      <MainView />
    </Theme>
  );
}

export default function App() {
  const [speechMessage, setSpeechMessages] = useState<
    { time: string; type: string; message: string; id: number }[]
  >([]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
