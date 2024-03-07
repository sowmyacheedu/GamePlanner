import Sidebardb from "../../components/Sidebardb/Sidebardb";
import Usernavbar from "../../components/usernavbar/usernavbar";
import axios from 'axios';
import React, { useState,useContext,useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import Cookies from "universal-cookie";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import EmpCurrentBookings from "../../components/EmployeeDBcomp/EmpcurrBookings";
import EmpPastBookings from "../../components/EmployeeDBcomp/EmppastBookings";


function EmployeeDashboard(){
    const {user}=useAuth();
    const [date, setdate] = useState('');
    const [time, settime]=useState('');
    const [content, setcontent]=useState("");
    const [publishError, setpublishError] = useState(null);
    const [msg, setmsg]=useState();
    const[isOpen ,setIsOpen] = useState();
    const cookies = new Cookies();

    const onclick = (v) => {
      console.log("variable",v);
      setIsOpen(v);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const publish_notifications = {
            email: user.email,
            date: date.slice(5,7)+'/'+date.slice(8,10)+'/'+date.slice(0,4),
            time: time ,
            content: content,
            
     
          };
          console.log(publish_notifications)
          const response = await axios.post('http://18.223.24.199:3000/api/send', publish_notifications, { headers: {
            'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
            'Content-Type': 'application/json'
          }});
          if (response.data.success) {
            
            console.log(response.data.msg);
          setmsg(response.data.msg);
            console.log(msg);
        
          } else {
            setpublishError(response.data.message);
            setmsg(null);
          }
        } catch (error) {
          console.error(error);
          setpublishError('Error in publishing the details');
          setmsg(null);
        }
        resetForm();
      };

      const resetForm = () => {
        setdate('');
        settime('');
        setcontent('');
      };
    
    return (
        <div className='wrapper'> 
            {isOpen &&  <Sidebardb />}
                <div className='main'>
                <Usernavbar onClick={onclick}/>
            
                        <main class="content">
                        <div class="container-fluid p-0">

                                <h1 class="h3 mb-3">Welcome Back {user.firstName},</h1>

                                <div className='row' >
                <Row xs={1} md={2} className="g-4">
                    <Col>
                <Card style={{width:"620px", height:"300px",overflow:'scroll',backgroundColor:'white'}}>
                    <Card.Body>
                    <Card.Title style={{ fontSize:'25px', color:'black'}}>Current Bookings</Card.Title>
                    <Card.Text>
                         <EmpCurrentBookings/>
                    </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                <Col>
                <Card style={{width:"620px", height:"300px", overflow:'scroll',backgroundColor:'white'}}>
                    <Card.Body>
                    <Card.Title style={{ fontSize:'25px', color:'black'}}>Past Bookings</Card.Title>
                    <Card.Text>
                        <EmpPastBookings/>
                    </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                
            </Row>
            </div>
            <div className='row'>
                <Row xs={1} md={2} className="g-4">
                <Col>
                <Card style={{width:"1100px", height:"450px",overflow:'scroll',backgroundColor:'white'}}>
                    <Card.Body>
                    <Card.Title style={{ fontSize:'25px', color:'black',marginBottom: '-50px'}}>Push Notifications</Card.Title>
                    <Card.Text>
                    <div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column',}}>
                            
                                
                                    <label>Date:</label> 
                                    <input type="date" style={{marginBottom: '-10px',}} placeholder='mm/dd/yy'  className='Field' onChange={e => setdate(e.target.value)} />
                            
                                    <br>
                                    </br>
                                    <label style={{marginTop: '-70px',}}>Time:</label> 
                                    <input type="time" placeholder='00:00'  className='Field' onChange={e => settime(e.target.value)}/>
                            
                                    <br></br>
                                    <label style={{marginTop: '-90px',}}>Content:</label> 
                                    <input type="text" style={{height:'90px',width:'600px',textAlign: 'start' }} placeholder='Start Typing.....'  className='Field' onChange={e => setcontent(e.target.value)} />
                                
                            
                                <div style={{textAlign:'center'}} className='Submit-field'>
                                    <button type="submit" className='Reg-button'>Publish</button>
                                </div>
                                <p>{msg && msg}</p>
                                <p>{publishError && publishError}</p>
                           

                            </form>
                        </div>
                    </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                
                
                </Row>
                

            </div>

                                </div>

                        </main> 
                </div> 
        </div>
    );
}

export default EmployeeDashboard;
