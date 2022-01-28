import React, { useState, useContext, createContext } from 'react';

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
    channel: Object | any,
    setChannel: (channel: any) => void
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
    channel: null,
    setChannel: () => null
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
    const [channel, setChannel] = useState(null);

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
            setChannel,
            channel
            }}>
            {props.children}
        </MainContext.Provider>
    );
}

export default MainContextProvider;