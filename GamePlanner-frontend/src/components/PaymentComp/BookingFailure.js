import React, { useState, useEffect } from 'react';
import Sidebardb from '../../components/Sidebardb/Sidebardb';
import Usernavbar from '../../components/usernavbar/usernavbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const BookingFailure = ({ bookingDetails }) => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const[isOpen ,setIsOpen] = useState();
  const [countdown, setCountdown] = useState(60);

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
            <main class="content" style={{alignContent: 'center'}}>
                <div class="container-fluid p-0" style={{height: "100%", alignItems: 'center'}}> 
                    <h1>Your Booking is Not Successful</h1>
                    <div style={{height: "100%", alignItems: 'center'}}>
                        <div style={{fontSize: '200px', color: 'red', marginBottom: '30px'}}>&#10006;</div>
                        <p>You will be redirected to the home page in {countdown} seconds.</p>
                        <button onClick={handleRedirect}>Go to Home Page</button>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
};

export default BookingFailure;