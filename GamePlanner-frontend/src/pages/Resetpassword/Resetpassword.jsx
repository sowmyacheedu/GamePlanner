import "./Resetpassword.css";
import { useState } from "react";
import Cookies from "universal-cookie";

function Resetpassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resultdata,setResultdata]=useState('');
    const cookies = new Cookies();
  
    const handleSubmit = async (event) => {
        console.log("main url is: ")
        console.log(window.location.href)
        const url = window.location.href
        const finalUrl = url.split("/")
        console.log("final token is: ", finalUrl[5])

        console.log("password: ", password)
        console.log("confirm password: ", confirmPassword)



      event.preventDefault();
      try {
        const token = finalUrl[5]
        const response = await fetch('http://18.223.24.199:3000/api/new-password', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer your_token_here',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password, token }),
        });

        const data = await response.json();
        setResultdata(data)
        console.log(data);
        if (data) {
          
          window.location.href = '/login';
        } 

      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className='Reset-password'>
      
      <form onSubmit={handleSubmit} className="resetcontainer">
      <h2>Reset Password</h2>
        <label className="resetfields" style={{fontSize:'20px'}}>
          New Password
          <input style={{border:'solid'}}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)} placeholder="Enter New Password" required
          />
        </label><br></br>
        <label className="resetfields" style={{fontSize:'20px'}}>
          Confirm Password
          <input style={{border:'solid'}}
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter Same Password" required
          />
        </label>
        {resultdata.message}
        <button style={{marginTop:'80px'}} type="submit">Reset Password</button>
      </form>
      </div>
    );
  }
  

  export default Resetpassword;