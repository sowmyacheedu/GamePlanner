import React, { useState,useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import Cookies from "universal-cookie";

export default function ManagementDropdowns(props) {
    const { user } = useAuth();
  const [franchisedata, setfranchiseData] = useState([]);
  const [statedata, setstateData] = useState([]);
  const [citydata, setcityData] = useState([]);
  const [companydata, setcompanyData] = useState([]);
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [managerEmail,setmanagerEmail]=useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const cookies = new Cookies();  
 
  useEffect(() => {
    fetchfranchiseData();
    fetchstateData();
    fetchcityData();
    // fetchcompanyData();
  }, []); 


  const fetchfranchiseData = async () => {
    try {
        const data={
            'email':user.email
        };
      const response = await axios.put('http://18.223.24.199:3000/api/dropdown/franchise',data, { headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
        'Content-Type': 'application/json'
      }});
      if (response.data.success) {
        setfranchiseData(response.data.data.franchises);
      }
    } catch (error) {
      console.error(error);
    } 
    }
    const fetchstateData = async ()=>{
        try {
            const statedata={
                'email':user.email
            }
          const response = await axios.put('http://18.223.24.199:3000/api/dropdown/state',statedata, { headers: {
            'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
            'Content-Type': 'application/json'
          }});
          if (response.data.success) {
            setstateData(response.data.data.states);
          }
        } catch (error) {
          console.error(error);
        } 
        }
    const fetchcityData = async ()=>{
        try {
            const citydata={
                'email':user.email
            }
          const response = await axios.put('http://18.223.24.199:3000/api/dropdown/city',citydata, { headers: {
            'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
            'Content-Type': 'application/json'
          }});
          if (response.data.success) {
            setcityData(response.data.data.cities);
          }
        } catch (error) {
          console.error(error);
        } 
        }

    const fetchcompanyData = async ()=>{
      try {
          const companydata={
              'email':user.email
          }
        const response = await axios.put('http://18.223.24.199:3000/api/dropdown/company',companydata, { headers: {
          'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
          'Content-Type': 'application/json'
        }});
        if (response.data.success) {
        
          setcompanyData(response.data.data.company);
          
        }
      } catch (error) {
        console.error(error);
      } 
      }

  const options1 = ['Franchise', 'State', 'City','Company'];
  const options2 = {
  'Franchise': franchisedata,
  'State': statedata,
  'City': citydata,
  'Company':companydata,
  };
   
  

  const handleChange1 = event => {
    const managerEmail=event.target.value;
    const selectedValue1 = event.target.value;
    setmanagerEmail();
    setSelectedValue1(selectedValue1);
    setSelectedValue2(null);
    if (selectedValue1 === 'Franchise') {
        fetchfranchiseData();
      } else if (selectedValue1 === 'State') {
        fetchstateData();
      } else if (selectedValue1 === 'City') {
        fetchcityData();
      }
      else if (selectedValue1 === 'Company') {
        fetchcompanyData();
      }
      // props.onChange({v1:"variable1"});
  };

  const handleChange2 = event => {
    const selectedValue2 = event.target.value;
    setSelectedValue2(selectedValue2);
    props.onChange([selectedValue1,selectedValue2]);
    
  };

  const handleEmailChange = event => {
    const managerEmail = event.target.value;
    setmanagerEmail(managerEmail);
  };

  // const handleSubmit = event => {

  //   event.preventDefault();
    
  //   if (selectedValue1 && selectedValue2) {
  //     console.log('Here#')

       
  //     setFormSubmitted(true);
  //   } else {
  //     alert('Please select an option and a suboption');
  //   }
  // };
 
  
  return (
    <div >
        {/* <form onSubmit={handleSubmit} > */}
        {/* <label className='col-sm-6'  >
          Enter your email:
          <br />
          <input style={{height:'40px',width:"450px",marginBottom:'-190px' }} type='email' value={managerEmail} onChange={handleEmailChange} />
        </label> */}
        
    <br/>
    <label className='col-sm-6 .mb-6' >
        Select an option:<br></br>
        <select style={{height:'40px',width:"450px",}} value={selectedValue1} onChange={handleChange1}>
          <option value="">-- Select --</option>
          {options1.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label >
      
      {selectedValue1 && (
        <label className='col-sm-6 .mb-6'>
          Select a {selectedValue1}:<br></br>
          <select style={{height:'40px',width:"450px"}} value={selectedValue2} onChange={handleChange2}>
            <option value="">-- Select --</option>
            {options2[selectedValue1].map(suboption => (
              <option key={suboption} value={suboption}>
                {suboption}
              </option>
            ))}
          </select>
        </label>
      )}
      
      {/* </form> */}
    </div>
  );
}
