import React, { useState } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useEffect } from "react";
import CounterInput from "react-counter-input"; 
import {useAuth} from "../../Context/AuthContext";
import { Navigate,useNavigate } from 'react-router-dom';

export default function Equipment() {
   const [card,setcard]=useState();
   const {BookingData,setBookingData}=useAuth();
   const cookies = new Cookies();
   const [equipmentData, setEquipmentData] = useState();
   const [counter,setCounter]=useState(0);
   const navigate=useNavigate();
   console.log("bbbbb",BookingData);
   const fetchEquipmentData = async () => {
    try {
      const response = await axios.get(`http://18.223.24.199:3000/api/equipment/${BookingData.activity}`, { headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
        'Content-Type': 'application/json'
      }});
      if (response.data.success) {
        setEquipmentData(response.data.data.equipment);
        console.log(response.data.data.equipment);
      }
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
    fetchEquipmentData();
  }, []);
  const handlecountchange=(count)=>{
      
     
      setCounter(count);

  }
  const handlequip=()=>{
    const finalBookingData={
      // "Franchise": BookingData?.franchise ,
      "email": BookingData.email ,
      "activity":BookingData.activity,
      "date": BookingData.date,
      "room": BookingData.room,
      "startTimes": BookingData.startTimes,
      "equipmentName":equipmentData.name,
      "equipmentCount":counter,
      // "numSlots":BookingData.numSlots,
      }
      setBookingData(finalBookingData);
      console.log("final",finalBookingData);
    navigate("/Summary")
  }
  return (
    <div>
     <div style={{height:'25px',width:'100vw',marginTop:'5px',marginBottom:'5px',marginBottom:'25px'}}>

        <h2>Equipment Booking</h2>
         <h4 style={{marginLeft:'35%',marginTop:'20px'}}>Please select the equipment</h4> 
        <br/>
       
      </div>
      <br></br>
      <Row style={{marginTop:'30px'}}>
        {equipmentData &&
          <Col>
            <Card style={{width:"200px", height:"200px",overflow:'scroll',backgroundColor:'white',alignItems:'center',marginLeft:'40%',borderTopLeftRadius:'20px',borderBottomRightRadius:'20px'}}>
              <Card.Body>
                  <Card.Text style={{ fontSize:'25px', color:'black'}}>{equipmentData.name} ${equipmentData.price}</Card.Text>
                  <Card.Text style={{ fontSize:'25px', color:'black'}}>Limit: {equipmentData.limit}</Card.Text>
                    <CounterInput min={0} max={equipmentData.limit} onCountChange={count => handlecountchange(count)}></CounterInput>
              </Card.Body>
            </Card>
          </Col>
        } 
      </Row>
      <button style={{textAlign:'center',marginTop:'0px',width:'110px',borderRadius:'25px',marginLeft:"43%"}} type="button" class="btn btn-dark" onClick={handlequip}>Proceed</button>
     
    </div>        
  );
};