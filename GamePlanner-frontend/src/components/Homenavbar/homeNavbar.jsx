import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";
import logo from "../../images/logo.png";
import "./homeNavbar.css";

const HomeNavbar = () => {

  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <div className="navbar1">
      <div className="navContainer1">
        <span className="logo" onClick={toggleNav}>
          <img src={logo} alt="Logo" className="logoImg" />
          <h2 style={{color:'white',fontFamily:'Charmonman'}}><Link to = "/" className = "link"><strong>Game Planner</strong></Link></h2>
        </span>
        
        <div className="navItems1">
              <button className="navButton1">
              <Link style={{color:'white'}} to="/search" className="link">
                Find a Facility
              </Link>
            </button>
            <button className="navButton1">
              <Link style={{color:'white'}} to="/Map_home" className="link">
                Map
              </Link>
            </button>
            {/* <button className="navButton1">
              <Link style={{color:'white'}} to="/whyJoinUs" className="link">
                Why Join
              </Link>
            </button> */}
            <button className="navButton1">
              <Link style={{color:'white'}} to="/AboutUs" className="link">
                About Us
              </Link>
            </button>
            <button className="navButton1">
            <FontAwesomeIcon icon={faFingerprint} />
              <Link style={{color:'white'}} to="/login" className="link">
                LOGIN
              </Link>
            </button>
          </div>
        
      </div>
    </div>
  );
};

export default HomeNavbar;
