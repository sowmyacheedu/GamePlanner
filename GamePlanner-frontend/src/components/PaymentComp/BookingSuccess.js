import React, { useState, useEffect } from 'react';
import Sidebardb from '../../components/Sidebardb/Sidebardb';
import Usernavbar from '../../components/usernavbar/usernavbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
const BookingSuccess = ({ bookingDetails }) => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const[isOpen ,setIsOpen] = useState();
  const [countdown, setCountdown] = useState(60);
  const {BookingData,setBookingData}= useAuth();

  const onclick = (v) => {
    console.log("variable",v);
    setIsOpen(v);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      if(!user || !user.userType) {
        navigate('/');
      }
      else if (user.userType === "Customer") {
        navigate("/UserDashboard");
      } else if (user.userType === "Staff") {
        navigate("/EmployeeDashboard");
      } else if (user.userType === "Management") {
        navigate("/ManagementDashboard");
      }
    }, 60000);
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  const handleRedirect = () => {
    if(!user || !user.userType) {
      navigate('/');
    }
    else if (user.userType === "Customer") {
      navigate("/UserDashboard");
    } else if (user.userType === "Staff") {
      navigate("/EmployeeDashboard");
    } else if (user.userType === "Management") {
      navigate("/ManagementDashboard");
    }
  };

  return (
    <div className='wrapper'> 
        {isOpen &&  <Sidebardb />}
        <div className='main' style={{height:'100%'}} >
            <Usernavbar onClick={onclick}/>
            <main class="content" style={{alignContent: 'center',}}>
                <div class="container-fluid p-0" style={{height: "100%", justifyContent:'center'}}> 
                    <h1>Your Booking is Successful</h1>
                    {/* <h2>Your Booking id:{BookingData.bid}</h2> */}
                    <div >
                        <div style={{fontSize: '200px', color: 'green', marginBottom: '30px',marginLeft:'40%'}}>&#10004;</div>
                        <p style={{marginLeft:'33%'}} >You will be redirected to the home page in {countdown} seconds.</p>
                        <button style={{marginLeft:'40%'}} onClick={handleRedirect}>Go to Home Page</button>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
};

export default BookingSuccess;
