
import React, {useState} from "react";
import axios from "axios";
import "./Login.css";
import {useNavigate} from "react-router";
//import "./backend/index";
// import { useHistory } from "react-router";


function Login(){
    // const history=useNavigate();
   const[name,setName]=useState('')
    
    const[password,setPassword]=useState('')

    async function submit(e){
          e.preventDefault();

          try{

            await axios.post("http://localhost:4000/test",{
                name,password
            })
            .then(res=>{
                if(res.data==="exist")
                {
                    
                    alert("Login successfully")
                    localStorage.setItem('token',res.data.token)
                    // history('/')
                }
                else if(res.data==="not exist")
                {
                    alert("Email id or password is not valid")
                }
            })
            .catch(e=>{
                alert("wrong details")
            })
          }
          catch(e){
            console.log(e);
          }

    }

    return(
        <div className="Login">
        <div className="login-form">
          <div className="title">LOGIN</div>
        <div className='form'>
             <form action="/test" method="post">
             <div className="input-container">
             <label id="uname" >Username</label>
            <input onChange={(e)=>{setName(e.target.value)}} className="input"
               placeholder="name" type="text" />
            </div>
  <div className="input-container">
    <label id="uname">Password</label>
    <input onChange={(e)=>{setPassword(e.target.value)}} className="input"
   placeholder="password" type="password" />
   </div>
   <div className="button-container">
    <input type="submit" onClick={submit}/>
    </div>
        </form> 
        </div>
        </div>
    </div>
    )
};

export default Login;