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
import '../style/style.css'
const history = createBrowserHistory();
const apikey=process.env.REACT_APP_API_URL;
export default class Dossier extends Component {
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
  this.setState({ token: token }, () => {
    this.getProduct();
  });
}
}

getProduct = () => {

this.setState({ loading: true });

axios.get(`${apikey}/${this.state.user._id}/dossier`, {
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


getinfoDossier = (id) => {
console.log(id)
  this.setState({ loading: true });
  
  axios.get(`${apikey}/${id}/info-dossier`, {
    headers: {
      'token': this.state.token
    }
  }).then((res) => {
    console.log(res.data.productss)
    this.props.setdossier(res.data.productss)
    
  }).catch((err) => {
    this.props.setdossier("hehe")
  });
  }


deleteProduct = (id) => {
axios.post(`${apikey}/delete-dossier`, {
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
file.append('name', this.state.name);
file.append('user_id', this.state.user._id );
console.log(this.state.token)
axios.post(`${apikey}/add-dossier`, file, {
  headers: { 'Content-Type': 'multipart/form-data','token': this.state.token }
}).then((res) => {

  swal({
    text: res.data.title,
    icon: "success",
    type: "success"
  });
this.handleProductClose();
  this.setState({ name: '', page: 1 }, () => {
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
const file = new FormData();
file.append('id', this.state.id);
file.append('name', this.state.name);
axios.post(`${apikey}/update-dossier`, file, {
    headers: { 'Content-Type': 'multipart/form-data','token': this.state.token }
}).then((res) => {

  swal({
    text: res.data.title,
    icon: "success",
    type: "success"
  });

  this.handleProductEditClose();
  this.setState({ name: '' }, () => {
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
});
};

handleProductClose = () => {
this.setState({ openProductModal: false });
};

handleProductEditOpen = (data) => {
this.setState({
  openProductEditModal: true,
  id: data._id,
  name: data.name,
});
};

handleProductEditClose = () => {
this.setState({ openProductEditModal: false });
};

render() {
    
    const filterText = this.state.search;
    const rows = [];
    this.state.products.forEach((row) => {

      if (`${row.name}`.indexOf(filterText) === -1) {
        return;
      }
    
     rows.push(
   <div className="card" id='mondossier' key={row.name} style={{width: "18rem",marginLeft:"30px",marginTop:"25px"}}>
    <div className='col-sm'>
  <div className="card-body">
  <div class="d-flex flex-row" style={{marginLeft:'5px'}}>
  <div class="p-2" style={{width:'190px'}}> <h5 className="card-title"></h5></div>
  <div class="p-2" style={{marginLeft:'0px'}}>
    
  <div class="dropdown" style={{marginTop:'-10px'}}>
  <button class="btn  " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
  <i className='bx bx-log-out icon' id='icone1'> <GrMoreVertical/></i>
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li class="dropdown-item"><Button
            className="button_style"
            variant="outlined"
            color="primary"
            size="small"
            onClick={(e) => this.handleProductEditOpen(row)}
          >
            Renomer
        </Button></li>
    <li class="dropdown-item" >
    <Button
            className="button_style"
            variant="outlined"
            color="secondary"
            size="small"
            onClick={(e) => { if (window.confirm("Voullez vous vraiment supprimer ce dossier , Cette action est irreversible") === true) {
              this.deleteProduct(row._id)
            } else {
              this.setState({condition1: true })
            } }}
          >
            Supprimer
        </Button>
    </li>
  
  </ul>
</div>
    
      
      
      </div>
</div>
   


  <Link to={row.name} >
<img src={require('../mesPhotos/officiel.png')}   className="card-img-top" onClick={(e) => this.getinfoDossier(row._id)} /></Link>
  </div>
  <div className="card-body "style={{marginTop:'-52px'}}>
  {row.name}
  </div>
</div>
</div>
      );
    });

return (
  <div    style={{marginTop:"75px"}}>
    {this.state.loading && <LinearProgress size={40} />}
    <div >
    <NavBar user={this.state.user} titre="Ma Collection"></NavBar>
    </div>
      <section className="home">
      <h2>Ma Collection</h2>





      <div class="container d-flex  float-start"  >
   

<div class="input-group col-sm-3  input-group-lg" style={{width:'600px'}}>
<div class="input-group-prepend">
                         <span class="input-group-text google"  style={{height:'48px'}}></span>
                       </div>
<input type="email"

    name="search"
onChange={this.onChange}
value={this.state.search}
class="form-control"
placeholder="Chercher un dossier"
id="" />
            <div class="input-group-append">
              <span class="input-group-text microphone" style={{height:'48px'}}> <BsSearch/></span>
            </div>
 </div>


</div>



  </section>

    {/* Edit Product */}
    <Dialog
      open={this.state.openProductEditModal}
      onClose={this.handleProductClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Renomer le dossier</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="name"
          value={this.state.name}
          onChange={this.onChange}
          placeholder="Nouveau nom du dossier"
          required
        /><br />
         

        {this.state.fileName}
      </DialogContent>

      <DialogActions>
        <Button onClick={this.handleProductEditClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={this.state.name === ''}
          onClick={(e) => this.updateProduct()} color="primary" autoFocus>
          Edit Product
        </Button>
      </DialogActions>
    </Dialog>

    {/* Add Product */}
    <Dialog
      open={this.state.openProductModal}
      onClose={this.handleProductClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Crée un dossier</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="name"
          value={this.state.name}
          onChange={this.onChange}
          placeholder="nom du dossier"
          required
        /><br />
        
      </DialogContent>

      <DialogActions>
        <Button onClick={this.handleProductClose} color="primary">
        Retour
        </Button>
        <Button
          disabled={this.state.name === ''}
          onClick={(e) => this.addProduct()} color="primary" autoFocus>
         Crée
        </Button>
      </DialogActions>
    </Dialog>

    <br />

    <TableContainer>
       <div class="row float-end"   style={{borderColor:'red',width:'80%'}}>
        

 <div className="card" id='adddossier' style={{width: "18rem",marginLeft:"30px",marginTop:"25px"}}>
    <div className='col-sm'>

<img src={require('../mesPhotos/officiel2.png')}  onClick={this.handleProductOpen}  className="card-img-top" width='100%' height='100%'/>
</div>
</div  >
     {rows}
  </div>

   
      <br />
    </TableContainer>
  <hr />
<div style={{marginTop:'-25px'}} id='collection'>
  <Dashboard info={this.state.user}/>
  </div>
  </div>
);
}
}


