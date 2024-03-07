import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";
import jwt from "jwt-decode";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [BookingData,setBookingData]=useState(null);
  const [location, setLocation] = useState(null);
  const [ franchise, setFranchise ] = useState(null);
  const cookies = new Cookies();
  const cookies1 = new Cookies();

  const login = async (email1, password1) => {
    // perform login logic here
    try{
      const credentials ={
        password : password1
    }
      if (email1.includes("@")) {
        credentials.email = email1;
      }
      else {
        credentials.phoneNumber = email1;
      }
      
        const response = await axios.post('http://18.223.24.199:3000/api/signin', credentials);
        if (response.data.success) {
          cookies.set("jwt_authorization", response.data.data.token, {
            expiresIn: '1h',
          });
          cookies1.set("user_email", response.data.data.email, {
            expiresIn: '1h',
          });
          const userResponse = await axios.get(`http://18.223.24.199:3000/api/user/${response.data.data.email}`, { headers: {
            'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
            'Content-Type': 'application/json'
          }});
          setUser(userResponse.data.data);
          console.log(userResponse.data);
          console.log(response.data);
        } else {
            console.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        console.error("invalid user");
        throw error;
      }
  };

  const logout = () => {
    // perform logout logic here
    // set user state to null
    if (user.authType === "google.com") {
      console.log("test");
      firebase.auth().signOut();
    }
    setUser(null);
    cookies.remove("jwt_authorization");
    cookies.remove("user_email");
    
  };

  const locationFunction = (coordinates) => {
    try {
      setLocation(coordinates);
      console.log(coordinates);
    } catch(error) {
      console.error(error.message);
    }
  };

  const franchiseFunction = (franchise) => {
    try {
      setFranchise(franchise);
      console.log(franchise);
    } catch(error) {
      console.error(error.message);
    }
  };

  const value = {
    user,
    setUser,
    location,
    franchise,
    login,
    logout,
    locationFunction,
    franchiseFunction,
    BookingData,
    setBookingData,
  };

  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
