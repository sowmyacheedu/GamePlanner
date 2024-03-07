import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { addDays } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import Cookies from 'universal-cookie';
import { Modal, Button } from 'react-bootstrap';
import { FaBold } from 'react-icons/fa';
// import availableslots from '../../src/components/availableslots';

export default function Slots(props) {
  const {user}=useAuth();
  const {BookingData,setBookingData}=useAuth();
  
  const [card,setcard]=useState();
  const [dates, setDates] = useState([]);
  const today = new Date();
  const [slotdate, setSlotdate] = useState(today.toLocaleDateString());
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(BookingData.defaultRoom);
  const selectedSport = useState(BookingData.activity);
  const [numSlots, setNumSlots] = useState(0);
  const navigate=useNavigate();
  const [startTime, setStartTime] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [selectedslotindex,setselectedslotindex]=useState(null);
  const cookies = new Cookies()
  const [showModal, setShowModal] = useState(false);
const fetchroomsdata = async() => {
  try {

    const response = await axios.get(`http://18.223.24.199:3000/api/rooms/${BookingData.activity}`,{ headers: {
      'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
      'Content-Type': 'application/json'
    }});
    if (response.data.success) {
      setRooms(response.data.data.rooms);
      console.log("rrrrrrrr",rooms);
    }
    console.log(rooms);
  } catch (error) {
    console.error(error);
  } 
};


const fetchslotsdata = async() => {
  try {
      const params= {'room': selectedRoom,'date': slotdate};

    console.log("fffff",params);
    const response = await axios.post(`http://18.223.24.199:3000/api/slots`,params,{ headers: {
      'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
      'Content-Type': 'application/json'
    }});
    if (response.data.success) {
      setSlotData(response.data.data);
      console.log("********",slotData);
    }
    console.log(slotData);
  } catch (error) {
    console.error(error);
  } 
};
useEffect(() => {
  
  fetchslotsdata();
  fetchroomsdata(); 
},[selectedRoom, slotdate]);


   useEffect(() => {
    const today = new Date();
    const nextDates = [...Array(4)].map((_, i) => addDays(today, i));
    setDates(nextDates);
  }, []);

  const handleDateClick = (date,index) => {
    const formattedDate = date.toLocaleDateString();
    setSelectedButtonIndex(index);
    setSlotdate(formattedDate);
    setSelectedSlots([]);
  };

  
  

/*temporaray code for static room data*/
const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
    setSelectedSlots([]);
  };  

const handleSlotClick = (slot) => {
    if (slot.available) {
        setNumSlots(numSlots + 1);

        if (selectedSlots.includes(slot.time)) {

            // console.log(">>>>>>>>>>>",selectedSlots.filter((time) => time !== slot.time));
            setSelectedSlots(selectedSlots.filter((time) => time !== slot.time));
            // const selectslot={
            //   'time': slot.time, 'available': false,
            // }
            // setselectedslotindex(selectslot);
          } 
          else {
            
            setSelectedSlots([...selectedSlots, slot.time]);
            
            setselectedslotindex();
          }
      }
      console.log(">/./.././././",selectedSlots);
      // setselectedslotindex(index);
  };
  const formatTime = (time) => {
    if (time === 12) {
      return '12 PM';
    } else if (time === 0) {
      return '12 AM';
    } else if (time < 12) {
      return `${time} AM`;
    } else {
      return `${time - 12} PM`;
    }
  };
  const formatSlot = (start, end) => {
    const startSlot = formatTime(start);
    const endSlot = formatTime(end);
    return `${startSlot} - ${endSlot}`;
  };

  
  function handleClick() {
    navigate('/Equip');
  }
  const buttonStyle = {
    borderRadius: "50%",
    width: "10px",
    height: "50px",
    fontSize: "14px",
    lineHeight: "10px",
    textAlign: "center",
    backgroundcolor: "#333",
    marginRight: "20px",
    color: "#000000",
    justifyContent:"center",
  
    
    
  };
  const handleequipment=()=>{
    if (selectedSlots.length == 0){
      // alert("Please Select a Slot");
      setShowModal(true);
    }
    else{
    const BookingslotData={
      "Franchise": BookingData.franchise ,
      "email": BookingData.email ,
      "activity":BookingData.activity,
      "date": slotdate,
      "room": selectedRoom,
      "startTimes": selectedSlots,
      // "numSlots":numSlots,
      
    }
    
    setBookingData(BookingslotData);
    navigate("/Equipmentbooking");
  }
    
  }
  
       return (
        
       <>
       <div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {/* <Modal.Header closeButton> */}
          <Modal.Title>Error in Slot Booking:</Modal.Title>
        {/* </Modal.Header> */}
        <Modal.Body style={{fontFamily:'Bold',marginLeft:'150px',fontWeight:'bold'}}>Please Select a Slot</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
     <div style={{height:'25px',width:'100vw',marginTop:'5px',marginBottom:'5px'}}>
                   <h2>Slots Availability</h2>
                   <br/>
                 </div>
                 <div style={{height:'100px',width:'100vw',marginTop:'10px',marginBottom:'50px',marginLeft:"30%"}}>
                 
                 {dates.map((date,index) => (
        <button style={{borderRadius: "50%",width: "10px",height: "50px",fontSize: "14px",lineHeight: "10px",textAlign: "center",backgroundcolor: "#333",
        marginRight: "20px",
        color: "#000000",
        justifyContent:"center",
        backgroundColor: selectedButtonIndex === index ? "green" : "white",
        }} key={date.toISOString()} onClick={() => handleDateClick(date,index)} >
          {date.getDate()}
        </button>
      ))}
      
     </div>
                 
      <div>
      <label htmlFor="rooms">Rooms:</label>
      <select name="rooms" id="rooms" onChange={handleRoomChange}>
        {rooms && rooms.map(room => (
          <option value={room} key={room}>{room}</option>
        ))}
      </select>
    </div>
    
    
      
                
                
                 <div style={{marginTop:"30px"}}> 
                 <Row style={{height:'auto',justifyContent:"space-between",flexWrap:"wrap"}} >
                 {slotData && slotData.map((slot, index) => ( 
                       <Col>
                         <Card style={{width:"200px", height:"120px",backgroundColor:selectedSlots.includes(slot.time) ? "green" :'white'}}>
                    <Card.Body>
                    <Card.Text style={{ fontSize:'25px', color:'black'}}>{formatSlot(slot.time, slot.time + 1)}</Card.Text>
                    <button style={{textAlign:'center',marginTop:'0px',width:'110px',borderRadius:'25px',marginLeft:"15%",
                    
                    

     }} type="button" class="btn btn-dark" onClick={() => handleSlotClick(slot)} disabled={!slot.available}>
              {selectedSlots.includes(slot.time) ? "Selected" : slot.available ? "Available" : "Unavailable"}</button>
                    </Card.Body>
                </Card>
                       </Col>
                       ))}</Row>
                 </div>
                 <div>
                 
                    <button style={{textAlign:'center',marginTop:'0px',width:'110px',borderRadius:'25px',marginLeft:'1100px'}} type="button" class="btn btn-dark" onClick={handleequipment}>Proceed</button>
                 </div>
                 
       </>  
       );
     };