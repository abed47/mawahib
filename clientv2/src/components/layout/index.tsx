import * as React from 'react';
import SideNav from './SideNav';
import TopBar from './TopBar';
import RightPanel from './RightPanel';
const Layout: React.FC = (props) => {
    
    return (
        <div className="app-wrapper">
            
            <TopBar />

            <div className="inner">
                <SideNav />
                    <div className="page-wrapper">
                        {props.children}
                    </div>
                <RightPanel />
            </div>

        </div>
    );
}

export default Layout;