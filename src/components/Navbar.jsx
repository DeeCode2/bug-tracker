import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { UserAuth } from '../config/AuthContext.jsx';
import '../styles/Navbar.scss';

const Navbar = () => {
  //get user auth and logout functions from config
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.log(e.message);
    }
  };

  if (location.pathname === '/' || location.pathname === '/signup') {
    return null;
  } else {
    return (
      <nav>
        <ul>
          <li>
            <NavLink
              to='/dashboard'
              style={({ isActive }) => {
                return {
                  backgroundColor: isActive ? '#9099a2' : '',
                  color: isActive ? '#212529' : '',
                };
              }}
            >
              Dashboard
            </NavLink>
          </li>
          {/* <li>
          <NavLink
              to='/account'
              style={({ isActive }) => {
                return {
                  backgroundColor: isActive ? '#9099a2' : 'transparent',
                  color: isActive ? '#212529' : '',
                };
              }}
            >
            
              Account
            </NavLink>
          </li> */}
        </ul>
        <button className='secondary' type='button' onClick={handleLogout}>
          Logout
        </button>
      </nav>
    );
  }
};

export default Navbar;
