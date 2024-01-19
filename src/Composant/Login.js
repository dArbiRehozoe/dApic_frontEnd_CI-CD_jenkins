import React from 'react';
import swal from 'sweetalert';
import { Button, TextField} from '@material-ui/core';
import {Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import '../style/login.css'
import BackdropFilter from "react-backdrop-filter";
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const apikey=process.env.REACT_APP_API_URL;

 function Login ({setLoginUser}){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleOnChange = (event) => {
    const nom= event.target.value;
    setUsername(nom);
  };
  const handleOnChange1 = (event) => {
    const mdp = event.target.value;
    setPassword(mdp);
  };


  const login = () => {
  
    const pwd = bcrypt.hashSync(password, salt);

    axios.post(`${apikey}/login`, {
      username: username,
      password: pwd,
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',JSON.stringify(res.data.user));
      localStorage.setItem('username', res.data.user.username);
      navigate(`${res.data.user._id}/Acceuil`);
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
    });
  }

    return (
      <div className="body">
      <div className="container container1 ">
      <BackdropFilter
          className="bluredForm"
          filter={"blur(10px) sepia(50%)"}
          canvasFallback={true}
          html2canvasOpts={{
              allowTaint: true
          }}
         
          >
          <form>
              <div className="profilePic">
          <img src={require('../mesPhotos/logo1.png')}  style={{width:"100%",height:"100%"}} />
              </div>
          <h5 style={{color:'white'}}>Se connécter a d'Apic v1</h5>
            <br />   <br />
            <input className="form-control me-2 input1" type="search"
            name="username"
            value={username}
            onChange={handleOnChange}
        
          placeholder="Pseudo"
      aria-label="Search"/>
   
  <br />
  <input className="form-control me-2 input1" type="password"
             name="password"
             value={password}
             onChange={handleOnChange1}
             placeholder="Mots de passe"

      aria-label="Search"/>
 
  <br />
  <br /><br />
  <Button
    className="button_style"
    variant="contained"
    color="primary"
    size="small"
    disabled={username === '' || password === ''}
    onClick={login}
  >
    Se connécter
  </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <Link to="/register">
    S'inscrire
  </Link>
          </form>
      </BackdropFilter>
      </div>
  </div>
//       <div  className="container-fluid" style={{marginTop:'10%',width:'80%'}} >
//         <div  >zzzz

//         <nav className="navbar  container-fluid" style={{backgroundColor:'blue',borderRadius:'40px',marginTop:'2px'}} >
//   <div  className="container-fluid" style={{marginLeft:'2%'}}>
//   <div className="blur"  style={{width:'38%',padding:'80px'}}>

// <div >
//   <h2 style={{color:'white'}}>Se connécter</h2>
// </div>

// <div >
  
// </div>
// </div>
//     <div className="d-flex blur"  style={{width:"50%",height:"50%"}}>
   
        

    
     
//     </div>
//   </div>
// </nav>
          
//         </div>
    

//       </div>

    );
  
}
export default Login