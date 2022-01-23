import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Home from "./components/home.component";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import NavBar from './components/navigation-bar.component';

export default function App() {
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);

    return (
        <div>
            <NavBar/>
            <div>
                <Routes>
                    <Route path="/home" element={<Home/>} />
                    <Route path="login" element={<Login/>} />
                    <Route
                        path="register"
                        element={
                            <Register
                                showModeratorBoard={showModeratorBoard}
                                showAdminBoard={showAdminBoard}
                            />
                        }
                    />
                    <Route path="living_group" element={<BoardAdmin/>} />
                    <Route path="children" element={<Profile/>} />
                    <Route path="profile" element={<Profile/>} />
                    <Route path="appointment" element={<BoardUser/>} />
                    <Route path="record" element={<BoardUser/>} />
                    <Route path="employees" element={<BoardModerator/>} />
                </Routes>
            </div>

        </div>
    );
}
