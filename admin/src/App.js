import Layout from './components/layout';
import { Switch, Route, HashRouter} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import LoginPage from './pages/auth';
import ProtectedRoute from './utils/components/ProtectedRoutes';
import ForbiddenPage from './pages/auth/403';
import Categories from './pages/Categories';

function App() {

  return (
      <HashRouter>
            <Switch>
            <Route path='/login' exact component={LoginPage} />
            <Route path='/403' exact component={ForbiddenPage} />
            
            <Layout  >
                    
              <ProtectedRoute path="/" exact={true} component={Dashboard} />
              <ProtectedRoute path="/categories" exact={true} component={Categories} />

            </Layout>

             
            </Switch>
      </HashRouter>
  );
}

export default App;
