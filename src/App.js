import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import {RequireAuth} from "./utils/private_route";
import Home from "./components/home.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import Appointment from "./components/appointments.component";
import Employees from './components/employees.component';
import NavBar from './components/navigation-bar.component';
import LivingGroup from "./components/living-group.component";
import Accounts from './components/account.component';
import Options from "./components/options.component";
import {ToastContainer} from "react-toastify";

export default function App() {
    return (
        <div>
            <NavBar/>

            <div>
                <ToastContainer position="bottom-center" autoClose={15000}/>
            </div>

            <div>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="login" element={<Login/>} />
                    <Route
                        path="register"
                        element={
                            <RequireAuth navigateTo="../login">
                                <Register/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="living_group"
                        element={
                            <RequireAuth navigateTo="../login">
                                <LivingGroup/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <RequireAuth navigateTo="../login">
                                <BoardUser/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="appointment"
                        element={
                            <RequireAuth navigateTo="../login">
                                <Appointment/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="record"
                        element={
                            <RequireAuth navigateTo="../login">
                                <BoardUser/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="options"
                        element={
                            <RequireAuth navigateTo="../login">
                                <Options/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="employees"
                        element={
                            <RequireAuth navigateTo="../login">
                                <Employees/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="accounts"
                        element={
                            <RequireAuth navigateTo="../login">
                                <Accounts/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="children"
                        element={
                            <RequireAuth navigateTo="../login">
                                <></>
                            </RequireAuth>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}
