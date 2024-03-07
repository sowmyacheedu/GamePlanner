import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import CurrentBookings from '../../components/Userdashboardcomp/Currentbookings/Currentbookings';
import PastBookings from '../../components/Userdashboardcomp/PastBookings/PastBookings';
import Activememberships from '../../components/Userdashboardcomp/Activememberships/Activememberships';
import ActivePasses from '../../components/Userdashboardcomp/ActivePasses/ActivePasses';
import Notifications from '../../components/Userdashboardcomp/UserNotifications/UserNotifications';
import Cookies from "universal-cookie";

function Dashboard(){
    const { user, setUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate(); 
    const cookies = new Cookies();

  const fetchUserData = async () => {
    try {
        console.log(user);
        const user_email = cookies.get("user_email");
          const response = await axios.get(`http://18.223.24.199:3000/api/user/${user_email}`, { headers: {
            'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
            'Content-Type': 'application/json'
          }});
          if (response.data.success) {
            setUserData(response.data.data);
            setUser(userData);
          }
          console.log(user);
        } catch (error) {
          console.error(error);
        } 
      };
  useEffect(() => {
    fetchUserData();
  }, [userData]);
    return (
        <div>
            <h2 style={{ marginBottom: "-30px"}}> Welcome Back, {user?.firstName}</h2>
            <br>
            </br>
            
            <div style={{marginTop: "50px",display: "flex",flexWrap: "wrap",justifyContent: "space-between"}} >
                
                <Card style={{width:"600px", height:"250px",overflow:'scroll',backgroundColor:'white'}}>
                    <Card.Body>
                    <Card.Title style={{fontSize:'25px',color:'black'}}>Current Bookings</Card.Title>
                    <Card.Text>
                        <CurrentBookings/>  
                    </Card.Text>
                    </Card.Body>
                </Card>
                
                <Card style={{width:"600px", height:"250px", overflow:'scroll',backgroundColor:'white'}}>
                    <Card.Body>
                    <Card.Title style={{ fontSize:'25px', color:'black'}}>Past Bookings</Card.Title>
                    <Card.Text>
                        <PastBookings/>
                        
                    </Card.Text>
                    </Card.Body>
                </Card>
                
            <Row style={{display:'flex',justifyContent:'space-between'}}>
                
                <Card style={{width:"440px", height:"250px",overflow:'scroll',backgroundColor:'white',marginLeft:'10px'}}>
                    <Card.Body>
                    <Card.Title style={{ fontSize:'25px', color:'black'}}>Active Memberships</Card.Title>
                    <Card.Text>
                        <Activememberships/>
                    </Card.Text>
                    </Card.Body>
                </Card>
                             
                
                <Card style={{width:"440px", height:"250px", overflow:'scroll',backgroundColor:'white',marginLeft:'10px'}}>
                    <Card.Body>
                    <Card.Title style={{ fontSize:'25px', color:'black'}}>Reward Points</Card.Title>
                    <Card.Text>
                        <p style={{textAlign:'center', }}> 
                        <img  src="https://media.istockphoto.com/id/1183252990/vector/first-prize-gold-trophy-icon-prize-gold-trophy-winner-first-prize-vector-illustration-and.jpg?s=612x612&w=0&k=20&c=cr3yNa3yDHeqaN_-2W8TmGvuZ2hLXufO75KOdjY-1uo=" style={{height:'150px',marginTop:"-10px"}}/>
                       
                        <br/>
                        {user?.rewardPoints} </p>
                        
                    </Card.Text>
                    </Card.Body>
                </Card>
           
           
                
                <Card style={{width:"440px", height:"250px",overflow:'scroll',backgroundColor:'white',marginLeft:'10px'}}>
                    <Card.Body>
                    <Card.Title style={{ fontSize:'25px', color:'black'}}>Notifications</Card.Title>
                    
                    <Card.Text>
                    {user && user.notification.map((not, index) => {
        return <div><p style={{borderBottom: "1px inset",padding: '5px',width:'100%',marginBottom:'-3px'}} key={index}>{not}</p></div>
      })}

                    </Card.Text>
                    </Card.Body>
                </Card>
                
              
               
        </Row>
        
        </div>
        </div>
  );
}



export default Dashboard;