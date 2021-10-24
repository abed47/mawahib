import { createContext, useEffect, useState } from "react";
import StoreService from '../services/store';
export const AuthContext = createContext({
    hasChannel: false,
    setChannel: () => {},
    channel: null,
    setHasChannel: () => {},
    loggedIn: false,
    setLoggedIn: () => {},
    user: null,
    setUser: () => {}
});

const AuthProvider = props => {

    
    const [hasChannel, setHasChannel] = useState(false);
    const [channel, setChannel] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    
    useEffect(() => {

        if(StoreService.get('currentUser') && !loggedIn){
            setLoggedIn(true);
            setUser(StoreService.get('currentUser'));

            if(StoreService.get('currentUser').channel){
                setHasChannel(true);
                setChannel(StoreService.get('currentUser').channel);
            }
        }

    }, [loggedIn])

    let val = {
        hasChannel,
        setChannel,
        channel,
        setHasChannel,
        loggedIn,
        setLoggedIn,
        user,
        setUser
    }

    return <AuthContext.Provider value={val}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;