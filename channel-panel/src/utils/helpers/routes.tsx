import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import StorageService from '../services/store';
import Layout from '../../components/layout';
import LoginPage from '../../pages/auth/login';
import CategoriesPage from '../../pages/categories';
import VideoListing from '../../pages/videos/listing';
import VideoUpload from '../../pages/videos/upload';
import FollowersPage from '../../pages/followers';
import Dashboard from '../../pages/dashboard';
import LiveStream from '../../pages/videos/live';

const Routes: React.FC = props => {

    const checkAuth = () => {
        let user = StorageService.getItem('currentUser');
        let token = StorageService.getItem('token');
        let channel = StorageService.getItem('channel');
        if(user && token && channel) return true;
        return false;
    }
    
    let el = useRoutes([
        {
            path: '',
            element: checkAuth() ? <><Layout/></> : <Navigate to="/login" />,
            children: [
                { path: 'categories', element: <CategoriesPage /> },
                { path: '/videos', element: <VideoListing />},
                { path: '/videos/upload', element: <VideoUpload />},
                { path: '/followers', element: <FollowersPage />},
                { path: '/live-stream', element: <LiveStream /> },
                { path: '/', element: <Dashboard />}
            ]
        },
        {
            path: 'login',
            element: <LoginPage />
        }
    ]);

    return el;
}

export default Routes;