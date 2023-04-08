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

  //toggle menu
  function toggleMenu() {
    // if (document.getElementById('nav').classList.contains('hide')) {
    //   document.getElementById('nav').classList.remove('hide');
    // } else {
    //   document.getElementById('nav').classList.add('hide');
    // }
    document.getElementById('nav').classList.toggle('hide');
  }

  if (location.pathname === '/' || location.pathname === '/signup') {
    return null;
  } else {
    return (
      <div id='nav-wrapper'>
        <nav id='nav' className='hide'>
          <h1>Doc <br/>Tracker</h1>
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
          <button className='secondary logout' type='button' onClick={handleLogout}>
            Logout
          </button>

          
        </nav>  

        {/* <button className='primary menu-btn' type='button' onClick={toggleMenu}>Menu</button> */}
      </div>
      
    );
  }
};

export default Navbar;
