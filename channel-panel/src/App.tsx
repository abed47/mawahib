import React, { useEffect, useState } from 'react';
import './assets/styles/styles.scss'
import MainContextProvider from './utils/context';
import Routes from './utils/helpers/routes';
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
  

  return (
    <div className="App">
      <MainContextProvider>
        <Routes />
      </MainContextProvider>
    </div>
  );
}

export default App;
