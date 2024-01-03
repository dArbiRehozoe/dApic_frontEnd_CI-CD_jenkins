import React, { Component } from 'react';
import {
Button, TextField, Dialog, DialogActions, LinearProgress,
DialogTitle, DialogContent,
TableContainer
} from '@material-ui/core';
import swal from 'sweetalert';
import axios from 'axios';
import NavBar from './NavBar';
import { BsSearch} from 'react-icons/bs';
import '../style/recherche.css'
import { createBrowserHistory } from '@remix-run/router';
import { GrMore} from 'react-icons/gr';
import { ImHome } from 'react-icons/im';
const history = createBrowserHistory();
const apikey=process.env.REACT_APP_API_URL;
export default class Acceuil extends Component {
constructor() {
super();
this.state = {
  date:'',
  token: '',
  openProductModal: false,
  description: false,
  openProductEditModal: false,
  user:[{}],
  id: '',
  name: '',
  desc: '',
  file: '',
  fileName: '',
  page: 1,
  search: '',
  products:[{}],
  userinfo:[{}],
  userinfo2:[{}],
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
  this.setState({ token: token }, () => {
    this.getProduct();
    this.getUse();
  });
}

}

actOnPost = (e) => {
  var updatePostStats = {
    Like: function (postId) {
        document.querySelector('#likes-count-' + postId).textContent++;
    },
    Unlike: function(postId) {
        document.querySelector('#likes-count-' + postId).textContent--;
    }
  };
  
  var toggleButtonText = {
    Like: function(button) {
        button.textContent = "Unlike";
    },
    Unlike: function(button) {
        button.textContent = "Like";
    }
  };
  var postId = e.target.dataset.postId;
  console.log(postId)
  var action1 = e.target.textContent.trim();
  console.log(action1)
  toggleButtonText[action1](e.target);
  updatePostStats[action1](postId);
  axios.post(`${apikey}/posts/${postId}/act`,{action:action1,idUser:this.state.user.username}, {
    headers: {
      'Content-Type': 'application/json',
      'token': this.state.token
    }
  })
  .then(function (response) {
    console.log(response.data.like);
  })
  .catch(function (error) {
    console.log(error);
  })
};


pageChange = (e, page) => {
  this.setState({ page: page }, () => {
    this.getProduct();
  });
  }


  getUse= () => {

    this.setState({ loading: true });
    
    
    axios.get(`${apikey}/getAllusers`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, userinfo: res.data.productss, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, userinfo: [{"id":2}], pages: 0 },()=>{});
    });
    }
    

getProduct = () => {
  console.log(this.state.token)

this.setState({ loading: true });
let data = '?';
data = `${data}page=${this.state.page}`;
if (this.state.search) {
  data = `${data}&search=${this.state.search}`;
}

axios.get(`${apikey}/get-public`, {
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
file.append('user_id', this.state.user._id);
file.append('username',this.state.user.username);
console.log(this.state.token)
axios.post(`${apikey}/public`, file, {
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
  
date1(date){
return `${date}`.slice(0, 10)
}

taillelike(tmp){
  let j=0;
  console.log(tmp.length)
  if(tmp.length===0){
    console.log(tmp.length)
    return 0
  } else {
  for (var i = 0 ; i < tmp.length ;  i++) {
    if(tmp[i]===','){
     j=j+1;
    }
    console.log("a=")
    console.log(j+1)
    return j+1
 }}
}  

render() {
  
  const filterText = this.state.search;
  const rows = [];
  let a="";
  let b="";
  this.state.products.forEach((row) => {
console.log(`${row.likes_bools}`.indexOf(this.state.user.username))
    if (`${row.name}`.indexOf(filterText) === -1) {
      return;
    }
    
    this.state.userinfo.forEach((user)=> {
      if(row.user_id===user._id){
        a=user.username;
        b=user.image;
      }
    })


    rows.push(
      
        <div key={row._id} className="card" id="public">
          <div class="card">
  <div class="card-body">

  <div class="d-flex flex-row">
      <div class="p-2">
        <img src={`${apikey}/${b}`} width="50" height="50" style={{borderRadius:'50%'}}/>
      </div>
        <div class="p-2"><h5 className='float-start'>{a} </h5> <br />
              <p class="card-text float-start" ><small class="text-muted" >Crée le {this.date1(row.date)}</small></p>
        </div>
        <div class="p-2" style={{marginLeft:'0px'}}>
        {row.user_id===this.state.user._id      ? 
    <div class="dropdown" id='drop'>
    <button class="btn  " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    <i className='bx bx-log-out icon' id='icone1'> <GrMore/></i>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li class="dropdown-item"><Button
          className="button_style"
          variant="outlined"
          color="primary"
          size="small"
          onClick={(e) => this.handleProductEditOpen(row)}
        >
         Modifier
      </Button></li>
      <li class="dropdown-item" >
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
      </li>
    
    </ul>
  </div>
  : <div></div> }
        
        
        </div>

  </div>
  </div>





  












  <img src={`${apikey}/${row.image}`} width="400" class="card-img-bottom"  style={{marginTop:"1px",borderRadius:'1%'}} height="390" onClick={(e) => this.handleDescripOpen(row)}/>

</div>

      
<div class="d-flex">
 <p  style={{marginTop:'0px'}}> <span id={`likes-count-${row._id }`} style={{position:'relative',top:'2px'}} >{row.likes_count}</span><ImHome  /> </p>
{`${row.likes_bools}`.indexOf(this.state.user.username)!== -1 ?<button style={{marginLeft:'200px',height:'6%',width:'100px',backgroundColor:'white',borderRadius:'12%'}} onClick={this.actOnPost}
                            data-post-id={row._id }> Unlike
                    </button>
                    :    <button style={{marginLeft:'200px',width:'100px',height:'6%',backgroundColor:'white',borderRadius:'12%'}}  onClick={this.actOnPost}
                    data-post-id={row._id }> Like 
            </button>
                    } 
                
</div>
</div>

    );
  });
    console.log(this.state.products)
    console.log(this.state.userinfo)   


return (
    <div >
    <NavBar user={this.state.user}></NavBar>
  <div >
    {this.state.loading && <LinearProgress size={40} />}
    <nav className="navbar navbar-light fixed-top w-75 p-3 sale" style={{backgroundColor:'white',borderRadius:'40px'}} >
  <div class="container-fluid">
    <a class="navbar-brand">d'Apic</a>
    <form class="d-flex">
      <input class="form-control me-2" type="search"
          name="search"
          value={this.state.search}
          onChange={this.onChange}
          placeholder="Chercher un photo"
      aria-label="Search"/>
    
  <Button
        className="button_style"
        variant="contained"
        color="primary"
        size="small"
        onClick={this.handleProductOpen}
      >
       Ajouter une photo
      </Button>
    </form>
  </div>
</nav>
{/* 
    <div className='position-fixed' id='nav'>
    
    <div class="d-flex flex-row bd-highlight mb-3">
    <div class="p-2 bd-highlight" >
    <div class="container d-flex  p-2"  >
   

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
   </div>


    <div className='p-2 bd-highlight float-start'  style={{marginTop:"20px"}}>

     
    </div>
    </div>

    </div> */}

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
        > Sélectionné
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
    <img src={`${apikey}/${this.state.fileName}`}  style={{marginTop:"3px",marginLeft:"3px",borderRadius:'1%'}} width="560" height="593px" />

    </div>
    <div className="col-md-5" style={{ marginTop:"180px"}}>
      <div className="card-body">
        <h5 className="card-title">Nom:{this.state.name}</h5>
        <p className="card-text">Description:{this.state.desc}</p>
        <p className="card-text" style={{marginLeft:'40px'}}><small className="text-muted" >date de création:{`${this.state.date}`.slice(0, 10)}</small></p>
      </div>
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
        > Sélectionné
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

        <div class="container float-end" style={{marginLeft:'600px',marginTop:'100px'}}>
     {rows}


</div>


      <br />
    </TableContainer>
 
  </div>
  </div>

);
}
}


