import Sidebardb from "../../components/Sidebardb/Sidebardb";
import Usernavbar from "../../components/usernavbar/usernavbar";
import React, { useState,useContext,useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Dbchart from "../../components/dashboardchart/dashboardchart";
import YearlyDbchart from "../../components/dashboardchart/yearlydbchart";
import ManagementDropdowns from "../../components/managementdropdowns/managementdropdowns";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import Cookies from "universal-cookie";
import { FaDollarSign } from "react-icons/fa";
import { GiPayMoney,GiReturnArrow } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";

function ManagementDashboard(){
    const { user } = useAuth();
    const [Managementdata, setmanagementData] = useState([]);
    const [variable,setvariable]=useState([]);
    const [data,setdata]=useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const cookies = new Cookies();
    const[isOpen ,setIsOpen] = useState();
  
    const onclick = (v) => {
      console.log("variable",v);
      setIsOpen(v);
  }
    const handleChildVariableChange = (v) => {
        console.log("variable",v);
        setvariable(v);

    }

    const fetchManagementdata= async()=>{
        try {

            
        if (variable[0]==='Franchise'){

            setdata({'email': user.email, 'franchise':variable[1]});
            console.log("ffffff");
        }   
        else if (variable[0]==='State'){

            setdata({'email': user.email, 'state':variable[1]});
            console.log("ssssss");
        }

        else if (variable[0]==='City'){

            setdata({'email': user.email, 'city':variable[1]});
            console.log("ciiiiiiiccc");
            

        }

        else if (variable[0]==='Company'){

            setdata({'email': user.email, 'company':'Anytime Fitness'});
            console.log("cccc");
        }
        else{
            setdata({'email': user.email,});
            console.log("iiiiiii");
        }
          const response = await axios.post('http://18.223.24.199:3000/api/manageDash', data, { headers: {
            'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
            'Content-Type': 'application/json'
          }});
          if (response.data.success) {
            console.log("extracteddata",response.data);
            setmanagementData(response.data.data);
            
            
          }
        } catch (error) {
          console.error(error);
        } 
        
        

       
    }
  
    
    
    useEffect(() => {
        fetchManagementdata();

    }, []);
   
    const handleSubmit = event => {

        event.preventDefault();
        
        if (variable[0] && variable[1]) {
          console.log('Here#');
          fetchManagementdata();
           
          setFormSubmitted(true);
        } else {
          alert('Please select an option and a suboption');
        }
      };
    
    
    return (
       
        <div className='wrapper'> 
            
	  {isOpen &&  <Sidebardb />}
            <div className='main'>
            <Usernavbar onClick={onclick}/>
            
                        <main class="content">
                        <div class="container-fluid p-0">

                                <h1 class="h3 mb-3">Analytics Dashboard</h1>
                                
                                <div class="row" style={{marginTop:'-100px', display: 'flex',flexDirection: 'column'}} >
                                <form onSubmit={handleSubmit} > 
                                    
                                    <ManagementDropdowns onChange={handleChildVariableChange}/>
                                    <div className='Submit-field'>
                                        <button type="submit" className='Filter'>Submit</button>
                                    </div>
                                </form>

                                    

                                </div>
         

                                 <div class="row">
                                     
                                        <div class="w-100">
                                            <div class="row">
                                                <div class="col-sm-6">
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col mt-0">
                                                                     <h5 class="card-title">Sales</h5>
                                                                 </div>

                                                                   <div class="col-auto">
                                                                     <div class="stat text-primary">
                                                                        <FaDollarSign size={30} style={{ fill: 'black' }}/>
                                                                    </div>
                                                                 </div>
                                                             </div>
                                                             <h1 class="mt-1 mb-3">$ {Managementdata.sales}</h1>
                                                             <div class="mb-0">
                                                                
                                                                <span class="text-muted">Since last year</span>
                                                            </div>
                                                        </div>
                                                     </div>
                                                     <div class="card">
                                                         <div class="card-body">
                                                             <div class="row">
                                                                 <div class="col mt-0">
                                                                     <h5 class="card-title">Profit/Loss</h5>
                                                                 </div>

                                                                 <div class="col-auto">
                                                                     <div class="stat text-primary">
                                                                         <GrMoney size={30} style={{ fill: 'black' }}/>
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                             <h1 class="mt-1 mb-3" >$ {Managementdata?.profit ?  Managementdata.profit : (Managementdata.loss ? `-${Managementdata.loss}` : '0')}</h1>
                                                             
                                                             
                                                             <div class="mb-0">
                                                                
                                                                 <span class="text-muted">Since last year</span>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                                 <div class="col-sm-6">
                                                     <div class="card">
                                                         <div class="card-body">
                                                             <div class="row">
                                                                 <div class="col mt-0">
                                                                     <h5 class="card-title">Expenses</h5>
                                                                 </div>

                                                                 <div class="col-auto">
                                                                     <div class="stat text-primary">
                                                                         <GiPayMoney size={32} style={{ fill: 'black' }}/>
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                             <h1 class="mt-1 mb-3">$ {Managementdata.expenses}</h1>
                                                             <div class="mb-0">
                                                                 
                                                                 <span class="text-muted">Since last year</span>
                                                             </div>
                                                         </div>
                                                     </div>
                                                     <div class="card">
                                                         <div class="card-body">
                                                             <div class="row">
                                                                 <div class="col mt-0">
                                                                     <h5 class="card-title">Turnover</h5>
                                                                 </div>

                                                                 <div class="col-auto">
                                                                     <div class="stat text-primary">
                                                                         <GiReturnArrow size={30} style={{ fill: 'black' }}/>
                                                                     </div>
                                                                 </div>
                                                         </div>
                                                             <h1 class="mt-1 mb-3">$ {Managementdata.turnover}</h1>
                                                             <div class="mb-0">
                                                                 
                                                                 <span class="text-muted">Since last year</span>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>


                                 <div class="row" style={{display:'flex'}}>
                                     <div class="col-12 col-lg-8 col-xxl-12 d-flex">
                                         <div class="card flex-fill">
                                             <div class="card-header">

                                                 <h5 class="card-title mb-0" >Monthly Sales</h5>
                                                 
                                             </div>
                                             <table class="table table-hover my-0" >                     
                                             <Dbchart  data={data} />   
                                             </table>
                                         </div>
                                     </div>
                                     
                                </div> 

                                </div>

                        </main> 
                </div> 
        </div>
    );
}

export default ManagementDashboard;
