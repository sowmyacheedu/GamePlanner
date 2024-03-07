import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import HomeNavbar from '../../components/Homenavbar/homeNavbar';
// import Footer from '../../components/Footer/footer';
import "./Userprofile.css"; 
import Usernavbar from '../../components/usernavbar/usernavbar';
import Cookies from "universal-cookie";

function UserProfile () {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); 
  const cookies = new Cookies();

  const [imageSrc, setImageSrc] = useState('https://via.placeholder.com/150');

  const fetchUserData = async () => {
    try {
    console.log(user);
    const user_email = cookies.get("user_email");
      const response = await axios.get(`http://18.223.24.199:3000/api/user/${user_email}`, { headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
        'Content-Type': 'application/json'
      }});
      if (response.data.success) {
        setUserData(response.data.data);
        setUser(userData);
        setImageSrc('https://lettergenerator.net/domain/lettergenerator/assets/generators/bold-letter-generator/asapbold/printable-letter-asapbold-' + userData?.firstName[0].toLowerCase() + '.jpg');
        console.log(imageSrc);
      }
      console.log(user);
    } catch (error) {
      console.error(error);
    } 
  };
  useEffect(() => {
    fetchUserData();
  }, [userData]);

  const handleUpdateClick = () => {
    navigate('/UserProfileEdit');
  };

  
  useEffect(() => {
    fetchUserData();
  }, [userData]);

  return (
    
    <div>
      
      <Usernavbar/>
      <div className="user-profile-container">
    <div className="row">
      <div className="col-md-4">
        <div className="user-picture">
          <img src={imageSrc} alt="User" />
          <h2>{userData?.firstName} {userData?.lastName}</h2>
        </div>
      </div>
      <div className="col-md-8">
        <div className="user-basic-data">
          <h2>{userData?.firstName} {userData?.lastName}</h2>
          <hr/>
          <div class="row">
            <div class="col-3 labels">
              <p>Email</p>
              <p>Phone</p>
              <p>Address</p>
              <p>Date of Birth</p>
              <p>Gender</p>
            </div>
            <div class="col-1 colons">
              <p>:</p>
              <p>:</p>
              <p>:</p>
              <p>:</p>
              <p>:</p>
            </div>
            <div class="col-8 data">
              <p>{userData?.email}</p>
              <p>{userData?.phoneNumber}</p>
              <p>{userData?.address.streetAddress}, {userData?.address.city}, {userData?.address.state}, {userData?.address.postalCode}</p>
              <p>{userData?.dateOfBirth}</p>
              <p>{userData?.gender}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4">
        <div className="user-other-interests">
          <h2>Other Details</h2>
          <div class="row">
            <div class="col-4 labels">
              <p>Interests</p>
              <p>User Type</p>
              <p>MembershipStatus</p>
              <p>Reward Points</p>
            </div>
            <div class="col-1 colons">
              <p>:</p>
              <p>:</p>
              <p>:</p>
              <p>:</p>
            </div>
            <div class="col-7 data">
              <p>{userData?.interests}</p>
              <p>{userData?.userType}</p>
              <p>{userData?.membershipStatus}</p>
              <p>{userData?.rewardPoints}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="user-billing-details">
          <h2>Billing Details</h2>
          <div class="row">
            <div class="col-4 labels">
              <p>Card type</p>
              <p>Name on Card</p>
              <p>Card Number</p>
              <p>Expiry Date</p>
            </div>
            <div class="col-1 colons">
              <p>:</p>
              <p>:</p>
              <p>:</p>
              <p>:</p>
            </div>
            <div class="col-7 data">
              <p>{userData?.paymentDetails.cardType}</p>
              <p>{userData?.paymentDetails.nameOnCard}</p>
              <p>XXXX XXXX XXXX {userData?.paymentDetails.cardNumber}</p>
              <p>{userData?.paymentDetails.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <br />
      <button onClick={handleUpdateClick}>Update</button>
    </div>
  </div>
  {/* <Footer /> */}
  </div>
);
};

export default UserProfile;