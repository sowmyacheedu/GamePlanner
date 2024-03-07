import React, { useState, useContext } from 'react';
import './Register.css';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import HomeNavbar from '../../components/Homenavbar/homeNavbar';
import { useAuth } from '../../Context/AuthContext';
import UserContext from '../../Context/Usercontext';
import { PersonObject } from "react-chat-engine-advanced";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Footer from '../../components/Footer/footer';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
const clientId = "936293186215-ob0hbo1v1stu86cubul22oqd05605ts1.apps.googleusercontent.com";

firebase.initializeApp({
  apiKey: "AIzaSyCt0PHGmSISchE63fvSWEFosGNHmOo5hz8",
  authDomain: "bookeasy-firebase-auth.firebaseapp.com",
  projectId: "bookeasy-firebase-auth",
  storageBucket: "bookeasy-firebase-auth.appspot.com",
  messagingSenderId: "540829392687",
  appId: "1:540829392687:web:322238f62133f4035acbda",
  measurementId: "G-QYBQCFT1TT",
});

function Register() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconfirmation, setPasswordconf] = useState('');
  const [phonenumber, setPhonenum] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const { franchise } = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const cookies = new Cookies();
  const uiConfig = {
    signInFlow: "popup", //redirect
    signInSuccessUrl: "/signedIn",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };
  
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      const param = {
        "franchise": franchise,  
        "email": user?.email,
        "displayName": user?.displayName,
        "phoneNumber": user?.phoneNumber,
        "authType": user?.providerData.at(0).providerId
      }
      const response = await axios.post('http://18.223.24.199:3000/api/firebase-auth-signup', param);
      if (response.data.success) {
        navigate("/login");
      } else {
          console.error(response.data.message);
      }
      console.log("param", param);
      console.log("user", user);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //chatbox
    var signChat = true;

    if (password !== passwordconfirmation) {
      setRegisterError('Passwords do not match.');
      return;
    }
    try {
      const credentials = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password,
        passwordConfirmation: passwordconfirmation,
        phoneNumber: phonenumber,
        franchise: franchise 
      };
      console.log(credentials);
      const response = await axios.post('http://18.223.24.199:3000/api/signup', credentials, { headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
        'Content-Type': 'application/json'
      }});
      if (response.data.success) {
        // registration successful, show success message
        console.log(response.data);
        signChat = true;
        //window.location.href = '/login';
      } else {
        setRegisterError(response.data.message);
        return;
      }
    } catch (error) {
      console.error(error.message);
      setRegisterError('An error occurred during registration. Please try again later.');
      return;
    }

    if (signChat) {
      const userJson: PersonObject = {
        email: email,
        username: email,
        first_name: firstname,
        last_name: lastname,
        secret: password,
        avatar: null,
        custom_json: {},
        is_online: true,
      };
  
      let formData = new FormData();
      formData.append("email", email);
      formData.append("username", email);
      formData.append("first_name", firstname);
      formData.append("last_name", lastname);
      formData.append("secret", password);

      const headers = { "Private-Key": "f704850d-8022-4564-b4a6-c47fe7860a12" };
      // console.log("form data is: ", formData);
  
      await axios
        .post("https://api.chatengine.io/users/", formData, {
          headers,
        })
        .then((r) => {
          if (r.status === 201) {
            userJson.avatar = r.data.avatar;
            //setUser(userJson);
          }
        })
        .catch((e) => console.log("Error", e));
    }
    await login(email, password);
    onSuccess();

  };
  const onSuccess = (res) => {
    navigate("/Login");
  }
  const onFailure = (res) => {
    console.log("Login failed");
  }
  return (
    <div>
      <HomeNavbar/>
<div className="Register-container">
    <form className='Register-form' onSubmit={handleSubmit}>
     <div className='Reg-Content'>
        <h4 className="Reg-title">Register</h4>
        <div  className='label'>
        <label>First Name:</label> <br></br>
        <input type="text" placeholder='First Name' value={firstname} className='Field' onChange={e => setFirstName(e.target.value)} style={{width:'400px'}} />
       </div>
      
     <div  className='label'>
      <label>Last Name:</label><br></br>
        <input type="text" placeholder='Last Name' value={lastname} className='Field' onChange={e => setLastName(e.target.value)} style={{width:'400px'}} />
     </div>
   
      <div >
      <label className='label'>Email:</label><br></br><input type="email" placeholder="yourID@gmail.com" value={email} className='Field' onChange={e => setEmail(e.target.value)} style={{width:'400px'}}/>
      
      </div>
      <br></br>
      <div className='label'>
      <label>Password:</label><br></br><input type="password" placeholder="*******" value={password} className='Field' onChange={e => setPassword(e.target.value)} style={{width:'400px'}} style={{width:'400px'}} />
      </div>
      
      <div className='label'>
      <label>Password confirmation:</label><br></br><input type="password" placeholder="*******" value={passwordconfirmation} className='Field' onChange={e => setPasswordconf(e.target.value)} style={{width:'400px'}} />
      </div>
      
      <div className='label'>
      <label>Phonenumber:</label><br></br><input type="tel" placeholder="1234567890" value={phonenumber} className='Field' onChange={e => setPhonenum(e.target.value)} style={{width:'400px'}} style={{width:'400px'}}/>
      </div>
      
      <div style={{textAlign:'center'}} className='Submit-field'>
      <button type="submit" className='Reg-button'>Register</button>
      </div>
      {registerError && <p>{registerError}</p>}
      <p style={{textAlign:'center'}}>OR</p>
      <div style={{textAlign:'center'}} id= "siginbutton">
      <div>
        <div>
          <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
          />
        </div>
      </div>
      </div>
    </div>
    </form>
</div>
<Footer/>
</div>
  );
}

export default Register;