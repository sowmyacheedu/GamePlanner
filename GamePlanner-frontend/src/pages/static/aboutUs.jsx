import React from 'react';
import Footer from '../../components/Footer/footer';
import "./aboutUs.css";
import Usernavbar from '../../components/usernavbar/usernavbar';
import HomeNavbar from '../../components/Homenavbar/homeNavbar';
import WhyJoinUs from './whyJoinUs';

const AboutUs = () => {
  return (
    <div>
      <HomeNavbar/>
    <div className="about-us">
      <h2>About Us</h2>
      <p>We are a team of passionate sports enthusiasts who want to make it easy for you to book your favorite sports and game sessions.</p>
      <p>Our booking management system is designed to make your life easier, whether you're a business owner looking to manage your bookings or a customer looking to book your next session.</p>
    </div>
       <div>
        <WhyJoinUs/>
      </div>
        <Footer/>
  
    </div>
    
    
  );
}

export default AboutUs;
