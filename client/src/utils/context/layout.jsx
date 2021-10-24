import { createContext, useEffect, useState } from "react";
import StoreService from '../services/store';

export const LayoutContext = createContext({
    preloaderActive: null,
    showPreLoader: () => {},
    hidPreLoader: () => {},
    snackBarOptions: null,
    snackBarOpen: null,

    /**
     * 
     * @param {string} msg message to show
     * @param {string} type snackbar theme (success - warn - info - error)
     */
    showSnackBar: (msg, type) => {},
    hideSnackBar: () => {}
});

const LayoutProvider = props => {

    
    const [snackBarOpen, setSnackbarOpen] = useState(false);
    const [snackBarOptions, setSnackbarOptions] = useState({});
    const [preloaderActive, setPreloaderActive] = useState(false);

    const showPreLoader = () => {
        setPreloaderActive(true);
    }

    const hidPreLoader = () => {
        setPreloaderActive(false);
    }

    /**
     * 
     * @param {string} msg message to show
     * @param {string} type snackbar theme (success - warn - info - error)
     */
    const showSnackBar = (msg, type) => {
        setSnackbarOptions({message: msg, type: type});
        setSnackbarOpen(true);
    }

    const hideSnackBar = () => {
        setSnackbarOpen(false)
    }

    let val = {
        preloaderActive,
        showPreLoader,
        hidPreLoader,
        snackBarOptions,
        snackBarOpen,
        showSnackBar,
        hideSnackBar
    }

    return <LayoutContext.Provider value={val}>{props.children}</LayoutContext.Provider>
}

export default LayoutProvider;