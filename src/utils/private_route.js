import React from 'react';
import AuthService from '../services/auth.service';
import { Navigate } from 'react-router-dom';

export function RequireAuth({ children, navigateTo, isCreate, isInitial}) {
    let isAuthenticated = AuthService.getCurrentUser();
    let isExpired = null;
    if (isAuthenticated) {
        const expirationDate = new Date(Number(isAuthenticated.expiration)).toLocaleString();
        isExpired = new Date(Number(isAuthenticated.expiration)).getTime() < new Date().getTime();
        if (isExpired) {
            console.log("JWT is expired!")
            AuthService.logout();
            AuthService.navigateToLogin();
        }
    } else {
        console.log("Not authenticated!");
        AuthService.logout()
        AuthService.navigateToLogin();
    }
    //if children create was clicked and the jwt is expired, change browser url und redirect to /login
    if (!isAuthenticated && isCreate) {
        AuthService.navigateToLogin();
    }
    if (isInitial) {
        AuthService.navigateToLogin();
    }

    const shouldRender = isAuthenticated && !isExpired;

    return shouldRender ? children : <Navigate to={navigateTo}/>
}
