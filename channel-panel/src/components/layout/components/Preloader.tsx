import { CircularProgress } from "@mui/material";
import { useCtx } from "../../../utils/context";

const PreLoader: React.FC = props => {

    const ctx = useCtx();

    return (
        <div className={`preloader ${ctx.preloaderActive ? 'active' : ''}`}>
            <CircularProgress />
        </div>
    );
}

export default PreLoader;