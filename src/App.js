import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "./components/home.component";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import Employees from './components/employees.component';
import NavBar from './components/navigation-bar.component';
import LivingGroup from "./components/living-group.component";
import Accounts from './components/account.component';

export default function App() {
    return (
        <div>
            <NavBar/>
            <div>
                <Routes>
                    <Route path="/home" element={<Home/>} />
                    <Route path="login" element={<Login/>} />
                    <Route path="register" element={<Register/>} />
                    <Route path="living_group" element={<LivingGroup/>} />
                    <Route path="profile" element={<Profile/>} />
                    <Route path="appointment" element={<BoardUser/>} />
                    <Route path="record" element={<BoardUser/>} />
                    <Route path="employees" element={<Employees/>} />
                    <Route path="accounts" element={<Accounts/>} />
                </Routes>
            </div>
        </div>
    );
}
