import { CircularProgress } from "@mui/material";
import { useContext } from "react";
import { LayoutContext } from "../../utils/context/layout";

const PagePreloader = () => {
    
    const layoutCtx = useContext(LayoutContext);

    return <div className={`_pages-preloader ${layoutCtx.preloaderActive ? 'active' : ''}`}>
        <CircularProgress color={'primary'} />
    </div>
}

export default PagePreloader;