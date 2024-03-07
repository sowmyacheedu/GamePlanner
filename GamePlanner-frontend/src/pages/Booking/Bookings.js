import React,{useState,useEffect} from 'react';
import { Row } from 'react-bootstrap';
import Sidebardb from '../../components/Sidebardb/Sidebardb';
import Usernavbar from '../../components/usernavbar/usernavbar';
import Activities from '../../components/BookingActivities/Activities';
// import Summary from '../../components/PaymentComp/Summary';
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export default function Bookings(props) {
const {user}=useAuth();
const {BookingData,setBookingData}=useAuth();
const[isOpen ,setIsOpen] = useState();
const [activity,setActivity]=useState();
const [paysummary,setPaysummary]=useState(false);
const cookies = new Cookies();
const Navigate=useNavigate();
console.log("ffff",user);
console.log("{{{{{",BookingData)
  const onclick = (v) => {
    console.log("variable",v);
    setIsOpen(v);
  }
  const BookingSelection = (d) => {
    setActivity(d);
    console.log("########",activity);
    const slotselectData={
      "Franchise": user.franchise ,
      "email": BookingData ? BookingData.email : user.email,
      "activity":d.name,
      "defaultRoom":d.defaultRoom,
    }
    setBookingData(slotselectData);
    console.log("{{{{{",BookingData)
    Navigate("/Slots1");
  };
  
  return (
    <>
    <div className='wrapper'> 
    
	  {isOpen &&  <Sidebardb />}
      
        
        
    {/* <Sidebardb/> */}
    
      <div className='main' style={{height:'auto',overflow:'scroll'}} >
      
        <Usernavbar onClick={onclick}/>
        <Row style={{height:'280px',}}>
        <img  src='https://t3.ftcdn.net/jpg/03/29/56/80/360_F_329568059_WWrGwdqz2K2MhHIsi6BaEhxH9nuhZhRv.jpg' style={{height:'280px',maxWidth: '100%'}}/>
            </Row>
          <main class="content" style={{height: "auto",display:'flex' ,flexWrap:'wrap',}}>
            
          
            <div class="container-fluid p-0" style={{height: "auto",display:'flex' ,flexWrap:'wrap',}}>
              
                  <Activities onData={BookingSelection}/>
                  
                  
                  
            </div>
          </main>
        
      </div>
  </div>
 </>
    
    


  )
}
