import { Navigate, Outlet, Routes, Route } from 'react-router-dom';
import StorageService from '../services/store';
import Layout from '../../components/layout';
import React, { useEffect } from 'react';
import LoginPage from '../../pages/auth/login';
import CategoriesPage from '../../pages/categories';

const routes = (isLoggedIn?: any) => {

    const checkAuth = () => {
        let user = StorageService.getItem('currentUser');
        let token = StorageService.getItem('token');
        console.log('check auth')
        if(user && token) return true;
        return false;
    }
    return [
        {
            path: '/',
            element: checkAuth() ? <Layout /> : <Navigate to="/login" />,
            children: [
                { path: 'categories', element: <CategoriesPage /> },
            ]
        },
        {
            path: 'login',
            element: <LoginPage />
        }
    ];
}

export default routes;