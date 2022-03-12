import AuthApis from './auth';
import ChannelApis from './channel';
import UtilsApis from './utils';
import VideoApis from './Video';
import PurchasesApis from './purchases';
import UserApis from './user';
import CategoryApis from './category';
import eventsApis from './events';
import UserPlaceholder from '../../../assets/images/user-placeholder.png';
import VideoPlaceholder from '../../../assets/images/video-placeholder.png';
import Logo from '../../../assets/images/logo.png';

//DEPLOY: change to server url
const host = 'http://192.168.222.45:4000/api/';
export const getChannelPanelUrl = () => 'http://192.168.222.45:4001';

export const AuthRequests = AuthApis(host);
export const ChannelRequests = ChannelApis(host);
export const UtilsRequests = UtilsApis(host);
export const VideoRequests = VideoApis(host);
export const PurchasesRequests = PurchasesApis(host);
export const UserRequests = UserApis(host);
export const CategoryRequests = CategoryApis(host);
export const EventRequests = eventsApis(host);


export const getVideoThumb = (u: string) => {
    return host + 'v1/uploads/' + u;
}

export const getServerPhoto = (u: string) => {
    return host + 'v1' + u;
}

export const handlePhotoUrl = (u: string | null | undefined, placeholder_type?: "user" | "video" | "logo") => {
    if(u?.length && u.includes('http')) return u;
    if(u?.length && (u.includes('\\uploads') || u.includes('/uploads'))) return host + 'v1' + u;
    if(u?.length) return host + 'v1/uploads/' + u;
    if(placeholder_type === "user") return UserPlaceholder;
    if(placeholder_type === "video") return VideoPlaceholder;
    if(placeholder_type === "logo") return Logo;
    return 'null';
}