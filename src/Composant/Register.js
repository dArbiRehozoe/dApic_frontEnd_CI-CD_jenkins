import React from 'react';
import swal from 'sweetalert';
import { Button, TextField} from '@material-ui/core';
import {Link } from 'react-router-dom';
import axios from 'axios';
import '../style/sinup.css'
import '../App.css'
const apikey=process.env.REACT_APP_API_URL;
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: '',
      conf: 'black'
    };
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.zaza()
  }
zaza(){
  if(this.state.confirm_password !== ''){
    if(this.state.password === this.state.confirm_password){
     return this.setState({conf: 'yellow' });

      }else{
    return    this.setState({conf: 'red' })
      }
  }
}


  register = () => {

    axios.post(`${apikey}/register`, {
      username: this.state.username,
      password: this.state.password,
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      this.props.history.push('/');
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  render() {
    
    return (
      <div >  
    <div className="background-image"></div>
    <div className="content">
    <div  className='input'>
          <h2 style={{marginBottom:'40px',marginTop:'20px'}}>Crée un compte</h2>
          <TextField
         color='warning'
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="Pseudo"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Mots de passe"
            required
          />
          <br /><br />
         
           <input class="form-control me-2 input12" type="password"
                  autoComplete="off"
                  name="confirm_password"
                  value={this.state.confirm_password}
                  onChange={this.onChange}
                  placeholder="Confirmer votre mots de passe"
        style={{ borderColor: this.state.confirm_password === ''? 'black': 
        this.state.password === this.state.confirm_password ? 'green':'red' }}
    />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.username === '' || this.state.password === '' || this.state.password !== this.state.confirm_password}
            onClick={this.register}
          >
            S'inscrire
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/">
           Se connécter
          </Link>
        </div>

    </div>
    </div>
//       <div >

// <img src={require('../mesPhotos/Cheezcayk 🧋🤍.jpeg')}  style={{position:'relative',width:"100%",height:"967px",zIndex:-1}}  />
 
//       </div>
    );
  }
}
