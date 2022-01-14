import React from 'react';
import './assets/styles/styles.scss'
import {  Route, Routes } from 'react-router-dom';
import Layout from './components/layout';

import DiscoverPage from './pages/discover';
import CategoriesPage from './pages/categories';

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
