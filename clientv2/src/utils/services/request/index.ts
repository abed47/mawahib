import AuthApis from './auth';
import ChannelApis from './channel';
import UtilsApis from './utils';
import VideoApis from './Video';
import PurchasesApis from './purchases';
import UserApis from './user';
import CategoryApis from './category';

//DEPLOY: change to server url
const host = 'http://localhost:4000/api/';

export const AuthRequests = AuthApis(host);
export const ChannelRequests = ChannelApis(host);
export const UtilsRequests = UtilsApis(host);
export const VideoRequests = VideoApis(host);
export const PurchasesRequests = PurchasesApis(host);
export const UserRequests = UserApis(host);
export const CategoryRequests = CategoryApis(host);

export const getVideoThumb = (u: string) => {
    return host + 'v1/uploads/' + u;
}

export const getServerPhoto = (u: string) => {
    return host + 'v1' + u;
}