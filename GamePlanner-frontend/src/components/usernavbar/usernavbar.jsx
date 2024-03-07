// import { BsPersonCircle } from 'react-icons/bs';
// import {FaBell} from "react-icons/fa";
import React, { useState,useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import './usernavbar.css';
import axios from 'axios';

// import React from 'react';
import Container from 'react-bootstrap/Container';
import { BsPersonCircle } from 'react-icons/bs';
import { MdNotificationsActive }  from 'react-icons/md';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "bootstrap/dist/css/bootstrap.min.css";
import { GiHamburgerMenu } from "react-icons/gi";
function Usernavbar(props){

	
	const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => {
		setIsOpen (!isOpen);
		props.onClick(isOpen);
	}


	const { user } = useAuth();
	const [notifData, setnotifData] = useState();
	const {logout} = useAuth();

	const navigate = useNavigate(); 
  
  
	// const fetchnotifData = async () => {
	//   try {
	//   console.log(user);
	// 	const response = await axios.get(`http://18.223.24.199:3000/api/notifications/${user.notifdata}`);
	// 	if (response.data.success) {
	// 		setnotifData(response.data.data);
	// 	}
	// 	console.log(user);
	//   } catch (error) {
	// 	console.error(error);
	//   } 
	// };
	// useEffect(() => {
	// 	fetchnotifData();
	// }, [notifData]);
	const handleprofile=(e)=>{ 
		e.preventDefault();
		navigate('/Userprofile');
	
	};
	const handledash = (e) => {
		e.preventDefault();
		if (user.userType === "Customer") {
			navigate("/UserDashboard");
		  }
		  if (user.userType === "Staff") {
			navigate("/EmployeeDashboard");
		  }
		  if (user.userType === "Management") {
			navigate("/ManagementDashboard");
		  }
	}
	const handleLogout=(event)=>{

		event.preventDefault();
		 logout();
		 navigate('/');
		
		};
    return (
        <nav className="navbar navbar-expand navbar-light navbar-bg" style={{height:'50px',backgroundColor:'#212e3c',color:'white'}}>
				<a className="sidebar-toggle js-sidebar-toggle" >
				<span style={{color:'white',marginRight:'15px'}}>
      				<GiHamburgerMenu size={32}  onClick={toggle}/>
					
     			</span>
				 
        </a>

				<div className="navbar-collapse collapse">
				<h3 style={{color:"black",fontFamily:'Charmonman',marginTop:"20px",color:'white'}}><strong>Game Planner </strong></h3>
					<ul className="navbar-nav navbar-align">
						<li className="nav-item dropdown">
							<a className="nav-icon dropdown-toggle d-inline-block d-sm-none" href="#" data-bs-toggle="dropdown">
                <i className="align-middle" data-feather="settings"></i>
              </a>
              <BsPersonCircle/>
							<a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                 <span style={{color:'white'}}>{user?.firstName}</span>
              </a>
							<div className="dropdown-menu dropdown-menu-end">
								<a className="dropdown-item" onClick={handleprofile} ><i className="align-middle me-1" data-feather="user"></i> Profile</a>
								<a className="dropdown-item" onClick={handledash}><i className="align-middle me-1" data-feather="pie-chart"></i> Dashboard</a>
								<div className="dropdown-divider"></div>
								<a className="dropdown-item" onClick={handleLogout}  >Log out</a>

							</div>
				
						</li>
					</ul>
				</div>
			</nav>
	
    );
 }
 export default Usernavbar;