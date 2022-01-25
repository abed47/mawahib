import AuthApis from './auth';
import ChannelApis from './channel';
import UtilsApis from './utils';

const host = 'http://localhost:4000/api/';

export const AuthRequests = AuthApis(host);
export const ChannelRequests = ChannelApis(host);
export const UtilsRequests = UtilsApis(host);