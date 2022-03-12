import AuthApis from './auth';
import CategoryApis from './category';
import ChannelApis from './channel';
import eventsApis from './events';
import PlaylistApis from './playlist';
import UtilsApis from './utils';
import VideoApis from './video';
import UserPlaceholder from '../../../assets/images/user-placeholder.png';
import VideoPlaceholder from '../../../assets/images/video-placeholder.png';
import Logo from '../../../assets/images/logo.png';

const host = 'http://192.168.222.45:4000/api/';

export const AuthRequests = AuthApis(host);
export const ChannelRequests = ChannelApis(host);
export const UtilsRequests = UtilsApis(host);
export const CategoryRequests = CategoryApis(host);
export const PlaylistRequests = PlaylistApis(host);
export const VideoRequests = VideoApis(host);
export const EventRequests = eventsApis(host);

export const handlePhotoUrl = (u: string | null | undefined, placeholder_type?: "user" | "video" | "logo") => {
    if(u?.length && u.includes('http')) return u;
    if(u?.length && (u.includes('\\uploads') || u.includes('/uploads'))) return host + 'v1' + u;
    if(u?.length) return host + 'v1/uploads/' + u;
    if(placeholder_type === "user") return UserPlaceholder;
    if(placeholder_type === "video") return VideoPlaceholder;
    if(placeholder_type === "logo") return Logo;
    return 'null';
}