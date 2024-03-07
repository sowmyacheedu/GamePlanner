import React, { useState,useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
export default function GroupExcomps({onData}) {
   const {user}=useAuth();
   const [card,setcard]=useState();
   const [Activity,setActivity]=useState();
   const cookies=new Cookies();
   const handleBook= (card) => {
      
    console.log("//////",card.name);
    
    onData(card);
  }
  useEffect(() => { 
  const BookActivities = async() => {
    try {
        const params= {'email': user.email,"category": "Group Exercises"};
      console.log(user);
      const response = await axios.post(`http://18.223.24.199:3000/api/activities`,params,{ headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
        'Content-Type': 'application/json'
      }});
      if (response.data.success) {
        setActivity(response.data.data);
        console.log("********",Activity);
      }
      console.log(user);
    } catch (error) {
      console.error(error);
    } 
  };
 
    BookActivities();
  }, []);
      

      // const displayActivities = [1,2,3,5,6];

      // const sportActivities = Activity.filter(activity => displayActivities.includes(parseInt(Activity.id)));

       return (
      
       <>
       <div style={{height:'150px',width:'100vw',marginTop:'30px',marginBottom:'30px'}}>
                   <h2>Group Exercises</h2>
                   
       </div>
       <span style={{display:'flex',justifyContent:"space-between",flexWrap:"wrap",flexDirection:'row'}} >
                {Activity && Activity.map((card, index) => (
                  <div key={index} className="card" >
                  <img src={card.imglink} alt={card.name} style={{height:'250px',width:'370px'}} />
                  <h2 style={{fontFamily:'gloock',textAlign:'center'}}>{card.name} </h2>
                  <button  style={{textAlign:'center',marginTop:'0px',width:'200px',borderRadius:'25px',marginLeft:"25%",marginBottom:'20px'}} type="button" class="btn btn-dark" onClick={ () =>  handleBook(card) }>Book now</button>
                  </div>
                 
                  ))}

                </span>
      

       </>  
       );
     };
 

