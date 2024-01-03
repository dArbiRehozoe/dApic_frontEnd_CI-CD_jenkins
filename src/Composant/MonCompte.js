import React, { Component } from 'react';
import {
Button, TextField, Dialog, DialogActions, LinearProgress,
DialogTitle, DialogContent, 
TableContainer,
} from '@material-ui/core';
import swal from 'sweetalert';
import axios from 'axios';
import NavBar from './NavBar';
import { createBrowserHistory } from '@remix-run/router';
const history = createBrowserHistory();
const apikey=process.env.REACT_APP_API_URL;

export default class Dashboard extends Component {
constructor() {
super();
this.state = {
  user:[{}],
  date:'',
  token: '',
  openProductModal: false,
  description: false,
  openProductEditModal: false,
  id: '',
  test: true,
  name: '',
  desc: '',
  file: '',
  fileName: '',
  page: 1,
  search: '',
  products:[{}],
  pages: 0,
  loading: false
};
}

componentDidMount = () => {
  let user=JSON.parse(localStorage.getItem('user'))
let token = localStorage.getItem('token');
if (!token) {  history.push('/login');

} else {
  this.setState({ user: user });
    this.setState({ test: !this.state.test });
    this.setState({ token: token }, () => {
    this.getProduct();
  });
}
}

getProduct = () => {

this.setState({ loading: true });


console.log(this.state.user._id)
axios.get(`${apikey}/${this.state.user._id}/get_users`, {
  headers: {
    'token': this.state.token
  }
}).then((res) => {
  this.setState({ loading: false, products: res.data.productss, pages: res.data.pages });
}).catch((err) => {
  swal({
    text: err.response.data.errorMessage,
    icon: "error",
    type: "error"
  });
  this.setState({ loading: false, products: [{"id":2}], pages: 0 },()=>{});
});
}

deleteProduct = (id) => {
axios.post(`${apikey}/delete-user`, {
  id: id
}, {
  headers: {
    'Content-Type': 'application/json',
    'token': this.state.token
  }
}).then((res) => {

  swal({
    text: res.data.title,
    icon: "success",
    type: "success"
  });

  this.setState({ page: 1 }, () => {
    this.pageChange(null, 1);
  });
}).catch((err) => {
  swal({
    text: err.response.data.errorMessage,
    icon: "error",
    type: "error"
  });
});
}

pageChange = (e, page) => {
this.setState({ page: page }, () => {
  this.getProduct();
});
}

onChange = (e) => {
if (e.target.files && e.target.files[0] && e.target.files[0].name) {
  this.setState({ fileName: e.target.files[0].name }, () => { });
}
this.setState({ [e.target.name]: e.target.value }, () => { });
if (e.target.name === 'search') {
  this.setState({ page: 1 }, () => {
    this.getProduct();
  });
}
};

addProduct = () => {
const file = new FormData();
file.append('id', this.state.user._id);
file.append('name', this.state.name);
file.append('desc', this.state.desc);

console.log(this.state.token)
axios.post(`${apikey}/update-mdp`, file, {
  headers: { 'Content-Type': 'multipart/form-data','token': this.state.token }
}).then((res) => {

  swal({
    text: res.data.title,
    icon: "success",
    type: "success"
  });
this.handleProductClose();
  this.setState({ name: '', desc: '', file: null, page: 1 }, () => {
    this.getProduct();
  });
}).catch((err) => {
  swal({
    text: err.response.data.errorMessage,
    icon: "error",
    type: "error"
  });
  this.handleProductClose();
});

}

updateProduct = () => {
const fileInput = document.querySelector("#fileInput");
const file = new FormData();
file.append('id', this.state.user._id);
file.append('file', fileInput.files[0]);
file.append('name', this.state.name);

axios.post(`${apikey}/update-user`, file, {
    headers: { 'Content-Type': 'multipart/form-data','token': this.state.token }
}).then((res) => {

  swal({
    text: res.data.title,
    icon: "success",
    type: "success"
  });

  this.handleProductEditClose();
  this.setState({ name: '', file: null }, () => {
    this.getProduct();
  });
}).catch((err) => {
  swal({
    text: err.response.data.errorMessage,
    icon: "error",
    type: "error"
  });
  this.handleProductEditClose();
});

}

handleProductOpen = () => {
this.setState({
  openProductModal: true,
  id: '',
  name: '',
  desc: '',
  fileName: ''
});
};

handleProductClose = () => {
this.setState({ openProductModal: false });
};

handleProductEditOpen = (data) => {
this.setState({
  openProductEditModal: true,
  id: data._id,
  name: data.username
});
};

handleDescripOpen = (data) => {
  this.setState({
    description: true,
    id: data._id,
    name: data.name,
    desc: data.desc,
    date: data.date,
    fileName: data.image
  });
  };

handleProductEditClose = () => {
this.setState({ openProductEditModal: false });
};
handleDescripClose = () => {
  this.setState({ description: false });
  };
  

render() {
  console.log(this.state.products)
return (
  <div>
    {this.state.loading && <LinearProgress size={40} />}
    <div>
    <NavBar user={this.state.user._id}></NavBar>
    </div>

    <Dialog
      open={this.state.openProductEditModal}
      onClose={this.handleProductClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Modifier Votre Profil</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="name"
          value={this.state.name}
          onChange={this.onChange}
          placeholder="Votre nouveau pseudo"
          required
        /><br />
      <br />
        <br />
        <Button
          variant="contained"
          component="label"
        > Changer de photo de profil
        <input
            
            type="file"
            accept="image/*"
            name="file"
            value={this.state.file}
            onChange={this.onChange}
            id="fileInput"
            placeholder="File"
            hidden
          />
        </Button>&nbsp;
        {this.state.fileName}
      </DialogContent>

      <DialogActions>
        <Button onClick={this.handleProductEditClose} color="primary">
          Retour
        </Button>
        <Button
          disabled={this.state.name === ''}
          onClick={(e) => this.updateProduct()} color="primary" autoFocus>
         Modifier
        </Button>
      </DialogActions>
    </Dialog>



    <Dialog
      open={this.state.description}
      onClose={this.handleDescripClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth='lg'
    >
      <div className="card mb-3" style={{ width:"1060",  height: "600px"}}>
  <div className="row g-0">
    <div className="col-md-7">
    <img src={`${apikey}/${this.state.fileName}`} width="560" height="600px" />
    </div>
  </div>
</div>
      <DialogActions>
        <Button onClick={this.handleDescripClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog
      open={this.state.openProductModal}
      onClose={this.handleProductClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Modifier votre Mots de passe</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="name"
          value={this.state.name}
          onChange={this.onChange}
          placeholder="Ancien mots de passe"
          required
        /><br />
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="desc"
          value={this.state.desc}
          onChange={this.onChange}
          placeholder="Nouveau mots de passe"
          required
        /><br />
        <br /><br />
        
    
      </DialogContent>

      <DialogActions>
        <Button onClick={this.handleProductClose} color="primary">
          Retour
        </Button>
        <Button
          disabled={this.state.name === '' || this.state.desc === ''}
          onClick={(e) => this.addProduct()} color="primary" autoFocus>
          Modifier
        </Button>
      </DialogActions>
    </Dialog>

    <br />

    <TableContainer>
         <div class="container" style={{borderColor:'red'}}>
          <h2 style={{marginTop:"100px"}}>Mon profil</h2>
     <div className="card" style={{marginLeft:"30px",marginTop:"25px"}}>
    <div className='col-lg'>
    <div style={{marginTop:"25px"}}>

    <img style={{borderRadius:'50%'}} src={`${apikey}/${this.state.products.image}`} width="260" height="250" onClick={(e) => this.handleDescripOpen(this.state.products)}/>
    </div>
  
  <div className="card-body">
    <h5 className="card-title">{this.state.products.username}</h5>
  </div>

  <div className="card-body">
  <hr/>
  <Button
            className="button_style"
            variant="outlined"
            color="primary"
            size="large"
            onClick={(e) => this.handleProductEditOpen(this.state.products)}
          >
            Modifier mon profil
        </Button>
        <hr/>
        <Button
            className="button_style"
            variant="outlined"
            color="primary"
            size="large"
            onClick={this.handleProductOpen}
          >
            Changer Votre mots de passe
        </Button>   
        <hr/>
        <Button
      
            className="button_style"
            variant="outlined"
            color="secondary"
            size="large"
            onClick={(e) => { if (window.confirm("Voullez vous vraiment supprimer cette photo Cette action est irreversible") === true) {
              this.deleteProduct(this.state.products._id)
              history.push('/')
            } else {
              this.setState({condition1: true })
            } }}
          >
           Supprimer Mon compte
        </Button> 
  </div></div>
</div> 
  </div>

      <br />
    </TableContainer>

  </div>
);
}
}














