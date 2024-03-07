 import React, { useState,useEffect } from 'react'
 import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useAuth} from '../../Context/AuthContext';
import { GiConsoleController } from 'react-icons/gi';
import Cookies from 'universal-cookie';
import { CardGroup } from 'react-bootstrap';
import Usersearch from './Usersearch';

 export default function Activities({onData}) {
  const { user } = useAuth();
    const [card,setcard]=useState('');
    const [Activity,setActivity]=useState(null);
    const [input,setinput]=useState('');
    const email = useState('');
    const cookies=new Cookies();
    const [showdiv,setshowdiv] = useState(false);

    const handleBook= (card) => {
      
      console.log("//////",card.name);
      
      onData(card);
    }
    useEffect(() => { 
    const BookActivities = async() => {
      try {
        if (user.userType === "Staff") {
          setshowdiv(true);
        }
          const params= {'email': user.email};
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

  
        return (
        
        <>
        {showdiv && <Usersearch/>}
        <div style={{height:'150px',width:'100vw',marginTop:'30px',marginBottom:'30px'}}>
                    <h2> New Bookings</h2>
                    <br/>
                    <h3>
                        Available Courts & Rooms
                    </h3>
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
  
 
 