import Sidebardb from "../../components/Sidebardb/Sidebardb";
import Usernavbar from "../../components/usernavbar/usernavbar";
import React, { useState,useContext,useEffect } from 'react';
import Dashboard from "./Dashboard";

const URL=" ";

function UserDashboard(){
  const[isOpen ,setIsOpen] = useState();
  
  const onclick = (v) => {
    console.log("variable",v);
    setIsOpen(v);
}
  return (
    <>

    <div className='wrapper'> 
    
	  {isOpen &&  <Sidebardb />}
      
    
      <div className='main' >
      
        <Usernavbar onClick={onclick}/>
          <main class="content">
            <div class="container-fluid p-0" style={{height: "100%",display:'flex' ,flexWrap:'wrap'}}>
              <Dashboard/>
            </div>
          </main>
        
      </div>
  </div>
 </>
     
  );
}

export default UserDashboard;