import * as React from 'react';
import SideNav from './SideNav';
import TopBar from './TopBar';
import { useCtx } from '../../utils/context';
import StorageService from '../../utils/services/store';
import PreLoader from './components/Preloader';
import SnackBar from './components/SnackBar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = (props) => {

    const ctx = useCtx();

    React.useEffect(() => {
        if(!ctx.loggedIn){
            let user = StorageService.getItem('currentUser');
            let token = StorageService.getItem('token');
            if(!user || !token){
                ctx.setCurrentUser(null);
                ctx.setLoggedIn(false);
                ctx.setToken('');
                return;
            }
            //@ts-ignore
            ctx.setToken(token);
            ctx.setLoggedIn(true);
            ctx.setCurrentUser(user);
        }
    }, [])
    
    return (
        <div className="app-wrapper">
            
            <TopBar />

            <div className="inner">
                <SideNav />
                    <div className="page-wrapper">
                        {props.children}
                        <Outlet />
                        <PreLoader />
                        <SnackBar />
                    </div>
            </div>

        </div>
    );
}

export default Layout;