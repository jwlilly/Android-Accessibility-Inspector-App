import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { BasicTreeView, testData } from './views/basic-tree-view';

function Main() {
  return (
    <div>
      <BasicTreeView tree={testData} />
    </div>
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
