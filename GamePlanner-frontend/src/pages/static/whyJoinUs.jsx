import React from 'react';
import HomeNavbar from '../../components/Homenavbar/homeNavbar';
import Footer from '../../components/Footer/footer';
import "./whyJoinUs.css";

const WhyJoinUs = () => {
  return (
    <div>
        {/* <HomeNavbar /> */}
    <div className="why-join-us">
      <h2>Why Join Us</h2>
      <div className="benefits">
        <div className="benefit">
          <h3>Easy booking process</h3>
          <p>Our platform makes it simple and intuitive to book your session. With just a few clicks, you can choose the date, time, and location that works best for you, and receive instant confirmation of your booking.</p>
        </div>
        <div className="benefit">
          <h3>Real-time availability</h3>
          <p>Our system is constantly updated in real-time, so you can see exactly what time slots are available and choose the one that works best for you.</p>
        </div>
        <div className="benefit">
          <h3>Secure payments</h3>
          <p>We understand the importance of secure payments, which is why our platform uses the latest encryption technologies to ensure that your payments are safe and secure.</p>
        </div>
        <div className="benefit">
          <h3>Customizable options</h3>
          <p>We know that every sports or game business is unique, which is why our platform is customizable to meet your specific needs. From pricing options to session types, you can tailor our system to fit your business perfectly.</p>
        </div>
        <div className="benefit">
          <h3>Exceptional customer service</h3>
          <p>Our team is dedicated to providing the best possible experience for our customers. We offer personalized support and guidance throughout the booking process, so you can be confident that you are getting the best possible service.</p>
        </div>
      </div>
    </div>
    {/* <Footer/> */}
    </div>
  );
}

export default WhyJoinUs;
