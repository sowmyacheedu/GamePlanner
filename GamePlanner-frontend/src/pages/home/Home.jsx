import { useState } from "react";
import { Link } from "react-router-dom";
import HomeNavbar from "../../components/Homenavbar/homeNavbar";
import Footer from "../../components/Footer/footer";
import "./home.css";

function Home() {  
    return (
      <div className="home">
        <HomeNavbar />
        <div className="home-content">
          <h1>Experience hassle-free 
              <br/>
              sports bookings with 
              <br/><span style={{color: '#5942ac' }}>GAME PLANNER </span>
              <br/>the ultimate game day companion.</h1>
          <div>
            <button>
              <Link to="/search" className="link">
                Find a Facility
              </Link>
            </button>
          </div>
          <br/>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default Home;