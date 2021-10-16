import React, {createContext, useState, useCallback} from 'react';

export const LayoutContext = createContext({
    msg: "",
    showSnack: () => {},
    hideSnack: () => {},
    snackOpen: false,
    snackType: "",
    preLoaderActive: false,
    showPreLoader: () => {},
    hidePreLoader: () => {},
});

const LayoutUtilsProvider = ({children}) => {

    const [msg, setMsg] = useState("");
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("");
    const [preloaderOpen, setPreloaderOpen] = useState(false);

    const showPreLoader = () => {
        setPreloaderOpen(true);
    }

    const hidePreLoader = () => {
        setPreloaderOpen(false);
    }

    const addSnackMessage = (msg, type) => {
        setOpen(true);
        setMsg(msg);
        setType(type);
    }

    const hideSnack = () => {
        setOpen(false);
        setMsg("");
        setType("");
    }

    const contextValue = {
        msg,
        showSnack: useCallback((message,type) => addSnackMessage(message, type)),
        hideSnack: useCallback(() => {hideSnack()}),
        snackOpen: open,
        snackType: type,
        showPreLoader: useCallback(() => {showPreLoader()}),
        hidePreLoader: useCallback(() => {hidePreLoader()}),
        preLoaderActive: preloaderOpen
    }

    return (
        <LayoutContext.Provider value={contextValue}>
            {children}
        </LayoutContext.Provider>
    )
}

export default LayoutUtilsProvider;