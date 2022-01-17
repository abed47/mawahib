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
    hidePreloader: () => void
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
    hidePreloader: () => null
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

    const showPreloader = () => {
        setPreloaderActive(true);
    }

    const hidePreloader = () => {
        setPreloaderActive(false);
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
            hidePreloader
            }}>
            {props.children}
        </MainContext.Provider>
    );
}

export default MainContextProvider;