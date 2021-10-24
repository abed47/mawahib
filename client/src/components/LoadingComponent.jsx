import { CircularProgress } from "@mui/material";

const LoadingComponent = (props) => {
    return (
        <div className={`loading-wrapper ${props.shown ? 'active' : ''}`}>
            <CircularProgress />
        </div>
    );
}

export default LoadingComponent;