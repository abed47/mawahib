import React, { Suspense } from 'react';
import './assets/styles/styles.scss'
import {  Route, Routes } from 'react-router-dom';
import MainContextProvider from './utils/context';
import { Lines,  } from 'react-preloaders2';
import DiscoverPage from './pages/discover';
import CategoriesPage from './pages/categories';
import LoginPage from './pages/auth/login';
import SignUpPage from './pages/auth/signup';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import CreateChannel from './pages/channel/create';
import WalletPage from './pages/wallet';
import CheckoutPage from './pages/wallet/checkout';
import TransactionsPage from './pages/wallet/Transactions-Page';
import CategoryListing from './pages/categories/category';

const AccountSettings = React.lazy(() => import('./pages/user/AccountSettings'));
const ChannelViewPage = React.lazy(() => import('./pages/channel/channel'));
const EventsHome = React.lazy(() => import('./pages/events'));
const WatchScreen = React.lazy(() => import('./pages/videos/watch'));
const Layout = React.lazy(() => import('./components/layout'));
const EventPage  = React.lazy(() => import('./pages/events/event'));
const ChannelListing = React.lazy(() => import('./pages/channel/listing'));

function App() {

  return (
    <div className="App">
      <Lines />
      <Suspense fallback={<div>loading ...</div>}>
        <MainContextProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:id" element={<CategoryListing />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/linkedin" element={<LinkedInCallback />} />
              <Route path="/create/channel" element={<CreateChannel />} />
              <Route path="/watch/:id" element={<WatchScreen />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/checkout/:id" element={<CheckoutPage />} />
              <Route path="/transaction-history" element={<TransactionsPage />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/channel/:id" element={<ChannelViewPage />} />
              <Route path="/events" element={<EventsHome />} />
              <Route path="/event/:id" element={<EventPage />} />
              <Route path="/channels" element={<ChannelListing />} />
            </Routes>
          </Layout>
        </MainContextProvider>
      </Suspense>
    </div>
  );
}

export default App;
