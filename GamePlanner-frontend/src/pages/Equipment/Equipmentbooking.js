import React,{useState} from 'react';
import { BsTranslate } from 'react-icons/bs';
import { Row } from 'react-bootstrap';
import Sidebardb from '../../components/Sidebardb/Sidebardb';
import Usernavbar from '../../components/usernavbar/usernavbar';
import Equipment from '../../components/Equipcomp/Equipment';
//import img from '../../images/images.jpeg';
import { useAuth } from '../../Context/AuthContext';
export default function Equipmentbooking() {
const[isOpen ,setIsOpen] = useState();
  const {BookingData}=useAuth();
  
  const onclick = (v) => {

    console.log("variable",v);
    setIsOpen(v);
  }
  const handleClick = () => {
    
  };

 
  return (
    <>
    <div className='wrapper'> 
    
	  {isOpen &&  <Sidebardb />}
      
        
        
    {/* <Sidebardb/> */}
    
      <div className='main' style={{height:'100%'}} >
      
        <Usernavbar onClick={onclick}/>
        <Row style={{border:'solid',height:'250px',}}>
        <img  src='https://idme-marketplace.s3.amazonaws.com/iasiwpyfatb08yvutcx9yj40lx5i' style={{height:'250px',width:"100%"}}/>
        {/* <img  src={img} style={{height:'250px',width:"100vw",}}/> */}
            </Row>
          <main class="content">
            
          
            <div class="container-fluid p-0" style={{height: "100%",display:'flex' ,flexWrap:'wrap'}}>
              
                  <Equipment />
                  
                  
            </div>
          </main>
        
      </div>
  </div>
 </>
    
    


  )
}