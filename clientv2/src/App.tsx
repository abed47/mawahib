import React from 'react';
import './assets/styles/styles.scss'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Layout from './components/layout';

function App() {
  return (
    <div className="App">
      <Layout>
        <div className="page">page</div>
      </Layout>
    </div>
  );
}

export default App;
