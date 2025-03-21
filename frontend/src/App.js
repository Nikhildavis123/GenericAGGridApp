import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataGridComponent from './components/DataGridComponent';
import DetailsPage from './components/DetailsPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<DataGridComponent />} />
      <Route path="/details/:id" element={<DetailsPage />} />
    </Routes>
  </Router>
);

export default App;