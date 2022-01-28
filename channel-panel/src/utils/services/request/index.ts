import AuthApis from './auth';
import CategoryApis from './category';
import ChannelApis from './channel';
import PlaylistApis from './playlist';
import UtilsApis from './utils';

const host = 'http://localhost:4000/api/';

export const AuthRequests = AuthApis(host);
export const ChannelRequests = ChannelApis(host);
export const UtilsRequests = UtilsApis(host);
export const CategoryRequests = CategoryApis(host);
export const PlaylistRequests = PlaylistApis(host);