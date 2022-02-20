import React, {useState} from 'react';
import {Link} from "react-router-dom";
import "../style/children.navigation.component.css";

function ChildNav() {

    return (
        <header className="children-nav-header">

            <div className="children-nav-left">
                <ul className="children-navBar">
                    <div className="children-nav-left-panel">
                        <div className="children-nav-left-action-panel">
                            <li>
                                <Link to="/child/1">Kind 1</Link>
                            </li>
                            <li>
                                <Link to="/child/2">Kind 2</Link>
                            </li>
                            <li>
                                <Link to="/child/3">Kind 3</Link>
                            </li>
                            <li>
                                <Link to="/child/4">Kind 4</Link>
                            </li>
                            <li>
                                <Link to="/child/5">Kind 5</Link>
                            </li>
                            <li>
                                <Link to="/child/6">Kind 6</Link>
                            </li>
                            <li>
                                <Link to="/child/7">Kind 7</Link>
                            </li>
                            <li>
                                <Link to="/child/8">Kind 8</Link>
                            </li>
                            <li>
                                <Link to="/child/9">Kind 9</Link>
                            </li>
                            <li>
                                <Link to="/child/10">Kind 10</Link>
                            </li>

                        </div>
                    </div>
                </ul>
            </div>

            <div className="children-nav-right">
                <ul>
                    <div className="children-nav-right-panel">
                        <li>
                            <Link to="/create">Anlegen</Link>
                        </li>
                        <li>
                            <Link to="/edit">Bearbeiten</Link>
                        </li>
                        <li>
                            <Link to="/delete">Entfernen</Link>
                        </li>
                    </div>
                </ul>
            </div>

        </header>
    );
}
export default ChildNav;