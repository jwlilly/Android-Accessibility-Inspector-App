import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './index.scss';
import { Theme } from 'react-daisyui';
import MainView from './views/main-view';

function Main() {
  return (
    <Theme dataTheme="light">
      <MainView />
    </Theme>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
