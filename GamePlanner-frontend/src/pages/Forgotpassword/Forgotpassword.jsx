import { Link } from 'react-router-dom';
import { useState } from 'react';
import "./Forgotpassword.css";
import Cookies from "universal-cookie";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [resultdata,setResultdata]=useState('');
    const cookies = new Cookies();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch('http://18.223.24.199:3000/api/reset-password', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        console.log(data);
        setResultdata(data)
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className='forgot-password'>
      
      <form onSubmit={handleSubmit} className="forgotcontainer">
      <h2> Reset Password</h2>
        <label>
          Email
          <input style={{border:'solid'}}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value) } placeholder="Enter Email" required
          />
        </label>
        <br></br>
        {resultdata.message}
        <br></br>
        
        <button type="submit">Reset Password</button>
      </form>
      </div>
    );
  }

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = new URLSearchParams(window.location.search).get('token');
      const response = await fetch('/api/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='forgot-password'>
    
    <form onSubmit={handleSubmit} className="container">
    <h2>Reset Password</h2>
      <label>
        New Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)} placeholder="Enter New Password" required
        />
      </label><br></br>
      <label>
        Confirm Password
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter Same Password" required
        />
      </label><br></br>
      
      <button type="submit">Reset Password</button>
    </form>
    </div>
  );
}

export default ForgotPassword;
