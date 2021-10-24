import Layout from './components/layout';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import { Suspense, lazy} from 'react';
import MainContextProvider from './utils/context';

//pages
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/signup';
import HomePage from './pages/home';
import UserProfilePage from './pages/user-profile';
import UserChannel from './pages/channel';
import WatchPage from './pages/watch';
import CategoryPage from './pages/categories';
const  App = () => {

  return (
    <div className="app-container">
      <MainContextProvider>
        <Router>
          <Switch>
            <Route  path="/login" exact={true} component={LoginPage} />
            <Route  path="/register" exact={true} component={RegisterPage} />

            
            <Layout>
              <Route path="/" exact={true} component={HomePage}/>
              <Route path="/home" exact={true} component={HomePage}/>
              <Route path="/user-profile" component={UserProfilePage} />
              <Route path="/channel" component={UserChannel} />
              <Route path="/watch/:id" component={WatchPage} />

              <Route path="/categories">
                <CategoryPage />
              </Route>
            </Layout>

          </Switch>
        </Router>
      </MainContextProvider>
    </div>
  );
}

export default App;
