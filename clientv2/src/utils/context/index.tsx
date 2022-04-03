import React, { useState, useContext, createContext, useEffect } from 'react';
import StorageService from '../services/store';

export interface MainContextInterface {
    currentUser: Object | any,
    setCurrentUser: (user: any) => void,
    token: string,
    setToken: (t: string) => void,
    loggedIn: boolean,
    setLoggedIn: (v: boolean) => void,
    preloaderActive: boolean,
    showPreloader: () => void,
    hidePreloader: () => void,
    showSnackbar: (message: string, type: string) => void,
    hideSnackbar: () => void,
    snackbarOpen: boolean,
    snackbarType: string,
    snackbarMessage: string,
    userChannel: Object | any,
    setUserChannel: (c: any) => void,
    pinnedCategories: any[],
    setPinnedCategories: (t: any[]) => void,
    sideNavOpen: boolean,
    setSideNavOpen: (v: boolean) => void
}

export const mainContextDefaults: MainContextInterface = {
    currentUser: null,
    setCurrentUser: () => null,
    token: '',
    setToken: () => null,
    loggedIn: false,
    setLoggedIn: () => null,
    preloaderActive: false,
    showPreloader: () => null,
    hidePreloader: () => null,
    showSnackbar: () => null,
    hideSnackbar: () => null,
    snackbarOpen: false,
    snackbarType: 'info',
    snackbarMessage: '',
    userChannel: null,
    setUserChannel: () => null,
    pinnedCategories: [],
    setPinnedCategories: () => null,
    sideNavOpen: false,
    setSideNavOpen: () => null
}

const MainContext:any = createContext(mainContextDefaults);

export const useCtx: () => MainContextInterface = () => {
    return useContext(MainContext)
}

const MainContextProvider: React.FC = props => {

    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loggedIn, setLoggedIn] = useState(null);
    const [preloaderActive, setPreloaderActive] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('info');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [userChannel, setUserChannel] = useState(null);
    const [pinnedCategories, setPinnedCategories] = useState([]);
    const [sideNavOpen, setSideNavOpen] = useState(false);

    useEffect(() => {
        initContext();
    }, []);

    const initContext = () => {
        if(!currentUser || !token || !userChannel){
            let u: any = StorageService.getItem('currentUser');
            let c = u?.channel || StorageService.getItem('channel');
            let t: any = StorageService.getItem('token');
            setUserChannel(c);
            setCurrentUser(u);
            setToken(t);
        }
    }

    const showPreloader = () => {
        setPreloaderActive(true);
    }

    const hidePreloader = () => {
        setPreloaderActive(false);
    }

    const showSnackbar = (message: string, type: string) => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarOpen(true);
    }

    const hideSnackbar = () => {
        setSnackbarOpen(false);
    }

    return (
        <MainContext.Provider value={{
            currentUser, 
            setCurrentUser, 
            token, 
            setToken, 
            loggedIn, 
            setLoggedIn,
            preloaderActive,
            showPreloader,
            hidePreloader,
            showSnackbar,
            snackbarOpen,
            hideSnackbar,
            snackbarMessage,
            snackbarType,
            userChannel,
            setUserChannel,
            pinnedCategories,
            setPinnedCategories,
            sideNavOpen,
            setSideNavOpen
            }}>
            {props.children}
        </MainContext.Provider>
    );
}

export default MainContextProvider;