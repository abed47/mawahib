import {useContext} from 'react';
import {CircularProgress} from '@material-ui/core';
import {LayoutContext} from '../../utils/context/LayoutContext'

const PreLoader = (props) => {

    const ctx = useContext(LayoutContext);

    return <div className={`pre-loader-wrapper ${ctx.preLoaderActive ? '' : 'd-none'}`}><CircularProgress /></div>
}

export default PreLoader;