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
  date:'',
  token: '',
  openProductModal: false,
  description: false,
  openProductEditModal: false,
  id: '',
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
let token = localStorage.getItem('token');
if (!token) {  history.push('/login');

} else {
  this.setState({ token: token }, () => {
    this.getProduct();
  });
}
}

getProduct = () => {

this.setState({ loading: true });
console.log(this.state.token)
let data = '?';
data = `${data}page=${this.state.page}`;
if (this.state.search) {
  data = `${data}&search=${this.state.search}`;
}
console.log(this.props.info._id)
axios.get(`${apikey}/${this.props.info._id}/get-photo`, {
  headers: { 'Content-Type': 'multipart/form-data','token': this.state.token }
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
axios.post(`${apikey}/delete-product`, {
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
const fileInput = document.querySelector("#fileInput");
const file = new FormData();
file.append('file', fileInput.files[0]);
file.append('name', this.state.name);
file.append('desc', this.state.desc);
file.append('username',this.props.info.username);
file.append('user_id', this.props.info._id );
console.log(this.state.token)
axios.post(`${apikey}/add-product`, file, {
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
file.append('id', this.state.id);
file.append('file', fileInput.files[0]);
file.append('name', this.state.name);
file.append('desc', this.state.desc);

axios.post(`${apikey}/update-product`, file, {
    headers: { 'Content-Type': 'multipart/form-data','token': this.state.token }
}).then((res) => {

  swal({
    text: res.data.title,
    icon: "success",
    type: "success"
  });

  this.handleProductEditClose();
  this.setState({ name: '', desc: '', file: null }, () => {
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
  name: data.name,
  desc: data.desc,
  fileName: data.image
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
  
    const filterText = this.state.search;
    const rows = [];
    this.state.products.forEach((row) => {

      if (`${row.name}`.indexOf(filterText) === -1) {
        return;
      }
    
     rows.push(
  
          <div key={row.name} className="card" style={{width: "18rem",marginLeft:"30px",marginTop:"25px"}}>
             <div className='col-sm'>
          <img src={`${apikey}/${row.image}`} width="260" height="250" onClick={(e) => this.handleDescripOpen(row)}/>
    <h5 className="card-title">{row.name}</h5>

<li className="list-group-item">Crée le {`${row.date}`.slice(0, 10)}</li>
  <div className="card-body">
  <Button
            className="button_style"
            variant="outlined"
            color="primary"
            size="small"
            onClick={(e) => this.handleProductEditOpen(row)}
          >
           Modifier
        </Button>
          <Button
            className="button_style"
            variant="outlined"
            color="secondary"
            size="small"
            onClick={(e) => { if (window.confirm("Voullez vous vraiment supprimer cette photo Cette action est irreversible") === true) {
              this.deleteProduct(row._id)
            } else {
              this.setState({condition1: true })
            } }}
          >
           Supprimer
        </Button>
  </div>
</div></div>

      );
    });
         
return (
  <div  className='container'  style={{marginTop:"25px"}}>

    {this.state.loading && <LinearProgress size={40} />}
    <div>
    <div   style={{marginLeft:"30px",marginTop:"75px"}}>
    <section style={{position:'relative',top:"-45px",left:"60px"}}>    <h2 className='float-start'>Mes Images</h2>  </section>
    <h2 className='float-start'></h2>
      </div>
    <div className='float-end'  style={{marginRight:"30px",marginTop:"5px"}}>
    
      <Button
        className="button_style"
        variant="contained"
        color="primary"
        size="small"
        onClick={this.handleProductOpen}
      >
       Ajouter une photo
      </Button>
    </div>
    </div>

    {/* Edit Product */}
    <Dialog
      open={this.state.openProductEditModal}
      onClose={this.handleProductClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Modifier la photo</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="name"
          value={this.state.name}
          onChange={this.onChange}
          placeholder="Nom de la photo"
          required
        /><br />
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="desc"
          value={this.state.desc}
          onChange={this.onChange}
          placeholder="Description de la photo"
          required
        /><br />
        <br />
        <Button
          variant="contained"
          component="label"
        > Sélectionner
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
          disabled={this.state.name === '' || this.state.desc === ''}
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
    <img src={`${apikey}/${this.state.fileName}`} style={{marginTop:"3px",marginLeft:"3px",borderRadius:'1%'}} width="560" height="592px" />

    </div>
    <div className="col-md-5" style={{ marginTop:"180px"}}>
      <div className="card-body">
        <h5 className="card-title">Nom:{this.state.name}</h5>
        <p className="card-text">Description:{this.state.desc}</p>
        <p className="card-text" style={{marginLeft:'40px'}}><small className="text-muted">date de création: {`${this.state.date}`.slice(0, 10)}</small></p>
      </div>
    </div>
  </div>
</div>
      <DialogActions>
        <Button onClick={this.handleDescripClose} color="primary">
          Retour
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog
      open={this.state.openProductModal}
      onClose={this.handleProductClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Ajouter une photo</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="name"
          value={this.state.name}
          onChange={this.onChange}
          placeholder="Nom de la photo"
          required
        /><br />
        <TextField
          id="standard-basic"
          type="text"
          autoComplete="off"
          name="desc"
          value={this.state.desc}
          onChange={this.onChange}
          placeholder="Description de la photo"
          required
        /><br />
        <br /><br />
        <Button
          variant="contained"
          component="label"
        > Sélectionner
        <input
         
            type="file"
            accept="image/*"
            // inputProps={{
            //   accept: "image/*"
            // }}
            name="file"
            value={this.state.file}
            onChange={this.onChange}
            id="fileInput"
            placeholder="File"
            hidden
            required
          />
        </Button>&nbsp;
        {this.state.fileName}
      </DialogContent>

      <DialogActions>
        <Button onClick={this.handleProductClose} color="primary">
         Retour
        </Button>
        <Button
          disabled={this.state.name === '' || this.state.desc === '' ||  this.state.file === null}
          onClick={(e) => this.addProduct()} color="primary" autoFocus>
         Ajouter
        </Button>
      </DialogActions>
    </Dialog>

    <br />

    <TableContainer>
    
      <TextField
        id="standard-basic"
        type="search"
        autoComplete="off"
        name="search"
        value={this.state.search}
        onChange={this.onChange}
        placeholder="Chercher un photo"
        required
      />
        <div className="row " style={{borderColor:'red',width:'100%'}}>
     {rows}
  </div>

      <br />
    </TableContainer>

  </div>
);
}
}


