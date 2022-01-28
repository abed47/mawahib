import * as React from 'react';
import SideNav from './SideNav';
import TopBar from './TopBar';
import RightPanel from './RightPanel';
import { useCtx } from '../../utils/context';
import StorageService from '../../utils/services/store';
import PreLoader from './components/Preloader';
import SnackBar from './components/SnackBar';

const Layout: React.FC = (props) => {

    const ctx = useCtx();

    React.useEffect(() => {
        if(!ctx.loggedIn){
            let user: any = StorageService.getItem('currentUser');
            let token: any = StorageService.getItem('token');
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
            ctx.setUserChannel(user?.channel || null);
        }
    }, [])
    
    return (
        <div className="app-wrapper">
            
            <TopBar />

            <div className="inner">
                <SideNav />
                    <div className="page-wrapper">
                        {props.children}
                        <PreLoader />
                        <SnackBar />
                    </div>
                <RightPanel />
            </div>

        </div>
    );
}

export default Layout;