import "bootstrap/dist/css/bootstrap.css";

import "./footer.css";
import { BsInstagram } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";

function Footer(props) {
  return (
    <div class="footer-container">
     
      <div class="footer">
        <div class="footer-section">
          
          <h2 style={{color:'white',fontFamily:'Charmonman'}}>GamePlanner</h2>
          <div class="space-between icons">
            <BsInstagram size="15" />
            <BsFacebook size="15" />
            <BsTwitter size="15" />
            <BsYoutube size="15" />
          </div>
        </div>
        <div class="footer-section flex-start">
          <div class="footer-text">
            <b>Our Destinations</b>
            <div class="color-blue">Bloomington</div>
            <div class="color-blue">Indianapolis</div>
            <div class="color-blue">Kentucky</div>
            <div class="color-blue">Greenwood</div>
            <div class="color-blue">Corydon</div>
          </div>
        </div>
        

        <div class="footer-section flex-start">
          <div class="footer-text">
            <b>Our Destinations</b>
            <div class="color-blue">Our Careers</div>
            <div class="color-blue">Privacy</div>
            <div class="color-blue">Terms & Conditions</div>
          </div>
        </div>
        <div class="footer-section flex-start">
          <div class="footer-text">
            <b>Connect</b>
            <div class="color-blue">gameplanner.team6@gmail.com</div>
            <div class="color-blue">812-855-9988</div>
            <div class="color-blue">Bloomington, Indiana</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;