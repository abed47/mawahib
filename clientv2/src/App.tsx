import React from 'react';
import './assets/styles/styles.scss'
import {  Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import MainContextProvider from './utils/context';
import { Lines } from 'react-preloaders2';
import DiscoverPage from './pages/discover';
import CategoriesPage from './pages/categories';
import LoginPage from './pages/auth/login';
import SignUpPage from './pages/auth/signup';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import CreateChannel from './pages/channel/create';
import WatchScreen from './pages/videos/watch';
import WalletPage from './pages/wallet';

function App() {
  return (
    <div className="App">
      <Lines />
      <MainContextProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/linkedin" element={<LinkedInCallback />} />
            <Route path="/create/channel" element={<CreateChannel />} />
            <Route path="/watch/:id" element={<WatchScreen />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Routes>
        </Layout>
      </MainContextProvider>
    </div>
  );
}

export default App;
