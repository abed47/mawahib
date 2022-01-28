import React, { useEffect, useState } from 'react';
import './assets/styles/styles.scss'
import {  Route, Routes, useRoutes } from 'react-router-dom';
import Layout from './components/layout';
import MainContextProvider from './utils/context';

import DiscoverPage from './pages/discover';
import CategoriesPage from './pages/categories';
import LoginPage from './pages/auth/login';
import SignUpPage from './pages/auth/signup';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import CreateChannel from './pages/channel/create';
import routes from './utils/helpers/routes';
import StorageService from './utils/services/store';


function App() {

  const [ isLoggedIn, setIsLoggedIn ] = useState(true);

  useEffect(() => {
    checkAuth()
  }, []);

  const checkAuth = () => {
    let user = StorageService.getItem('currentUser');
    let token = StorageService.getItem('token');
    if(user && token) return setIsLoggedIn(true);
    else return setIsLoggedIn(false);
  }
  
  const routing = useRoutes(routes());

  return (
    <div className="App">
      <MainContextProvider>
        {routing}
        {/* <Layout>
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/linkedin" element={<LinkedInCallback />} />
            <Route path="/create/channel" element={<CreateChannel />} />
          </Routes>
        </Layout> */}
      </MainContextProvider>
    </div>
  );
}

export default App;
