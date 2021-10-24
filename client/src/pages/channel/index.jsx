import { Route } from "react-router-dom";
import ChannelProfile from "./components/main";
import UploadVideoScreen from "./components/video-upload";

const UserChannel = (props) => {
    return (
        <>
            <Route path="/channel" exact={true} component={ChannelProfile} />
            <Route path="/channel/upload" exact={true} component={UploadVideoScreen} />
        </>
    );
}

export default UserChannel;