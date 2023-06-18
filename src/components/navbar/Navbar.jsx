import { useState, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { UserAuth } from '../../config/AuthContext.jsx';
import { auth, firestore } from '../../config/Firebase.jsx';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import './Navbar.scss';

const Navbar = () => {
  //get user auth and logout functions from config
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();

      if (authObj) {
        const uid = auth.currentUser.uid;
        setUserId(uid);
        setUsername(auth.currentUser.displayName)
      } else {
        console.log('User is not logged in');
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.log(e.message);
    }
  };

  //console.log(username)

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
          {/* <h1>Doc <br/>Tracker</h1> */}
          <h2>Hello {username}</h2>
          <ul>
            <li>
              <NavLink
                to='/dashboard'
                className='nav-link'
                style={({ isActive }) => {
                  return {
                    backgroundColor: isActive ? '#9099a2' : '',
                    color: isActive ? '#212529' : '#ffffff',
                  };
                }}
              >
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/account'
                className='nav-link'
                style={({ isActive }) => {
                  return {
                    backgroundColor: isActive ? '#9099a2' : '',
                    color: isActive ? '#212529' : '#ffffff',
                  };
                }}
              >
                Account
              </NavLink>
            </li>
            
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
