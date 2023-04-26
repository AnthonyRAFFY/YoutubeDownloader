import { Outlet } from "react-router-dom";

function Layout() 
{
    return (
        <div className="layout-container">
            <div className="container main-container">
                <Outlet/>
            </div>
        </div>
    );
}

export default Layout