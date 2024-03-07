import React from 'react';
import {useAuth} from "../../../Context/AuthContext";

function Activememberships(){
  const {user}=useAuth();

    return (
        <table class="table table-hover my-0">
        
        <tbody>
            <tr style={{textAlign:"center"}}>
              <br/>
            <td class="badge bg-warning" ></td>
              Membership Status:  
             <strong><br/>{user?.membershipStatus}</strong> 
            </tr>      
        </tbody>
        <tbody>
        </tbody>
    </table>

    );
}
export default Activememberships;