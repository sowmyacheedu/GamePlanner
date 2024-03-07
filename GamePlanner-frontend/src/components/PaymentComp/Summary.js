import React,{useState, useEffect } from 'react';
import Sidebardb from '../Sidebardb/Sidebardb';
import Usernavbar from '../usernavbar/usernavbar';
import { Row } from 'react-bootstrap';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { faEarListen } from '@fortawesome/free-solid-svg-icons';

export default function Summary() {
  const {user}=useAuth();
  const navigate = useNavigate();
  const[isOpen ,setIsOpen] = useState();
  const {BookingData,setBookingData}= useAuth();
  const [summaryData, setSummaryData] = useState([]);
  const [urlData, seturlData] = useState();
  const cookies = new Cookies();
  const [bookid,setbookid]=useState();
  const [member, setMember] = useState();
  // console.log("llllll",BookingData)
  const onclick = (v) => {
    console.log("variable",v);
    setIsOpen(v);
  }
  const items={
    // Franchise:BookingData.franchise,
    "Email": BookingData.email,
    "room": BookingData.room,
    "activity":BookingData.activity,
    "equipmentCount":BookingData.equipmentCount,
    "date":BookingData.date,
    "startTimes":BookingData.startTimes,
    "numSlots":BookingData.startTimes.length,
    // "bid":bookid,
  }
  // setBookingData(items);
  const fetchmemberdata = async() => {
    try{
      const userResponse = await axios.get(`http://18.223.24.199:3000/api/user/${BookingData.email}`, { headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
        'Content-Type': 'application/json'
      }});
      if (userResponse.data.success) {
        setMember(userResponse.data.data);
      }
    }catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchmemberdata();
  },[]);
  const fetchsummarydata = async() => {
    try {
      
      const params= {'activity': BookingData.activity,'numSlots': BookingData.startTimes.length, 'numEquipment':BookingData.equipmentCount };
      // console.log("fffff",params);
      const response = await axios.post(`http://18.223.24.199:3000/api/price`,params,{ headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
      }});
      if (response.data.success) {
        setSummaryData(response.data.data);
        // console.log("********",summaryData);
      }
      console.log(summaryData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchsummarydata();
  },[]);
  const handleClickProceed = async () => {
    console.log("ENTEREDCLICK");
    // const input= {'email':BookingData.email, 'room': BookingData.selectedRoom,'activity': BookingData.activity, 'date':BookingData.slotdate, 'startTimes':BookingData.selectedSlots };
    try {
      const response = await axios.post('http://18.223.24.199:3000/api/createBooking', BookingData, { headers: {
      'Authorization': 'Bearer '+cookies.get("jwt_authorization")
    }});
      if(response.data.success){
        console.log("RESPONSE",response.data);
        setbookid(response.data.bid);
        console.log("$$$$$$",bookid);
        navigate('/BookingSuccess');
      }
    }
    catch(error) {
        navigate('/BookingFailure');
    }

  }
  const handleClickProceedandCheckout = async() => {
    const input = {'booking': BookingData,
                    'price': summaryData};
    try {
      const response = await axios.post(`http://18.223.24.199:3000/api/checkout`,input,{ headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
      }});
      console.log("33333333",response.data.url);
      window.location.href=response.data.url;
    }
    catch(error) {
      navigate('/BookingFailure');
    }
  }
  return (
  <>
  <div className='wrapper'> 
    {isOpen &&  <Sidebardb />}
    <div className='main' style={{height:'auto',overflow:'scroll'}} >
      <Usernavbar onClick={onclick}/>
      <Row style={{border:'solid',height:'250px',}}>
        <img  src='https://t3.ftcdn.net/jpg/03/29/56/80/360_F_329568059_WWrGwdqz2K2MhHIsi6BaEhxH9nuhZhRv.jpg' style={{height:'250px',width:"100%"}}/>
      </Row>
      <main class="content">
        <div class="container-fluid p-0" style={{height: "auto",display:'flex' ,flexWrap:'wrap',justifyContent:'center'}}>
          <div style={{border:"solid",height:'auto',width:"450px",alignItems:'center',backgroundColor:'white',borderTopLeftRadius:"30px",borderBottomRightRadius:"30px",borderStyle:"outset"}}>
            <div>
              <br></br>
              <h2 style={{ fontFamily:'sans',marginTop:"10px",textAlign:"center"}}>Summary</h2>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Email: </strong> {BookingData.email}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Court Booked:</strong> {BookingData.room}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Activity: </strong> {BookingData.activity}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>No. of Equipment:</strong> {BookingData.equipmentCount}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Price per each Equipment:</strong> ${summaryData.pricePerEquipment}</span><br/>
              <span  style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Booking Date:</strong> {BookingData.date}</span><br/>
              <span style={{ fontSize: '20px', fontFamily: 'sans', marginTop: '0px', marginLeft: '20px', display: 'flex', flexDirection: 'row' }}>
  <strong>Slot: </strong>
  {BookingData.startTimes.map((item, index) => (
    <React.Fragment key={index}>
      {item}:00{index === BookingData.startTimes.length - 1 ? '' : ','}&nbsp;
    </React.Fragment>
  ))}
</span>
              <span  style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Price per Slot:</strong> ${summaryData.pricePerSlot}</span><br/>
              <hr/>
              <span  style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Total:</strong> ${summaryData.totalPrice}</span><br/>
              {member && member.membershipStatus === 'Active' ? (
                <button type="button" class="btn btn-primary" style={{textAlign:'center',marginTop:'0px',width:'200px',borderRadius:'25px',marginLeft:"30%",marginBottom:"20px"}} onClick={handleClickProceed}>
                  Proceed
                </button>
                ) : (
                <div>
                  <button type="button" class="btn btn-primary" style={{textAlign:'center',marginTop:'0px',width:'200px',borderRadius:'25px',marginLeft:"30%",marginBottom:"20px"}} onClick={handleClickProceedandCheckout}>
                    Proceed and checkout
                  </button>
                  <button type="button" class="btn btn-primary" style={{textAlign:'center',marginTop:'0px',width:'200px',borderRadius:'25px',marginLeft:"30%",marginBottom:"20px"}} onClick={handleClickProceed}>
                    Proceed and Pay Later
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
    </>
    )
  }
    

























// import React,{useState} from 'react';
// import Sidebardb from '../Sidebardb/Sidebardb';
// import Usernavbar from '../usernavbar/usernavbar';
// import { Row } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../Context/AuthContext';

// export default function Summary() {
//     const {user}=useAuth();
//     const navigate = useNavigate();
//     const[isOpen ,setIsOpen] = useState();
//     const {BookingData}= useAuth();
//     console.log("llllll",BookingData)
//     const onclick = (v) => {
//         console.log("variable",v);
//         setIsOpen(v);
//       }
//       const items={
//         // Franchise:BookingData.franchise,
//         "Email": BookingData.email,
//         "room":BookingData.room,
//         "activity":BookingData.activity,
//         "equipmentCount":BookingData.equipmentCount,
//         "date":BookingData.date,
//         "startTime":BookingData.startTimes,
//       }

//       const total= "";
//       const handleClickProceed = () => {
//         navigate('/BookingSuccess');
//       }

//       const handleClickProceedandCheckout = () => {

//         navigate('/BookingFailure');
//       }
//       return (
//         <>
//         <div className='wrapper'> 
        
//           {isOpen &&  <Sidebardb />}
        
//           <div className='main' style={{height:'auto',overflow:'scroll'}} >
          
//             <Usernavbar onClick={onclick}/>
//             <Row style={{border:'solid',height:'250px',}}>
//             <img  src='https://www.shutterstock.com/image-photo/creative-collage-sportsmen-mixed-neon-260nw-1670001286.jpg' style={{height:'250px',width:"100vw",}}/>
//                 </Row>
//               <main class="content">
                
              
//                 <div class="container-fluid p-0" style={{height: "auto",display:'flex' ,flexWrap:'wrap',justifyContent:'center'}}>
//                   <div style={{border:"solid",height:'auto',width:"450px",alignItems:'center',backgroundColor:'white',borderTopLeftRadius:"30px",borderBottomRightRadius:"30px",borderStyle:"outset"}}>
//                   <div>
//                     <br></br>
//                                     <h2 style={{ fontFamily:'sans',marginTop:"10px",textAlign:"center"}}>Summary</h2>
//                                     {/* <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Franchise: </strong>{items.Franchise}</span><br/> */}
//                                     <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Email: </strong>{BookingData.email}</span><br/>
//                                     <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Court Booked:</strong> {BookingData.room}</span><br/>
//                                     <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Activity: </strong>{BookingData.activity}</span><br/>
                                    
//                                     <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>No. of Equipment:</strong> {BookingData.equipmentCount}</span><br/>
//                                     <span  style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Date:</strong> {BookingData.date}</span><br/>
//                                     <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"0px",marginLeft:"20px",display: 'flex', flexDirection: 'row'}}><strong> Slot: </strong>{BookingData.startTimes.map((item, index) => (<div key={index}>{item}:00 </div> ))}</span><br/>
//                                   <hr/>
//                                   {user.membershipStatus === 'Active' ? (
//   <button type="button" class="btn btn-primary" style={{textAlign:'center',marginTop:'0px',width:'200px',borderRadius:'25px',marginLeft:"30%",marginBottom:"20px"}} onClick={handleClickProceed}>
//     Proceed
//   </button>
// ) : (
//   <div>
//   <button type="button" class="btn btn-primary" style={{textAlign:'center',marginTop:'0px',width:'200px',borderRadius:'25px',marginLeft:"30%",marginBottom:"20px"}} onClick={handleClickProceedandCheckout}>
//     Proceed and checkout
//   </button>
//   <button type="button" class="btn btn-primary" style={{textAlign:'center',marginTop:'0px',width:'200px',borderRadius:'25px',marginLeft:"30%",marginBottom:"20px"}} onClick={handleClickProceed}>
//   Proceed and Pay Later
//   </button>
//   </div>
// )}
//                  </div>
                  
//                   </div>
                  
                
                  

                  
                      
                      
                      
//                 </div>
//               </main>
            
//           </div>
//       </div>
//      </>
        
        
    
    
//       )
//     }
    