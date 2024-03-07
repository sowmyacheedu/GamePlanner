import "./Login.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleLogin } from "react-google-login";
import { useEffect, useContext } from "react";
import { gapi } from "gapi-script";
import jwt_decode from "jwt-decode";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaEyeSlash,FaEye } from "react-icons/fa";
import Footer from "../../components/Footer/footer";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import HomeNavbar from "../../components/Homenavbar/homeNavbar";
import UserContext from "../../Context/Usercontext";
import Cookies from "universal-cookie";
import jwt from "jwt-decode";

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


function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const { login } = useAuth();
  const { user, setUser } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const cookies = new Cookies();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
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
      setIsSignedIn(!!user);
      // write api to send display name , email, access token, phone number
      const param = {
        "email": user?.email,
        "displayName": user?.displayName,
        "phoneNumber": user?.phoneNumber,
        "authType": user?.providerData.at(0).providerId
      }
      const response = await axios.post('http://18.223.24.199:3000/api/firebase-auth-signin', param);
      if (response.data.success) {
        const decoded = jwt(response.data.data.token);
        cookies.set("jwt_authorization", response.data.data.token,{
          expiresIn: '1h',
        });
        cookies.set("user_email", param.email,{
          expiresIn: '1h',
        });
        const user_email = cookies.get("user_email")
        const userResponse = await axios.get(`http://18.223.24.199:3000/api/user/${user_email}`,  { headers: {
          'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
          'Content-Type': 'application/json'
        }});
        if (userResponse.data.success) {
        setUser(userResponse.data.data);
        console.log(userResponse.data);
        console.log(response.data);
        navigate("/UserDashboard");
      } else {
        console.error(userResponse.data.message);
      }
      } else {
          console.error(response.data.message);
      }
      console.log("param", param);
      console.log("user", user);
    });
  }, []);

  const count = 0;
  
  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, []);
  
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await login(username, password);
      const user_email = cookies.get("user_email")
      const userResponse = await axios.get(`http://18.223.24.199:3000/api/user/${user_email}`,  { headers: {
          'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
          'Content-Type': 'application/json'
      }});
      //chatbox code starts here
      const projectId = "79ca702a-5109-4cf9-8a33-8d576f5bd04f"
      const headers = {
        "Project-ID": projectId ,
        "User-Name": userResponse.data.data.email,
        "User-Secret": password,
      };
      console.log(headers);
      await axios
      .get("https://api.chatengine.io/users/me/", {headers})
      .then((r) => {
        if (r.status === 200) {
          console.log("Hi user");
          const user: PersonObject = {
            first_name: r.data.first_name,
            last_name: r.data.last_name,
            email: userResponse.data.data.email,
            username: userResponse.data.data.email,
            secret: password,
            avatar: r.data.avatar,
            custom_json: {},
            is_online: true,
          };
          
          console.log("user is: ", user);
          //setUser(user);
          //storing
          localStorage.setItem("user", JSON.stringify(user));
          onSuccess();
        }
      })
      .catch((e) => console.log("Error", e));
      if (userResponse.data.data.userType === "Customer") {
        navigate("/UserDashboard");
        } else if (userResponse.data.data.userType === "Staff") {
          navigate("/EmployeeDashboard");
        } else if (userResponse.data.data.userType === "Management") {
          navigate("/ManagementDashboard");
        }
      onSuccess();
    } catch (error) {
      setLoginError("Invalid User, Please enter valid credentials");
    }
  };
  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  const onSuccess = async (res) => {
    console.log("Login Success");
    try {
      if (user.userType === "Customer") {
        navigate("/UserDashboard");
      } else if (user.userType === "Staff") {
        navigate("/EmployeeDashboard");
      } else if (user.userType === "Management") {
        navigate("/ManagementDashboard");
      }
    } catch (error) {}
  };
  
  const onFailure = (res) => {
    console.log("Login failed");
  };
return (
  <div>
    <HomeNavbar />
    <div>
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol sm="6" style={{}}>
            <br></br>
            <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
              <h3 className="fw-normal mb-3 ps-5 pb-3"
              style={{
                letterSpacing: "1px",
                fontSize: "40px",
                fontFamily: "glook",
                marginTop: "35px",
              }}
              >Login
              </h3>
              <label style={{
                fontSize: "24px",
                marginLeft: "50px",
                marginTop: "-20px",
              }}
              >Email or Phone Number
              </label>
              <MDBInput wrapperClass="mb-4 mx-5 w-100" value={username} onChange={(e) => setUsername(e.target.value)} type="text" size="lg"/>
              <label style={{
                fontSize: "24px",
                marginLeft: "50px",
                marginTop: "-30px",
              }}
              >Password
              </label>
              <MDBInput wrapperClass="mb-4 mx-5 w-100" value={password} onChange={(e) => setPassword(e.target.value)} id="formControlLg" type={showPassword ? "text" : "password"}   size="lg"/>

              <label style={{ textAlign: "left",marginTop:'-50px', fontSize:'20px',marginLeft: "50px", display: "inline-block", marginRight: "10px", }} htmlFor="showPassword" className="mb-0">Show password</label>
              <input style={{ textAlign: "left",marginTop:'-20px', fontSize:'20px',height:'20px',marginLeft:'500px',width:'20px' }} type="checkbox" id="showPassword" checked={showPassword} onChange={toggleShowPassword} size="sm"/>
              
              <button
              type="button"
              onClick={handleLogin}
              class="mb-4 px-5 mx-5 w-100 btn btn-primary btn-rounded"
              style={{
                backgroundColor: "#222e3c",
                height: "50px",
                marginTop: "50px",
              }}
              bgfg
              >Login
              </button>
              {loginError && <div className='loginError'>{loginError}</div>}
              <p className="ms-5 password">
                <a href="/Forgotpassword">Forgot password?</a>
              </p>
              <p className="ms-5">
                Don't have an account?{" "}
                <a href="/search" class="link-info">
                  Register here
                </a>
                </p>
                <h5 style={{ textAlign: "center" }}>--or--</h5><br/>
                <div className="text">
                  <div style={{ textAlign: "center" }}>Login with:</div>
                  <div
                  style={{
                    textAlign: "center",
                    marginTop: "-50px",
                    marginBottom: "15px",
                  }}
                  >
                    <div>
                        <StyledFirebaseAuth
                        uiConfig={uiConfig}
                        firebaseAuth={firebase.auth()}
                      />
                    </div>
                  </div>
                </div>
              </div>
              </MDBCol>
              <MDBCol sm="6" className="d-none d-sm-block px-0">
                <img src="https://www.goscience.eu/common/img/login.jpg" alt="image" className="w-100" style={{ objectFit: "cover", objectPosition: "left",marginTop:"35px" }}/>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
        <Footer />
      </div>
    );
  }
  
export default Login;