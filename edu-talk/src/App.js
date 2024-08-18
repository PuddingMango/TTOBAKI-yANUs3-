import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Voca from './Pages/Voca';
import ExSituation from './Pages/ExSituation';
import Free from './Pages/Free';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voca" element={<Voca />} />
        <Route path="/Ex-Situation" element={<ExSituation />} />
        <Route path="/free" element={<Free />} />
      </Routes>
    </Router>
  );
}

export default App;
