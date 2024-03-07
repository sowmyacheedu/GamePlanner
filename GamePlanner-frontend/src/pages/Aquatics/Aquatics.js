import React,{useState} from 'react';
import { Row } from 'react-bootstrap';
import Sidebardb from '../../components/Sidebardb/Sidebardb';
import Usernavbar from '../../components/usernavbar/usernavbar';
import AquaticsComp from '../../components/Aquacomps/AquaticsComp';
import { useAuth } from '../../Context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
export default function Aquatics(props) {
const {user}=useAuth();
const[isOpen ,setIsOpen] = useState();
const [activity,setActivity]=useState();
const {BookingData,setBookingData}=useAuth(); 
const [paysummary,setPaysummary]=useState(false);
const Navigate=useNavigate();
  const onclick = (v) => {
    console.log("variable",v);
    setIsOpen(v);
  }
  const handleSelection = (A) => {
    setActivity(A);
    console.log("########",A);
    const slotselectData={
      "Franchise": user.franchise,
      "email": user.email,
      "activity":A.name,
      "defaultRoom":A.defaultRoom,
    }
    setBookingData(slotselectData);
    console.log("{{{{{",BookingData);
    Navigate("/Slots1");
  };
  

 
  return (
    <>
    <div className='wrapper'> 
    
	  {isOpen &&  <Sidebardb />}
          
      <div className='main' style={{height:'auto',overflow:'scroll'}} >
      
        <Usernavbar onClick={onclick}/>
        <Row style={{border:'solid',height:'250px',}}>
        <img  src='https://t3.ftcdn.net/jpg/03/29/56/80/360_F_329568059_WWrGwdqz2K2MhHIsi6BaEhxH9nuhZhRv.jpg' style={{height:'250px',width:"100%",}}/>
            </Row>
          <main class="content" style={{height: "auto",display:'flex' ,flexWrap:'wrap'}}>
            
          
            <div class="container-fluid p-0" style={{height: "auto",display:'flex' ,flexWrap:'wrap',}}>
              
                  <AquaticsComp onData={handleSelection}/>
                  
                  
            </div>
          </main>
        
      </div>
  </div>
 </>
    
    


  )
}
