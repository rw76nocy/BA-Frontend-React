import React from 'react';
import AuthService from '../services/auth.service';
import { Navigate } from 'react-router-dom';

export function RequireAuth({ children, navigateTo, isCreate, isInitial}) {
    let isAuthenticated = AuthService.getCurrentUser();
    //if children create was clicked and the jwt is expired, change browser url und redirect to /login
    if (!isAuthenticated && isCreate) {
        AuthService.navigateToLogin();
    }
    if (isInitial) {
        AuthService.navigateToLogin();
    }
    return isAuthenticated ? children : <Navigate to={navigateTo}/>
}
