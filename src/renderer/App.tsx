import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Theme } from 'react-daisyui';
import { BasicTreeView, testData } from './views/basic-tree-view';
import ConnectDevice from './views/connect-device';

function Main() {
  return (
    <Theme dataTheme="cupcake">
      <ConnectDevice />
      <BasicTreeView tree={testData} />
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
