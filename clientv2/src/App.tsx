import React from 'react';
import './assets/styles/styles.scss'
import {  Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import MainContextProvider from './utils/context';

import DiscoverPage from './pages/discover';
import CategoriesPage from './pages/categories';
import LoginPage from './pages/auth/login';
import SignUpPage from './pages/auth/signup';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';


function App() {
  return (
    <div className="App">
      <MainContextProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/linkedin" element={<LinkedInCallback />} />
          </Routes>
        </Layout>
      </MainContextProvider>
    </div>
  );
}

export default App;
