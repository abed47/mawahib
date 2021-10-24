import { Route, Switch } from "react-router-dom";
import CreateChannelPage from "./components/create-channel";
import MainComponent from './components/main';
import ProfileSettingComponent from './components/profile-setting';

const UserProfile = (props) => {

    return (
        <>
            <Route path="/user-profile/create-channel" exact={true} component={CreateChannelPage} />
            <Route path="/user-profile/settings" exact={true} component={ProfileSettingComponent} />
            <Route path="/user-profile" exact={true} component={MainComponent} />
        </>
    );
}

export default UserProfile;