import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';  
import HomeNavbar from '../../components/Homenavbar/homeNavbar';
import Usernavbar from '../../components/usernavbar/usernavbar';
// import Footer from '../../components/Footer/footer';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './Userprofileedit.css';
import Cookies from "universal-cookie";

function UserProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const cookies = new Cookies();

  const [userData, setUserData] = useState({
    _id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: {
        streetAddress: user.address.streetAddress?user.address.streetAddress:'' ,
        city: user.address.city?user.address.city:'',
        state: user.address.state?user.address.state:'',
        postalCode: user.address.postalCode?user.address.postalCode:'',
    },
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    interests: user.interests,
    paymentDetails: {
        cardNumber: user.paymentDetails.cardNumber?user.paymentDetails.cardNumber:'',
        nameOnCard: user.paymentDetails.nameOnCard?user.paymentDetails.nameOnCard:'',
        expiryDate: user.paymentDetails.expiryDate?user.paymentDetails.expiryDate:'',
        cardType: user.paymentDetails.cardType?user.paymentDetails.cardType:'',
    },
  });

  const [updateError, setUpdateError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const data = {
            _id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            address: {
                streetAddress: userData.address.streetAddress,
                city: userData.address.city,
                state: userData.address.state,
                postalCode: userData.address.postalCode,
              },
            dateOfBirth: userData.dateOfBirth?userData.dateOfBirth.slice(5,7)+'/'+userData.dateOfBirth.slice(8,10)+'/'+userData.dateOfBirth.slice(0,4):null,
            gender: userData.gender,
            interests: userData.interests,
            paymentDetails: {
                cardNumber: userData.paymentDetails.cardNumber,
                nameOnCard: userData.paymentDetails.nameOnCard,
                expiryDate: userData.paymentDetails.expiryDate,
                cardType: userData.paymentDetails.cardType,
            },
        };
        console.log(data)
        const response = await axios.put('http://18.223.24.199:3000/api/update', data, { headers: {
          'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
          'Content-Type': 'application/json'
        }});
        if (response.data.success) {
          // registration successful, show success message
          console.log(response.data);
          navigate("/userProfile");
        } else {
          setUpdateError(response.data.message);
        }
      } catch (error) {
        console.error(error);
        setUpdateError(error.response.data.message || "An error occured during update. Please check your input.");
      }
  }

  
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'streetAddress' || name === 'city' || name === 'state' || name === 'postalCode') {
    setUserData(prevUserData => ({
    ...prevUserData,
    address: {
    ...prevUserData.address,
    [name]: value,
    },
    }));
    } else if (name === 'cardNumber' || name === 'nameOnCard' || name === 'expiryDate' || name === 'cardType') {
    setUserData(prevUserData => ({
    ...prevUserData,
    paymentDetails: {
    ...prevUserData.paymentDetails,
    [name]: value,
    },
    }));
    } else {
    setUserData(prevUserData => ({
    ...prevUserData,
    [name]: value,
    }));
    }
    };
    
    

  return (
    <div>
      <Usernavbar/>
    <div style={{  margin: '0 25%', display: 'flex', border: '1px solid grey'}}>
      <div style={{ width: '100%', maxWidth: '800px', padding: '0 15%' }}>
        <h1>User Details</h1>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td ><label htmlFor="firstName">First Name:</label></td>
                <td ><input type="text" id="firstName" name="firstName" value={userData.firstName} onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="lastName">Last Name:</label></td>
                <td><input type="text" id="lastName" name="lastName" value={userData.lastName} onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="email">Email:</label></td>
                <td><input type="email" id="email" name="email" value={userData.email} onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="phoneNumber">Phone Number:</label></td>
                <td><input type="tel" id="phoneNumber" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} /></td>
              </tr>
              <th><label style={{fontSize:'1.3rem'}}>ADDRESS</label></th>
              <tr>
                <td><label htmlFor="streetAddress">Street Address:</label></td>
                <td><input type="text" id="streetAddress" name="streetAddress" value={userData.address.streetAddress} placeholder="fill in street address" onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="city">City:</label></td>
                <td><input type="text" id="city" name="city" value={userData.address.city} placeholder="fill in city" onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="state">State:</label></td>
                <td><input type="text" id="state" name="state" value={userData.address.state} placeholder="fill in state" onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="postalCode">Postal Code:</label></td>
                <td><input type="number" id="postalCode" name="postalCode" value={userData.address.postalCode} placeholder="fill in postal code" onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="dateOfBirth">Date of Birth:</label></td>
                <td><input type="date" id="dateOfBirth" name="dateOfBirth" value={userData.dateOfBirth} onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="gender">Gender:</label></td>
                <td>
                  <select id="gender" name="gender" value={userData.gender} onChange={handleChange} defaultChecked>
                    <option value="">--Please select--</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Other</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="interests">Interests:</label></td>
                <td><input type="text" id="interests" name="interests" value={userData.interests} placeholder='EX: Cricket, Tennis' onChange={handleChange} /></td>
              </tr>
              <th><label style={{fontSize:'1.3rem'}}>PAYMENT DETAILS</label></th>
              <tr>
                <td><label htmlFor="cardNumber">Card Number:</label></td>
                <td><input type="number" id="cardNumber" name="cardNumber" value={userData.paymentDetails.cardNumber} placeholder="16 Digit card Number" onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="nameOnCard">Name on Card:</label></td>
                <td><input type="text" id="nameOnCard" name="nameOnCard" value={userData.paymentDetails.nameOnCard} placeholder="Name on card" onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="expiryDate">Expiry date:</label></td>
                <td><input type="text" id="expiryDate" name="expiryDate" value={userData.paymentDetails.expiryDate} placeholder="YY/MM" onChange={handleChange} /></td>
              </tr>
              <tr>
                <td><label htmlFor="cardType">Card type</label></td>
                  <td>
                    <select id="cardType" name="cardType" value={userData.cardType} onChange={handleChange} defaultChecked>
                      <option value="">--Please select--</option>
                      <option value="Debit">Debit</option>
                      <option value="Credit">Credit</option>
                    </select>
                  </td>
              </tr>
              <tr>{updateError && <div className="error">{updateError}</div>}</tr>
            </tbody>
          </table>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
    {/* <Footer/> */}
    </div>
  );
};

export default UserProfileEdit;