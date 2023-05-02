import { Outlet } from "react-router-dom";
import Header from "./Header";
import './Layout.css';

function Layout() 
{
    return (
        <div className="layout-container">
            <Header/>
            <div className="container main-container">
                <Outlet/>
            </div>
        </div>
    );
}

export default Layout