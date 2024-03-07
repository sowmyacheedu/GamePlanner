import React,{useState, useEffect } from 'react';
import HomeNavbar from "../Homenavbar/homeNavbar";
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function BookingInfo() {
  const[isOpen ,setIsOpen] = useState();
  const [bookData, setBookData] = useState([]);
  const { id } = useParams();
  const fetchbookdata = async() => {
    try {
      const response = await axios.get(`http://18.223.24.199:3000/api/booking/${id}`);
      if (response.data.success) {
        setBookData(response.data.data);
        console.log("********",bookData);
      }
      console.log(bookData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchbookdata();
  },[bookData]);

  return (
  <>
  <div className='wrapper'> 
  <div className="home"><HomeNavbar /></div>
    <div className='main' style={{height:'auto',overflow:'scroll'}} >
      <Row style={{border:'solid',height:'250px',}}>
        <img  src='https://t3.ftcdn.net/jpg/03/29/56/80/360_F_329568059_WWrGwdqz2K2MhHIsi6BaEhxH9nuhZhRv.jpg' style={{height:'250px',width:"100vw",}}/>
      </Row>
      <main class="content">
        <div class="container-fluid p-0" style={{height: "auto",display:'flex' ,flexWrap:'wrap',justifyContent:'center'}}>
          <div style={{border:"solid",height:'auto',width:"450px",alignItems:'center',backgroundColor:'white',borderTopLeftRadius:"30px",borderBottomRightRadius:"30px",borderStyle:"outset"}}>
            <div>
              <br></br>
              <h2 style={{ fontFamily:'sans',marginTop:"10px",textAlign:"center"}}>Booking Information</h2>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Company: </strong> {bookData.comp}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Franchise: </strong> {bookData.fran}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Address: </strong> {bookData.addr}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Date: </strong> {bookData.date}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Time: </strong> {bookData.time}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Activity: </strong> {bookData.activity}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Room: </strong> {bookData.room}</span><br/>
              <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}><strong>Equipment: </strong> {bookData.equipment}</span><br/>
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
    </>
    )
  }