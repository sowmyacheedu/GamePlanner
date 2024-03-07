import React,{useState, useEffect } from 'react';
import Sidebardb from '../../components/Sidebardb/Sidebardb';
import Usernavbar from '../../components/usernavbar/usernavbar';
import { Row } from 'react-bootstrap';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

export default function Membership() {
  const {user}=useAuth();
  const navigate = useNavigate();
  const[isOpen ,setIsOpen] = useState();
  const[data, setData] = useState([]);
  const cookies = new Cookies();

  const onclick = (v) => {
    console.log("variable",v);
    setIsOpen(v);
  }
  
  const fetchdata = async() => {
    try {
        const response = await axios.get(`http://18.223.24.199:3000/api/user/${user.email}`, { headers: {
          'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
          'Content-Type': 'application/json'
        }});
        if (response.data.success) {
          const temp = {userType: response.data.data.userType, status: response.data.data.membershipStatus, cost: response.data.data.membershipCost, date: response.data.data.membershipDate};
          setData(temp);
          console.log(data);
        }
      } catch (error) {
        console.error(error);
      } 
  };
  useEffect(() => {
    fetchdata();
  },[data]);

  
  const handleClickProceedandCheckout = async() => {
    const input = {email: user.email};
    const response = await axios.post(`http://18.223.24.199:3000/api/membershipCheckout`,input,{ headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
      }});
      console.log("33333333",response.data.url);
      window.location.href=response.data.url;
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
          <div style={{border:"solid",height:'100px',width:"450px",alignItems:'center',backgroundColor:'white',borderTopLeftRadius:"30px",borderBottomRightRadius:"30px",borderStyle:"outset"}}>
            <div>
              {data.userType === 'Customer' ? (<div>
            {data.status === 'Active' ? (
              <div>
                <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px",display:'flex',justifyContent:'center',alignItems:'center'}}>Member Until {data.date}</span><br/></div>
                ) : (
                <div>
                  <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px"}}>Membership Cost: ${data.cost}</span><br/>
                  <button type="button" class="btn btn-primary" style={{textAlign:'center',marginTop:'0px',width:'200px',borderRadius:'25px',marginLeft:"30%",marginBottom:"20px"}} onClick={handleClickProceedandCheckout}>
                    Purchase Membership
                  </button>
                </div>
              )}</div>) : (<div>
                <span style={{fontSize:'20px', fontFamily:'sans',marginTop:"20px",marginLeft:"20px",display:'flex',justifyContent:'center',alignItems:'center'}}>Page is For Customers</span><br/>
                </div>)}
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
    </>
    )
  }