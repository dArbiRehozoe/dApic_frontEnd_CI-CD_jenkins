import React, { Component } from 'react';
import {
Button, TextField, Dialog, DialogActions, LinearProgress,
DialogTitle, DialogContent, 
TableContainer,
} from '@material-ui/core';
import '../style/recherche.css'
import { GrMoreVertical} from 'react-icons/gr';
import { BsSearch} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';
import Dashboard from './photo';
import { createBrowserHistory } from '@remix-run/router';
import NavBar from './NavBar';
import {GoChevronRight} from "react-icons/go";
import '../style/style.css'
const history = createBrowserHistory();
export default class DossierP extends Component {
constructor() {
super();
this.state = {
  token: '',
  openProductModal: false,
  openProductEditModal: false,
  id: '',
  name: '',
  page: 1,
  search: '',
  user:[{}],
  products:[{}],
  pages: 0,
  loading: false
};
}

componentDidMount = () => {
let token = localStorage.getItem('token');
let user=JSON.parse(localStorage.getItem('user'))
if (!token) {  history.push('/login');

} else {
  this.setState({ user: user });
}
}
render() {
    console.log(this.state.user)
return (
  <div    style={{marginTop:"75px"}}>
    {this.state.loading && <LinearProgress size={40} />}
    <div >
        <NavBar user={this.state.user} titre="Ma Collection"></NavBar>
    </div>
  
    <i ><GoChevronRight/></i>
    <div style={{marginTop:'-25px'}} id='collection'>
        <Dashboard info={this.props.info}/>
    </div>
    </div>
);
}
}


