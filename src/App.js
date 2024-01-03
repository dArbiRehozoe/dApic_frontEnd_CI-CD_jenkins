import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route,Routes} from 'react-router-dom';
import { useState } from 'react';
import Login from './Composant/Login';
import Register from './Composant/Register';
import Acceuil from  './Composant/Acceuil'
import Dashboard from './Composant/photo';
import Dossier from './Composant/dossier';
import DossierP from './Composant/dossierPhoto';
import './Login.css';
import MonCompte from './Composant/MonCompte';
import { useParams } from "react-router-dom";

function App() {
  const routeParams = useParams();
  const [userid,setLoginUser] = useState({

  })
  const [userdossier,setdossier] = useState({

  })
  console.log(routeParams)
  return (
<BrowserRouter>
    <Routes>
      <Route path="/" >
        <Route index element={<Login setLoginUser={setLoginUser}/>}/>
        <Route path="register" element={<Register />} />
        <Route path="/:id/Acceuil" element={<Acceuil params={routeParams} info={userid}/>} />
        <Route path="/:id/Mon-Compte" element={<MonCompte params={routeParams} info={userid}/>} />
        <Route path="/:id/prive" element={<Dossier info={userid} setdossier={setdossier}/>} />
        <Route path={`/:id/prive/${userdossier.name}`} element={<DossierP info={userdossier}/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
