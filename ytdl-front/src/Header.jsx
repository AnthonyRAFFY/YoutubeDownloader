import './Header.css';
import React from "react";
import { NavLink, Link } from 'react-router-dom';

function Header(props) {
    return (
        <div id="header">
            <div className="flex">
                <div id="header-fixed">
                    <a href="/" id="title">YoutubeDL</a>
                    <a>About</a>
                </div>
            </div>
        </div>
    );
}

export default Header;