import { Navigate, NavLink, useLocation } from "react-router-dom";

const Navbar = () => {

    const location = useLocation()

    if (location.pathname === '/' || location.pathname ==='/signup') {
        return null
    } else {
        return (
            <nav>
                <ul>
                    <NavLink to='/dashboard'>Dashboard</NavLink>          
                    <li>My Tickets</li>
                </ul>
            </nav>
        )
    }
    
};

export default Navbar;