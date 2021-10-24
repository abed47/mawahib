import HomeIcon from '@mui/icons-material/Home';
import TopSongsIcon from '@mui/icons-material/LibraryMusic';
import CategoryIcon from '@mui/icons-material/AutoAwesomeMosaic';
import ChannelIcon from '@mui/icons-material/Album';
export const sideNavMenu = [
    {
        type: 1,
        name: 'home',
        title: 'Home',
        path: '/',
        icon: HomeIcon
    },
    {
        type: 1,
        name: 'top-songs',
        title: 'Top Songs',
        path: '/top-songs',
        icon: TopSongsIcon
    },
    {
        type: 1,
        name: 'categories-icon',
        title: 'Categories',
        path: '/categories',
        icon: CategoryIcon
    },
    {
        type: 1,
        name: 'channels',
        title: 'Channels',
        path: '/channels',
        icon: ChannelIcon
    }
]