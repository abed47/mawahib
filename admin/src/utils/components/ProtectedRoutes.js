import {Route, Redirect} from 'react-router-dom';
import {sidenav} from '../config/menus';
const ProtectedRoute = ({component: Component, ...rest}) => {

    const handleRoles = (path) => {
        return true;
        let currentPath = undefined;
        for(let i = 0; i < sidenav.length; i++){
            if(path.includes(sidenav[i].path)){
                currentPath = sidenav[i];
                // break;
            }
        }
        if(!currentPath) return false;
        let currentUserType = localStorage.getItem('userType');
        if(!currentUserType || !+currentUserType) return false;
        return (currentPath.permissions[+currentUserType - 1]);
    }

    return (
        <Route {...rest} render={ props => { 
            if(localStorage.getItem('loggedIn') === "true"){
                if(handleRoles(props.location.pathname))return <Component {...props} />
                if(!handleRoles(props.location.pathname))return <Redirect to={{
                    pathname: "/403",
                    state: {
                        from: props.location
                    }
                }} />
            }

            return <Redirect to={{
                pathname: "/login",
                state: {
                    from: props.location
                }
            }} />
        }} />
    )
}

export default ProtectedRoute;