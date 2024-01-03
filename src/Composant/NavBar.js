import { useState } from 'react';
import '../style/style.css'
import React from 'react';
import { Link } from 'react-router-dom';
import { ImHome } from 'react-icons/im';
import { ImImages,ImExit } from 'react-icons/im';
import { HiOutlineUserCircle} from "react-icons/hi";
import { createBrowserHistory } from '@remix-run/router';
import {GoChevronRight} from "react-icons/go";
function NavBar(user) {
  const body = document.querySelector('body')
  const modeText = body.querySelector(".mode-text");
  const history = createBrowserHistory();
  const [toggled,setToggled] = useState(false);
  function Navigation(){
      setToggled(!toggled)
  }
  function heh(){
    body.classList.toggle("dark");
    
    if(body.classList.contains("dark")){
        modeText.innerText = "Light mode";
    }else{
        modeText.innerText = "Dark mode";
        
    }
  }
 const logOut = () => {
  localStorage.setItem('token', null);
  history.push('/');
  window.location.reload()}
  return (
    <div >
    <nav className={toggled ? "sidebar": "sidebar close"} >
      <header >
          <div className="image-text">
              <span className="image">
              <img src={require('../mesPhotos/logo1.png')}  style={{width:"65px",height:"60px",borderRadius:'50%',marginRight:'15px'}}  />
              </span>

              <div className="text logo-text">
                  <span className="name">..d'Apic</span>
              </div>
          </div>

          <i className='toggle' onClick={Navigation}><GoChevronRight/></i>
      </header>

      <div className="menu-bar">
          <div className="menu">
              <ul className="menu-links">
                  <li className="nav-link">
              <Link to={`/${user.user}/Acceuil`} style={{textDecoration:'none',color:'black'}} replace >
                <i className='bx bx-log-out icon' > <ImHome /></i>
                <span className="text nav-text hehe">Acceuil</span>
                </Link></li>
                  <li className="nav-link">
                  <Link to={`/${user.user}/Prive`} style={{textDecoration:'none',color:'black'}} replace >
                  <i className='bx bx-log-out icon' > <ImImages/></i>
                 <span className="text nav-text hehe">Ma Gallerie</span>

                    </Link>
                  </li>
                  <li className="nav-link">
                  <Link to={`/${user.user}/Mon-Compte`}  style={{textDecoration:'none',color:'black'}}  replace >
                  <i className='bx bx-log-out icon' > <HiOutlineUserCircle/></i>
                 <span className="text nav-text hehe">Mon-Compte</span>
                    </Link>
                  </li>

              </ul>
          </div>

          <div className="bottom-content">
              <li className="" onClick={logOut}>
                
                      <i className='bx bx-log-out icon' > <ImExit /></i>
                      <span className="text nav-text">Logout</span>
              
              </li>

              <li className="mode" onClick={heh}>
                  <div className="sun-moon">
                      <i className='bx bx-moon icon moon'></i>
                      <i className='bx bx-sun icon sun'></i>
                  </div>
                  <span className="mode-text text" >Dark mode</span>

                  <div className="toggle-switch">
                      <span className="switch"></span>
                  </div>
              </li>
              
          </div>
      </div>

  </nav>

    </div>

  );
}

export default NavBar;