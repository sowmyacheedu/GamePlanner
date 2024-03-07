import React,{useState} from 'react';
import { BsTranslate } from 'react-icons/bs';
import { Row } from 'react-bootstrap';
import Sidebardb from '../../components/Sidebardb/Sidebardb';
import Usernavbar from '../../components/usernavbar/usernavbar';
import Slots from '../../components/Slots';


export default function SlotBooking() {
const[isOpen ,setIsOpen] = useState();
  
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
        <img  src='https://t3.ftcdn.net/jpg/03/29/56/80/360_F_329568059_WWrGwdqz2K2MhHIsi6BaEhxH9nuhZhRv.jpg' style={{height:'250px',width:"100%"}}/>
        {/* <img  src={img} style={{height:'250px',width:"100vw",}}/> */}
            </Row>
          <main class="content">
            
          
            <div class="container-fluid p-0" style={{height: "100%",display:'flex' ,flexWrap:'wrap'}}>
              
                  <Slots />
                  
                  
            </div>
          </main>
        
      </div>
  </div>
 </>
    
    


  )
}